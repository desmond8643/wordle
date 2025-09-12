"use client";

import { useState, useEffect } from "react";
import WordleGame from "../components/WordleGame";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Wordle</h1>
      <WordleGame 
        maxRounds={6} 
        wordList={["apple", "paper", "heart", "swift", "dance", "unity", "react", "slime", "plate", "house"]} 
      />
    </div>
  );
}
