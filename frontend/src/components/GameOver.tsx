import React, { useContext } from 'react';
import { GridContext } from './GridContext';

const GameOver: React.FC = () => {
  const { playAgain } = useContext(GridContext);
  const handlePlayAgain = () => {
    if (!playAgain) return;
    playAgain();
  }

  return (
    <div className="game-over-modal">
      <div className="game-over-content">
        <h2>Game Over</h2>
        <button onClick={handlePlayAgain}>Play Again</button>
      </div>
    </div>
  );
};

export default GameOver;