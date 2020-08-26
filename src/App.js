import React from "react";
import CoinList from "./components/CoinList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>GOPAX API TEST</p>
      </header>
      <main className="App-main">
        <CoinList />
      </main>
    </div>
  );
}

export default App;
