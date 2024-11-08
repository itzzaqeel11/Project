// hooks/useProductData.js
import { useState } from 'react';
import axios from 'axios';

const useProductData = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductImages = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/products/${productId}/images`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching product images:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    images,
    loading,
    fetchProductImages,
  };
};

export default useProductData;
