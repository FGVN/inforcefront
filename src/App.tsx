import React from 'react';
import ProductList from './features/products/components/ProductList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Product List</h1>
      </header>
      <main>
        <ProductList />
      </main>
    </div>
  );
}

export default App;
