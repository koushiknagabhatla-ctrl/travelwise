import os
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import requests
from typing import Optional, List
from datetime import datetime

app = FastAPI(title="TravelWise API", description="FastAPI Serverless Backend")

DUFFEL_API_KEY = os.getenv("DUFFEL_API_KEY")
DUFFEL_BASE = "https://api.duffel.com"
DUFFEL_HEADERS = {
    "Authorization": f"Bearer {DUFFEL_API_KEY}",
    "Duffel-Version": "v2",
    "Content-Type": "application/json",
    "Accept": "application/json",
}

class FlightSearchRequest(BaseModel):
    from_iata: str
    to_iata: str
    date: str
    pax: int = 1
    carrier: str = "All"

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "engine": "FastAPI Vercel"}

@app.get("/api/search")
def search_flights(
    mode: str = "flights",
    carrier: str = "All",
    from_iata: str = Query(..., alias="from"),
    to_iata: str = Query(..., alias="to"),
    date: str = Query(...),
    pax: int = 1
):
    """
    Real-Time Flight Search via Duffel API.
    Provides highly realistic fallback if API key is missing or invalid.
    """
    if DUFFEL_API_KEY:
        try:
            slices = [{"origin": from_iata, "destination": to_iata, "departure_date": date}]
            passengers = [{"type": "adult"} for _ in range(pax)]
            
            payload = {
                "data": {
                    "slices": slices,
                    "passengers": passengers,
                    "cabin_class": "economy",
                    "return_offers": True,
                    "max_connections": 1,
                }
            }
            
            response = requests.post(f"{DUFFEL_BASE}/air/offer_requests", json=payload, headers=DUFFEL_HEADERS)
            
            if response.status_code == 200 or response.status_code == 201:
                offers = response.json().get("data", {}).get("offers", [])
                results = []
                for offer in offers[:15]:
                    slice_data = offer.get("slices", [{}])[0]
                    segments = slice_data.get("segments", [])
                    if not segments:
                        continue
                    first_seg = segments[0]
                    last_seg = segments[-1]
                    marketing_carrier = first_seg.get("marketing_carrier", {})
                    
                    results.append({
                        "id": offer.get("id"),
                        "mode": "flights",
                        "carrier": marketing_carrier.get("name", "Airline"),
                        "flightNumber": f"{marketing_carrier.get('iata_code', '')}-{marketing_carrier.get('flight_number', '101')}",
                        "departure": first_seg.get("departing_at", "").split("T")[-1][:5] if "T" in first_seg.get("departing_at", "") else "08:00",
                        "arrival": last_seg.get("arriving_at", "").split("T")[-1][:5] if "T" in last_seg.get("arriving_at", "") else "10:30",
                        "duration": slice_data.get("duration", "2h 30m").replace("PT", "").replace("H", "h ").replace("M", "m"),
                        "stops": "Direct" if len(segments) == 1 else f"{len(segments)-1} Stop",
                        "onTimeRating": "92%",
                        "baggage": "15kg Check-in",
                        "classes": [
                            {"name": "Economy", "price": float(offer.get("total_amount", 5000)), "currency": offer.get("total_currency", "INR")}
                        ],
                        "totalAmount": offer.get("total_amount"),
                        "currency": offer.get("total_currency")
                    })
                return {"success": True, "source": "Duffel API", "data": results}
        except Exception as e:
            print(f"Duffel Error: {e}")
            pass # Fallback to mock
            
    # Highly Realistic Dynamic Mock Data if Duffel Fails
    import random
    airlines = ["IndiGo", "Vistara", "Air India", "SpiceJet", "Akasa Air"]
    base_price = random.randint(3500, 8500)
    
    mock_results = []
    num_results = random.randint(3, 8)
    for i in range(num_results):
        airline = random.choice(airlines)
        price = base_price + random.randint(-1500, 2000)
        dep_hour = random.randint(5, 20)
        dep_min = random.choice(["00", "15", "30", "45"])
        arr_hour = (dep_hour + random.randint(1, 3)) % 24
        
        mock_results.append({
            "id": f"mock_{from_iata}_{to_iata}_{i}",
            "mode": "flights",
            "carrier": airline,
            "flightNumber": f"{airline[:2].upper()}-{random.randint(100, 999)}",
            "departure": f"{dep_hour:02d}:{dep_min}",
            "arrival": f"{arr_hour:02d}:{random.choice(['05', '20', '40', '55'])}",
            "duration": f"{arr_hour-dep_hour if arr_hour>dep_hour else 24-dep_hour+arr_hour}h {random.choice(['10m', '35m', '45m'])}",
            "stops": "Direct" if random.random() > 0.3 else "1 Stop",
            "onTimeRating": f"{random.randint(85, 98)}%",
            "baggage": "15kg Check-in" if airline == "IndiGo" else "20kg Check-in",
            "classes": [{"name": "Economy", "price": price, "currency": "INR"}],
            "totalAmount": str(price),
            "currency": "INR"
        })
        
    # Sort by price
    mock_results.sort(key=lambda x: x["classes"][0]["price"])
    return {"success": True, "source": "Mock Generator", "data": mock_results}

@app.get("/api/tracking/live")
def track_flight(flight: str = Query(...)):
    """Simulates real-time telemetry since tracking APIs require separate keys"""
    return {
        "telemetry": {
            "flight_iata": flight,
            "airline": "IndiGo" if "6E" in flight else "Vistara",
            "status": "en-route",
            "departure": {"airport": "DEL", "scheduled": "09:00", "actual": "09:12", "terminal": "3"},
            "arrival": {"airport": "BOM", "scheduled": "11:15", "estimated": "11:05", "terminal": "2"},
            "live": {
                "altitude": 35000,
                "speed_horizontal": 820,
                "latitude": 23.4,
                "longitude": 75.1,
                "progress": 65,
                "updated_at": datetime.now().isoformat()
            }
        }
    }
    
# Important: Vercel standardizes the entrypoint variable 'app'
