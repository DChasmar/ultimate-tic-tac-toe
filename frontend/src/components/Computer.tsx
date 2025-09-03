// Grid.tsx
import { useContext } from "react";
import { GridContext } from "./GridContext";
import { playRandom, playIntelligent } from "../utils/helpers";
import { MCTS } from "../utils/mcts";

const Computer: React.FC = () => {
  const {
    grid,
    setGrid,
    whoseTurn,
    setWhoseTurn,
    gameOver,
    setGameOver,
    nextSubGrid,
    setNextSubGrid,
    subGridsCompleted,
    setSubGridsCompleted,
  } = useContext(GridContext);
  const handlePlayRandom = () => {
    if (
      !grid ||
      !setGrid ||
      !whoseTurn ||
      !setWhoseTurn ||
      !subGridsCompleted ||
      !setSubGridsCompleted ||
      !nextSubGrid ||
      !setNextSubGrid ||
      !setGameOver
    )
      return;
    if (gameOver) return;
    const { newGrid, newSubGridsCompleted, newNextSubGrid, newGameOver } =
      playRandom({ grid, whoseTurn, subGridsCompleted, nextSubGrid });
    setGrid(newGrid);
    setSubGridsCompleted(newSubGridsCompleted);
    setNextSubGrid(newNextSubGrid);
    setWhoseTurn(whoseTurn === "X" ? "O" : "X");
    setGameOver(newGameOver);
  };

  const handlePlayIntelligent = () => {
    if (
      !grid ||
      !setGrid ||
      !whoseTurn ||
      !setWhoseTurn ||
      !subGridsCompleted ||
      !setSubGridsCompleted ||
      !nextSubGrid ||
      !setNextSubGrid ||
      !setGameOver
    )
      return;
    if (gameOver) return;
    const bestMoveData = MCTS({
      grid,
      subGridsCompleted,
      whoseTurn,
      nextSubGrid,
      gameOver: false,
    });
    if (!bestMoveData) {
      console.error("No data from Play Intelligent");
      return;
    }
    if (bestMoveData.bestMove) {
      console.log(bestMoveData);
      const { newGrid, newSubGridsCompleted, newNextSubGrid, newGameOver } =
        playIntelligent({
          grid,
          whoseTurn,
          subGridsCompleted,
          move: bestMoveData.bestMove,
        });
      setGrid(newGrid);
      setSubGridsCompleted(newSubGridsCompleted);
      setNextSubGrid(newNextSubGrid);
      setWhoseTurn(whoseTurn === "X" ? "O" : "X");
      setGameOver(newGameOver);
    }
  };

  return (
    <div className="computer-play-content">
      <button onClick={handlePlayRandom}>Play Random</button>
      <button onClick={handlePlayIntelligent}>Play Intelligent</button>
    </div>
  );
};

export default Computer;
