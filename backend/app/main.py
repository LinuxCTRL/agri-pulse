from fastapi import FastAPI
from app.api import varieties, crops

app = FastAPI(title="Agri-Pulse API")

app.include_router(varieties.router, prefix="/api/v1/varieties", tags=["varieties"])
app.include_router(crops.router, prefix="/api/v1/crops", tags=["crops"])

@app.get("/")
async def root():
    return {"message": "Welcome to Agri-Pulse API"}
