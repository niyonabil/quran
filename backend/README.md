# Quran & Prayer Times Backend API

## Overview
Backend API built with NestJS for a comprehensive Quran reading and prayer times platform.

## Technologies
- **Framework**: NestJS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **External APIs**:
  - QuranPedia API for Quran content
  - AlAdhan API for prayer times

##  Installation

```bash
cd backend
npm install
```

## Environment Variables

Create `.env` file:
```env
DATABASE_URL="postgresql://postgres.avwdhirkpcavmpygooee:Roa0629605450@aws-1-eu-west-3.pooler.supabase.com:6543/postgres"
PORT=3000
JWT_SECRET="supersecretkey"
```

## Database Setup

### Option 1: Using Prisma
```bash
npx prisma db push
```

### Option 2: Manual SQL
Run `init_db.sql` in your Supabase SQL editor manually.

## Running the Server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
  }
  ```
- `POST /api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `GET /api/auth/profile` - Get profile (requires JWT)

### Quran (`/api/quran`)
- `GET /api/quran/surahs` - Get all surahs
- `GET /api/quran/surahs/:id` - Get specific surah
- `GET /api/quran/verses?surah=1&translation=en` - Get verses
- `GET /api/quran/search?q=bismillah&translation=en` - Search verses

### Prayer Times (`/api/prayer`)
- `GET /api/prayer/times/city?city=Mecca&country=SA&method=4` - By city
- `GET /api/prayer/times/coordinates?latitude=21.4225&longitude=39.8262&method=4` - By coordinates
- `GET /api/prayer/calendar?city=Mecca&country=SA&month=12&year=2025&method=4` - Monthly calendar

### User Data (`/api/user`) - All require JWT
- `POST /api/user/favorites` - Add favorite verse
  ```json
  {
    "surahNumber": 1,
    "ayahNumber": 1
  }
  ```
- `GET /api/user/favorites` - Get favorites
- `DELETE /api/user/favorites/:id` - Remove favorite
- `POST /api/user/reading-history` - Update reading position
- `GET /api/user/reading-history` - Get last read position
- `POST /api/user/prayer-settings` - Update prayer settings
  ```json
  {
    "calculationMethod": "4",
    "madhab": "Shafi",
    "latitude": 21.4225,
    "longitude": 39.8262
  }
  ```
- `GET /api/user/prayer-settings` - Get prayer settings

## Calculation Methods (AlAdhan)
- `0` - Shia Ithna-Ansari
- `1` - University of Islamic Sciences, Karachi
- `2` - Islamic Society of North America (ISNA)
- `3` - Muslim World League (MWL)
- `4` - Umm al-Qura, Makkah
- `5` - Egyptian General Authority of Survey
- `7` - Institute of Geophysics, University of Tehran

## Project Structure
```
backend/
├── prisma/
│   └── schema.prisma         # Prisma schema
├── src/
│   ├── auth/                 # Auth module
│   ├── quran/                # Quran module
│   ├── prayer/               # Prayer times module
│   ├── user/                 # User data module
│   ├── prisma.service.ts     # Prisma service
│   ├── app.module.ts         # Main app module
│   └── main.ts               # Entry point
├── init_db.sql               # Manual SQL script
└── .env                      # Environment variables
```

## Notes
- All endpoints support CORS for frontend access
- JWT tokens expire after 7 days
- API responses use standard HTTP status codes
- Prisma Client may have compatibility issues - use SQL script if needed
