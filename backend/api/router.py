from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.core.config import settings
from backend.database.session import get_db
from backend.database.models import Interview

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok", "app": settings.app_name, "version": settings.version}

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_interviews = db.query(Interview).filter(Interview.status == "completed").count()
    total_seconds = db.query(func.sum(Interview.duration_seconds)).filter(Interview.status == "completed").scalar() or 0
    practice_hours = round(total_seconds / 3600, 1)

    completed = (
        db.query(Interview.started_at)
        .filter(Interview.status == "completed")
        .order_by(Interview.started_at.desc())
        .all()
    )

    streak_days = 0
    if completed:
        unique_dates = sorted(list({i.started_at.date() for i in completed}), reverse=True)
        today = datetime.utcnow().date()
        if unique_dates[0] in (today, today - timedelta(days=1)):
            current = unique_dates[0]
            for d in unique_dates:
                if d == current:
                    streak_days += 1
                    current -= timedelta(days=1)
                else:
                    break

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
    }