import { NextResponse } from "next/server";
import { processGuessWithCheating } from "../../../../utils/absurdleLogic";

export async function POST(req: Request) {
  try {
    const { gameId, guess } = await req.json();
    
    // Input validation
    if (!gameId || !guess) {
      return NextResponse.json({ error: "Missing gameId or guess" }, { status: 400 });
    }
    
    if (!global.absurdleGames || !global.absurdleGames[gameId]) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    
    const game = global.absurdleGames[gameId];
    
    // Check if game is already over
    if (game.status !== "playing") {
      return NextResponse.json({ 
        error: "Game already ended",
        status: game.status,
        answer: game.currentAnswer
      }, { status: 400 });
    }
    
    // Validate guess format
    if (typeof guess !== "string" || guess.length !== 5 || !/^[a-zA-Z]+$/.test(guess)) {
      return NextResponse.json({ error: "Invalid guess format" }, { status: 400 });
    }
    
    // Process the guess with our cheating algorithm
    const { evaluation, remainingCandidates, bestAnswer } = processGuessWithCheating(
      guess, 
      game.candidates
    );
    
    // Update game state
    game.candidates = remainingCandidates;
    game.currentAnswer = bestAnswer;
    game.guesses.push(guess);
    game.guessResults.push(evaluation);
    
    // Check if the player has guessed correctly or has run out of guesses
    const isCorrectGuess = evaluation.every(e => e === "hit");
    
    if (isCorrectGuess) {
      game.status = "won";
    } else if (game.guesses.length >= 6) {
      game.status = "lost";
    }
    
    return NextResponse.json({
      evaluation,
      guessCount: game.guesses.length,
      status: game.status,
      answer: game.status !== "playing" ? game.currentAnswer : null,
      remainingCandidates: remainingCandidates.length
    });
    
  } catch (error) {
    console.error("Error processing guess:", error);
    return NextResponse.json({ error: "Failed to process guess" }, { status: 500 });
  }
} 