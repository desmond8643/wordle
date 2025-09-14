# Wordle Game Project

This is a Next.js implementation of the Wordle game with two variations: classic Wordle and Absurdle (host cheating mode).

## How to Setup / Test / Run the Project

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wordle
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Project
Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

### Game Modes
- **Classic Wordle**: Standard version where you guess a 5-letter word within 6 attempts
- **Absurdle**: A "cheating" version that changes the target word to be as difficult as possible

## Decisions and Trade-offs During Development

### Architecture Decisions
1. **Next.js Framework**: Chosen for its server-side rendering capabilities and API routes, which enabled secure server/client implementation.

2. **In-memory Storage**: Used for game state management to keep the project simple. In a production environment, this would be replaced with a database solution.

3. **TypeScript**: Implemented throughout for type safety and better developer experience.

### Game Logic Trade-offs
1. **Word List**: Used a small, hardcoded word list for simplicity. A production version would use a more comprehensive dictionary.

2. **Evaluation Logic**: Prioritized correctness over performance in the letter evaluation algorithm.

3. **Absurdle Algorithm**: Implemented a strategy that selects patterns with the fewest hits/presents while maximizing remaining candidates.

### UI Considerations
1. **Responsive Design**: Used Tailwind CSS to ensure the game works well on both mobile and desktop devices.

2. **Keyboard Component**: Implemented both on-screen and physical keyboard support for better accessibility.

3. **Game State Feedback**: Used color coding (green for hits, yellow for present, gray for miss) for clear visual feedback.

### Security Concerns
1. **Server-side Processing**: Answer is kept on the server and never sent to client until the game ends.

2. **Input Validation**: All user inputs are validated on the server side to prevent cheating.
