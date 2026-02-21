# agentic-ai

A collection of AI-assisted projects and experiments.

## Projects

### Hunting & Fishing Database API

A REST API for tracking hunting and fishing catches with detailed information about what you caught/shot, when, where, and with what equipment.

**Tech Stack:**
- FastAPI (Python web framework)
- SQLite (database)
- SQLAlchemy (ORM)
- Pydantic (data validation)

**Getting Started:**

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the API:**
   ```bash
   python main.py
   ```

3. **Access the API:**
   - API runs on: `http://localhost:8000`
   - Interactive docs: `http://localhost:8000/docs`
   - Alternative docs: `http://localhost:8000/redoc`

**Database Schema:**

Each catch record includes:
- `species` - What you caught/shot (e.g., "Trout", "Deer", "Bass")
- `catch_type` - Type of activity: "hunting" or "fishing"
- `weight` - Weight in pounds/kg (optional)
- `location` - Where you caught it
- `date_caught` - Date and time of the catch
- `equipment` - What you used (e.g., "12-gauge shotgun", "Fly rod with size 12 fly")
- `notes` - Additional details about the catch
- `created_at` - When the record was created

**API Endpoints:**

- `POST /catches` - Log a new catch
- `GET /catches` - Get all catches (with optional `?catch_type=hunting` or `?catch_type=fishing` filter)
- `GET /catches/{catch_id}` - Get a specific catch record
- `PUT /catches/{catch_id}` - Update a catch record
- `DELETE /catches/{catch_id}` - Delete a catch record
- `GET /stats` - Get summary statistics (total catches, hunting vs fishing breakdown)

**Example Usage:**

Log a fishing catch:
```bash
curl -X POST "http://localhost:8000/catches" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "Rainbow Trout",
    "catch_type": "fishing",
    "weight": 2.5,
    "location": "Mountain River",
    "date_caught": "2026-02-21T14:30:00",
    "equipment": "Fly rod with size 12 nymph",
    "notes": "Caught in the morning run, released for conservation"
  }'
```

Log a hunting catch:
```bash
curl -X POST "http://localhost:8000/catches" \
  -H "Content-Type: application/json" \
  -d '{
    "species": "White-tailed Deer",
    "catch_type": "hunting",
    "weight": 185,
    "location": "North Ridge Forest",
    "date_caught": "2026-02-20T06:45:00",
    "equipment": "30-06 rifle with Leupold scope",
    "notes": "Buck with 8-point rack"
  }'
```

Get all catches:
```bash
curl "http://localhost:8000/catches"
```

Get only fishing catches:
```bash
curl "http://localhost:8000/catches?catch_type=fishing"
```

Get statistics:
```bash
curl "http://localhost:8000/stats"
```

Update a catch:
```bash
curl -X PUT "http://localhost:8000/catches/1" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Updated notes about this catch"}'
```

Delete a catch:
```bash
curl -X DELETE "http://localhost:8000/catches/1"
```