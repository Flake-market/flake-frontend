import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction, // TODO: remove this when we have a way to check if the account exists
} from '@solana/spl-token';
import { Connection, PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, VersionedTransaction, TransactionInstruction } from '@solana/web3.js';
import { FACTORY_ADDRESS } from '@/config/contracts';
import { IDL, Flake } from '@/idl/flake';

interface PhantomWalletAdapter {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
}

export interface RequestConfig {
  price: number;
  description: string;
}

export interface CreateTokenParams {
  name: string;
  ticker: string;
  description: string;
  token_image: string;
  socials: {
    twitter?: string;
    telegram?: string;
    website?: string;
  };
  base_price: number;
  requests: RequestConfig[];
}

export class FactoryService {
  private connection: Connection;

  constructor() {
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  }

  async createToken(phantomProvider: PhantomProvider, params: CreateTokenParams) {
    if (!phantomProvider) throw new Error('Wallet not connected');

    const walletAdapter: PhantomWalletAdapter = {
      publicKey: new PublicKey(phantomProvider.publicKey.toString()),
      signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
        return await phantomProvider.signTransaction(tx as Transaction) as T;
      },
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
        return await phantomProvider.signAllTransactions(txs as Transaction[]) as T[];
      }
    };

    const provider = new AnchorProvider(
      this.connection, 
      walletAdapter,
      { commitment: 'confirmed' }
    );

    const program = new Program<Flake>(IDL, provider);
    // @ts-expect-error/idl-structure-not-recognized
    const factoryAccount = await program.account.factory.fetch(new PublicKey(FACTORY_ADDRESS));
    
    // Generate mint and get associated token account
    const mintKeypair = Keypair.generate();
    const creatorTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      walletAdapter.publicKey
    );

    // Derive pair PDA
    const [pairAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("pair"),
        walletAdapter.publicKey.toBuffer(),
        factoryAccount.pairsCount.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    // Create the mint account
    const mintRent = await provider.connection.getMinimumBalanceForRentExemption(82);
    const createMintAccountIx = SystemProgram.createAccount({
      fromPubkey: walletAdapter.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: 82,
      lamports: mintRent,
      programId: TOKEN_PROGRAM_ID
    });

    try {
      const createPairData = {
        name: params.name.slice(0, 32),
        ticker: params.ticker.slice(0, 10),
        description: params.description.slice(0, 200),
        tokenImage: params.token_image,
        twitter: params.socials.twitter || '',
        telegram: params.socials.telegram || '',
        website: params.socials.website || '',
        basePrice: new BN(params.base_price * 1e9),
        requests: params.requests.map(r => ({
          price: new BN(r.price * 1e9),
          description: r.description.slice(0, 200)
        }))
      };

      const signature = await program.methods
        .createPair(createPairData)
        .accounts({
          factory: new PublicKey(FACTORY_ADDRESS),
          pair: pairAddress,
          attentionTokenMint: mintKeypair.publicKey,
          creatorTokenAccount: creatorTokenAccount,
          creator: walletAdapter.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .preInstructions([createMintAccountIx])
        .signers([mintKeypair])
        .rpc();

      return {
        pairAddress: pairAddress.toString(),
        signature: signature
      };
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  async swap(
    phantomProvider: PhantomProvider,
    amountIn: number,
    minimumAmountOut: number,
    isBuy: boolean,
    pairAddress: PublicKey,
    attentionTokenMint: PublicKey,
    userTokenAccount: PublicKey,
    creator: PublicKey,
    factoryAddress: PublicKey,
  ) {
    if (!phantomProvider) throw new Error('Wallet not connected');

    const walletAdapter: PhantomWalletAdapter = {
      publicKey: new PublicKey(phantomProvider.publicKey.toString()),
      signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
        return await phantomProvider.signTransaction(tx as Transaction) as T;
      },
      signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
        return await phantomProvider.signAllTransactions(txs as Transaction[]) as T[];
      }
    };

    const provider = new AnchorProvider(
      this.connection, 
      walletAdapter,
      { commitment: 'confirmed' }
    );

    const program = new Program<Flake>(IDL, provider);
    
    try {
      // Create associated token account if it doesn't exist - TODO: remove this when we have a way to check if the account exists
      const createAtaIx = await createAssociatedTokenAccountInstruction(
        walletAdapter.publicKey,  // payer
        userTokenAccount,         // ata
        walletAdapter.publicKey,  // owner
        attentionTokenMint       // mint
      );

      // Check if the token account exists - TODO: remove this when we have a way to check if the account exists
      const tokenAccountInfo = await this.connection.getAccountInfo(userTokenAccount);
      const preInstructions = !tokenAccountInfo ? [createAtaIx] : [];

      const signature = await program.methods
        .swap(new BN(amountIn), new BN(minimumAmountOut), isBuy)
        .accounts({
          pair: pairAddress,
          attentionTokenMint: attentionTokenMint,
          userTokenAccount: userTokenAccount,
          user: walletAdapter.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID, // TODO: remove this when we have a way to check if the account exists
          systemProgram: SystemProgram.programId,
          creator: creator,
          factory: factoryAddress,
        })
        .preInstructions(preInstructions) // TODO: remove this when we have a way to check if the account exists
        .rpc();

      return {
        signature: signature
      };
    } catch (error) {
      console.error('Error during swap:', error);
      throw error;
    }
  }

  async submitRequest(
    phantomProvider: PhantomProvider,
    pairAddress: PublicKey,
    attentionTokenMint: PublicKey,
    creator: PublicKey,
    requestIndex: number,
    adText: string
  ) {
    if (!phantomProvider) throw new Error('Wallet not connected');

    const walletAdapter: PhantomWalletAdapter = {
        publicKey: new PublicKey(phantomProvider.publicKey.toString()),
        signTransaction: async <T extends Transaction | VersionedTransaction>(tx: T): Promise<T> => {
          return await phantomProvider.signTransaction(tx as Transaction) as T;
        },
        signAllTransactions: async <T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> => {
          return await phantomProvider.signAllTransactions(txs as Transaction[]) as T[];
        }
      };

    const provider = new AnchorProvider(
      this.connection, 
      walletAdapter,
      { commitment: 'confirmed' }
    );

    const program = new Program<Flake>(IDL, provider);

    try {
      // Derive user / creator token accounts for this mint
      const userTokenAccount = await getAssociatedTokenAddress(
        attentionTokenMint,
        walletAdapter.publicKey
      );

      const creatorTokenAccount = await getAssociatedTokenAddress(
        attentionTokenMint,
        creator
      );

      // 2. (Optional) Check if the creator’s ATA already exists. If not, create it.
      const preInstructions: TransactionInstruction[] = [];
      const creatorAtaInfo = await this.connection.getAccountInfo(creatorTokenAccount);
      if (!creatorAtaInfo) {
        // The ATA for the creator does not exist; create it.
        const createCreatorAtaIx = createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,    // payer
          creatorTokenAccount,        // ata
          creator,                    // owner of this ATA
          attentionTokenMint          // mint
        );
        preInstructions.push(createCreatorAtaIx);
      }

      // 3. Send submitRequest instruction
      const signature = await program.methods
        .submitRequest(requestIndex, adText)
        .accounts({
          pair: pairAddress,
          attentionTokenMint,
          userTokenAccount,
          creatorTokenAccount,
          user: walletAdapter.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        // If we created the creator’s ATA, include that in the front of our transaction
        .preInstructions(preInstructions)
        .rpc();

      return {
        signature,
      };
    } catch (error) {
      console.error('Error submitting request:', error);
      throw error;
    }
  }
}