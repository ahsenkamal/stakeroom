"use client";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import { YellowService } from "../services/yellow";
import { Event } from "../types";
import { supabase } from "../utils/supabase"

interface Props {
  event: Event;
  onClose: () => void;
  onUpdate: (updatedEvent: Event) => void;
}

export default function ActionModal({ event, onClose, onUpdate }: Props) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState<"YES" | "NO" | null>(null);
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInteract = async () => {
    if (!walletClient || !address) return;
    
    setIsProcessing(true);
    setStatus("Connecting to Yellow Network...");

    try {
      const sdkSigner = async (message: any) => walletClient.request({
          method: 'personal_sign',
          params: [message, address],
      });

      const yellow = new YellowService(sdkSigner, address);
      await yellow.connect();
      
      setStatus("Signing Join Request...");

      const amountEth = event.type === 'STAKING' ? (event.stakeAmount || "0") : betAmount;
      const amountWei = parseEther(amountEth).toString();
      const side = event.type === 'STAKING' ? 'STAKE' : (selectedSide || 'YES');

      await supabase.from('participants').insert({
        event_id: event.id,
        user_address: address,
        amount: amountEth,
        side: event.type === 'STAKING' ? 'STAKE' : selectedSide
        });

      await yellow.joinEventSession(
        amountWei, 
        side as 'YES' | 'NO' | 'STAKE', 
        event.id, 
        event.creatorAddress as `0x${string}`
      );

      setStatus("✅ Joined Successfully!");
      
      await supabase
        .from('events')
        .update({ pool_total: (parseFloat(event.poolTotal || "0") + parseFloat(amountEth)).toFixed(4)}) // Add pool_yes/pool_no updates here too
        .eq('id', event.id);
    //   setTimeout(() => {
    //     const addedVal = parseFloat(amountEth);
    //     const currentPool = parseFloat(event.poolTotal || "0");
        
    //     const updatedEvent: Event = {
    //       ...event,
    //       poolTotal: (currentPool + addedVal).toFixed(4),
    //       participants: [...event.participants, address]
    //     };

    //     onUpdate(updatedEvent);
    //     setIsProcessing(false);
    //     yellow.disconnect();
    //   }, 1000);

    } catch (error) {
      console.error(error);
      setStatus("Failed: " + (error as Error).message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-8 rounded-3xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
        <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
        <p className="text-gray-400 text-xs mb-6 font-mono">
          Room Host: {event.creatorAddress.slice(0,6)}...
        </p>
        
        {status && <div className="mb-4 p-3 rounded-lg text-center font-bold text-sm bg-yellow-500/20 text-yellow-400">{status}</div>}

        <div className="mt-2 space-y-6">
           {event.type === 'STAKING' && (
              <div className="text-center p-6 bg-purple-900/10 rounded-2xl border border-purple-500/20">
                 <p className="text-purple-300 text-sm uppercase tracking-widest font-bold mb-2">Entry Stake</p>
                 <div className="text-4xl font-black text-white">{event.stakeAmount} ETH</div>
              </div>
           )}

           {event.type === 'BETTING' && (
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setSelectedSide("YES")} className={`py-4 rounded-xl border-2 font-bold ${selectedSide === 'YES' ? 'border-green-500 bg-green-500/20 text-green-400' : 'border-gray-700 bg-gray-800'}`}>YES</button>
                  <button onClick={() => setSelectedSide("NO")} className={`py-4 rounded-xl border-2 font-bold ${selectedSide === 'NO' ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-gray-700 bg-gray-800'}`}>NO</button>
               </div>
               <input type="number" placeholder="Amount (ETH)" className="w-full bg-black/40 border-gray-700 rounded-lg p-4 text-white" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} />
             </div>
           )}

           <button 
              onClick={handleInteract}
              disabled={isProcessing || (event.type === 'BETTING' && !selectedSide)}
              className="w-full py-4 font-bold rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black disabled:bg-gray-800 disabled:text-gray-500"
            >
              {isProcessing ? "Joining..." : (event.type === 'STAKING' ? "Stake with Yellow" : "Confirm Bet")}
            </button>
        </div>
      </div>
    </div>
  );
}