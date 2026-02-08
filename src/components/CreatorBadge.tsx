"use client";
import { useEnsName } from "wagmi";

export default function CreatorBadge({ address }: { address: string }) {
  // Automatically fetch ENS for this specific address
  const { data: ensName } = useEnsName({ 
    address: address as `0x${string}`, 
    chainId: 11155111 
  });

  return (
    <span className="text-xs text-gray-400 flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md">
      <span className="text-gray-600">by</span>
      <span className="text-blue-300 font-mono">
        {ensName || `${address.slice(0, 6)}...${address.slice(-4)}`}
      </span>
    </span>
  );
}