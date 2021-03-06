import './App.css';
import React, { PureComponent } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PLP from './pages/PLP/ProductListingPage';
import PDP from './pages/PDP/ProductDescriptionPage';
import Cart from './pages/Cart/Cart';

class App extends PureComponent {
  render() {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/all" />} />
        <Route path="/:id" element={<PLP />} />
        <Route path="/product/:id" element={<PDP />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    );
  }
}

export default App;
