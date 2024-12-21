import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/login';
import Register from "./components/register/register";


function App() {
  return (
      <div className="App">
<Login/>
      </div>
  );
}

export default App;