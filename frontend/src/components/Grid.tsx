// Grid.tsx
import { useContext } from 'react';
import SubGrid from './SubGrid';
import { GridContext } from './GridContext';
import GameOver from './GameOver';

function Grid() {
  const { grid, gameOver } = useContext(GridContext);
  return (
    <div className="grid-container">
      <div className="grid">
        {gameOver && <GameOver />}
        {grid && grid.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((col, colIndex) => (
              <SubGrid key={colIndex} values={col} subGridRow={rowIndex} subGridColumn={colIndex} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Grid;