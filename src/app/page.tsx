"use client";
import { useState } from "react";
import UserProfile from "../components/UserProfile";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [showEnsPopup, setShowEnsPopup] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
            stakeroom
          </h1>
          <UserProfile onMissingEns={() => setShowEnsPopup(true)} />
        </div>
      </nav>

      {/* Content */}
      <Dashboard />

      {/* Missing ENS Popup Modal */}
      {showEnsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
            <button 
              onClick={() => setShowEnsPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >✕</button>
            
            <h2 className="text-2xl font-bold mb-2 text-white">Get a Web3 Username</h2>
            <p className="text-gray-400 mb-6 text-sm">
              You are currently using a raw hex address. Create an ENS name (e.g., yourname.eth) to build your reputation on Stakeroom.
            </p>

            <a 
              href="https://app.ens.domains" 
              target="_blank"
              className="block w-full bg-white text-black font-bold text-center py-3 rounded-lg hover:bg-gray-200 transition mb-3"
            >
              Mint ENS Name
            </a>
            <button 
              onClick={() => setShowEnsPopup(false)}
              className="block w-full text-gray-500 hover:text-white py-2 text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}