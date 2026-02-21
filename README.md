# agentic-ai

A collection of AI-assisted projects and experiments.

## Projects

### Task Management API

A simple REST API for managing tasks with CRUD operations.

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

**API Endpoints:**

- `POST /tasks` - Create a new task
- `GET /tasks` - Get all tasks
- `GET /tasks/{task_id}` - Get a specific task
- `PUT /tasks/{task_id}` - Update a task
- `DELETE /tasks/{task_id}` - Delete a task

**Example Usage:**

Create a task:
```bash
curl -X POST "http://localhost:8000/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn FastAPI", "description": "Build a REST API with FastAPI"}'
```

Get all tasks:
```bash
curl "http://localhost:8000/tasks"
```

Update a task:
```bash
curl -X PUT "http://localhost:8000/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

Delete a task:
```bash
curl -X DELETE "http://localhost:8000/tasks/1"
```