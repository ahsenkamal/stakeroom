"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import CreateEventModal from "./CreateEventModal";
import ActionModal from "./ActionModal";
import CreatorBadge from "./CreatorBadge"; 
import { Event } from "../types";

const getTimeRemaining = (endsAt: number) => {
  const total = endsAt - Date.now();
  if (total <= 0) return "ENDED";
  
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`; 
};

export default function Dashboard() {
  const { address } = useAccount();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'ALL' | 'MY'>('ALL'); 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setEvents([
      { 
        id: "evt_101", 
        title: "ETH will go to 4000", 
        type: "BETTING", 
        creatorAddress: "0x123...mock", 
        poolTotal: "12.5", 
        createdAt: Date.now(), 
        endsAt: Date.now() + 72800000,
        participants: [] 
      },
      { 
        id: "evt_102", 
        title: "Exclusive pool event entry", 
        type: "STAKING", 
        creatorAddress: "0x123...mock", 
        stakeAmount: "0.1", 
        createdAt: Date.now(), 
        endsAt: Date.now() + 72800000,
        participants: [] 
      },
    ]);
  }, [address]);

  const handleEventUpdate = (updatedEvent: Event) => {
    setEvents(prev => prev.map(ev => (ev.id === updatedEvent.id ? updatedEvent : ev)));
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter((ev) => {
    const matchesSearch = ev.title.toLowerCase().includes(searchTerm.toLowerCase());
    const isMyEvent = ev.creatorAddress === address || (address && ev.participants.includes(address));
    const matchesView = viewMode === 'ALL' ? true : isMyEvent;
    return matchesSearch && matchesView;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this event?")) setEvents(events.filter(ev => ev.id !== id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10">
      
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex justify-between gap-4">
          <input
            type="text"
            placeholder="Search events..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition">+ Create</button>
        </div>
        <div className="flex gap-6 border-b border-gray-800">
          <button onClick={() => setViewMode('ALL')} className={`pb-3 text-sm font-bold border-b-2 ${viewMode === 'ALL' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent'}`}>All Events</button>
          <button onClick={() => setViewMode('MY')} className={`pb-3 text-sm font-bold border-b-2 ${viewMode === 'MY' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent'}`}>My Events</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const timeLeft = getTimeRemaining(event.endsAt);
          const isExpired = timeLeft === "ENDED";

          return (
            <div key={event.id} className={`bg-gray-900 border p-6 rounded-2xl relative group transition ${isExpired ? 'border-gray-800 opacity-70' : 'border-gray-800 hover:border-gray-600'}`}>
              
              <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded border ${
                isExpired ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
              }`}>
                {timeLeft}
              </div>

              {address && event.creatorAddress === address && (
                <button onClick={(e) => handleDelete(e, event.id)} className="absolute top-4 right-20 text-gray-600 hover:text-red-500 transition z-10 p-1" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              )}

              <div className="flex justify-between items-start mb-3">
                 <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${event.type === 'STAKING' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>{event.type}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
              <div className="mb-4"><CreatorBadge address={event.creatorAddress} /></div>

              <div className="bg-black/30 rounded-lg p-3 mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{event.type === 'STAKING' ? 'Stake' : 'Pool'}</span>
                  <span className="text-white font-mono font-bold">{event.type === 'STAKING' ? event.stakeAmount : event.poolTotal} ETH</span>
                </div>
                <div className="text-xs text-gray-500 text-right">{event.participants.length} players</div>
              </div>

              <button 
                onClick={() => !isExpired && setSelectedEvent(event)}
                disabled={isExpired}
                className={`w-full py-3 rounded-xl font-semibold transition border ${
                  isExpired 
                    ? 'bg-gray-800 text-gray-500 border-gray-800 cursor-not-allowed' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700 hover:border-gray-500'
                }`}
              >
                {isExpired ? 'Event Ended' : (event.type === 'STAKING' ? 'Stake Now' : 'Place Bet')}
              </button>
            </div>
          );
        })}
      </div>

      {isCreateModalOpen && <CreateEventModal onClose={() => setIsCreateModalOpen(false)} onCreate={(ev) => setEvents([ev, ...events])} />}
      {selectedEvent && <ActionModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onUpdate={handleEventUpdate} />}
    </div>
  );
}