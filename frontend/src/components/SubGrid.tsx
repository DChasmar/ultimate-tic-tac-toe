// SubGrid.tsx
import React, { useContext } from 'react';
import Cell from './Cell';
import { GridContext } from './GridContext';
import { SubGridProps } from '../types';

const SubGrid: React.FC<SubGridProps> = ({ values, subGridRow, subGridColumn }) => {
  const { subGridsCompleted, nextSubGrid } = useContext(GridContext);
  const subGridNumberCode: number = subGridRow * 10 + subGridColumn;
  const subGridSymbol = subGridsCompleted?.X.has(subGridNumberCode) ? 'X' : subGridsCompleted?.O.has(subGridNumberCode) ? 'O' : subGridsCompleted?.full.has(subGridNumberCode) ? '=' : '';
  const subGridStyle = subGridSymbol === 'X' ? 'x' : subGridSymbol === 'O' ? 'o' : subGridsCompleted?.full.has(subGridNumberCode) ? 'full' : '';

  return (
    <div className={`sub-grid-container ${subGridStyle}`} 
        data-symbol={subGridSymbol}>
      <div className="grid">
        {values.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((cellValue, cellIndex) => (
              <Cell key={cellIndex} value={cellValue} 
              subGridRow={subGridRow} subGridColumn={subGridColumn} 
              cellRow={rowIndex}  cellColumn={cellIndex} 
              isNextSubGrid={nextSubGrid && nextSubGrid.has(subGridNumberCode) || false} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubGrid;