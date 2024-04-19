// Cell.tsx
import React, { useContext } from 'react';
import { addSymbolToCell, checkWinningCombinations, nextTurn, updateSubGridsCompleted, updateNextSubGrid  } from '../utils';
import { CellProps } from '../types';
import { GridContext } from './GridContext';

const Cell: React.FC<CellProps> = ({ value, subGridRow, subGridColumn, cellRow, cellColumn, isNextSubGrid }) => {
    const { grid, setGrid, subGridsCompleted, setSubGridsCompleted, whoseTurn, setWhoseTurn, setNextSubGrid, setGameOver } = useContext(GridContext);
    const nextSubGridNumberCode: number = cellRow * 10 + cellColumn;
    const handleAddSymbolToCell = (nextSubGridNumberCode: number, subGridRow: number, subGridColumn: number) => () => {
        if (!grid || !setGrid || !whoseTurn || !setWhoseTurn || !subGridsCompleted || !setSubGridsCompleted || !setNextSubGrid || !setGameOver) return;
        if (grid[subGridRow][subGridColumn][cellRow][cellColumn] !== '') return;

        const newGridValues = addSymbolToCell({
            grid: grid,
            subGridRow: subGridRow,
            subGridColumn: subGridColumn,
            cellRow: cellRow,
            cellColumn: cellColumn,
            symbol: whoseTurn
        });
        setGrid(newGridValues);

        const newGridCode = 10 * subGridRow + subGridColumn;
        const newSubGridsCompleted = updateSubGridsCompleted(newGridValues[subGridRow][subGridColumn], subGridsCompleted, newGridCode, whoseTurn);      
        setSubGridsCompleted(newSubGridsCompleted);

        const isGameOver = checkWinningCombinations(newSubGridsCompleted[whoseTurn]) || newSubGridsCompleted['full'].size + newSubGridsCompleted['X'].size + newSubGridsCompleted['O'].size === 9;
        if (isGameOver) {setNextSubGrid(new Set<number>()); setGameOver(true); return;}

        const newNextSubGrid = updateNextSubGrid(nextSubGridNumberCode, newSubGridsCompleted);
        setNextSubGrid(newNextSubGrid);
        setWhoseTurn(nextTurn(whoseTurn));
    };
    
    return (
        <div
            className={`cell ${isNextSubGrid ? 'nextSubGrid' : ''}`}
            style={{cursor: isNextSubGrid ? 'pointer' : 'default'}}
            onClick={(isNextSubGrid) ? handleAddSymbolToCell(nextSubGridNumberCode, subGridRow, subGridColumn) : undefined}
        > {value} </div>
    );
};

export default Cell;