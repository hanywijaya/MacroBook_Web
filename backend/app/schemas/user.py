from pydantic import BaseModel, Field
from uuid import UUID

# class UserCreate(BaseModel):
#     name: str = Field(min_length=1, max_length=100)
#     age: int = Field(gt=0)
#     gender: str = Field(min_length=1, max_length=20)
#     height: float = Field(gt=0)
#     weight: float = Field(gt=0)
#     maintenance: float = Field(gt=0)
#     targetCarbs: float = Field(ge=0)
#     targetProtein: float = Field(ge=0)
#     targetFat: float = Field(ge=0)

class UserCreate(BaseModel):
    name: str
    age: int
    gender: str
    height: float
    weight: float
    maintenance: float
    target_carbs: float 
    target_protein: float 
    target_fat: float 

class UserResponse(UserCreate):
    id: UUID

    class Config:
        from_attributes = True