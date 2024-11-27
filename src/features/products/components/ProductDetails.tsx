import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById, updateProduct } from '../productSlice';
import { RootState } from '../../../app/store';
import { AppDispatch } from '../../../app/store'; // Adjust the import if needed
import './ProductDetails.css';
import AddProductModal from './AddProductModal'; // Import the modal

const ProductDetails: React.FC = () => {
  // State to manage modal visibility
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { productDetails, status } = useSelector((state: RootState) => state.products);

  // Fetch product details when the component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [dispatch, id]);

  // Function to handle the update product action
  const handleUpdateProduct = async (updatedProduct: any) => {
    if (id) {
      await dispatch(updateProduct({ id: Number(id), ...updatedProduct }));
      setEditModalOpen(false); // Close modal after updating
    }
  };

  // Show loading state
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Failed</p>;
  if (!productDetails) return <p>Product not found</p>;

  const { name, imageUrl, count, size, weight, comments } = productDetails;

  return (
    <div className="product-details-container">
      <div className="product-details">
        <img src={imageUrl} alt={name} className="product-details-image" />
        <div className="product-details-info">
          <h1 className="product-details-name">{name}</h1>
          <p className="product-details-count">In Stock: {count}</p>
          <p className="product-details-size">Size: {size.width} x {size.height} cm</p>
          <p className="product-details-weight">Weight: {weight} kg</p>
          <h3 className="product-details-comments-title">Comments:</h3>
          <ul className="product-details-comments-list">
            {comments?.map((comment, index) => (
              <li key={index} className="product-details-comment">{comment}</li>
            ))}
          </ul>
          <button onClick={() => setEditModalOpen(true)}>Edit</button> {/* Add Edit button */}
        </div>
      </div>

      {/* AddProductModal for editing */}
      <AddProductModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={productDetails} // Pass product details to modal
        onSave={handleUpdateProduct} // Handle save action
      />
    </div>
  );
};

export default ProductDetails;
