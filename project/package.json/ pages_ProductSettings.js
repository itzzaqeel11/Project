// pages/ProductSettings.js
import React, { useState } from 'react';
import { Page, Layout, TextField, Button } from '@shopify/polaris';
import ProductImageUpload from '../components/ProductImageUpload';
import useProductData from '../hooks/useProductData';

const ProductSettings = () => {
  const [productId, setProductId] = useState('');
  const { fetchProductImages } = useProductData();

  const handleProductChange = (value) => setProductId(value);

  const handleFetchImages = async () => {
    if (productId) {
      await fetchProductImages(productId);
    } else {
      alert('Please enter a valid product ID');
    }
  };

  return (
    <Page title="Product Settings">
      <Layout>
        <Layout.Section>
          <TextField
            label="Product ID"
            value={productId}
            onChange={handleProductChange}
            placeholder="Enter Product ID"
          />
          <Button onClick={handleFetchImages} primary>
            Fetch Product Images
          </Button>
        </Layout.Section>
        <Layout.Section>
          <ProductImageUpload productId={productId} />
        </L
