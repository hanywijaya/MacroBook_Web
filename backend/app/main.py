from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import user, meal
from app.routers import users, meals

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173", "http://127.0.0.1:5173", "https://macro-book-fglsfeeee-nini-c81c.vercel.app"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(meals.router)

@app.get("/")
def root():
    return {"message": "FastAPI is running!"}

@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI~"}