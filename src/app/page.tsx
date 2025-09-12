"use client";

import WordleGame from "../components/WordleGame";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Wordle</h1>
      <WordleGame maxRounds={6} />
    </div>
  );
}
