const express = require('express');
const router = express.Router();
const axios = require('axios');

const EXCHANGE_RATE_KEY = process.env.EXCHANGE_RATE_API_KEY;

/**
 * GET /api/currency/convert?from=INR&to=USD&amount=5000
 */
router.get('/convert', async (req, res) => {
  try {
    const { from = 'INR', to = 'USD', amount = 1 } = req.query;

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_KEY}/pair/${from}/${to}/${amount}`
    );

    const d = response.data;
    res.json({
      success: true,
      data: {
        from: d.base_code,
        to: d.target_code,
        amount: parseFloat(amount),
        rate: d.conversion_rate,
        convertedAmount: d.conversion_result,
        lastUpdated: d.time_last_update_utc,
      },
    });
  } catch (error) {
    console.error('[Currency Service] Error:', error.message);
    res.status(500).json({ error: 'Currency conversion failed' });
  }
});

/**
 * GET /api/currency/rates?base=INR
 */
router.get('/rates', async (req, res) => {
  try {
    const { base = 'INR' } = req.query;

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_KEY}/latest/${base}`
    );

    const rates = response.data?.conversion_rates || {};
    const popular = ['USD', 'EUR', 'GBP', 'AED', 'SGD', 'THB', 'JPY', 'AUD', 'CAD', 'MYR'];
    const filtered = {};
    popular.forEach((c) => { if (rates[c]) filtered[c] = rates[c]; });

    res.json({
      success: true,
      base,
      data: filtered,
      lastUpdated: response.data?.time_last_update_utc,
    });
  } catch (error) {
    console.error('[Currency Service] Rates error:', error.message);
    res.status(500).json({ error: 'Exchange rates unavailable' });
  }
});

module.exports = router;
