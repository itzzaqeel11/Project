require('dotenv').config();
const express = require('express');
const { shopifyApp } = require('@shopify/shopify-app-express');
const { Shopify } = require('@shopify/shopify-api');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection (replace with your database of choice)
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Shopify App setup
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SHOPIFY_SCOPES.split(','),
  hostName: process.env.SHOPIFY_APP_URL.replace(/^https?:\/\//, ''),
  isEmbeddedApp: true,
  sessionStorage: new Shopify.Session.MemorySessionStorage(),
});

// Session management with express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Initialize Shopify app with routes
app.use(shopify);

// OAuth and authentication route
app.get('/auth', async (req, res) => {
  const { shop } = req.query;
  if (!shop) {
    return res.status(400).send('Shop is missing in the request');
  }

  // Redirect to Shopify for authentication
  const redirectUrl = await shopify.auth.beginAuth(req, res, shop, '/auth/callback', false);
  res.redirect(redirectUrl);
});

// Auth callback route
app.get('/auth/callback', async (req, res) => {
  try {
    await shopify.auth.validateAuthCallback(req, res, req.query);
    res.redirect('/');
  } catch (error) {
    console.error('Failed to authenticate:', error);
    res.status(500).send('Authentication error');
  }
});

// Example API route to add extra images to a product
app.post('/api/products/:id/images', async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res);
  const productId = req.params.id;
  const { imageUrl } = req.body;

  if (!session) return res.status(401).send('Unauthorized');

  try {
    const response = await Shopify.Clients.Rest(session.shop).post({
      path: `/products/${productId}/images`,
      data: { image: { src: imageUrl } },
      type: 'application/json',
    });
    res.status(200).json(response.body);
  } catch (error) {
    console.error('Failed to add image:', error);
    res.status(500).send('Failed to add image');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
