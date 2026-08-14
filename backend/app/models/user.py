from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True
    )

    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    height = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)

    maintenance = Column(Float, nullable=False)
    target_carbs = Column(Float, nullable=False)
    target_protein = Column(Float, nullable=False)
    target_fat = Column(Float, nullable=False)