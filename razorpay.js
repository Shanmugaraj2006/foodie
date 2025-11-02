// razorpay.js - safe init for Razorpay
const Razorpay = require('razorpay');

function initRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set. Razorpay payments will not work until you set them in .env');
    return null;
  }
  return new Razorpay({ key_id, key_secret });
}

module.exports = initRazorpay();
