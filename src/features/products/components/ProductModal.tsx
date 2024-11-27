import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct, fetchProductById } from '../productSlice';
import { Product } from '../../../models/product';
import './ProductModal.css';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product; // Optional product for editing
  onSave: (updatedProduct: Product) => void; 
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [formProduct, setFormProduct] = useState<Product>({
    id: product?.id || 0, // Ensure an ID is initialized if product exists
    name: product?.name || '',
    size: {
      width: product?.size?.width || 0,
      height: product?.size?.height || 0,
    },
    weight: product?.weight || '',
    count: product?.count || 0,
    imageUrl: product?.imageUrl || '',
    comments: product?.comments || [],
  });

  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Populate form fields when editing
  useEffect(() => {
    if (product) {
      setFormProduct(product);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'width' || name === 'height') {
      // Handle size input changes separately
      setFormProduct((prevProduct) => ({
        ...prevProduct,
        size: {
          ...prevProduct.size,
          [name]: parseFloat(value), // Convert to number for numeric fields
        },
      }));
    } else {
      setFormProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormProduct((prevProduct) => ({
        ...prevProduct,
        image: file,
      }));
    }
  };

  const handleSaveProduct = async () => {
    if (
      !formProduct.name ||
      !formProduct.size.width ||
      !formProduct.size.height ||
      !formProduct.weight
    ) {
      alert('Please fill in all fields');
      return;
    }

    try {
        // Call onSave prop to pass the updated product back to ProductDetails
        onSave(formProduct);
        alert('Product saved successfully');
        onClose();
      } catch (error) {
        setError('Error saving product');
      }

  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formProduct.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Width:</label>
            <input
              type="number"
              name="width"
              value={formProduct.size.width}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Height:</label>
            <input
              type="number"
              name="height"
              value={formProduct.size.height}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Weight:</label>
            <input
              type="text"
              name="weight"
              value={formProduct.weight}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              name="count"
              value={formProduct.count}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="button" onClick={handleSaveProduct}>
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
