import Stripe from 'stripe';

let stripeInstance = null;

// Proxy har property access ko intercept karega (jaise paymentIntents, customers, etc.)
const stripe = new Proxy({}, {
  get(target, prop) {
    if (!stripeInstance) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing from environment variables. Check your .env file.');
      }
      stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripeInstance[prop];
  }
});

export default stripe;