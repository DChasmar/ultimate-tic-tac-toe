import { allSubGrids, winningCombinations } from "./constants";
import { SubGridsCompleted, AddSymbolToCellProps, PlayRandomProps, PlayRandomResult, TreeNode, State, Move, MCTSResult, PlayIntelligentProps, PlayIntelligentResult } from "./types";

export const createEmptyGrid = (): string[][][][] => {
    return Array(3).fill(0).map(() => Array(3).fill(0).map(() => Array(3).fill(0).map(() => Array(3).fill(''))));
}

export const createInitialSubGridsCompleted = (): SubGridsCompleted => {
    return {
        X: new Set<number>(),
        O: new Set<number>(),
        full: new Set<number>()
    };
}

export const addSymbolToCell = ({ grid, subGridRow, subGridColumn, cellRow, cellColumn, symbol }: AddSymbolToCellProps): string[][][][] => {
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy the grid
    if (grid[subGridRow][subGridColumn][cellRow][cellColumn] === '') { // Check if the cell is empty
        newGrid[subGridRow][subGridColumn][cellRow][cellColumn] = symbol;
    } else {
        console.error('Cell is not empty');
    }
    return newGrid;
};

export const nextTurn = (currentValue: 'X' | 'O'): 'X' | 'O' => {
    return currentValue === 'X' ? 'O' : 'X';
};

export const updateNextSubGrid = ( subGridNumberCode: number, subGridsCompleted: SubGridsCompleted): Set<number> => {
    const nextSubGrid = new Set<number>();
    const nextSubGridWonOrFull = Object.values(subGridsCompleted).some(set => set.has(subGridNumberCode));
    if (!nextSubGridWonOrFull) {
        nextSubGrid.add(subGridNumberCode);
    } else {
        for (const code of allSubGrids) {
            const subGridWonOrFull = Object.values(subGridsCompleted).some(set => set.has(code));
            if (!subGridWonOrFull) nextSubGrid.add(code);
        }
    }

    return nextSubGrid;
};

export const checkForWonSubGrid = (gridToCheck: string[][]): boolean => {
    const checkLine = (a: string, b: string, c: string) => {
        return a !== '' && a === b && b === c;
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
    ) return true;

    return false;
};

export const checkWinningCombinations = (playerSubGridsWon: Set<number>): boolean => {
    for (const combination of winningCombinations) {
        const threeInARowGridsWon = combination.every(number => playerSubGridsWon.has(number));
        if (threeInARowGridsWon) {
            return true; // Found a winning combination
        }
    }

    return false; // No winning combination found
};


export const updateSubGridsCompleted = (subGridValues: string[][], subGridsCompleted: SubGridsCompleted, subGridCode: number, symbol: ('X' | 'O')): SubGridsCompleted => {
    const subGridFull = subGridValues.every(row => row.every(cell => cell !== ''));
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
}

export const checkForDraw = (subGridsCompleted: SubGridsCompleted): boolean => {
    return subGridsCompleted.full.size + subGridsCompleted.X.size + subGridsCompleted.O.size === 9;
}

export const playRandom = ({
    grid, 
    whoseTurn, 
    subGridsCompleted, 
    nextSubGrid}: PlayRandomProps): PlayRandomResult => {
    const randomSubGrid = Array.from(nextSubGrid)[Math.floor(Math.random() * nextSubGrid.size)];
    const subGridRow = Math.floor(randomSubGrid / 10);
    const subGridColumn = randomSubGrid % 10;
    const randomRow = Math.floor(Math.random() * 3);
    const randomColumn = Math.floor(Math.random() * 3);
    if (grid[subGridRow][subGridColumn][randomRow][randomColumn] !== '') {
        return playRandom({grid, whoseTurn, subGridsCompleted, nextSubGrid});
    }
    const symbol = whoseTurn;
    const subGridCode: number = subGridRow * 10 + subGridColumn;
    const nextSubGridCode: number = randomRow * 10 + randomColumn;

    const newGrid = addSymbolToCell({ grid, subGridRow, subGridColumn, cellRow: randomRow, cellColumn: randomColumn, symbol });
    const newSubGridsCompleted = updateSubGridsCompleted(newGrid[subGridRow][subGridColumn], subGridsCompleted, subGridCode, symbol);
    let newGameOver = checkWinningCombinations(newSubGridsCompleted[symbol]);
    const nowhereToPlay = subGridsCompleted && (checkForDraw(subGridsCompleted));
    if (nowhereToPlay && !newGameOver) newGameOver = true;
    let newNextSubGrid = updateNextSubGrid(nextSubGridCode, newSubGridsCompleted);
    if (newGameOver) newNextSubGrid = new Set<number>();

    return { newGrid, newSubGridsCompleted, newNextSubGrid, newGameOver };
}

