"use client";
import { useState, useCallback } from "react";
import Dashboard from "../components/Dashboard";
import UserProfile from "../components/UserProfile";

export default function Home() {
  const [showEnsPopup, setShowEnsPopup] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  const handleMissingEns = useCallback(() => {
    if (!hasDismissed) {
      setShowEnsPopup(true);
    }
  }, [hasDismissed]);

  const handleClosePopup = () => {
    setShowEnsPopup(false);
    setHasDismissed(true); 
  };

  return (
    <main className="min-h-screen bg-black text-white">
      
      <nav className="border-b border-gray-800 p-4 flex justify-between items-center bg-gray-900/50 sticky top-0 backdrop-blur-md z-30">
        <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
          STAKEROOM
        </h1>
        
        {/* Pass the handler */}
        <UserProfile onMissingEns={handleMissingEns} />
      </nav>

      <Dashboard />

      {/* Popup */}
      {showEnsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-md p-8 rounded-3xl shadow-2xl relative">
            
            {/* Close Button (X) */}
            <button 
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
            >
              ✕
            </button>
            
            <div className="w-16 h-16 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
              ⚠️
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2 text-white">Missing Identity</h2>
            <p className="text-gray-400 text-center mb-8">
              Your wallet is connected, but you don't have an ENS name. Stakeroom is built on reputation.
            </p>

            <a 
              href="https://app.ens.domains" 
              target="_blank"
              className="block w-full bg-white text-black font-bold text-center py-4 rounded-xl hover:bg-gray-200 transition mb-3"
            >
              Get an ENS Name ↗
            </a>
            
            {/* Continue Button */}
            <button 
              onClick={handleClosePopup}
              className="block w-full text-gray-500 hover:text-white py-2 text-sm transition"
            >
              Continue anonymously
            </button>
          </div>
        </div>
      )}
    </main>
  );
}