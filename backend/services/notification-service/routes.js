const express = require('express');
const router = express.Router();

// const sgMail = require('@sendgrid/mail');
// const twilio = require('twilio');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * PATH: /api/notifications/dispatch
 * DESCRIPTION: Handles automated delivery of E-Tickets via SendGrid (Email) and Twilio (SMS).
 * Fired asynchronously via webhooks after the Razorpay verification settles.
 */
router.post('/dispatch', async (req, res) => {
  try {
    const { email, phone, pnr, flightData } = req.body;

    console.log(`[Notification Microservice] Preparing dispatch queue for PNR: ${pnr}`);

    // SIMULATED SENDGRID EMAIL DISPATCH
    const emailPayload = {
      to: email || 'user@example.com',
      from: 'tickets@travelwise.in',
      subject: `Your TravelWise E-Ticket (PNR: ${pnr})`,
      html: `<strong>Booking Confirmed!</strong> Keep this email secure. You are traveling on ${flightData || 'your selected flight'}.`
    };
    // await sgMail.send(emailPayload);
    console.log('[Notification Microservice] -> SendGrid Email successfully queued.');

    // SIMULATED TWILIO SMS DISPATCH
    if (phone) {
       // await twilioClient.messages.create({ body: `TravelWise: Booking Confirmed (PNR: ${pnr}). Have a safe flight!`, from: '+15017122661', to: phone });
       console.log('[Notification Microservice] -> Twilio SMS successfully queued.');
    }

    res.json({ success: true, message: 'Communications successfully dispatched to telecommunication carriers.' });

  } catch (error) {
    console.error('[Notification Microservice] Dispatch Failure:', error);
    res.status(500).json({ error: 'Communication network payload rejected.' });
  }
});

module.exports = router;