export const playIntelligent = ({
    grid, 
    whoseTurn, 
    subGridsCompleted,
    move}: PlayIntelligentProps): PlayIntelligentResult => {
    const subGridRow = move.subGridRow;
    const subGridColumn = move.subGridColumn;
    const cellRow = move.cellRow;
    const cellColumn = move.cellColumn;
    if (grid[subGridRow][subGridColumn][cellRow][cellColumn] !== '') {
        console.error('Cell is not empty');
    }
    const symbol = whoseTurn;
    const subGridCode: number = subGridRow * 10 + subGridColumn;
    const nextSubGridCode: number = cellRow * 10 + cellColumn;

    const newGrid = addSymbolToCell({ grid, subGridRow, subGridColumn, cellRow, cellColumn, symbol });
    const newSubGridsCompleted = updateSubGridsCompleted(newGrid[subGridRow][subGridColumn], subGridsCompleted, subGridCode, symbol);
    let newGameOver = checkWinningCombinations(newSubGridsCompleted[symbol]);
    const nowhereToPlay = subGridsCompleted && (checkForDraw(subGridsCompleted));
    if (nowhereToPlay && !newGameOver) newGameOver = true;
    let newNextSubGrid = updateNextSubGrid(nextSubGridCode, newSubGridsCompleted);
    if (newGameOver) newNextSubGrid = new Set<number>();

    return { newGrid, newSubGridsCompleted, newNextSubGrid, newGameOver };
}
// MCTS

const EXPLORE = Math.sqrt(2);

const createRootNode = (state: State): TreeNode => {
    return {
    state: state,
    parent: null,
    children: [],
    visits: 0,
    reward: 0,
    untriedMoves: getMoves(state),
    move: null,
  };
}

const getMoves = (state: State): Move[] => {
    // return a list of all possible actions from this state
    const moves: Move[] = [];
    for (const subGridCode of state.nextSubGrid) {
        const subGridRow = Math.floor(subGridCode / 10);
        const subGridColumn = subGridCode % 10;
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                if (state.grid[subGridRow][subGridColumn][row][column] === '') {
                    moves.push({ subGridRow: subGridRow, subGridColumn: subGridColumn, cellRow: row, cellColumn: column });
                }
            }
        }
    }
    return moves;
}

const selectChild = (node: TreeNode): TreeNode | null => {
    if (node.children.length === 0) return null;
    return node.children.reduce((a, b) => a && b && uct(a) > uct(b) ? a : b);
}

const uct = (node: TreeNode): number => {
    if (node.visits === 0) return Infinity; // if the node has not been visited yet, return infinity (to make sure it is selected)
    if (node.parent === null) return node.reward / node.visits; // if the node is the root node, return the reward/visits
    return node.reward / node.visits + EXPLORE * Math.sqrt(Math.log(node.parent.visits) / node.visits); // return the UCT value
}  

const bestChild = (node: TreeNode): TreeNode | null => {
    if (node.children.length === 0) return null;
    return node.children.reduce((a, b) => a && b && a.visits > b.visits ? a : b);
}
  
const addChild = (node: TreeNode, state: State, move: Move): TreeNode | null => {
    const newNode = {
        state: state,
        parent: node,
        children: [],
        visits: 0,
        reward: 0,
        untriedMoves: getMoves(state),
        move: move,
    };
    return newNode;
}
  
