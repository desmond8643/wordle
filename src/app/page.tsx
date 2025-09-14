"use client";

import { useState } from "react";
import WordleGame from "../components/WordleGame";
import AbsurdleGame from "../components/AbsurdleGame";

export default function Home() {
  const [gameMode, setGameMode] = useState<"wordle" | "absurdle">("wordle");
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Wordle Games</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setGameMode("wordle")} 
          className={`px-4 py-2 rounded ${gameMode === "wordle" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        >
          Classic Wordle
        </button>
        <button 
          onClick={() => setGameMode("absurdle")} 
          className={`px-4 py-2 rounded ${gameMode === "absurdle" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        >
          Absurdle (Cheating)
        </button>
      </div>
      
      {gameMode === "wordle" ? (
        <WordleGame maxRounds={6} />
      ) : (
        <AbsurdleGame maxRounds={6} />
      )}
    </div>
  );
}
