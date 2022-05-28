import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
// src/pages/index.js를 통해서 한번에 import 할 수 있도록 함



import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Game from './Game'; 
import Main from './Main';
import Test from './Test';  

const App = () => { 
  return ( 
  <div className='App'> 
  <BrowserRouter> 
  <Routes> 
    <Route path="/" element={<Main />}></Route>
    <Route path="/game" element={<Game />}></Route> 
    <Route path="/test" element={<Test />}></Route> 
  </Routes> 
  </BrowserRouter> </div> 
    ); 
  }; 
  export default App;