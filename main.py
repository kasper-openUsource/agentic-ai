from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
import uvicorn

# Database setup
DATABASE_URL = "sqlite:///./hunting_fishing.db"
gine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
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
    weight: float = None
    location: str
    date_caught: datetime
    equipment: str
    notes: str = None

class CatchUpdate(BaseModel):
    species: str = None
    weight: float = None
    location: str = None
    date_caught: datetime = None
    equipment: str = None
    notes: str = None

class CatchResponse(BaseModel):
    id: int
    species: str
    catch_type: str
    weight: float = None
    location: str
    date_caught: datetime
    equipment: str
    notes: str = None
    created_at: datetime

    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI(title="Hunting & Fishing Database", version="1.0.0")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.post("/catches", response_model=CatchResponse)
def create_catch(catch: CatchCreate, db: Session = Depends(get_db)):
    db_catch = Catch(**catch.dict())
    db.add(db_catch)
    db.commit()
    db.refresh(db_catch)
    return db_catch

@app.get("/catches", response_model=list[CatchResponse])
def get_all_catches(db: Session = Depends(get_db), catch_type: str = None):
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
    
    update_data = catch_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(catch, field, value)
    
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
    return {"message": "Catch deleted successfully"}

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_catches = db.query(Catch).count()
    hunting_catches = db.query(Catch).filter(Catch.catch_type == "hunting").count()
    fishing_catches = db.query(Catch).filter(Catch.catch_type == "fishing").count()
    
    return {
        "total_catches": total_catches,
        "hunting": hunting_catches,
        "fishing": fishing_catches
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)