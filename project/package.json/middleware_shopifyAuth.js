// middleware/shopifyAuth.js
const { Shopify } = require('@shopify/shopify-api');

// Middleware to ensure that the user is authenticated
module.exports = async (req, res, next) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res);

  if (!session || !session.accessToken) {
    return res.status(401).json({ message: 'Unauthorized: Please log in to access this resource' });
  }

  // Attach session to response for further use
  res.locals.shopifySession = session;
  next();
};
