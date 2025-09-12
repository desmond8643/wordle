import React from 'react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  evaluations: Array<Array<'hit' | 'present' | 'miss' | ''>>;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, evaluations }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Track letter states based on all evaluations
  const letterStates: Record<string, 'hit' | 'present' | 'miss' | null> = {};

  // Process all evaluations to determine the state of each letter
  evaluations.forEach(rowEval => {
    if (!rowEval || rowEval[0] === '') return;
    
    rowEval.forEach((evaluation, index) => {
      const guessIndex = evaluations.findIndex(e => e === rowEval);
      if (guessIndex === -1) return;
      
      const letter = document.querySelector(`[data-guess="${guessIndex}"]`)?.textContent?.[index]?.toLowerCase() || '';
      
      if (!letter) return;
      
      // Only update if the current evaluation is better than what we have
      if (evaluation === 'hit' || 
          (evaluation === 'present' && letterStates[letter] !== 'hit') ||
          (evaluation === 'miss' && !letterStates[letter])) {
        letterStates[letter] = evaluation;
      }
    });
  });

  // Use real keyboard input as well
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      
      if (key === 'ENTER' || key === 'BACKSPACE' || 
          (key.length === 1 && key >= 'A' && key <= 'Z')) {
        onKeyPress(key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  return (
    <div className="flex flex-col items-center gap-1">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((key) => {
            const lowerKey = key.toLowerCase();
            let bgColor = 'bg-gray-300 dark:bg-gray-600';
            let width = 'w-8 sm:w-10';
            
            if (key === 'ENTER' || key === 'BACKSPACE') {
              width = 'w-16 sm:w-20';
            }
            
            // Apply colors based on letter evaluation
            if (letterStates[lowerKey]) {
              if (letterStates[lowerKey] === 'hit') {
                bgColor = 'bg-green-500';
              } else if (letterStates[lowerKey] === 'present') {
                bgColor = 'bg-yellow-500';
              } else if (letterStates[lowerKey] === 'miss') {
                bgColor = 'bg-gray-500 dark:bg-gray-800';
              }
            }
            
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`${width} h-12 sm:h-14 flex items-center justify-center font-medium ${bgColor} rounded text-sm sm:text-base`}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard; 