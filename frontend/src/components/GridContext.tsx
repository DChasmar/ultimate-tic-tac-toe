import React, { createContext, useState, ReactNode } from 'react';
import { GridContextType, SubGridsCompleted } from '../types';
import { allSubGrids } from '../constants';
import { createInitialSubGridsCompleted, createEmptyGrid } from '../utils';

export const GridContext = createContext<GridContextType>({});

interface GridProviderProps {
    children: ReactNode;
}

export const GridProvider: React.FC<GridProviderProps> = ({ children }) => {
  const [grid, setGrid] = useState<string[][][][]>(createEmptyGrid());

  const [subGridsCompleted, setSubGridsCompleted] = useState<SubGridsCompleted>(createInitialSubGridsCompleted());

  const [whoseTurn, setWhoseTurn] = useState<'X' | 'O'>('X'); // Initialize to 'X'

  const [nextSubGrid, setNextSubGrid] = useState<Set<number>>(allSubGrids);

  const [gameOver, setGameOver] = useState<boolean>(false);

  const playAgain = () => {
    if (gameOver) {
      if (!setGameOver || !setGrid || !setSubGridsCompleted || !setWhoseTurn || !setNextSubGrid) return;
      setGameOver(false);
      setGrid(createEmptyGrid());
      setSubGridsCompleted(createInitialSubGridsCompleted());
      setWhoseTurn('X');
      setNextSubGrid(allSubGrids);
    }
  }

  return (
    <GridContext.Provider value={{
      grid, setGrid, 
      subGridsCompleted, setSubGridsCompleted,
      whoseTurn, setWhoseTurn, 
      nextSubGrid, setNextSubGrid,
      gameOver, setGameOver,
      playAgain
      }}>
      {children}
    </GridContext.Provider>
  );
};