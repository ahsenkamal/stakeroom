"use client";
import { useState } from "react";
import { Event } from "../types";

interface Props {
  event: Event;
  onClose: () => void;
}

export default function ActionModal({ event, onClose }: Props) {
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState<"YES" | "NO" | null>(null);

  const handleInteract = () => {
    // This is where Smart Contract logic will go later
    alert(`Interaction simulated!\nType: ${event.type}\nAmount: ${event.type === 'STAKING' ? event.stakeAmount : betAmount} ETH`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >✕</button>

        {/* Header */}
        <div className="flex justify-between items-start mb-4">
           <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
              event.type === 'STAKING' ? 'bg-purple-900/30 text-purple-400' : 'bg-green-900/30 text-green-400'
            }`}>
              {event.type}
            </span>
            <span className="font-mono text-xs text-gray-500">ID: {event.id}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-8">{event.title}</h2>

        {/* --- STAKING UI --- */}
        {event.type === 'STAKING' && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-purple-900/10 rounded-2xl border border-purple-500/20">
              <p className="text-purple-300 text-sm uppercase tracking-widest font-bold mb-2">Entry Fee</p>
              <div className="text-4xl font-black text-white">{event.stakeAmount} <span className="text-xl text-gray-400">ETH</span></div>
            </div>

            <button 
              onClick={handleInteract}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-purple-900/40 transition hover:scale-[1.02]"
            >
              Stake & Join
            </button>
          </div>
        )}

        {/* --- BETTING UI --- */}
        {event.type === 'BETTING' && (
          <div className="space-y-6">
            {/* Side Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSelectedSide("YES")}
                className={`py-4 rounded-xl border-2 font-bold text-lg transition ${
                  selectedSide === 'YES' 
                    ? 'border-green-500 bg-green-500/20 text-green-400' 
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                YES / FOR
              </button>
              <button 
                onClick={() => setSelectedSide("NO")}
                className={`py-4 rounded-xl border-2 font-bold text-lg transition ${
                  selectedSide === 'NO' 
                    ? 'border-red-500 bg-red-500/20 text-red-400' 
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                NO / AGAINST
              </button>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Your Wager (ETH)</label>
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-white text-lg focus:border-blue-500 outline-none"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">ETH</span>
              </div>
            </div>

            <button 
              onClick={handleInteract}
              disabled={!selectedSide || !betAmount}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-900/40 transition hover:scale-[1.02]"
            >
              Place Bet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}