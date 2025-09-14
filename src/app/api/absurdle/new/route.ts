import { NextResponse } from "next/server";

// Sample word list - in a production app, you'd load this from a database or file
const WORD_LIST = [
  "apple", "beach", "cloud", "dance", "earth", "fruit", "grape", "heart", 
  "image", "jumbo", "knife", "lemon", "music", "night", "ocean", "pizza", 
  "queen", "river", "snake", "table", "under", "voice", "water", "xenon",
  "young", "zebra", "clown", "plumb", "glass", "stone", "train", "plant"
];

export async function POST() {
  try {
    // Generate a unique game ID
    const gameId = Date.now().toString();
    
    // Create a game with all candidate words
    if (!global.absurdleGames) {
      global.absurdleGames = {};
    }
    
    global.absurdleGames[gameId] = {
      candidates: [...WORD_LIST],
      currentAnswer: null, // We don't pick an answer yet
      guesses: [],
      guessResults: [],
      status: "playing"
    };
    
    return NextResponse.json({
      gameId,
      maxGuesses: 6,
      totalCandidates: WORD_LIST.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to start game" },
      { status: 500 }
    );
  }
} 