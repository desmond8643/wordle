import { selectRandomWord } from "../../../../utils/gameLogic";
import { NextResponse } from "next/server";

// Sample word list - in a production app, you'd load this from a database or file
const WORD_LIST = [
  "apple",
  "beach",
  "cloud",
  "dance",
  "earth",
  "fruit",
  "grape",
  "heart",
  "image",
  "jumbo",
  "knife",
  "lemon",
  "music",
  "night",
  "ocean",
  "pizza",
  "queen",
  "river",
  "snake",
  "table",
  "under",
  "voice",
  "water",
  "young",
  "zebra",
];

export async function POST() {
  try {
    // Generate a unique game ID (normally would use a database)
    const gameId = Date.now().toString();

    // Select a random word for this game
    const answer = selectRandomWord(WORD_LIST);

    if (!global.wordleGames) {
      global.wordleGames = {};
    }

    global.wordleGames[gameId] = {
      answer,
      guesses: [],
      status: "playing",
    };

    // Only send the game ID, not the answer
    return NextResponse.json({
      gameId,
      maxGuesses: 6,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to start game" },
      { status: 500 }
    );
  }
}
