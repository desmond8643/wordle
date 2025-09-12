"use client";

import { useState, useEffect } from "react";
import WordleRow from "./WordleRow";
import Keyboard from "./Keyboard";
import { checkGuess } from "../utils/gameLogic";

interface WordleGameProps {
  maxRounds: number;
  wordList: string[];
}

type GameStatus = "playing" | "won" | "lost";

const WordleGame: React.FC<WordleGameProps> = ({ maxRounds, wordList }) => {
  const [answer, setAnswer] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>(Array(maxRounds).fill(""));
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [round, setRound] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [evaluations, setEvaluations] = useState<
    Array<Array<"hit" | "present" | "miss" | "">>
  >(Array(maxRounds).fill(Array(5).fill("")));

  // Select a random word from the wordList at the beginning
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    setAnswer(wordList[randomIndex].toLowerCase());
  }, [wordList]);

  // Handle keyboard input
  const handleKeyPress = (letter: string) => {
    if (gameStatus !== "playing") return;

    if (letter === "ENTER") {
      if (currentGuess.length === 5) {
        submitGuess();
      }
    } else if (letter === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + letter.toLowerCase());
    }
  };

  // Submit the current guess
  const submitGuess = () => {
    if (currentGuess.length !== 5) return;

    const newGuesses = [...guesses];
    newGuesses[round] = currentGuess;
    setGuesses(newGuesses);

    const result = checkGuess(currentGuess, answer);

    const newEvaluations = [...evaluations];
    newEvaluations[round] = result;
    setEvaluations(newEvaluations);

    // Check if player won
    if (currentGuess.toLowerCase() === answer.toLowerCase()) {
      setGameStatus("won");
    } else if (round === maxRounds - 1) {
      // Check if player lost (all rounds used)
      setGameStatus("lost");
    } else {
      // Move to next round
      setRound(round + 1);
      setCurrentGuess("");
    }
  };

  // Reset the game
  const resetGame = () => {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    setAnswer(wordList[randomIndex].toLowerCase());
    setGuesses(Array(maxRounds).fill(""));
    setCurrentGuess("");
    setRound(0);
    setGameStatus("playing");
    setEvaluations(Array(maxRounds).fill(Array(5).fill("")));
  };

  return (
    <div className="flex flex-col items-center gap-6">
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

      <Keyboard onKeyPress={handleKeyPress} evaluations={evaluations} />

      {gameStatus === "won" && (
        <div className="mt-4 text-center">
          <p className="text-green-600 font-bold text-xl">You won!</p>
          <p>
            You guessed the word in {round + 1} {round === 0 ? "try" : "tries"}.
          </p>
          <button
            onClick={resetGame}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="mt-4 text-center">
          <p className="text-red-600 font-bold text-xl">Game Over</p>
          <p>
            The word was: <span className="font-bold">{answer}</span>
          </p>
          <button
            onClick={resetGame}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default WordleGame;
