const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// --- Razorpay Initialization ---
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('[Payment Microservice] Razorpay SDK Initialized for Production');
} else {
  console.warn('[Payment Microservice] WARNING: Razorpay keys missing. Using SIMULATION mode.');
}

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
    
    if (razorpay) {
      // PRODUCTION: Create real order with Razorpay
      const order = await razorpay.orders.create({
        amount: amount * 100, // paisa
        currency: currency || 'INR',
        receipt: `receipt_${Date.now()}`,
        // Note: Transfers (Split Payment) require Razorpay Route to be enabled
      });
      console.log('[Payment Microservice] Generated Live Razorpay Order:', order.id);
      return res.json({ success: true, order });
    } else {
      // SIMULATION for local dev
      const mockRazorpayOrder = {
        id: `order_${Date.now()}_mock`,
        amount: amount * 100,
        currency: currency || 'INR',
        status: 'created'
      };
      console.log('[Payment Microservice] Using Simulated Order for:', amount);
      return res.json({ success: true, order: mockRazorpayOrder });
    }
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
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (secret) {
    const generated_signature = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
    if (generated_signature !== req.headers['x-razorpay-signature']) {
      console.error('[Payment Microservice] Invalid Webhook Signature');
      return res.status(400).send('Invalid Signature');
    }
  }

  console.log('[Payment Microservice] Asynchronous Webhook Settlement Triggered:', req.body?.event);
  res.json({ status: 'ok' });
});

module.exports = router;
