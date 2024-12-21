"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface SummaryPanelProps {
  tokenName: string;
  description: string;
  socials: {
    x?: string;
    telegram?: string;
    website?: string;
  };
  pairKey: string;
}

export default function SummaryPanel({ tokenName, description, socials, pairKey }: SummaryPanelProps) {
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { connected } = useWallet();

  const handleRequestClick = () => {
    router.push(`/pair/${pairKey}/request`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold text-grey-500">{tokenName}</h2>
        <div className="flex ml-auto space-x-3">
          {socials.x || socials.telegram || socials.website ? (
            <>
              {socials.x && (
                <a href={`${socials.x}`} target="_blank" rel="noopener noreferrer">
                  <Image src="/images/socials/x.svg" alt="X" width={24} height={24} className="hover:opacity-50"/>
                </a>
              )}
              {socials.telegram && (
                <a href={`${socials.telegram}`} target="_blank" rel="noopener noreferrer">
                  <Image src="/images/socials/telegram.svg" alt="Telegram" width={24} height={24} className="hover:opacity-50"/>
                </a>
              )}
              {socials.website && (
                <a href={`${socials.website}`} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-6 h-6 text-black hover:opacity-50" />
                </a>
              )}
            </>
          ) : (
            <span className="text-muted-foreground text-red-500">[No socials found]</span>
          )}
        </div>
      </div>
      <p className="mb-6">
        {description ? (
          description.length > 100 ? (
            <span>
              {showFullDescription ? description : `${description.slice(0, 100)}...`}{" "}
              <button 
                className="text-muted-foreground hover:underline"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? <span className="text-sky-500">[see less]</span> : <span className="text-sky-500">[see more]</span>}
              </button>
            </span>
          ) : (
            description
          )
        ) : (
          <span className="text-muted-foreground text-red-500">[No description provided]</span>
        )}
      </p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <Button 
                onClick={handleRequestClick}
                className={`h-12 text-sm font-medium ${
                  connected
                    ? "bg-zinc-900 border border-black text-white hover:bg-zinc-900/80"
                    : "bg-transparent border border-black text-black hover:bg-black hover:text-white"
                }`}
                disabled={!connected}
              >
                Request
              </Button>
            </div>
          </TooltipTrigger>
          {!connected && (
            <TooltipContent side="bottom">
              <p>Please connect your wallet to continue</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
  
  