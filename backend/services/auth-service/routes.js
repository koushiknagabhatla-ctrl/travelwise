const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'travelwise_v2_super_secret';

/**
 * POST /api/auth/login
 * Verifies Supabase session and issues backend JWT cookie
 */
router.post('/login', async (req, res) => {
  try {
    const { accessToken, user: userData } = req.body;

    if (!userData) {
      return res.status(400).json({ error: 'Missing user data' });
    }

    console.log('[Auth Service] Login for:', userData.email);

    // Create backend JWT session
    const sessionToken = jwt.sign(
      { userId: userData.id, email: userData.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('auth_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name || 'Traveler',
        email: userData.email,
        profilePhoto: userData.profilePhoto || '',
      },
    });
  } catch (error) {
    console.error('[Auth Service] Error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie('auth_session');
  res.json({ success: true, message: 'Logged out' });
});

/**
 * GET /api/auth/verify
 */
router.get('/verify', (req, res) => {
  const token = req.cookies?.auth_session;
  if (!token) return res.status(401).json({ error: 'No session' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, uid: decoded.userId });
  } catch (error) {
    res.status(401).json({ error: 'Session expired' });
  }
});

module.exports = router;
