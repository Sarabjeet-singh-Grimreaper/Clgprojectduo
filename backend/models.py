from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from database import Base

class Timetable(Base):
    __tablename__ = "timetable"
    id = Column(Integer, primary_key=True, index=True)
    day = Column(String)         # e.g., Monday
    time_slot = Column(String)   # e.g., 09:00-10:00
    room_id = Column(String)
    teacher_id = Column(Integer)
    subject = Column(String)

    # Logic: A teacher or room cannot be in two places at the same time
    __table_args__ = (
        UniqueConstraint('day', 'time_slot', 'teacher_id', name='_teacher_time_uc'),
        UniqueConstraint('day', 'time_slot', 'room_id', name='_room_time_uc'),
    )

class Notice(Base):
    __tablename__ = "notices"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    date_posted = Column(String)

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer)
    status = Column(String)  # Present/Absent
    date = Column(String)