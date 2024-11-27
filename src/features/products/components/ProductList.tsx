import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, fetchProducts } from '../productSlice';
import { RootState } from '../../../app/store';
import { AppDispatch } from '../../../app/store';
import { Link } from 'react-router-dom';
import AddProductModal from './AddProductModal';
import ConfirmationModal from './ConfirmationModal';
import './ProductList.css';
import { deleteProduct } from '../../../api/productsApi';
import { Product } from '../../../models/product';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string>('name'); // New state for sorting

  const { products, status } = useSelector((state: RootState) => state.products);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Fetch products when the page, limit, or sort criteria change
  useEffect(() => {
    dispatch(fetchProducts({ page, limit, sortBy }));
  }, [dispatch, page, limit, sortBy]);

  const handleDelete = async () => {
    if (productToDelete !== null) {
      try {
        await deleteProduct(productToDelete);
        dispatch(fetchProducts({ page, limit, sortBy })); // Re-fetch after deletion
        setIsConfirmationModalOpen(false);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      await dispatch(addProduct(newProduct));
      dispatch(fetchProducts({ page, limit, sortBy })); // Re-fetch after adding
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error fetching products.</p>;

  return (
    <div>
      <div className="header-container">
        <div className="limit-selector">
          <label htmlFor="limit">Products per page:</label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        
        <div className="sort-selector">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="count">Count</option>
          </select>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} className="add-product-btn">
          Add New Product
        </button>
      </div>

      <div className="product-list-container">
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.id}`} className="product-link">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">Left in stock: {product.count}</p>
                </div>
              </Link>
              <button
                className="delete-btn"
                onClick={() => {
                  setProductToDelete(product.id);
                  setIsConfirmationModalOpen(true);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={products.length < limit}>
          Next
        </button>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProduct} // Pass the handler that dispatches the action
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        message="Are you sure you want to delete this product?"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />
    </div>
  );
};

export default ProductList;
