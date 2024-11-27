import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById, updateProduct } from '../productSlice';
import { RootState } from '../../../app/store';
import { AppDispatch } from '../../../app/store';
import './ProductDetails.css';
import ProductModal from '../components/ProductModal';
import CommentsSection from '../../comments/components/CommentsSection';

const ProductDetails: React.FC = () => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Initialize navigate

  // Select the product details and the status from the Redux store
  const { productDetails, status } = useSelector((state: RootState) => state.products);

  // Fetch the product details on component mount or when the ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [dispatch, id]);

  // Handle updating the product and force re-render by re-fetching the product
  const handleUpdateProduct = async (updatedProduct: any) => {
    if (id) {
      await dispatch(updateProduct({ id: Number(id), ...updatedProduct }));
      dispatch(fetchProductById(Number(id))); // Re-fetch to ensure the product details are current
      setEditModalOpen(false); // Close the modal after saving
    }
  };

  // Display loading or error messages based on the status
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Failed to load product details.</p>;
  if (!productDetails) return <p>Product not found</p>;

  const { name, imageUrl, count, size, weight, comments } = productDetails;

  return (
    <div className="product-details-container">
      {/* Header with "Back" button and title */}
      <div className="product-details-header">
        <button className="back-button" onClick={() => navigate('/')}>Back</button>
        <h1 className="product-details-title">Product View</h1>
      </div>

      <div className="product-details">
        <img src={imageUrl} alt={name} className="product-details-image" />
        <div className="product-details-info">
          <h1 className="product-details-name">{name}</h1>
          <p className="product-details-count">In Stock: {count}</p>
          <p className="product-details-size">Size: {size.width} x {size.height} cm</p>
          <p className="product-details-weight">Weight: {weight} kg</p>
          <button onClick={() => setEditModalOpen(true)}>Edit</button>
        </div>
      </div>

      <ProductModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={productDetails}
        onSave={handleUpdateProduct}
      />

      {/* Comments Section */}
      <CommentsSection productId={Number(id)} existingComments={comments || []} productDetails={productDetails} />
    </div>
  );
};

export default ProductDetails;
