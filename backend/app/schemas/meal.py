from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class MealCreate(BaseModel):
    title: str
    calories: float
    carbs: float
    protein: float
    fat: float
    time: datetime | None = None


class MealResponse(BaseModel):
    id: UUID
    user_id: UUID

    title: str
    calories: float
    carbs: float
    protein: float
    fat: float

    time: datetime

    model_config = {
        "from_attributes": True
    }