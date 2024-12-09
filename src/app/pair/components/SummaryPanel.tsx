"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';

interface SummaryPanelProps {
  tokenName: string;
  description: string;
  socials: {
    x?: string;
    telegram?: string;
    website?: string;
  };
}

export default function SummaryPanel({ tokenName, description, socials }: SummaryPanelProps) {
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleRequestClick = () => {
    router.push('/pair/[address]/request');
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold text-lime-500">{tokenName}</h2>
        <div className="flex ml-auto space-x-3">
          {socials.x || socials.telegram || socials.website ? (
            <>
              {socials.x && (
                <a href={`${socials.x}`} target="_blank" rel="noopener noreferrer">
                  <Image src="/images/socials/x.svg" alt="X" width={24} height={24} className="hover:opacity-80"/>
                </a>
              )}
              {socials.telegram && (
                <a href={`${socials.telegram}`} target="_blank" rel="noopener noreferrer">
                  <Image src="/images/socials/telegram.svg" alt="Telegram" width={24} height={24} className="hover:opacity-80"/>
                </a>
              )}
              {socials.website && (
                <a href={`${socials.website}`} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-6 h-6 text-white hover:opacity-80" />
                </a>
              )}
            </>
          ) : (
            <span className="text-muted-foreground text-red-500">[No socials found]</span>
          )}
        </div>
      </div>
      <p className="mb-6 text-muted-foreground">
        {description ? (
          description.length > 100 ? (
            <span>
              {showFullDescription ? description : `${description.slice(0, 100)}...`}{" "}
              <button 
                className="text-lime-500 hover:underline"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? '[see less]' : '[see more]'}
              </button>
            </span>
          ) : (
            description
          )
        ) : (
          <span className="text-muted-foreground text-red-500">[No description provided]</span>
        )}
      </p>
      <button
        onClick={handleRequestClick}
        className="px-6 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
      >
        Request
      </button>
    </div>
  );
}
  
  