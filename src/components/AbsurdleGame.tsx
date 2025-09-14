 "use client";

import { useState, useEffect } from 'react';
import WordleRow from './WordleRow';
import Keyboard from './Keyboard';

interface AbsurdleGameProps {
  maxRounds: number;
}

type GameStatus = 'playing' | 'won' | 'lost';

const AbsurdleGame: React.FC<AbsurdleGameProps> = ({ maxRounds }) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<string[]>(Array(maxRounds).fill(''));
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [round, setRound] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [answer, setAnswer] = useState<string>('');
  const [candidateCount, setCandidateCount] = useState<number>(0);
  const [evaluations, setEvaluations] = useState<Array<Array<'hit' | 'present' | 'miss' | ''>>>(
    Array(maxRounds).fill(Array(5).fill(''))
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Initialize a new game when component mounts
  useEffect(() => {
    startNewGame();
  }, []);

  // Start a new game by calling the API
  const startNewGame = async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/absurdle/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to start a new game');
      }
      
      const data = await response.json();
      setGameId(data.gameId);
      setGuesses(Array(maxRounds).fill(''));
      setCurrentGuess('');
      setRound(0);
      setGameStatus('playing');
      setAnswer('');
      setCandidateCount(data.totalCandidates);
      setEvaluations(Array(maxRounds).fill(Array(5).fill('')));
      
    } catch (error) {
      console.error('Error starting game:', error);
      setErrorMessage('Failed to start a new game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard input
  const handleKeyPress = (letter: string) => {
    if (gameStatus !== 'playing' || isLoading) return;
    
    if (letter === 'ENTER') {
      if (currentGuess.length === 5) {
        submitGuess();
      }
    } else if (letter === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + letter.toLowerCase());
    }
  };

  // Submit the current guess to the server
  const submitGuess = async () => {
    if (currentGuess.length !== 5 || !gameId) return;
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/absurdle/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          guess: currentGuess
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit guess');
      }
      
      const data = await response.json();
      
      // Update the guesses array
      const newGuesses = [...guesses];
      newGuesses[round] = currentGuess;
      setGuesses(newGuesses);
      
      // Update evaluations
      const newEvaluations = [...evaluations];
      newEvaluations[round] = data.evaluation;
      setEvaluations(newEvaluations);
      
      // Update candidate count
      setCandidateCount(data.remainingCandidates);
      
      // Check game status
      if (data.status === 'won') {
        setGameStatus('won');
        setAnswer(data.answer);
      } else if (data.status === 'lost') {
        setGameStatus('lost');
        setAnswer(data.answer);
      } else {
        // Move to next round
        setRound(round + 1);
        setCurrentGuess('');
      }
      
    } catch (error) {
      console.error('Error submitting guess:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit guess');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}
      
      <div className="text-center mb-2">
        <h2 className="text-lg font-bold">Absurdle</h2>
        <p className="text-sm opacity-75">
          The game that changes the answer to be as difficult as possible!
        </p>
        {candidateCount > 0 && gameStatus === 'playing' && (
          <p className="text-xs mt-1">Possible words: {candidateCount}</p>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        {guesses.map((guess, index) => (
          <WordleRow 
            key={index} 
            word={index === round ? currentGuess : guess} 
            evaluation={evaluations[index]} 
            isCurrentRow={index === round}
          />
        ))}
      </div>
      
      <Keyboard 
        onKeyPress={handleKeyPress} 
        evaluations={evaluations} 
        disabled={isLoading || gameStatus !== 'playing'} 
      />
      
      {gameStatus === 'won' && (
        <div className="mt-4 text-center">
          <p className="text-green-600 font-bold text-xl">You won!</p>
          <p>You guessed the word in {round + 1} {round === 0 ? 'try' : 'tries'}.</p>
          <p>The word was: <span className="font-bold">{answer}</span></p>
          <button 
            onClick={startNewGame}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
      
      {gameStatus === 'lost' && (
        <div className="mt-4 text-center">
          <p className="text-red-600 font-bold text-xl">Game Over</p>
          <p>The word was: <span className="font-bold">{answer}</span></p>
          <button 
            onClick={startNewGame}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default AbsurdleGame;