export const cloneState = (state: State): State => {
    return {
        grid: JSON.parse(JSON.stringify(state.grid)),
        subGridsCompleted: {
            X: new Set(state.subGridsCompleted.X),
            O: new Set(state.subGridsCompleted.O),
            full: new Set(state.subGridsCompleted.full)
        },
        whoseTurn: state.whoseTurn,
        nextSubGrid: new Set(state.nextSubGrid),
        gameOver: state.gameOver,
    };
}
  
export const sorted = <T>(array: T[], key: (item: T) => number): T[] => {
  return array.sort((a, b) => key(a) - key(b));
}

const randomMove = (untriedMoves: Move[]): Move => {
    return untriedMoves[Math.floor(Math.random() * untriedMoves.length)];
}

const backProp = (node: TreeNode | null, winner: string) => {
    let n = node;
    while (n !== null) {
        n.visits++;
        let reward = 0;
        if (winner === 'draw') reward = 0.5;
        else if (n.state.whoseTurn !== winner) reward = 1;
        else reward = 0;
        n.reward += reward;
        n = n.parent;
    }
}

const updateStateWithMove = (state: State, move: Move): State => {
    const newState = cloneState(state);
    newState.grid = addSymbolToCell({
        grid: newState.grid, 
        subGridRow: move.subGridRow, 
        subGridColumn: move.subGridColumn,
        cellRow: move.cellRow,
        cellColumn: move.cellColumn,
        symbol: state.whoseTurn,
    });
    newState.subGridsCompleted = updateSubGridsCompleted(newState.grid[move.subGridRow][move.subGridColumn], state.subGridsCompleted, move.subGridRow * 10 + move.subGridColumn, state.whoseTurn);
    newState.nextSubGrid = updateNextSubGrid(move.cellRow * 10 + move.cellColumn, newState.subGridsCompleted);
    newState.whoseTurn = nextTurn(state.whoseTurn);
    newState.gameOver = checkWinningCombinations(newState.subGridsCompleted[state.whoseTurn]) || checkForDraw(newState.subGridsCompleted);
    return newState;
}

const runMCTS = (parentNode: TreeNode): void => {
    const startTime = Date.now();
const timeLimit = 3000; // 5 seconds    
    // Selection
    let node = parentNode;
    while (node.untriedMoves.length === 0 && node.children.length > 0) {
        if (Date.now() - startTime > timeLimit) {
            console.log("Time limit exceeded");
            return;
        }
        const selection = selectChild(node);
        if (selection === null) {console.error("Selection is null"); return;} // Check if selection is null;
        node = selection;
    }

    // Expansion
    if (node.untriedMoves.length > 0) {
        if (Date.now() - startTime > timeLimit) {
            console.log("Time limit exceeded");
            return;
        }
        const move = node.untriedMoves.pop();
        if (!move) {console.error("Move is null"); return;} // Check if move is null
        const newState = updateStateWithMove(node.state, move);
        const newChild = addChild(node, newState, move);
        node.children.push(newChild);
        if (newChild === null) {console.error("New child is null"); return;} // Check if newChild is null
        node = newChild;
    }
    // Simulation
    let currState = cloneState(node.state);
    while (!currState.gameOver) {
        if (Date.now() - startTime > timeLimit) {
            console.log("Time limit exceeded");
            return;
        }
        currState = updateStateWithMove(currState, randomMove(getMoves(currState)));
    }

    // Determine winner
    let winner = 'draw';
    if (checkWinningCombinations(currState.subGridsCompleted.X)) winner = 'X';
    else if (checkWinningCombinations(currState.subGridsCompleted.O)) winner = 'O';

    // Backpropagation
    backProp(node, winner);
}

export const MCTS = (state: State): MCTSResult => {
    const tree = createRootNode(state);
    // Consider an alternative to running the algorithm for a fixed amount of time
    const endTime = Date.now() + 3000;
	while (Date.now() < endTime) {
		runMCTS(tree);
	}
    const best = bestChild(tree);
    if (best === null) {
        return { bestMove: null, bestMoveScore: 0, iterations: tree.visits || 0 };
    } else {
        return { bestMove: best.move, bestMoveScore: best.reward / best.visits, iterations: tree.visits };
    }
}