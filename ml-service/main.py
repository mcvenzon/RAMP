import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI(title="MRF ML Service")

# Data Models
class PredictionData(BaseModel):
    date: str
    predicted_price: float
    demand_index: float

class AnalyticsResponse(BaseModel):
    material_id: str
    predictions: List[PredictionData]

# --- Mock ML Logic (To be replaced with real model inference) ---

def get_mock_prediction(material_id: str) -> List[dict]:
    """
    Simulates a time-series prediction model.
    In production, this would load a pre-trained model (e.g., Prophet, ARIMA, or LSTM)
    and run inference on recent historical data.
    """
    return [
        {"date": "2026-07-10", "predicted_price": 16.20, "demand_index": 0.65},
        {"date": "2026-07-11", "predicted_price": 16.45, "demand_index": 0.68},
        {"date": "2026-07-12", "predicted_price": 15.90, "demand_index": 0.62},
        {"date": "2026-07-13", "predicted_price": 16.10, "demand_index": 0.64},
        {"date": "2026-07-14", "predicted_price": 16.30, "demand_index": 0.66},
    ]

# --- API Endpoints ---

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ml-service"}

@app.get("/predict/{material_id}", response_model=AnalyticsResponse)
async def predict_price_trend(material_id: str):
    """
    Retrieves predicted price and demand trends for a specific material.
    """
    try:
        # Simulate processing time for a real model
        # import time; time.sleep(0.5)
        
        predictions = get_mock_prediction(material_id)
        return {
            "material_id": material_id,
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/materials")
async def list_materials():
    return ["Aluminum", "PET", "Paper", "Glass", "Cardboard"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
