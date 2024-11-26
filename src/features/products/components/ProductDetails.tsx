import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById } from '../productSlice';
import { RootState } from '../../../app/store';
import { AppDispatch } from '../../../app/store'; // Adjust the import if needed
import './ProductDetails.css'; 

const ProductDetails: React.FC = () => {
  // Extracting the `id` parameter from the URL using `useParams`
  const { id } = useParams<{ id: string }>();
  
  const dispatch = useDispatch<AppDispatch>(); // Correctly type the dispatch function
  
  // Selectors to get product details and loading/error state
  const { productDetails, status } = useSelector((state: RootState) => state.products);

  // Fetch product details when the component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [dispatch, id]);

  // Show loading state if the product is being fetched
  if (status === 'loading') return <p>Loading...</p>;

  // Show error if fetching failed
  if (status === 'failed') return <p>Failed</p>;

  // Show product not found message if no product is found
  if (!productDetails) return <p>Product not found</p>;

  // Destructuring the product details to display
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
            {comments.map((comment, index) => (
              <li key={index} className="product-details-comment">{comment}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
