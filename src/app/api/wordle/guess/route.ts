import { checkGuess } from '../../../../utils/gameLogic';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { gameId, guess } = await req.json();
    
    // Input validation
    if (!gameId || !guess) {
      return NextResponse.json({ error: 'Missing gameId or guess' }, { status: 400 });
    }
    
    if (!global.wordleGames || !global.wordleGames[gameId]) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    
    const game = global.wordleGames[gameId];
    
    // Check if game is already over
    if (game.status !== 'playing') {
      return NextResponse.json({ 
        error: 'Game already ended',
        status: game.status,
        answer: game.answer // Return answer if game is over
      }, { status: 400 });
    }
    
    // Validate guess format
    if (typeof guess !== 'string' || guess.length !== 5 || !/^[a-zA-Z]+$/.test(guess)) {
      return NextResponse.json({ error: 'Invalid guess format' }, { status: 400 });
    }
    
    // Add guess to game history
    game.guesses.push(guess);
    
    // Check the guess
    const evaluation = checkGuess(guess, game.answer);
    
    // Determine game status
    let status = 'playing';
    let answer = null;
    
    if (guess.toLowerCase() === game.answer.toLowerCase()) {
      status = 'won';
      answer = game.answer;
      game.status = 'won';
    } else if (game.guesses.length >= 6) {
      status = 'lost';
      answer = game.answer;
      game.status = 'lost';
    }
    
    return NextResponse.json({
      evaluation,
      guessCount: game.guesses.length,
      status,
      answer // Will be null unless game is over
    });
    
  } catch (error) {
    console.error('Error processing guess:', error);
    return NextResponse.json({ error: 'Failed to process guess' }, { status: 500 });
  }
} 