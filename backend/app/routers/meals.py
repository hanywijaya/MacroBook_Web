from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models.meal import Meal
from app.schemas.meal import MealCreate, MealResponse
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/meals",
    tags=["Meals"]
)

@router.post("/", response_model=MealResponse)
def create_meal(
    meal_data: MealCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    meal = Meal(
        user_id=user_id,
        title=meal_data.title,
        calories=meal_data.calories,
        carbs=meal_data.carbs,
        protein=meal_data.protein,
        fat=meal_data.fat,
        time=meal_data.time
    )

    db.add(meal)
    db.commit()
    db.refresh(meal)

    return meal

@router.get("/", response_model=list[MealResponse])
def get_my_meals(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    meals = (
        db.query(Meal)
        .filter(Meal.user_id == user_id)
        .order_by(Meal.time.desc())
        .all()
    )

    return meals

@router.get("/{meal_id}", response_model=MealResponse)
def get_meal(
    meal_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    meal = (
        db.query(Meal)
        .filter(
            Meal.id == meal_id,
            Meal.user_id == user_id
        )
        .first()
    )

    if not meal:
        raise HTTPException(
            status_code=404,
            detail="Meal not found"
        )

    return meal


@router.delete("/{meal_id}")
def delete_meal(
    meal_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    meal = (
        db.query(Meal)
        .filter(
            Meal.id == meal_id,
            Meal.user_id == user_id
        )
        .first()
    )

    if not meal:
        raise HTTPException(
            status_code=404,
            detail="Meal not found"
        )

    db.delete(meal)
    db.commit()

    return {
        "message": "Meal deleted successfully"
    }