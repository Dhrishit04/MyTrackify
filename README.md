# MyTrackify — Campus Placement Intelligence Platform

> A knowledge retention and analytics system that prevents placement preparation intelligence from vanishing when seniors graduate.

## Project Structure

```
MyTrackify/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level page components
│   │   ├── services/     # API service layer (currently mock data)
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript type definitions
│   └── ...
├── backend/           # Spring Boot 3.2 + Java 17
│   ├── src/main/java/com/mytrackify/
│   │   ├── controller/   # REST API controllers
│   │   ├── service/      # Business logic
│   │   ├── repository/   # JPA repositories
│   │   ├── entity/       # JPA entities
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── security/     # JWT authentication
│   │   ├── config/       # Spring configuration
│   │   └── exception/    # Error handling
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/  # Flyway SQL migrations
└── CAMPUS_PLACEMENT_INTELLIGENCE_PLATFORM.md  # Full specification
```

## Quick Start

### Frontend (currently runs with mock data — no backend needed)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend (requires Java 17 + Maven)

```bash
cd backend
./mvnw spring-boot:run
# API available at http://localhost:8080
```

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Backend   | Spring Boot 3.2, Java 17, Spring Data JPA, Spring Security |
| Database  | PostgreSQL 15+ (H2 for development) |
| Auth      | JWT (BCrypt password hashing)      |

## Current Status

- ✅ Frontend — Complete with mock data (all MVP pages functional)
- ✅ Backend — Project structure with entities, controllers, services ready
- ⏳ Database — PostgreSQL setup pending (using H2 in-memory for dev)
- ⏳ API Integration — Wire frontend to real backend APIs

## Features

- **Dashboard** — Application stats, charts, recent activity
- **Company Library** — Search/filter companies, view processes & experiences
- **Log Experience** — Multi-step form for logging interview experiences
- **Analytics** — Readiness calculator, skill radar, cohort comparison
- **Profile** — Student profile with coding stats and application history

## License

MIT
