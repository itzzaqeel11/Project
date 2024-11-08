// shopify.auth.js
const { Shopify } = require('@shopify/shopify-api');

const shopifyAuth = (app) => {
  // Initializes Shopify authentication with required scopes
  app.get('/auth', async (req, res) => {
    const { shop } = req.query;

    if (!shop) {
      return res.status(400).send('Shop parameter is required');
    }

    // Initiates the OAuth process
    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      shop,
      '/auth/callback',
      false
    );

    res.redirect(redirectUrl);
  });

  // Callback endpoint after OAuth
  app.get('/auth/callback', async (req, res) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(req, res, req.query);
      req.session.shopify = session;
      res.redirect('/');
    } catch
