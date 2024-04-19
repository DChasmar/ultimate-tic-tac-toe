export interface SubGridProps {
    values: string[][];
    subGridRow: number;
    subGridColumn: number;
}

export interface CellProps {
    value: string;
    subGridRow: number;
    subGridColumn: number;
    cellRow: number;
    cellColumn: number;
    isNextSubGrid: boolean;
}

export interface SubGridsCompleted {
    X: Set<number>;
    O: Set<number>;
    full: Set<number>;
}

export interface GridContextType {
    grid?: string[][][][];
    setGrid?: (grid: string[][][][]) => void;
    subGridsCompleted?: SubGridsCompleted;
    setSubGridsCompleted?: (subGridsWon: SubGridsCompleted) => void;
    whoseTurn?: 'X' | 'O';
    setWhoseTurn?: (whoseTurn: ('X' | 'O')) => void;
    plays?: number;
    setPlays?: (plays: number) => void;
    nextSubGrid?: Set<number>;
    setNextSubGrid?: (nextSubGrid: Set<number>) => void;
    gameOver?: boolean;
    setGameOver?: (gameOver: boolean) => void;
    playAgain?: () => void;
}

export interface AddSymbolToCellProps {
    grid: string[][][][],
    subGridRow: number, 
    subGridColumn: number, 
    cellRow: number, 
    cellColumn: number, 
    symbol: 'X' | 'O'
}

export interface UpdateSubGridsCompletedProps {
    subGridValues: string[][],
    subGridsCompleted: SubGridsCompleted,
    subGridCode: number,
    symbol: ('X' | 'O')
}

export interface PlayRandomProps {
    grid: string[][][][],
    whoseTurn: 'X' | 'O',
    subGridsCompleted: SubGridsCompleted,
    nextSubGrid: Set<number>
}

export interface PlayRandomResult {
    newGrid: string[][][][];
    newSubGridsCompleted: SubGridsCompleted;
    newNextSubGrid: Set<number>;
    newGameOver: boolean;
}

export interface PlayIntelligentProps {
    grid: string[][][][],
    whoseTurn: 'X' | 'O',
    subGridsCompleted: SubGridsCompleted,
    move: Move
}

export interface PlayIntelligentResult {
    newGrid: string[][][][];
    newSubGridsCompleted: SubGridsCompleted;
    newNextSubGrid: Set<number>;
    newGameOver: boolean;
}

export interface State {
    grid: string[][][][];
    subGridsCompleted: SubGridsCompleted;
    whoseTurn: 'X' | 'O';
    nextSubGrid: Set<number>;
    gameOver: boolean;
}

export interface TreeNode {
    state: State;
    parent: TreeNode | null;
    children: (TreeNode | null)[];
    visits: number,
    reward: number,
    untriedMoves: Move[];
    move: Move | null;
}

export interface Move {
    subGridRow: number;
    subGridColumn: number;
    cellRow: number;
    cellColumn: number;
}

export interface MCTSResult {
    bestMove: Move | null;
    bestMoveScore: number;
    iterations: number;
}
