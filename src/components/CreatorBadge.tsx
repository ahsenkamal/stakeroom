"use client";
import { useEnsName, useEnsAvatar } from "wagmi";

export default function CreatorBadge({ address }: { address: string }) {
  const { data: ensName, isLoading } = useEnsName({ 
    address: address as `0x${string}`, 
    chainId: 11155111,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName!,
    chainId: 11155111, 
  });

  if (isLoading) return <span className="text-xs text-gray-500 animate-pulse">Loading...</span>;

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="h-6 w-6 rounded-full overflow-hidden bg-gray-800 border border-white/10 flex-shrink-0">
        {ensAvatar ? (
          <img 
            src={ensAvatar} 
            alt="ENS" 
            className="h-full w-full object-cover" 
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-[8px] text-white font-bold">
            {ensName ? ensName[0].toUpperCase() : "0x"}
          </div>
        )}
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider leading-none mb-0.5">Created by</span>
        <span className={`text-xs font-mono truncate max-w-[120px] ${ensName ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
          {ensName ? ensName : `${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
      </div>
    </div>
  );
}