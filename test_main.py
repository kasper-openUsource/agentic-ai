import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime

from main import app, Base, get_db, Catch

# Create a test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_hunting_fishing.db"
engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    """Create a test client with overridden database dependency."""
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)

class TestCreateCatch:
    """Test suite for creating catches."""
    
    @pytest.mark.unit
    def test_create_fishing_catch(self, client):
        """Test creating a fishing catch."""
        payload = {
            "species": "Rainbow Trout",
            "catch_type": "fishing",
            "weight": 2.5,
            "location": "Mountain River",
            "date_caught": "2026-02-21T14:30:00",
            "equipment": "Fly rod with size 12 nymph",
            "notes": "Caught in the morning run"
        }
        response = client.post("/catches", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["species"] == "Rainbow Trout"
        assert data["catch_type"] == "fishing"
        assert data["weight"] == 2.5

    @pytest.mark.unit
    def test_create_hunting_catch(self, client):
        """Test creating a hunting catch."""
        payload = {
            "species": "White-tailed Deer",
            "catch_type": "hunting",
            "weight": 185,
            "location": "North Ridge Forest",
            "date_caught": "2026-02-20T06:45:00",
            "equipment": "30-06 rifle with Leupold scope",
            "notes": "Buck with 8-point rack"
        }
        response = client.post("/catches", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["species"] == "White-tailed Deer"
        assert data["catch_type"] == "hunting"

class TestGetCatches:
    """Test suite for retrieving catches."""  
    
    @pytest.mark.integration
    def test_get_all_catches(self, client):
        """Test retrieving all catches."""
        payload = {
            "species": "Bass",
            "catch_type": "fishing",
            "weight": 3.0,
            "location": "Lake",
            "date_caught": "2026-02-21T10:00:00",
            "equipment": "Spinner",
            "notes": "Test catch"
        }
        client.post("/catches", json=payload)
        
        response = client.get("/catches")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1

    @pytest.mark.integration
    def test_get_specific_catch(self, client):
        """Test retrieving a specific catch by ID."""
        payload = {
            "species": "Salmon",
            "catch_type": "fishing",
            "weight": 5.0,
            "location": "River",
            "date_caught": "2026-02-21T10:00:00",
            "equipment": "Net",
            "notes": "Test"
        }
        create_response = client.post("/catches", json=payload)
        catch_id = create_response.json()["id"]
        
        response = client.get(f"/catches/{catch_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == catch_id
        assert data["species"] == "Salmon"

    @pytest.mark.integration
    def test_get_nonexistent_catch(self, client):
        """Test retrieving a catch that doesn't exist."""
        response = client.get("/catches/99999")
        assert response.status_code == 404

class TestUpdateCatch:
    """Test suite for updating catches."""  
    
    @pytest.mark.integration
    def test_update_catch(self, client):
        """Test updating a catch."""
        payload = {
            "species": "Trout",
            "catch_type": "fishing",
            "weight": 2.0,
            "location": "Stream",
            "date_caught": "2026-02-21T10:00:00",
            "equipment": "Fly rod",
            "notes": "Original notes"
        }
        create_response = client.post("/catches", json=payload)
        catch_id = create_response.json()["id"]
        
        update_payload = {
            "weight": 2.5,
            "notes": "Updated notes"
        }
        response = client.put(f"/catches/{catch_id}", json=update_payload)
        assert response.status_code == 200
        data = response.json()
        assert data["weight"] == 2.5
        assert data["notes"] == "Updated notes"

class TestDeleteCatch:
    """Test suite for deleting catches."""
    
    @pytest.mark.integration
    def test_delete_catch(self, client):
        """Test deleting a catch."""
        payload = {
            "species": "Bass",
            "catch_type": "fishing",
            "weight": 3.0,
            "location": "Lake",
            "date_caught": "2026-02-21T10:00:00",
            "equipment": "Lure",
            "notes": "Test"
        }
        create_response = client.post("/catches", json=payload)
        catch_id = create_response.json()["id"]
        
        response = client.delete(f"/catches/{catch_id}")
        assert response.status_code == 200
        
        get_response = client.get(f"/catches/{catch_id}")
        assert get_response.status_code == 404

class TestStats:
    """Test suite for statistics endpoint."""
    
    @pytest.mark.integration
    def test_get_stats(self, client):
        """Test retrieving statistics."""
        fishing_payload = {
            "species": "Trout",
            "catch_type": "fishing",
            "weight": 2.5,
            "location": "River",
            "date_caught": "2026-02-21T10:00:00",
            "equipment": "Fly rod",
            "notes": "Test"
        }
        hunting_payload = {
            "species": "Deer",
            "catch_type": "hunting",
            "weight": 150,
            "location": "Forest",
            "date_caught": "2026-02-21T06:00:00",
            "equipment": "Rifle",
            "notes": "Test"
        }
        
        client.post("/catches", json=fishing_payload)
        client.post("/catches", json=hunting_payload)
        
        response = client.get("/stats")
        assert response.status_code == 200
        data = response.json()
        assert data["total_catches"] >= 2
        assert data["hunting"] >= 1
        assert data["fishing"] >= 1