from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ActivityCreate(BaseModel):
    title: str
    calories_burned: float
    note: str | None = None
    time: datetime


class ActivityResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    calories_burned: float
    note: str | None = None
    time: datetime

    model_config = ConfigDict(from_attributes=True)