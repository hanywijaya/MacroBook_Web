from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

@router.get("/")
def get_users():
    return {
        "message": "Get users"
    }

@router.get("/me", response_model=UserResponse)
def get_my_profile(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user = db.query(User).filter(
        User.id == current_user["sub"]
    ).first()

    return user

@router.put("/me/goals")
def update_goals():
    return {
        "message": "Update user goals"
    }

@router.post("/")
def create_user(user_data: UserCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    print("CURRENT USER:", current_user)
    
    user = User(
        id=current_user["sub"],

        name=user_data.name,
        age=user_data.age,
        gender=user_data.gender,
        height=user_data.height,
        weight=user_data.weight,

        maintenance=user_data.maintenance,
        target_carbs=user_data.target_carbs,
        target_protein=user_data.target_protein,
        target_fat=user_data.target_fat,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
