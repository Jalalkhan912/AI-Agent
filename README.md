# AI Agent (FastAPI CSV + General Assistant)

A FastAPI backend that supports **two chat modes**:

1. **General assistant mode** (no dataset required)
2. **CSV data-analysis mode** (upload a dataset and ask analysis questions)

When a CSV is uploaded, the agent can generate SQL queries, analyze results, and create chart images that are served via static URLs.

## Features

- Dual-mode chat workflow:
  - General Q&A with no upload
  - Data-aware analysis when a session has an uploaded CSV
- CSV upload endpoint with per-session storage
- SQL-based lookup over uploaded CSVs using DuckDB
- LLM-driven analysis and visualization code generation
- Chart image generation with Matplotlib and static serving at `/charts/*`
- Session management endpoints (create, inspect, delete)

## Tech Stack

- **API**: FastAPI + Pydantic
- **Data**: Pandas + DuckDB
- **LLM**: OpenAI Chat Completions API
- **Viz**: Matplotlib
- **Server**: Uvicorn

## Project Structure

```text
.
├── fastapi_agent_main.py   # Main FastAPI app and agent/tool orchestration
├── helper.py               # Environment helper functions (API key loading)
├── pyproject.toml          # Project metadata and dependencies
├── uploaded_datasets/      # Uploaded CSV files (runtime)
├── generated_charts/       # Generated chart images (runtime)
├── data/                   # Sample data files
├── images/                 # Architecture / demo images
└── Front-end/              # Front-end assets (zipped demo UI)
```

## Prerequisites

- Python **3.13+**
- An OpenAI API key

## Setup

1. Install dependencies (choose one):

   ```bash
   uv sync
   ```

   or

   ```bash
   pip install -e .
   ```

2. Add environment variables to a `.env` file in the repo root:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Run the API server:

   ```bash
   uvicorn fastapi_agent_main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Overview

Base URL (local): `http://localhost:8000`

### `GET /`
Returns service metadata and available endpoints.

### `POST /session/create`
Create a general conversation session (no dataset).

### `POST /upload`
Upload a CSV file and receive a `session_id` bound to that dataset.

- Form field: `file` (must end in `.csv`)

### `POST /chat`
Send a message to the agent.

Request body:

```json
{
  "session_id": "optional-session-id",
  "message": "your question"
}
```

Behavior:
- If `session_id` belongs to a dataset session → `mode: "data_analysis"`
- If omitted/unknown → `mode: "general"`

### `GET /session/{session_id}`
Get dataset session metadata (filename, columns, row count).

### `DELETE /session/{session_id}`
Delete a session and remove associated uploaded file.

## Example Usage

### 1) Create a general chat session

```bash
curl -X POST http://localhost:8000/session/create
```

### 2) Chat without data

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Explain overfitting in simple terms."}'
```

### 3) Upload a CSV

```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@data/Titanic-Dataset.csv"
```

### 4) Ask data questions (using returned `session_id`)

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id":"<SESSION_ID>","message":"Show survival rate by passenger class and include a chart."}'
```

If a visualization is generated, response includes chart URLs like:

```text
/charts/chart_<uuid>.png
```

Open in browser:

```text
http://localhost:8000/charts/chart_<uuid>.png
```

## Notes & Limitations

- Session storage is currently **in-memory** (`active_sessions` dict). Restarting the server clears active session state.
- Uploaded CSV and generated chart files are stored locally in runtime directories.
- Generated visualization code is produced by the model and executed dynamically; for production use, add strict sandboxing and validation.
- CORS is currently permissive (`allow_origins=["*"]`) and should be restricted in production.

## Future Improvements

- Persistent session/state storage (Redis/DB)
- Authentication and per-user isolation
- Safer chart-code execution pipeline
- Better query validation and guardrails
- Packaged frontend (instead of zip archive)

## License

No license file is currently included in this repository. Add one if you plan to distribute this project.
