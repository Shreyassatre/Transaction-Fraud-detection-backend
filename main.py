from fastapi import FastAPI
import customers
from database import create_tables
from fastapi.middleware.cors import CORSMiddleware
import ml

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include customer router
app.include_router(customers.router)
app.include_router(ml.app, prefix="/ml")

# On startup event to create database tables
@app.on_event("startup")
async def startup_event():
    create_tables()

# Main route for testing
@app.get("/")
async def root():
    return {"message": "Customer API"}
