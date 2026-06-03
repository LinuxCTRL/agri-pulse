from fastapi import FastAPI
from app.api import varieties

app = FastAPI(title="Agri-Pulse API")

app.include_router(varieties.router, prefix="/api/v1/varieties", tags=["varieties"])

@app.get("/")
async def root():
    return {"message": "Welcome to Agri-Pulse API"}
