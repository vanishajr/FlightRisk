from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Literal
from risk_calculator import calculate_risk, FlightData
from visualization import create_risk_visualization
import plotly.io as pio
import json
import uvicorn

app = FastAPI()

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"], # Allow both default Next.js ports
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

class FlightDataRequest(BaseModel):
    speed: float
    acceleration: float
    temperature: float
    humidity: float
    wind_speed: float
    visibility: float

@app.get("/")
async def root():
    return {"message": "Flight Risk Assessment API is running"}

@app.post("/api/calculate-risk")
async def calculate_flight_risk(data: FlightDataRequest):
    try:
        # Convert request data to FlightData
        flight_data: FlightData = {
            'speed': data.speed,
            'acceleration': data.acceleration,
            'temperature': data.temperature,
            'humidity': data.humidity,
            'wind_speed': data.wind_speed,
            'visibility': data.visibility
        }
        
        # Calculate risk assessment
        risk_assessment = calculate_risk(flight_data)
        
        # Create visualizations
        figures = create_risk_visualization(risk_assessment)
        
        # Convert figures to JSON
        risk_factors_json = json.loads(pio.to_json(figures['risk_factors']))
        risk_gauge_json = json.loads(pio.to_json(figures['risk_gauge']))
        
        return {
            "risk_assessment": risk_assessment,
            "visualizations": {
                "risk_factors": risk_factors_json,
                "risk_gauge": risk_gauge_json
            }
        }
    except Exception as e:
        print(f"Error in calculate_flight_risk: {str(e)}")  # Add logging
        raise HTTPException(status_code=500, detail=str(e))

def start():
    """Function to start the server"""
    # Use reload=True for development
    uvicorn.run("src.server:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    start() 