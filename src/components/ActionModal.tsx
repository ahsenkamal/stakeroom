"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Event } from "../types";

interface Props {
  event: Event;
  onClose: () => void;
  onUpdate: (updatedEvent: Event) => void;
}

export default function ActionModal({ event, onClose, onUpdate }: Props) {
  const { address } = useAccount();
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState<"YES" | "NO" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Double check expiration
  const isExpired = Date.now() > event.endsAt;

  const handleInteract = async () => {
    if (!address || isExpired) return;
    setIsProcessing(true);

    setTimeout(() => {
      const currentPool = parseFloat(event.poolTotal || "0");
      const addedAmount = parseFloat(event.type === 'STAKING' ? (event.stakeAmount || "0") : betAmount);
      const newPoolTotal = (currentPool + addedAmount).toFixed(4);

      const updatedEvent: Event = {
        ...event,
        poolTotal: event.type === 'BETTING' ? newPoolTotal : event.poolTotal,
        participants: event.participants.includes(address) ? event.participants : [...event.participants, address]
      };

      onUpdate(updatedEvent);
      setIsProcessing(false);
    }, 1500); 
  };

  if (isExpired) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-8 rounded-3xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Event Ended</h2>
          <p className="text-gray-400 mb-6">This event has expired and is no longer accepting bets.</p>
          <button onClick={onClose} className="bg-gray-800 text-white px-6 py-2 rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-8 rounded-3xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

        <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
        <p className="text-gray-400 text-sm mb-6">Closes in: {new Date(event.endsAt).toLocaleTimeString()}</p>

        {/* ... (Rest of UI same as before) ... */}
        {event.type === 'STAKING' ? (
          <div className="space-y-6">
            <div className="text-center p-6 bg-purple-900/10 rounded-2xl border border-purple-500/20">
              <p className="text-purple-300 text-sm uppercase tracking-widest font-bold mb-2">Entry Fee</p>
              <div className="text-4xl font-black text-white">{event.stakeAmount} ETH</div>
            </div>
            <button onClick={handleInteract} disabled={isProcessing} className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 disabled:text-gray-400 text-white font-bold rounded-xl">
              {isProcessing ? "Processing..." : `Stake ${event.stakeAmount} ETH`}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setSelectedSide("YES")} className={`py-4 rounded-xl border-2 font-bold ${selectedSide === 'YES' ? 'border-green-500 bg-green-500/20 text-green-400' : 'border-gray-700 bg-gray-800'}`}>YES</button>
              <button onClick={() => setSelectedSide("NO")} className={`py-4 rounded-xl border-2 font-bold ${selectedSide === 'NO' ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-gray-700 bg-gray-800'}`}>NO</button>
            </div>
            <input type="number" placeholder="Bet Amount (ETH)" className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-white focus:border-blue-500 outline-none" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} />
            <button onClick={handleInteract} disabled={isProcessing || !betAmount || !selectedSide} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold rounded-xl">
              {isProcessing ? "Processing..." : "Place Bet"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}