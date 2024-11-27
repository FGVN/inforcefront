import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ProductDetails from './features/products/pages/ProductDetails';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="products/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
