// import { SubGridsCompleted } from "./types";

export const allSubGrids = new Set<number>([0, 1, 2, 10, 11, 12, 20, 21, 22]);
export const winningCombinations: number[][] = [
    [0, 1, 2], [10, 11, 12], [20, 21, 22], // Rows
    [0, 10, 20], [1, 11, 21], [2, 12, 22], // Columns
    [0, 11, 22], [2, 11, 20]               // Diagonals
];
// export const emptyGrid = Array(3).fill(0).map(() => Array(3).fill(0).map(() => Array(3).fill(0).map(() => Array(3).fill(''))));
// export const initialSubGridsCompleted: SubGridsCompleted = {
//     X: new Set<number>(),
//     O: new Set<number>(),
//     full: new Set<number>()
// };