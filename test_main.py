import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import Fishing, Hunt

client = TestClient(app)

# Unit Tests for Database Models

def test_fishing_model():
    fishing = Fishing(name="Salmon", location="River")
    assert fishing.name == "Salmon"
    assert fishing.location == "River"


def test_hunt_model():
    hunt = Hunt(type="Deer", location="Forest")
    assert hunt.type == "Deer"
    assert hunt.location == "Forest"

# Integration Tests for API Endpoints

def test_get_fishings():
    response = client.get("/api/fishings")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_fishing():
    response = client.post("/api/fishings", json={"name": "Trout", "location": "Lake"})
    assert response.status_code == 201
    assert response.json()["name"] == "Trout"


def test_get_hunts():
    response = client.get("/api/hunts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_hunt():
    response = client.post("/api/hunts", json={"type": "Bear", "location": "Mountain"})
    assert response.status_code == 201
    assert response.json()["type"] == "Bear"