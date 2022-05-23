import './App.css';
import React, { PureComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import PLP from './pages/PLP/ProductListingPage';
import PDP from './pages/PDP/ProductDescriptionPage';

class App extends PureComponent {
  render() {
    return (
      <Routes>
        <Route path="/" element={<PLP />} />
        <Route path="/product/:id" element={<PDP />} />
      </Routes>
    );
  }
}

export default App;
