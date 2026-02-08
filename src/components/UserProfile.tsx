"use client";
import { useAccount, useEnsName, useEnsAvatar, useDisconnect } from "wagmi";
import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface UserProfileProps {
  onMissingEns: () => void;
}

export default function UserProfile({ onMissingEns }: UserProfileProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: ensName, isLoading: isEnsLoading } = useEnsName({
    address: address,
    chainId: 11155111, 
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName!,
    chainId: 11155111,
  });

  useEffect(() => {
    if (isConnected && !isEnsLoading && !ensName) {
      onMissingEns();
    }
  }, [isConnected, isEnsLoading, ensName, onMissingEns]);

  if (!isConnected) return <ConnectButton />;

  return (
    <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-full pl-2 pr-4 py-1.5">
      <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
        {ensAvatar ? (
          <img src={ensAvatar} alt="ENS" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs font-bold text-white">
            {ensName ? ensName[0].toUpperCase() : "0x"}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-white text-xs">
          {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </span>
        <span className="text-[10px] text-gray-400">
          {ensName ? "ENS Verified" : "Hex Address"}
        </span>
      </div>

      <button onClick={() => disconnect()} className="ml-2 text-xs text-red-400 hover:text-white">
        ✕
      </button>
    </div>
  );
}