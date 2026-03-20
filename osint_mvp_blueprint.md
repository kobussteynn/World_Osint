# OSINT MVP Blueprint

## Goal
Build a safe MVP with:
- news ingestion
- claim extraction
- basic source scoring
- flight data overlay
- satellite imagery search/display
- airport and geospatial lookup
- event map + timeline

Excluded from MVP:
- CCTV aggregation
- person-level tracking
- foot-traffic surveillance
- automated binary truth judgments

## Stack
### Frontend
- React with JSX
- Vite
- React Router
- Leaflet for maps
- Axios for API calls

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL + PostGIS
- Celery or RQ later for background ingestion jobs

## Suggested repo layout
```text
osint-platform/
  frontend/
    src/
      components/
        MapView.jsx
        NewsFeed.jsx
        EventList.jsx
        SourceBadge.jsx
      pages/
        Dashboard.jsx
        EventDetail.jsx
        Sources.jsx
      services/
        api.js
      App.jsx
      main.jsx
  backend/
    app/
      api/
        routes/
          health.py
          news.py
          events.py
          flights.py
          imagery.py
          airports.py
      core/
        config.py
        database.py
      models/
        source.py
        article.py
        event.py
        claim.py
      schemas/
        news.py
        event.py
        flight.py
      services/
        news_ingest.py
        claim_extractor.py
        source_scoring.py
        geocoder.py
      main.py
    requirements.txt
```

## Phase 1
### Backend endpoints
- `GET /health`
- `GET /news`
- `GET /events`
- `GET /flights`
- `GET /imagery/search`
- `GET /airports`

### Frontend pages
- Dashboard
- Event detail
- Sources

## First database models
### Source
- id
- name
- domain
- credibility_score
- created_at

### Article
- id
- title
- url
- source_id
- published_at
- language
- content
- summary

### Event
- id
- title
- description
- latitude
- longitude
- confidence_score
- created_at

### Claim
- id
- article_id
- text
- status (`verified`, `unverified`, `likely_false`, `known_false`)
- evidence_notes

## Initial API contract
### `/news`
Returns a list of articles:
```json
[
  {
    "id": 1,
    "title": "Explosion reported near airport",
    "source": "Example News",
    "published_at": "2026-03-19T08:00:00Z",
    "summary": "Local media reported an explosion near the airport.",
    "location": "Example City"
  }
]
```

### `/events`
Returns geolocated events:
```json
[
  {
    "id": 101,
    "title": "Airport incident cluster",
    "latitude": -26.2041,
    "longitude": 28.0473,
    "confidence_score": 0.72,
    "article_count": 4
  }
]
```

## Build order
1. Create FastAPI backend with health and news endpoints
2. Create React frontend with dashboard and API client
3. Add map view and event markers
4. Add ingestion pipeline for articles
5. Add claim extraction and source scoring
6. Add flights and imagery providers

## First milestone
A dashboard that:
- loads articles from backend
- shows event markers on a map
- opens an event detail panel
- displays a confidence score and linked articles

