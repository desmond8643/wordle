declare global {
  var wordleGames: {
    [gameId: string]: {
      answer: string;
      guesses: string[];
      status: string;
    };
  };
}

export {}; 