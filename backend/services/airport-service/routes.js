const express = require('express');
const router = express.Router();

// Extracted from Top 40 Indian Aviation Rankings
const airports = [
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bengaluru' },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai' },
  { code: 'CCU', name: 'Netaji Subhash Chandra Bose', city: 'Kolkata' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad' },
  { code: 'COK', name: 'Cochin International', city: 'Kochi' },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune' },
  { code: 'GOI', name: 'Dabolim Airport', city: 'Goa' },
  { code: 'TRV', name: 'Thiruvananthapuram Int.', city: 'Thiruvananthapuram' },
  { code: 'CCJ', name: 'Calicut International', city: 'Kozhikode' },
  { code: 'JAI', name: 'Jaipur International', city: 'Jaipur' },
  { code: 'LKO', name: 'Chaudhary Charan Singh', city: 'Lucknow' },
  { code: 'CJB', name: 'Coimbatore International', city: 'Coimbatore' },
  { code: 'TRZ', name: 'Tiruchirappalli Int.', city: 'Tiruchirappalli' },
  { code: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri' },
  { code: 'GAU', name: 'Gopinath Bordoloi Int.', city: 'Guwahati' },
  { code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam' },
  { code: 'ATQ', name: 'Sri Guru Ram Dass Jee', city: 'Amritsar' },
  { code: 'IXM', name: 'Madurai Airport', city: 'Madurai' },
  { code: 'NAG', name: 'Dr. Babasaheb Ambedkar', city: 'Nagpur' },
  { code: 'IXE', name: 'Mangaluru International', city: 'Mangaluru' },
  { code: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal' },
  { code: 'BBI', name: 'Biju Patnaik Int.', city: 'Bhubaneswar' },
  { code: 'IXZ', name: 'Veer Savarkar Int.', city: 'Port Blair' },
  { code: 'IXC', name: 'Chandigarh International', city: 'Chandigarh' },
  { code: 'IXA', name: 'Agartala Airport', city: 'Agartala' },
  { code: 'IXR', name: 'Ranchi Airport', city: 'Ranchi' },
  { code: 'PAT', name: 'Patna Airport', city: 'Patna' },
  { code: 'DED', name: 'Dehradun Airport', city: 'Dehradun' },
  { code: 'RJA', name: 'Rajahmundry Airport', city: 'Rajahmundry' },
  { code: 'TIR', name: 'Tirupati Airport', city: 'Tirupati' },
  { code: 'VGA', name: 'Vijayawada Airport', city: 'Vijayawada' },
  { code: 'IXL', name: 'Kushok Bakula Rimpochee', city: 'Leh' },
  { code: 'AGX', name: 'Agatti Island Airport', city: 'Agatti Island' },
  { code: 'DIB', name: 'Dibrugarh Airport', city: 'Dibrugarh' },
  { code: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur' },
  { code: 'IXU', name: 'Aurangabad Airport', city: 'Aurangabad' },
  { code: 'GWL', name: 'Gwalior Airport', city: 'Gwalior' }
];

router.get('/', (req, res) => {
    res.json({ success: true, data: airports });
});

module.exports = router;
