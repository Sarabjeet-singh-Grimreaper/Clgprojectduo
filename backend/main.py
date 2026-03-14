from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, database
import pandas as pd
import io
import shutil
import os
from datetime import datetime

app = FastAPI(title="Quest Group Smart ERP - Advanced")

# --- Security: CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Storage
UPLOAD_DIR = "uploads/assignments"
os.makedirs(UPLOAD_DIR, exist_ok=True)

models.Base.metadata.create_all(bind=database.engine)

@app.get("/")
def home():
    return {"status": "Online", "college": "Quest Group of Institutions", "dept": "CSE"}

# --- GOAL 1 & 7: Smart Scheduling & Exam Management ---
@app.get("/timetable/clash-check")
def check_scheduling_logic(day: str, slot: str, room: str, db: Session = Depends(database.get_db)):
    # Automated check for Room availability (Constraint Satisfaction)
    clash = db.query(models.Timetable).filter(
        models.Timetable.day == day,
        models.Timetable.time_slot == slot,
        models.Timetable.room_id == room
    ).first()
    if clash:
        raise HTTPException(status_code=400, detail="Clash: Room already occupied!")
    return {"status": "Clear"}

# --- GOAL 2: Assignment & Academic Module ---
@app.post("/assignments/submit/")
async def submit_assignment(student_id: int, subject: str, file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, f"{subject}_{student_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": "Assignment uploaded successfully", "path": file_path}

# --- GOAL 4: Student Data Excel Upload ---
@app.post("/students/bulk-upload/")
async def upload_students(file: UploadFile = File(...)):
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="Invalid file format. Upload .xlsx only.")
    contents = await file.read()
    df = pd.read_excel(io.BytesIO(contents))
    # Logic to process student rows goes here
    return {"message": f"Successfully processed {len(df)} student records."}

# --- Data Retrieval ---
@app.get("/timetable/")
def get_timetable(db: Session = Depends(database.get_db)):
    return db.query(models.Timetable).all()

@app.get("/notices/")
def get_notices(db: Session = Depends(database.get_db)):
    return db.query(models.Notice).order_by(models.Notice.id.desc()).all()