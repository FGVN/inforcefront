import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../productSlice';
import { RootState } from '../../../app/store';
import { Link } from 'react-router-dom';
import { AppDispatch } from '../../../app/store'; // Adjust the import if needed
import './ProductList.css'; 

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Correctly type the dispatch function

  // Local state for pagination
  const [page, setPage] = useState(1);
  const limit = 10; // You can adjust the limit as needed

  // Access products and status from the store
  const { products, status, productDetails } = useSelector((state: RootState) => state.products);

  // Fetch products when page changes or on initial load
  useEffect(() => {
    dispatch(fetchProducts({ page, limit }));
  }, [dispatch, page]);

  // Handle loading and error states
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error fetching products.</p>;

  return (
    <div>
      
      <div className="product-list-container">
        <p>Total Products: {products.length}</p>
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.id}`} className="product-link">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.count}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination controls */}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={products.length < limit}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
