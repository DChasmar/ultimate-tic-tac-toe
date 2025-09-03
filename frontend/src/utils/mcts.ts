import { TreeNode, State, Move, MCTSResult } from "../types";
import {
  addSymbolToCell,
  updateSubGridsCompleted,
  updateNextSubGrid,
  nextTurn,
  checkWinningCombinations,
  checkForDraw,
} from "./helpers";

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
};

const getMoves = (state: State): Move[] => {
  // return a list of all possible actions from this state
  const moves: Move[] = [];
  for (const subGridCode of state.nextSubGrid) {
    const subGridRow = Math.floor(subGridCode / 10);
    const subGridColumn = subGridCode % 10;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 3; column++) {
        if (state.grid[subGridRow][subGridColumn][row][column] === "") {
          moves.push({
            subGridRow: subGridRow,
            subGridColumn: subGridColumn,
            cellRow: row,
            cellColumn: column,
          });
        }
      }
    }
  }
  return moves;
};

const selectChild = (node: TreeNode): TreeNode | null => {
  if (node.children.length === 0) return null;
  return node.children.reduce((a, b) => (a && b && uct(a) > uct(b) ? a : b));
};

const uct = (node: TreeNode): number => {
  if (node.visits === 0) return Infinity; // if the node has not been visited yet, return infinity (to make sure it is selected)
  if (node.parent === null) return node.reward / node.visits; // if the node is the root node, return the reward/visits
  return (
    node.reward / node.visits +
    EXPLORE * Math.sqrt(Math.log(node.parent.visits) / node.visits)
  ); // return the UCT value
};

const bestChild = (node: TreeNode): TreeNode | null => {
  if (node.children.length === 0) return null;
  return node.children.reduce((a, b) =>
    a && b && a.visits > b.visits ? a : b
  );
};

const addChild = (
  node: TreeNode,
  state: State,
  move: Move
): TreeNode | null => {
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
};

export const cloneState = (state: State): State => {
  return {
    grid: JSON.parse(JSON.stringify(state.grid)),
    subGridsCompleted: {
      X: new Set(state.subGridsCompleted.X),
      O: new Set(state.subGridsCompleted.O),
      full: new Set(state.subGridsCompleted.full),
    },
    whoseTurn: state.whoseTurn,
    nextSubGrid: new Set(state.nextSubGrid),
    gameOver: state.gameOver,
  };
};

export const sorted = <T>(array: T[], key: (item: T) => number): T[] => {
  return array.sort((a, b) => key(a) - key(b));
};

const randomMove = (untriedMoves: Move[]): Move => {
  return untriedMoves[Math.floor(Math.random() * untriedMoves.length)];
};

const backProp = (node: TreeNode | null, winner: string) => {
  let n = node;
  while (n !== null) {
    n.visits++;
    let reward = 0;
    if (winner === "draw") reward = 0.5;
    else if (n.state.whoseTurn !== winner) reward = 1;
    else reward = 0;
    n.reward += reward;
    n = n.parent;
  }
};

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
  newState.subGridsCompleted = updateSubGridsCompleted(
    newState.grid[move.subGridRow][move.subGridColumn],
    state.subGridsCompleted,
    move.subGridRow * 10 + move.subGridColumn,
    state.whoseTurn
  );
  newState.nextSubGrid = updateNextSubGrid(
    move.cellRow * 10 + move.cellColumn,
    newState.subGridsCompleted
  );
  newState.whoseTurn = nextTurn(state.whoseTurn);
  newState.gameOver =
    checkWinningCombinations(newState.subGridsCompleted[state.whoseTurn]) ||
    checkForDraw(newState.subGridsCompleted);
  return newState;
};

const runMCTS = (parentNode: TreeNode): void => {
  // return early if parentNode gets x number of visits (perhaps 10000)
  const startTime = Date.now();
  const timeLimit = 3000; // 3 seconds
  // Selection
  let node = parentNode;
  while (node.untriedMoves.length === 0 && node.children.length > 0) {
    if (Date.now() - startTime > timeLimit) {
      console.log("Time limit exceeded");
      return;
    }
    const selection = selectChild(node);
    if (selection === null) {
      console.error("Selection is null");
      return;
    } // Check if selection is null;
    node = selection;
  }

  // Expansion
  if (node.untriedMoves.length > 0) {
    if (Date.now() - startTime > timeLimit) {
      console.log("Time limit exceeded");
      return;
    }
    const move = node.untriedMoves.pop();
    if (!move) {
      console.error("Move is null");
      return;
    } // Check if move is null
    const newState = updateStateWithMove(node.state, move);
    const newChild = addChild(node, newState, move);
    node.children.push(newChild);
    if (newChild === null) {
      console.error("New child is null");
      return;
    } // Check if newChild is null
    node = newChild;
  }
  // Simulation
  let currState = cloneState(node.state);
  while (!currState.gameOver) {
    if (Date.now() - startTime > timeLimit) {
      console.log("Time limit exceeded");
      return;
    }
    // Check for killer move and return early if it works
    currState = updateStateWithMove(currState, randomMove(getMoves(currState)));
  }

  // Determine winner
  let winner = "draw";
  if (checkWinningCombinations(currState.subGridsCompleted.X)) winner = "X";
  else if (checkWinningCombinations(currState.subGridsCompleted.O))
    winner = "O";

  // Backpropagation
  backProp(node, winner);
};

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
    return {
      bestMove: best.move,
      bestMoveScore: best.reward / best.visits,
      iterations: tree.visits,
    };
  }
};
