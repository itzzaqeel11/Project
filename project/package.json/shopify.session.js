// shopify.session.js
const { Shopify } = require('@shopify/shopify-api');
const sessionStorage = new Shopify.Session.MemorySessionStorage();

const loadSession = async (req, res, next) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.locals.shopifySession = session;
    next();
  } catch (error) {
    console.error('Session error:', error);
    res.status(401).json({ message: 'Session validation failed' });
  }
};

module.exports = { loadSession, sessionStorage };
