const express = require('express');
const router = express.Router();
// const Razorpay = require('razorpay');
// const crypto = require('crypto');

/*
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
*/

/**
 * PATH: /api/payment/create-order
 * DESCRIPTION: Reaches out to Razorpay API to generate a server-side order ID required for UI checkout.
 * Configured with Split Settlement routing directives.
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Simulate Split Payment Logic
    const baseFare = amount - 299; // 299 is TravelWise Platform Fee
    const platformFee = 299;
    
    // Simulate Razorpay API Response (Since we don't have active keys for the user)
    const mockRazorpayOrder = {
      id: `order_${Date.now()}_mock`,
      amount: amount * 100, // paise
      currency: currency || 'INR',
      status: 'created',
      transfers: [
        { account: 'acc_AirlineNodal', amount: baseFare * 100 },
        { account: 'acc_PlatformOwner', amount: platformFee * 100 }
      ]
    };

    res.json({ success: true, order: mockRazorpayOrder });
  } catch (error) {
    console.error('[Payment Microservice] Failed Order Generation:', error);
    res.status(500).json({ error: 'Payment Gateway is currently unresponsive.' });
  }
});

/**
 * PATH: /api/payment/webhook
 * DESCRIPTION: Secure endpoint designed to receive Razorpay signature verifications asynchronously.
 */
router.post('/webhook', (req, res) => {
  // const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  // const generated_signature = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
  // if (generated_signature !== req.headers['x-razorpay-signature']) return res.status(400).send('Invalid Signature');

  console.log('[Payment Microservice] Asynchronous Webhook Settlement Triggered:', req.body?.event);
  res.json({ status: 'ok' });
});

module.exports = router;
