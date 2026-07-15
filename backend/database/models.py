import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.database.session import Base

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    ended_at = Column(DateTime, nullable=True)
    topic = Column(String(100), nullable=False)
    difficulty = Column(String(50), default="intermediate", nullable=False)
    status = Column(String(50), default="in_progress", nullable=False)
    overall_score = Column(Float, nullable=True)
    duration_seconds = Column(Integer, default=0, nullable=False)

    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    interview_id = Column(String(36), ForeignKey("interviews.id"), nullable=False)
    prompt = Column(Text, nullable=False)
    topic = Column(String(100), nullable=False)
    difficulty = Column(String(50), nullable=False)
    order_index = Column(Integer, default=0, nullable=False)

    interview = relationship("Interview", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    interview_id = Column(String(36), ForeignKey("interviews.id"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id"), nullable=False)
    answer_text = Column(Text, nullable=False)
    duration_seconds = Column(Integer, default=0, nullable=False)
    score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    question = relationship("Question", back_populates="answers")