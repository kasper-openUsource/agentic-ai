from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uvicorn

# Database setup
DATABASE_URL = "sqlite:///./hunting_fishing.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Model
class Catch(Base):
    __tablename__ = "catches"

    id = Column(Integer, primary_key=True, index=True)
    species = Column(String, index=True)
    catch_type = Column(String)  # "hunting" or "fishing"
    weight = Column(Float, nullable=True)
    location = Column(String)
    date_caught = Column(DateTime, default=datetime.utcnow)
    equipment = Column(String)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Pydantic Models
class CatchCreate(BaseModel):
    species: str
    catch_type: str  # "hunting" or "fishing"
    weight: Optional[float] = None
    location: str
    date_caught: datetime
    equipment: str
    notes: Optional[str] = None

class CatchUpdate(BaseModel):
    species: Optional[str] = None
    weight: Optional[float] = None
    location: Optional[str] = None
    date_caught: Optional[datetime] = None
    equipment: Optional[str] = None
    notes: Optional[str] = None

class CatchResponse(BaseModel):
    id: int
    species: str
    catch_type: str
    weight: Optional[float] = None
    location: str
    date_caught: datetime
    equipment: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI(title="Hunting & Fishing Database", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.post("/catches", response_model=CatchResponse)
def create_catch(catch: CatchCreate, db: Session = Depends(get_db)):
    db_catch = Catch(**catch.model_dump())
    db.add(db_catch)
    db.commit()
    db.refresh(db_catch)
    return db_catch

@app.get("/catches", response_model=list[CatchResponse])
def get_all_catches(db: Session = Depends(get_db), catch_type: Optional[str] = None):
    query = db.query(Catch)
    if catch_type:
        query = query.filter(Catch.catch_type == catch_type)
    return query.order_by(Catch.date_caught.desc()).all()

@app.get("/catches/{catch_id}", response_model=CatchResponse)
def get_catch(catch_id: int, db: Session = Depends(get_db)):
    catch = db.query(Catch).filter(Catch.id == catch_id).first()
    if not catch:
        raise HTTPException(status_code=404, detail="Catch not found")
    return catch

@app.put("/catches/{catch_id}", response_model=CatchResponse)
def update_catch(catch_id: int, catch_update: CatchUpdate, db: Session = Depends(get_db)):
    catch = db.query(Catch).filter(Catch.id == catch_id).first()
    if not catch:
        raise HTTPException(status_code=404, detail="Catch not found")
    update_data = catch_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(catch, key, value)
    db.commit()
    db.refresh(catch)
    return catch

@app.delete("/catches/{catch_id}")
def delete_catch(catch_id: int, db: Session = Depends(get_db)):
    catch = db.query(Catch).filter(Catch.id == catch_id).first()
    if not catch:
        raise HTTPException(status_code=404, detail="Catch not found")
    db.delete(catch)
    db.commit()
    return {"message": f"Catch {catch_id} deleted successfully"}

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(Catch).count()
    hunting = db.query(Catch).filter(Catch.catch_type == "hunting").count()
    fishing = db.query(Catch).filter(Catch.catch_type == "fishing").count()
    return {"total_catches": total, "hunting": hunting, "fishing": fishing}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)