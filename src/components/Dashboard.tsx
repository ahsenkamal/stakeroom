"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

type Event = {
  id: number;
  title: string;
  pool: string;
  type: "Betting" | "Staking" | "Prediction";
};

export default function Dashboard() {
  const { isConnected } = useAccount();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [pool, setPool] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch from API
  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
      setIsLoading(false);
    } catch (e) { console.error(e); }
  };

  // Poll for updates every 5 seconds
  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !pool) return;
    setIsSubmitting(true);

    await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({ title, pool: pool + " ETH", type: "Betting" }),
    });

    setTitle("");
    setPool("");
    setIsSubmitting(false);
    fetchEvents(); // Refresh immediately
  };

  if (!isConnected) return <div className="text-center mt-20 text-gray-500">Please connect wallet to view events</div>;

  const filtered = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="flex-1 bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">Create New Event</h3>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input 
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Event Title..." 
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 outline-none"
            />
            <input 
              value={pool} onChange={e => setPool(e.target.value)}
              placeholder="Pool (ETH)" type="number"
              className="w-24 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 outline-none"
            />
            <button disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">
              {isSubmitting ? "..." : "+"}
            </button>
          </form>
        </div>

        <div className="flex-1 flex items-end">
          <input 
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search active events..." 
            className="w-full bg-gray-900 text-white px-6 py-4 rounded-xl border border-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? <p className="text-white">Loading...</p> : filtered.map((ev) => (
          <div key={ev.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-gray-600 transition">
            <div className="flex justify-between mb-4">
              <span className="text-gray-500 text-xs">#{ev.id}</span>
              <span className="text-blue-400 text-xs bg-blue-900/30 px-2 py-1 rounded">{ev.type}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{ev.title}</h3>
            <p className="text-gray-400 text-sm">Pool Size: <span className="text-white font-mono">{ev.pool}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}