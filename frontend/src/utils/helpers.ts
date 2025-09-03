import { allSubGrids, winningCombinations } from "../constants";
import {
  SubGridsCompleted,
  AddSymbolToCellProps,
  PlayRandomProps,
  PlayRandomResult,
  PlayIntelligentProps,
  PlayIntelligentResult,
} from "../types";

export const createEmptyGrid = (): string[][][][] => {
  return Array(3)
    .fill(0)
    .map(() =>
      Array(3)
        .fill(0)
        .map(() =>
          Array(3)
            .fill(0)
            .map(() => Array(3).fill(""))
        )
    );
};

export const createInitialSubGridsCompleted = (): SubGridsCompleted => {
  return {
    X: new Set<number>(),
    O: new Set<number>(),
    full: new Set<number>(),
  };
};

export const addSymbolToCell = ({
  grid,
  subGridRow,
  subGridColumn,
  cellRow,
  cellColumn,
  symbol,
}: AddSymbolToCellProps): string[][][][] => {
  const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid
  if (grid[subGridRow][subGridColumn][cellRow][cellColumn] === "") {
    // Check if the cell is empty
    newGrid[subGridRow][subGridColumn][cellRow][cellColumn] = symbol;
  } else {
    console.error("Cell is not empty");
  }
  return newGrid;
};

export const nextTurn = (currentValue: "X" | "O"): "X" | "O" => {
  return currentValue === "X" ? "O" : "X";
};

export const updateNextSubGrid = (
  subGridNumberCode: number,
  subGridsCompleted: SubGridsCompleted
): Set<number> => {
  const nextSubGrid = new Set<number>();
  const nextSubGridWonOrFull = Object.values(subGridsCompleted).some((set) =>
    set.has(subGridNumberCode)
  );
  if (!nextSubGridWonOrFull) {
    nextSubGrid.add(subGridNumberCode);
  } else {
    for (const code of allSubGrids) {
      const subGridWonOrFull = Object.values(subGridsCompleted).some((set) =>
        set.has(code)
      );
      if (!subGridWonOrFull) nextSubGrid.add(code);
    }
  }

  return nextSubGrid;
};

export const checkForWonSubGrid = (gridToCheck: string[][]): boolean => {
  const checkLine = (a: string, b: string, c: string) => {
    return a !== "" && a === b && b === c;
  };

  if (
    checkLine(gridToCheck[0][0], gridToCheck[0][1], gridToCheck[0][2]) ||
    checkLine(gridToCheck[1][0], gridToCheck[1][1], gridToCheck[1][2]) ||
    checkLine(gridToCheck[2][0], gridToCheck[2][1], gridToCheck[2][2]) ||
    checkLine(gridToCheck[0][0], gridToCheck[1][0], gridToCheck[2][0]) ||
    checkLine(gridToCheck[0][1], gridToCheck[1][1], gridToCheck[2][1]) ||
    checkLine(gridToCheck[0][2], gridToCheck[1][2], gridToCheck[2][2]) ||
    checkLine(gridToCheck[0][0], gridToCheck[1][1], gridToCheck[2][2]) ||
    checkLine(gridToCheck[0][2], gridToCheck[1][1], gridToCheck[2][0])
  )
    return true;

  return false;
};

export const checkWinningCombinations = (
  playerSubGridsWon: Set<number>
): boolean => {
  for (const combination of winningCombinations) {
    const threeInARowGridsWon = combination.every((number) =>
      playerSubGridsWon.has(number)
    );
    if (threeInARowGridsWon) {
      return true; // Found a winning combination
    }
  }

  return false; // No winning combination found
};

