"use client";
import { useState, useEffect } from "react";
import CreateEventModal from "./CreateEventModal";
import ActionModal from "./ActionModal";
import { Event } from "../types";

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Initialize with some dummy data for testing
  useEffect(() => {
    setEvents([
      { id: "evt_101", title: "ETH to flip BTC in 2024", type: "BETTING", poolTotal: "12.5", createdAt: Date.now() },
      { id: "evt_102", title: "VIP High Rollers Room", type: "STAKING", stakeAmount: "50", createdAt: Date.now() },
    ]);
  }, []);

  // SEARCH LOGIC: Filter by Title OR ID
  const filteredEvents = events.filter((ev) => 
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ev.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEvent = (newEvent: Event) => {
    setEvents([newEvent, ...events]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10">
      
      {/* --- HEADER: SEARCH & CREATE --- */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
        <div className="flex-1 relative">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
           <input
            type="text"
            placeholder="Search by Event Name or ID..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg shadow-blue-900/20 flex items-center gap-2"
        >
          <span>+</span> Create Event
        </button>
      </div>

      {/* --- EVENTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
           <div className="col-span-full text-center py-20 text-gray-600 border-2 border-dashed border-gray-800 rounded-3xl">
             No events found matching "{searchTerm}"
           </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl relative group hover:border-gray-600 hover:-translate-y-1 transition duration-300">
              
              {/* Card Badges */}
              <div className="flex justify-between items-start mb-4">
                 <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  event.type === 'STAKING' ? 'bg-purple-900/30 text-purple-400' : 'bg-green-900/30 text-green-400'
                }`}>
                  {event.type}
                </span>
                <span className="font-mono text-xs text-gray-500 bg-black/40 px-2 py-1 rounded">#{event.id}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{event.title}</h3>
              
              <div className="bg-black/30 rounded-lg p-3 mb-6">
                {event.type === 'STAKING' ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Fixed Stake</span>
                    <span className="text-white font-mono">{event.stakeAmount} ETH</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Pool</span>
                    <span className="text-white font-mono">{event.poolTotal} ETH</span>
                  </div>
                )}
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

      {/* --- MODAL INJECTION --- */}
      {isCreateModalOpen && (
        <CreateEventModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onCreate={handleCreateEvent} 
        />
      )}

      {selectedEvent && (
        <ActionModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

    </div>
  );
}