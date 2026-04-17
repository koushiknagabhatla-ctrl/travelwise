const express = require('express');
const router = express.Router();

// In-memory store for price alerts (production would use database)
const priceAlerts = new Map();

/**
 * POST /api/alerts
 * Set a price alert for a route
 */
router.post('/', async (req, res) => {
  try {
    const { userId, from, to, targetPrice, email } = req.body;

    if (!from || !to || !targetPrice) {
      return res.status(400).json({ error: 'Missing required fields: from, to, targetPrice' });
    }

    const alert = {
      id: `alert_${Date.now()}`,
      userId: userId || 'anonymous',
      from,
      to,
      targetPrice: parseFloat(targetPrice),
      email: email || '',
      active: true,
      createdAt: new Date().toISOString(),
    };

    const userAlerts = priceAlerts.get(userId) || [];
    userAlerts.push(alert);
    priceAlerts.set(userId, userAlerts);

    console.log(`[Alert Service] Price alert set: ${from}→${to} at ₹${targetPrice}`);
    res.json({ success: true, alert });
  } catch (error) {
    console.error('[Alert Service] Error:', error);
    res.status(500).json({ error: 'Failed to set price alert' });
  }
});

/**
 * GET /api/alerts/:userId
 * Get user's price alerts
 */
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const alerts = priceAlerts.get(userId) || [];
  res.json({ success: true, data: alerts });
});

/**
 * DELETE /api/alerts/:alertId
 * Delete a price alert
 */
router.delete('/:alertId', (req, res) => {
  const { alertId } = req.params;

  for (const [userId, alerts] of priceAlerts) {
    const idx = alerts.findIndex((a) => a.id === alertId);
    if (idx !== -1) {
      alerts.splice(idx, 1);
      priceAlerts.set(userId, alerts);
      return res.json({ success: true, message: 'Alert deleted' });
    }
  }

  res.status(404).json({ error: 'Alert not found' });
});

module.exports = router;