export const updateSubGridsCompleted = (
  subGridValues: string[][],
  subGridsCompleted: SubGridsCompleted,
  subGridCode: number,
  symbol: "X" | "O"
): SubGridsCompleted => {
  const subGridFull = subGridValues.every((row) =>
    row.every((cell) => cell !== "")
  );
  const subGridWon = checkForWonSubGrid(subGridValues);
  if (subGridWon) {
    const newSet = new Set(subGridsCompleted[symbol]);
    newSet.add(subGridCode);
    return { ...subGridsCompleted, [symbol]: newSet };
  } else if (subGridFull) {
    const newSet = new Set(subGridsCompleted.full);
    newSet.add(subGridCode);
    return { ...subGridsCompleted, full: newSet };
  } else {
    return subGridsCompleted;
  }
};

export const checkForDraw = (subGridsCompleted: SubGridsCompleted): boolean => {
  return (
    subGridsCompleted.full.size +
      subGridsCompleted.X.size +
      subGridsCompleted.O.size ===
    9
  );
};

export const playRandom = ({
  grid,
  whoseTurn,
  subGridsCompleted,
  nextSubGrid,
}: PlayRandomProps): PlayRandomResult => {
  const randomSubGrid =
    Array.from(nextSubGrid)[Math.floor(Math.random() * nextSubGrid.size)];
  const subGridRow = Math.floor(randomSubGrid / 10);
  const subGridColumn = randomSubGrid % 10;
  const randomRow = Math.floor(Math.random() * 3);
  const randomColumn = Math.floor(Math.random() * 3);
  if (grid[subGridRow][subGridColumn][randomRow][randomColumn] !== "") {
    return playRandom({ grid, whoseTurn, subGridsCompleted, nextSubGrid });
  }
  const symbol = whoseTurn;
  const subGridCode: number = subGridRow * 10 + subGridColumn;
  const nextSubGridCode: number = randomRow * 10 + randomColumn;

  const newGrid = addSymbolToCell({
    grid,
    subGridRow,
    subGridColumn,
    cellRow: randomRow,
    cellColumn: randomColumn,
    symbol,
  });
  const newSubGridsCompleted = updateSubGridsCompleted(
    newGrid[subGridRow][subGridColumn],
    subGridsCompleted,
    subGridCode,
    symbol
  );
  let newGameOver = checkWinningCombinations(newSubGridsCompleted[symbol]);
  const nowhereToPlay = subGridsCompleted && checkForDraw(subGridsCompleted);
  if (nowhereToPlay && !newGameOver) newGameOver = true;
  let newNextSubGrid = updateNextSubGrid(nextSubGridCode, newSubGridsCompleted);
  if (newGameOver) newNextSubGrid = new Set<number>();

  return { newGrid, newSubGridsCompleted, newNextSubGrid, newGameOver };
};

export const playIntelligent = ({
  grid,
  whoseTurn,
  subGridsCompleted,
  move,
}: PlayIntelligentProps): PlayIntelligentResult => {
  const subGridRow = move.subGridRow;
  const subGridColumn = move.subGridColumn;
  const cellRow = move.cellRow;
  const cellColumn = move.cellColumn;
  if (grid[subGridRow][subGridColumn][cellRow][cellColumn] !== "") {
    console.error("Cell is not empty");
  }
  const symbol = whoseTurn;
  const subGridCode: number = subGridRow * 10 + subGridColumn;
  const nextSubGridCode: number = cellRow * 10 + cellColumn;

  const newGrid = addSymbolToCell({
    grid,
    subGridRow,
    subGridColumn,
    cellRow,
    cellColumn,
    symbol,
  });
  const newSubGridsCompleted = updateSubGridsCompleted(
    newGrid[subGridRow][subGridColumn],
    subGridsCompleted,
    subGridCode,
    symbol
  );
  let newGameOver = checkWinningCombinations(newSubGridsCompleted[symbol]);
  const nowhereToPlay = subGridsCompleted && checkForDraw(subGridsCompleted);
  if (nowhereToPlay && !newGameOver) newGameOver = true;
  let newNextSubGrid = updateNextSubGrid(nextSubGridCode, newSubGridsCompleted);
  if (newGameOver) newNextSubGrid = new Set<number>();

  return { newGrid, newSubGridsCompleted, newNextSubGrid, newGameOver };
};
