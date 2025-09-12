export function checkGuess(
  guess: string,
  answer: string
): Array<'hit' | 'present' | 'miss'> {
  const normalizedGuess = guess.toLowerCase();
  const normalizedAnswer = answer.toLowerCase();
  
  // Initialize results as all misses
  const result: Array<'hit' | 'present' | 'miss'> = Array(5).fill('miss');
  
  // Track which letters in answer have been matched already
  const answerLetterUsed = Array(5).fill(false);
  
  // First pass: Check for exact matches (hits)
  for (let i = 0; i < 5; i++) {
    if (normalizedGuess[i] === normalizedAnswer[i]) {
      result[i] = 'hit';
      answerLetterUsed[i] = true;
    }
  }
  
  // Second pass: Check for letters in wrong position (present)
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'hit') continue; // Skip letters already marked as hits
    
    // Check if this letter exists elsewhere in the answer and hasn't been matched yet
    for (let j = 0; j < 5; j++) {
      if (!answerLetterUsed[j] && normalizedGuess[i] === normalizedAnswer[j]) {
        result[i] = 'present';
        answerLetterUsed[j] = true;
        break;
      }
    }
  }
  
  return result;
}

export function generateWordList(baseList: string[]): string[] {
  return baseList.filter(word => 
    word.length === 5 && /^[a-zA-Z]+$/.test(word)
  );
}

export function selectRandomWord(wordList: string[]): string {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex].toLowerCase();
} 