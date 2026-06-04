from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import varieties, crops, plantings, activities
from app.database import create_db_and_tables

app = FastAPI(title="Agri-Pulse API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(varieties.router, prefix="/api/v1/varieties", tags=["varieties"])
app.include_router(crops.router, prefix="/api/v1/crops", tags=["crops"])
app.include_router(plantings.router, prefix="/api/v1/plantings", tags=["plantings"])
app.include_router(activities.router, prefix="/api/v1/activities", tags=["activities"])

@app.get("/")
async def root():
    return {"message": "Welcome to Agri-Pulse API"}
