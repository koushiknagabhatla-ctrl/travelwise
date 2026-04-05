const express = require('express');
const router = express.Router();

// Extracted from Top 40 Indian Aviation Rankings + OpenFlights Data
const airports = [
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', terminals: 3, lat: 28.5562, lng: 77.1000 },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', terminals: 2, lat: 19.0896, lng: 72.8656 },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', terminals: 2, lat: 13.1986, lng: 77.7066 },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', terminals: 1, lat: 17.2403, lng: 78.4294 },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', terminals: 4, lat: 12.9941, lng: 80.1709 },
  { code: 'CCU', name: 'Netaji Subhash Chandra Bose', city: 'Kolkata', terminals: 2, lat: 22.6547, lng: 88.4467 },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad', terminals: 2, lat: 23.0772, lng: 72.6347 },
  { code: 'COK', name: 'Cochin International', city: 'Kochi', terminals: 2, lat: 10.1520, lng: 76.3919 },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', terminals: 1, lat: 18.5822, lng: 73.9197 },
  { code: 'GOI', name: 'Dabolim Airport', city: 'Goa', terminals: 1, lat: 15.3808, lng: 73.8314 },
  { code: 'TRV', name: 'Thiruvananthapuram Int.', city: 'Thiruvananthapuram', terminals: 1, lat: 8.4821, lng: 76.9201 },
  { code: 'CCJ', name: 'Calicut International', city: 'Kozhikode', terminals: 1, lat: 11.1368, lng: 75.9553 },
  { code: 'JAI', name: 'Jaipur International', city: 'Jaipur', terminals: 2, lat: 26.8242, lng: 75.8122 },
  { code: 'LKO', name: 'Chaudhary Charan Singh', city: 'Lucknow', terminals: 2, lat: 26.7606, lng: 80.8893 },
  { code: 'CJB', name: 'Coimbatore International', city: 'Coimbatore', terminals: 1, lat: 11.0300, lng: 77.0434 },
  { code: 'TRZ', name: 'Tiruchirappalli Int.', city: 'Tiruchirappalli', terminals: 1, lat: 10.7654, lng: 78.7097 },
  { code: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri', terminals: 1, lat: 26.6812, lng: 88.3286 },
  { code: 'GAU', name: 'Gopinath Bordoloi Int.', city: 'Guwahati', terminals: 1, lat: 26.1061, lng: 91.5859 },
  { code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam', terminals: 1, lat: 17.7212, lng: 83.2245 },
  { code: 'ATQ', name: 'Sri Guru Ram Dass Jee', city: 'Amritsar', terminals: 1, lat: 31.7096, lng: 74.7973 },
  { code: 'IXM', name: 'Madurai Airport', city: 'Madurai', terminals: 1, lat: 9.8345, lng: 78.0934 },
  { code: 'NAG', name: 'Dr. Babasaheb Ambedkar', city: 'Nagpur', terminals: 1, lat: 21.0922, lng: 79.0472 },
  { code: 'IXE', name: 'Mangaluru International', city: 'Mangaluru', terminals: 1, lat: 12.9613, lng: 74.8898 },
  { code: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', terminals: 1, lat: 23.2875, lng: 77.3374 },
  { code: 'BBI', name: 'Biju Patnaik Int.', city: 'Bhubaneswar', terminals: 1, lat: 20.2444, lng: 85.8178 },
  { code: 'IXZ', name: 'Veer Savarkar Int.', city: 'Port Blair', terminals: 1, lat: 11.6412, lng: 92.7297 },
  { code: 'IXC', name: 'Chandigarh International', city: 'Chandigarh', terminals: 1, lat: 30.6735, lng: 76.7885 },
  { code: 'IXA', name: 'Agartala Airport', city: 'Agartala', terminals: 1, lat: 23.8870, lng: 91.2404 },
  { code: 'IXR', name: 'Ranchi Airport', city: 'Ranchi', terminals: 1, lat: 23.3143, lng: 85.3217 },
  { code: 'PAT', name: 'Patna Airport', city: 'Patna', terminals: 1, lat: 25.5913, lng: 85.0877 },
  { code: 'DED', name: 'Dehradun Airport', city: 'Dehradun', terminals: 1, lat: 30.1897, lng: 78.1803 },
  { code: 'RJA', name: 'Rajahmundry Airport', city: 'Rajahmundry', terminals: 1, lat: 17.1104, lng: 81.8182 },
  { code: 'TIR', name: 'Tirupati Airport', city: 'Tirupati', terminals: 1, lat: 13.6325, lng: 79.5433 },
  { code: 'VGA', name: 'Vijayawada Airport', city: 'Vijayawada', terminals: 1, lat: 16.5304, lng: 80.7965 },
  { code: 'IXL', name: 'Kushok Bakula Rimpochee', city: 'Leh', terminals: 1, lat: 34.1359, lng: 77.5465 },
  { code: 'AGX', name: 'Agatti Island Airport', city: 'Agatti Island', terminals: 1, lat: 10.8237, lng: 72.1761 },
  { code: 'DIB', name: 'Dibrugarh Airport', city: 'Dibrugarh', terminals: 1, lat: 27.4839, lng: 95.0169 },
  { code: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur', terminals: 1, lat: 26.2511, lng: 73.0489 },
  { code: 'IXU', name: 'Aurangabad Airport', city: 'Aurangabad', terminals: 1, lat: 19.8627, lng: 75.3981 },
  { code: 'GWL', name: 'Gwalior Airport', city: 'Gwalior', terminals: 1, lat: 26.2933, lng: 78.2278 }
];

router.get('/', (req, res) => {
    res.json({ success: true, data: airports });
});

module.exports = router;
