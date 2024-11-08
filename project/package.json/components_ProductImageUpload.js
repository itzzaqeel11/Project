// components/ProductImageUpload.js
import React, { useState } from 'react';
import { Button, DropZone, Thumbnail, Stack } from '@shopify/polaris';
import axios from 'axios';

const ProductImageUpload = ({ productId }) => {
  const [file, setFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleDropZoneDrop = (_dropFiles, acceptedFiles) => setFile(acceptedFiles[0]);

  const handleUpload = async () => {
    if (!productId) {
      alert('Please enter a product ID');
      return;
    }
    if (!file) {
      alert('Please select an image to upload');
      return;
    }

    const formData = new FormData();
    formData.append('imageUrl', URL.createObjectURL(file));

    try {
      const response = await axios.post(`/api/products/${productId}/images`, formData);
      setUploadedImage(response.data);
      alert('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  return (
    <Stack vertical>
      <DropZone onDrop={handleDropZoneDrop}>
        {file ? (
          <Thumbnail
            source={URL.createObjectURL(file)}
            alt="Product Image Preview"
            size="large"
          />
        ) : (
          <DropZone.FileUpload />
        )}
      </DropZone>
      <Button onClick={handleUpload} primary>
        Upload Image
      </Button>
    </Stack>
  );
};

export default ProductImageUpload;
