import React from 'react';
import { BrowserRouter as Router, Routes, Route, RouteProps } from "react-router-dom";
import "destyle.css";
import './App.scss';
import Game from './pages/Game/Game';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path={"/game"}
          element={<Game/>}
        />
      </Routes>
    </Router>
  );
}

export default App;
