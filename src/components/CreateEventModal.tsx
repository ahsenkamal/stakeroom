"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Event, EventType } from "../types";

interface Props {
  onClose: () => void;
  onCreate: (event: Event) => void;
}

export default function CreateEventModal({ onClose, onCreate }: Props) {
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("BETTING");
  const [stakeAmount, setStakeAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address) return;

    const newEvent: Event = {
      id: `evt_${Math.floor(Math.random() * 9000) + 1000}`,
      title,
      type,
      creatorAddress: address,
      stakeAmount: type === 'STAKING' ? stakeAmount : undefined,
      poolTotal: "0",
      createdAt: Date.now(),
      participants: [], // Start empty
    };

    onCreate(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-6 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Event Name</label>
            <input 
              required type="text" placeholder="e.g. Will ETH flip BTC?" 
              className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-lg">
            <button type="button" onClick={() => setType("BETTING")} className={`py-2 rounded-md text-sm font-bold transition ${type === 'BETTING' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}>Betting</button>
            <button type="button" onClick={() => setType("STAKING")} className={`py-2 rounded-md text-sm font-bold transition ${type === 'STAKING' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}>Staking</button>
          </div>

          {type === 'STAKING' ? (
            <div>
              <label className="block text-gray-400 text-sm mb-1">Required Stake (ETH)</label>
              <input required type="number" step="0.0001" className="w-full bg-black/40 border border-purple-500/50 rounded-lg p-3 text-white focus:border-purple-500 outline-none" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} />
            </div>
          ) : (
             <div className="p-4 bg-blue-900/10 rounded-lg border border-blue-900/30 text-sm text-blue-200">ℹ️ Users will choose their own wager amount.</div>
          )}

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}