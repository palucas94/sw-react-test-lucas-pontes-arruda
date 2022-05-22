import './App.css';
import React, { PureComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import PLP from './pages/PLP/ProductListingPage';

class App extends PureComponent {
  render() {
    return (
      <Routes>
        <Route path="/" element={<PLP />} />
      </Routes>
    );
  }
}

export default App;
