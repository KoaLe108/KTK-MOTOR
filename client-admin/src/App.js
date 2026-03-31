import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <MyProvider>
          <Login />
          <Main />
        </MyProvider>
      </Router>
    );
  }
}

export default App;