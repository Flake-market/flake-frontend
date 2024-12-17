import { Idl } from '@coral-xyz/anchor';

export type Flake = Idl;

export const IDL: Flake = {
    "address": "3TSDjEyy4Hu3MejRUb4AMBrEQ8nRUtAXPw5Rr3Jkn1NM",
    "metadata": {
      "name": "flake",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "create_pair",
        "discriminator": [
          156,
          190,
          126,
          151,
          163,
          62,
          192,
          220
        ],
        "accounts": [
          {
            "name": "factory",
            "writable": true
          },
          {
            "name": "pair",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    97,
                    105,
                    114
                  ]
                },
                {
                  "kind": "account",
                  "path": "creator"
                },
                {
                  "kind": "account",
                  "path": "factory.pairs_count",
                  "account": "Factory"
                }
              ]
            }
          },
          {
            "name": "attention_token_mint",
            "writable": true
          },
          {
            "name": "creator_token_account",
            "writable": true
          },
          {
            "name": "creator",
            "writable": true,
            "signer": true
          },
          {
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "associated_token_program",
            "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "rent",
            "address": "SysvarRent111111111111111111111111111111111"
          },
          {
            "name": "vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "pair"
                }
              ]
            }
          }
        ],
        "args": [
          {
            "name": "params",
            "type": {
              "defined": {
                "name": "CreatePairParams"
              }
            }
          }
        ]
      },
      {
        "name": "initialize_factory",
        "discriminator": [
          179,
          64,
          75,
          250,
          39,
          254,
          240,
          178
        ],
        "accounts": [
          {
            "name": "factory",
            "writable": true,
            "signer": true
          },
          {
            "name": "fee_recipient"
          },
          {
            "name": "authority",
            "writable": true,
            "signer": true
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "protocol_fee",
            "type": "u64"
          }
        ]
      },
      {
        "name": "swap",
        "discriminator": [
          248,
          198,
          158,
          145,
          225,
          117,
          135,
          200
        ],
        "accounts": [
          {
            "name": "pair",
            "writable": true
          },
          {
            "name": "attention_token_mint",
            "writable": true
          },
          {
            "name": "user_token_account",
            "writable": true
          },
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "token_program",
            "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "creator",
            "writable": true
          },
          {
            "name": "factory",
            "writable": true
          },
          {
            "name": "vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "pair"
                }
              ]
            }
          }
        ],
        "args": [
          {
            "name": "amount_in",
            "type": "u64"
          },
          {
            "name": "minimum_amount_out",
            "type": "u64"
          },
          {
            "name": "is_buy",
            "type": "bool"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Factory",
        "discriminator": [
          159,
          68,
          192,
          61,
          48,
          249,
          216,
          202
        ]
      },
      {
        "name": "Pair",
        "discriminator": [
          85,
          72,
          49,
          176,
          182,
          228,
          141,
          82
        ]
      }
    ],
    "events": [
      {
        "name": "PairCreated",
        "discriminator": [
          173,
          73,
          77,
          43,
          235,
          157,
          56,
          30
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "InvalidProtocolFee",
        "msg": "Protocol fee must be between 0 and 10000 (100%)"
      },
      {
        "code": 6001,
        "name": "InvalidBasePrice",
        "msg": "Base price must be greater than 0"
      },
      {
        "code": 6002,
        "name": "InvalidStringLength",
        "msg": "String length exceeds maximum allowed"
      },
      {
        "code": 6003,
        "name": "InvalidRequestPrice",
        "msg": "Request price must be greater than 0"
      },
      {
        "code": 6004,
        "name": "SlippageExceeded",
        "msg": "Slippage tolerance exceeded"
      }
    ],
    "types": [
      {
        "name": "CreatePairParams",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "ticker",
              "type": "string"
            },
            {
              "name": "description",
              "type": "string"
            },
            {
              "name": "token_image",
              "type": "string"
            },
            {
              "name": "twitter",
              "type": "string"
            },
            {
              "name": "telegram",
              "type": "string"
            },
            {
              "name": "website",
              "type": "string"
            },
            {
              "name": "base_price",
              "type": "u64"
            },
            {
              "name": "requests",
              "type": {
                "vec": {
                  "defined": {
                    "name": "RequestConfig"
                  }
                }
              }
            }
          ]
        }
      },
      {
        "name": "Factory",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "pubkey"
            },
            {
              "name": "fee_recipient",
              "type": "pubkey"
            },
            {
              "name": "protocol_fee",
              "type": "u64"
            },
            {
              "name": "pairs_count",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "Pair",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "creator",
              "type": "pubkey"
            },
            {
              "name": "attention_token_mint",
              "type": "pubkey"
            },
            {
              "name": "creator_token_account",
              "type": "pubkey"
            },
            {
              "name": "base_price",
              "type": "u64"
            },
            {
              "name": "protocol_fee",
              "type": "u64"
            },
            {
              "name": "creator_fee",
              "type": "u64"
            },
            {
              "name": "creation_number",
              "type": "u64"
            },
            {
              "name": "vault",
              "type": "pubkey"
            },
            {
              "name": "name",
              "type": "string"
            },
            {
              "name": "ticker",
              "type": "string"
            },
            {
              "name": "description",
              "type": "string"
            },
            {
              "name": "token_image",
              "type": "string"
            },
            {
              "name": "twitter",
              "type": "string"
            },
            {
              "name": "telegram",
              "type": "string"
            },
            {
              "name": "website",
              "type": "string"
            },
            {
              "name": "requests",
              "type": {
                "vec": {
                  "defined": {
                    "name": "RequestConfig"
                  }
                }
              }
            }
          ]
        }
      },
      {
        "name": "PairCreated",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "pair_id",
              "type": "u64"
            },
            {
              "name": "pair_key",
              "type": "pubkey"
            },
            {
              "name": "creator",
              "type": "pubkey"
            },
            {
              "name": "base_price",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "RequestConfig",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "price",
              "type": "u64"
            },
            {
              "name": "description",
              "type": "string"
            }
          ]
        }
      }
    ]
  } as const;