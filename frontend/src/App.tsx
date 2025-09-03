import React from "react";
import "./App.css";
import Computer from "./components/Computer";
import Grid from "./components/Grid";
import { GridProvider } from "./components/GridContext";

const App: React.FC = () => {
  return (
    <GridProvider>
      <div className="app">
        <h3> Ultimate Tic-Tac-Toe </h3>
        <Grid />
        <Computer />
      </div>
    </GridProvider>
  );
};

export default App;
