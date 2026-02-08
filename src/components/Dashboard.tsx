"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import CreateEventModal from "./CreateEventModal";
import ActionModal from "./ActionModal";
import CreatorBadge from "./CreatorBadge"; // Import the badge
import { Event } from "../types";

export default function Dashboard() {
  const { address } = useAccount(); // Get current user
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // UI State
  const [viewMode, setViewMode] = useState<'ALL' | 'MY'>('ALL'); // Toggle State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Initialize Data
  useEffect(() => {
    setEvents([
      { id: "evt_101", title: "ETH back to 4000", type: "BETTING", creatorAddress: "0x123...mock", poolTotal: "12.5", createdAt: Date.now() },
      { id: "evt_102", title: "Exclusive pool event entry", type: "STAKING", creatorAddress: address || "0x000...000", stakeAmount: "50", createdAt: Date.now() },
    ]);
  }, [address]);

  // --- FILTERING LOGIC ---
  const filteredEvents = events.filter((ev) => {
    const matchesSearch = ev.title.toLowerCase().includes(searchTerm.toLowerCase()) || ev.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesView = viewMode === 'ALL' ? true : ev.creatorAddress === address;
    return matchesSearch && matchesView;
  });

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Stop click from opening the modal
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10">
      
      {/* --- HEADER CONTROLS --- */}
      <div className="flex flex-col gap-6 mb-10">
        
        {/* Row 1: Search & Create */}
        <div className="flex justify-between gap-4">
          <input
            type="text"
            placeholder="Search events..."
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-900/20"
          >
            + Create
          </button>
        </div>

        {/* Row 2: Tabs (All vs My Events) */}
        <div className="flex gap-4 border-b border-gray-800">
          <button 
            onClick={() => setViewMode('ALL')}
            className={`pb-3 px-2 text-sm font-bold transition border-b-2 ${
              viewMode === 'ALL' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            All Events
          </button>
          <button 
            onClick={() => setViewMode('MY')}
            className={`pb-3 px-2 text-sm font-bold transition border-b-2 ${
              viewMode === 'MY' ? 'text-white border-blue-500' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            My Events
          </button>
        </div>
      </div>

      {/* --- EVENTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
           <div className="col-span-full text-center py-20 text-gray-600 border-2 border-dashed border-gray-800 rounded-3xl">
             {viewMode === 'MY' ? "You haven't created any events yet." : "No events found."}
           </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative group hover:border-gray-600 transition">
              
              {/* DELETE BUTTON (Only visible if you are the creator) */}
              {address && event.creatorAddress === address && (
                <button 
                  onClick={(e) => handleDelete(e, event.id)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition z-10 p-1"
                  title="Delete Event"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              )}

              {/* Header: Type & Creator */}
              <div className="flex justify-between items-start mb-3 pr-8">
                 <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  event.type === 'STAKING' ? 'bg-purple-900/30 text-purple-400' : 'bg-green-900/30 text-green-400'
                }`}>
                  {event.type}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              
              {/* Creator Info */}
              <div className="mb-4">
                <CreatorBadge address={event.creatorAddress} />
              </div>

              <div className="bg-black/30 rounded-lg p-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{event.type === 'STAKING' ? 'Stake' : 'Pool'}</span>
                  <span className="text-white font-mono">
                    {event.type === 'STAKING' ? event.stakeAmount : event.poolTotal} ETH
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedEvent(event)}
                className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition border border-gray-700 hover:border-gray-500"
              >
                {event.type === 'STAKING' ? 'Stake Now' : 'Place Bet'}
              </button>
            </div>
          ))
        )}
      </div>

      {isCreateModalOpen && <CreateEventModal onClose={() => setIsCreateModalOpen(false)} onCreate={(ev) => setEvents([ev, ...events])} />}
      {selectedEvent && <ActionModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}