import React from 'react';

interface WordleRowProps {
  word: string;
  evaluation: Array<'hit' | 'present' | 'miss' | ''>;
  isCurrentRow: boolean;
}

const WordleRow: React.FC<WordleRowProps> = ({ word, evaluation, isCurrentRow }) => {
  // Pad the word to 5 letters for display
  const displayWord = word.padEnd(5, ' ');

  return (
    <div className="flex gap-1">
      {displayWord.split('').map((letter, index) => {
        let bgColor = 'bg-gray-200 dark:bg-gray-700';
        let textColor = 'text-black dark:text-white';
        
        if (letter !== ' ' && evaluation && evaluation[index]) {
          if (evaluation[index] === 'hit') {
            bgColor = 'bg-green-500';
            textColor = 'text-white';
          } else if (evaluation[index] === 'present') {
            bgColor = 'bg-yellow-500';
            textColor = 'text-black';
          } else if (evaluation[index] === 'miss') {
            bgColor = 'bg-gray-500 dark:bg-gray-800';
            textColor = 'text-white';
          }
        }
        
        // Current row that hasn't been submitted yet
        if (isCurrentRow) {
          bgColor = letter === ' ' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-300 dark:bg-gray-600';
        }
        
        return (
          <div 
            key={index} 
            className={`w-14 h-14 flex items-center justify-center font-bold text-2xl ${bgColor} ${textColor} rounded`}
          >
            {letter !== ' ' ? letter.toUpperCase() : ''}
          </div>
        );
      })}
    </div>
  );
};

export default WordleRow; 