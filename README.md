# FitMatch - Shark Tank Final Project

FitMatch is a full-stack outfit generator that combines the product idea of an AI outfit planner with the warm, curated styling of the FullyGrounded project. Users can generate looks based on occasion, weather, and closet items, then save, favorite, filter, and delete outfits.

## Features

- Semantic multi-page React frontend
- Responsive FullyGrounded-inspired design system
- Outfit generator form with text input, dropdowns, radio buttons, checkboxes, and validation
- Saved outfits table with sort, filter, favorite, and delete actions
- Image media and canvas media
- Express API with GET, POST, PUT, and DELETE routes
- SQLite database with `users` and `outfits` tables
- JWT authentication with hashed passwords
- Context API and localStorage persistence
- Frontend unit tests and backend API tests

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Context API

### Backend
- Node.js
- Express
- SQLite via better-sqlite3
- JWT
- bcryptjs

## Project Structure

```text
FitMatch_SharkTank_Project/
  frontend/
  backend/
  docs/
  README.md
```

## Local Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Backend default URL:

```text
http://localhost:3001
```

### 2. Frontend

Open a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

## Environment Variables

### backend/.env

```env
PORT=3001
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_this_with_a_long_random_secret
DATABASE_URL=./data/fitmatch.db
```

### frontend/.env

```env
VITE_API_URL=http://localhost:3001/api
```

## API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Outfits
- `POST /api/outfits/generate`
- `GET /api/outfits`
- `POST /api/outfits`
- `PUT /api/outfits/:id`
- `DELETE /api/outfits/:id`

## Testing

### Frontend tests

```bash
cd frontend
npm test
```

### Backend tests

```bash
cd backend
npm test
```

## Hosting

### Frontend
Deploy the `frontend` folder to Vercel or Netlify.

### Backend
Deploy the `backend` folder to Render or Railway.

### Important deployment note
Because this project uses SQLite, hosted free instances may lose local database data after redeploys or restarts. For class demonstration this is usually acceptable, but for a stronger deployment you should either:
- attach persistent disk storage on Render, or
- switch to PostgreSQL for production hosting.

## Demo Flow

1. Open the homepage
2. Go to Generator
3. Fill out the outfit form and generate a look
4. Save the outfit in guest mode or create an account
5. Log in and visit Saved Looks
6. Favorite, search, sort, and delete outfits

## Assignment Coverage

This project covers the final-project requirements for semantic HTML, CSS layout and styling, React state, Node routes, database CRUD, authentication, persistent state, testing, and deployment readiness.
