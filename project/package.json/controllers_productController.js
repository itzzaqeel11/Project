// controllers/productController.js
const { Shopify } = require('@shopify/shopify-api');

// Adds an additional image to a product
exports.addProductImage = async (req, res) => {
  const session = res.locals.shopifySession;
  const { id: productId } = req.params;
  const { imageUrl } = req.body;

  try {
    const response = await Shopify.Clients.Rest(session.shop).post({
      path: `/products/${productId}/images`,
      data: { image: { src: imageUrl } },
      type: 'application/json',
    });
    res.status(200).json(response.body);
  } catch (error) {
    console.error('Error adding product image:', error);
    res.status(500).json({ message: 'Failed to add image', error });
  }
};

// Retrieves images for a product
exports.getProductImages = async (req, res) => {
  const session = res.locals.shopifySession;
  const { id: productId } = req.params;

  try {
    const response = await Shopify.Clients.Rest(session.shop).get({
      path: `/products/${productId}/images`,
    });
    res.status(200).json(response.body.images);
  } catch (error) {
    console.error('Error retrieving product images:', error);
    res.status(500).json({ message: 'Failed to retrieve images', error });
  }
};
