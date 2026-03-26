const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const prisma = require('../../../lib/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'travelwise_v2_super_secret';

// --- Firebase Admin Initialization ---
const firebaseKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (firebaseKey && firebaseKey.trim() !== "" && firebaseKey !== '""') {
  try {
    const serviceAccount = JSON.parse(firebaseKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('[Auth Microservice] Firebase Admin SDK Initialized for Production');
  } catch (err) {
    console.error('[Auth Microservice] Firebase Admin Init Failed:', err.message);
  }
} else {
  console.warn('[Auth Microservice] WARNING: FIREBASE_SERVICE_ACCOUNT_KEY missing or empty. Using SIMULATION mode.');
}

/**
 * PATH: /api/auth/login
 * DESCRIPTION: Verifies the Firebase Client ID Token, synchronizes the user to PostgreSQL via Prisma,
 * and issues a secure 15-minute backend-signed JWT as an httpOnly cookie.
 */
router.post('/login', async (req, res) => {
  try {
    const { idToken, mockEmail, mockName, mockPhoto } = req.body;
    
    // TOKEN VERIFICATION LOGIC
    let decodedToken;
    if (admin.apps.length > 0) {
      // PRODUCTION: Verify token securely via Google Firebase servers
      decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('[Auth Microservice] Verified Live Firebase Token for:', decodedToken.email);
    } else {
      // SIMULATION for local auth testing
      decodedToken = { 
        uid: idToken || `firebase-mock-${Date.now()}`, 
        email: mockEmail || 'test@travelwise.in', 
        name: mockName || 'TravelWise User',
        picture: mockPhoto || ''
      };
      console.log('[Auth Microservice] Using Simulated Token for:', decodedToken.email);
    }

    console.log('[Auth Microservice] Login requested for:', decodedToken.email);
    
    // Synchronize User Profile to PostgreSQL via Prisma
    let user;
    try {
      user = await prisma.user.upsert({
        where: { email: decodedToken.email },
        update: { name: decodedToken.name, profilePhoto: decodedToken.picture, firebaseUid: decodedToken.uid },
        create: { firebaseUid: decodedToken.uid, name: decodedToken.name, email: decodedToken.email, profilePhoto: decodedToken.picture }
      });
    } catch (upsertError) {
      console.error('[Auth Microservice] Prisma Upsert Failed:', upsertError);
      // Fallback: Try to find by firebaseUid if email clash occurs
      user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
      if (!user) throw upsertError; // Re-throw if even fallback fails
    }
    
    console.log('[Auth Microservice] User resolved:', user.id);

    // Sign secure custom Microservice JWT (15 min expiry per requirements)
    const sessionToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '15m' });
    
    // Set httpOnly Cookie to prevent XSS attacks
    res.cookie('auth_session', sessionToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 
    });
    
    res.json({ success: true, user });

  } catch (error) {
    console.error('[Auth Microservice] Error resolving Firebase token:', error);
    res.status(401).json({ error: error.stack || 'Critical Authentication System Failure' });
  }
});

/**
 * PATH: /api/auth/logout
 * DESCRIPTION: Destroys the global httpOnly session cookie.
 */
router.post('/logout', (req, res) => {
  res.clearCookie('auth_session');
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * PATH: /api/auth/verify
 * DESCRIPTION: Middleware target to confirm a session's validity for cross-microservice communication.
 */
router.get('/verify', (req, res) => {
  const token = req.cookies?.auth_session;
  if (!token) return res.status(401).json({ error: 'No active session token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, uid: decoded.userId });
  } catch (error) {
    res.status(401).json({ error: 'Session Expired' });
  }
});

module.exports = router;
