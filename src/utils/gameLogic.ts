export function checkGuess(
  guess: string,
  answer: string
): Array<'hit' | 'present' | 'miss'> {
  const normalizedGuess = guess.toLowerCase();
  const normalizedAnswer = answer.toLowerCase();
  
  const result: Array<'hit' | 'present' | 'miss'> = Array(5).fill('miss');
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
    if (result[i] === 'hit') continue;
    
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

export function selectRandomWord(wordList: string[]): string {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex].toLowerCase();
} 