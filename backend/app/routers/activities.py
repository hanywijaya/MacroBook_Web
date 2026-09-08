from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityResponse
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/activities",
    tags=["Activities"]
)


@router.post("/", response_model=ActivityResponse)
def create_activity(
    activity_data: ActivityCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    activity = Activity(
        user_id=user_id,
        title=activity_data.title,
        calories_burned=activity_data.calories_burned,
        note=activity_data.note,
        time=activity_data.time
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return activity


@router.get("/", response_model=list[ActivityResponse])
def get_my_activities(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    activities = (
        db.query(Activity)
        .filter(Activity.user_id == user_id)
        .order_by(Activity.time.desc())
        .all()
    )

    return activities


@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(
    activity_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    activity = (
        db.query(Activity)
        .filter(
            Activity.id == activity_id,
            Activity.user_id == user_id
        )
        .first()
    )

    if not activity:
        raise HTTPException(
            status_code=404,
            detail="Activity not found"
        )

    return activity


@router.delete("/{activity_id}")
def delete_activity(
    activity_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user["sub"]

    activity = (
        db.query(Activity)
        .filter(
            Activity.id == activity_id,
            Activity.user_id == user_id
        )
        .first()
    )

    if not activity:
        raise HTTPException(
            status_code=404,
            detail="Activity not found"
        )

    db.delete(activity)
    db.commit()

    return {
        "message": "Activity deleted successfully"
    }