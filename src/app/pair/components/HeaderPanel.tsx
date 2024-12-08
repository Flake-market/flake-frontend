"use client"
import Image from 'next/image';
export default function HeaderPanel() {
  return (
    <div className="flex items-center h-full mx-2 px-4 space-x-8">
      <Image src="/images/tokens/pepe.svg" alt="logo" width={32} height={32} />
      <span className="text-xl font-semibold">AVAX-USD</span>
    </div>
  )
}
  
  