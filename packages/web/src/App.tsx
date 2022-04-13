import React from 'react';
import { BrowserRouter as Router, Routes, Route, RouteProps } from "react-router-dom";
import "destyle.css";
import './App.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path={"/dashboard/*"}
          element={null}
        />
      </Routes>
    </Router>
  );
}

export default App;
