declare global {
  var wordleGames: {
    [gameId: string]: {
      answer: string;
      guesses: string[];
      status: string;
    };
  };
  
  var absurdleGames: {
    [gameId: string]: {
      candidates: string[];
      currentAnswer: string | null;
      guesses: string[];
      guessResults: Array<Array<'hit' | 'present' | 'miss'>>;
      status: string;
    };
  };
}

export {}; 