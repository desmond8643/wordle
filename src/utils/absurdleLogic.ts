type EvaluationType = 'hit' | 'present' | 'miss';
type EvaluationPattern = EvaluationType[];

interface PatternGroup {
  pattern: EvaluationPattern;
  words: string[];
  score: number;
}

export function calculateEvaluation(guess: string, answer: string): EvaluationPattern {
  const normalizedGuess = guess.toLowerCase();
  const normalizedAnswer = answer.toLowerCase();
  
  const result: EvaluationPattern = Array(5).fill('miss');
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

// Calculate score - lower is better (more challenging)
function calculatePatternScore(pattern: EvaluationPattern): number {
  const hits = pattern.filter(p => p === 'hit').length;
  const presents = pattern.filter(p => p === 'present').length;
  
  // Weight hits more heavily than presents
  return hits * 100 + presents;
}

export function processGuessWithCheating(
  guess: string,
  candidates: string[]
): {
  evaluation: EvaluationPattern;
  remainingCandidates: string[];
  bestAnswer: string;
} {
  // Group words by their evaluation pattern
  const patternGroups: Record<string, PatternGroup> = {};
  
  candidates.forEach(word => {
    const pattern = calculateEvaluation(guess, word);
    const patternKey = pattern.join(',');
    
    if (!patternGroups[patternKey]) {
      patternGroups[patternKey] = {
        pattern,
        words: [],
        score: calculatePatternScore(pattern)
      };
    }
    
    patternGroups[patternKey].words.push(word);
  });
  
  // Find the pattern with the lowest score (fewest hits, then fewest presents)
  let bestGroup: PatternGroup | null = null;
  
  Object.values(patternGroups).forEach(group => {
    if (!bestGroup || group.score < bestGroup.score || 
        (group.score === bestGroup.score && group.words.length > bestGroup.words.length)) {
      bestGroup = group;
    }
  });
  
  if (!bestGroup) {
    throw new Error("No valid candidates found");
  }

  const { pattern, words } = bestGroup;

  return {
    evaluation: pattern,
    remainingCandidates: words,
    bestAnswer: words[0]
  };
} 