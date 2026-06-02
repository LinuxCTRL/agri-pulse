from fastapi import FastAPI

app = FastAPI(title="Agri-Pulse API")

@app.get("/")
async def root():
    return {"message": "Welcome to Agri-Pulse API"}
