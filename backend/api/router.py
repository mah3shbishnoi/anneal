from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.core.config import settings
from backend.database.session import get_db
from backend.database.models import Interview

router = APIRouter()

class CreateInterviewRequest(BaseModel):
    topic: str
    difficulty: str = "Intermediate"
    question_count: int = 3

class CompleteInterviewRequest(BaseModel):
    score: float = 85.0

@router.get("/health")
def health():
    return {"status": "ok", "app": settings.app_name, "version": settings.version}

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_interviews = db.query(Interview).filter(Interview.status == "completed").count()
    total_seconds = db.query(func.sum(Interview.duration_seconds)).filter(Interview.status == "completed").scalar() or 0
    practice_hours = round(total_seconds / 3600, 1)

    completed = (
        db.query(Interview.started_at, Interview.duration_seconds)
        .filter(Interview.status == "completed")
        .order_by(Interview.started_at.desc())
        .all()
    )

    streak_days = 0
    if completed:
        unique_dates = sorted(list({i.started_at.date() for i in completed if i.started_at}), reverse=True)
        today = datetime.utcnow().date()
        if unique_dates and unique_dates[0] in (today, today - timedelta(days=1)):
            current = unique_dates[0]
            for d in unique_dates:
                if d == current:
                    streak_days += 1
                    current -= timedelta(days=1)
                else:
                    break

    daily_activity = {}
    for i in completed:
        if not i.started_at:
            continue
        date_str = i.started_at.strftime("%Y-%m-%d")
        duration_mins = max(1, round((i.duration_seconds or 0) / 60))
        if date_str not in daily_activity:
            daily_activity[date_str] = {"date": date_str, "minutes": 0, "sessions": 0}
        daily_activity[date_str]["minutes"] += duration_mins
        daily_activity[date_str]["sessions"] += 1

    activity_list = list(daily_activity.values())

    recent = (
        db.query(Interview)
        .order_by(Interview.started_at.desc())
        .limit(5)
        .all()
    )

    return {
        "streak_days": streak_days,
        "total_interviews": total_interviews,
        "practice_hours": practice_hours,
        "recent_interviews": [
            {
                "id": i.id,
                "topic": i.topic,
                "difficulty": i.difficulty,
                "status": i.status,
                "overall_score": i.overall_score,
                "started_at": i.started_at.isoformat(),
            }
            for i in recent
        ],
        "activity": activity_list,
    }

@router.post("/interviews")
def create_interview(payload: CreateInterviewRequest, db: Session = Depends(get_db)):
    interview = Interview(
        topic=payload.topic,
        difficulty=payload.difficulty.lower(),
        status="in_progress",
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return {
        "id": interview.id,
        "topic": interview.topic,
        "difficulty": interview.difficulty,
        "status": interview.status,
        "started_at": interview.started_at.isoformat(),
    }

@router.post("/interviews/{interview_id}/complete")
def complete_interview(interview_id: str, payload: CompleteInterviewRequest, db: Session = Depends(get_db)):
    interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not interview:
        return {"error": "interview not found"}

    now = datetime.utcnow()
    interview.ended_at = now
    interview.duration_seconds = max(60, int((now - interview.started_at).total_seconds()))
    interview.overall_score = payload.score
    interview.status = "completed"
    db.commit()
    db.refresh(interview)
    return {
        "id": interview.id,
        "status": interview.status,
        "overall_score": interview.overall_score,
        "duration_seconds": interview.duration_seconds,
    }