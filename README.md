# TripMate – Your Smart Travel Companion

### Product Vision Statement

TripMate simplifies travel planning by bringing **hotels, food, transport, weather, and budgeting** into a single interactive map.  
No more switching between five apps — plan, explore, and track your trips in one place.

---

## Project Overview

**TripMate** is a full-stack web application that helps travelers:

- Plan trips day-by-day
- Visualize destinations on a map
- Track budgets and expenses
- Preview weather forecasts
- (Bonus) Save photos and memories on a “Memory Map”

---

## Team

* [Juno Cheung](https://github.com/avacheungx)
* [Jessy Wang](https://github.com/jwang9500)
* [Ahmmed Razee](https://github.com/ErazeerHead04)
* [Sejona Sujit Das](https://github.com/sejonasdas) 
* [Amy Liao](https://github.com/agile-students-fall2025/4-final-fishy/commits?author=Amyliao0) 

## How TripMate Started

TripMate began during our Agile Development course as a project to practice **Scrum methodology** and full-stack collaboration.  
The concept evolved from early brainstorming around travel apps and personal trackers — we chose TripMate to combine both ideas.

We’re currently in **Sprint 0**, focusing on research, wireframes, and environment setup.

## Tech Stack

**Frontend:** React.js

**Backend:** Node.js + Express  

**Database:** MongoDB  

**APIs:** Google Maps, OpenWeather, Currency API  

**Version Control:** Git + GitHub Project Boards  

## How to Contribute

We welcome collaboration! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for full details on:

- Team norms and coding conventions
- Branch and PR workflow
- How to set up your local environment
- How to submit and review pull requests

## Build & Run Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd back-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `back-end` directory:
   ```env
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   PORT=4000
   ```
   > **Note:** Get your OpenWeather API key from [openweathermap.org](https://openweathermap.org/api)

4. **Run the backend server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will start on `http://localhost:4000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd front-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

### Running Both Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd back-end
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd front-end
npm start
```

## Backend API

### Base URL
```
http://localhost:4000
```

### API Endpoints

#### Health Check
- `GET /` - Health check endpoint

#### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get a specific trip
- `POST /api/trips` - Create a new trip
- `PUT /api/trips/:id` - Update a trip (supports partial updates)
- `DELETE /api/trips/:id` - Delete a trip

#### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get a specific user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

#### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create a new budget
- `PATCH /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget
- `POST /api/budgets/:id/expenses` - Add an expense to a budget
- `DELETE /api/budgets/:id/expenses/:expenseId` - Delete an expense

#### Map Locations
- `GET /api/map/locations` - Get all locations
- `POST /api/map/locations` - Create a new location
- `PUT /api/map/locations/:id` - Update a location
- `DELETE /api/map/locations/:id` - Delete a location
- `POST /api/map/locations/:id/tasks` - Add a task to a location
- `PUT /api/map/locations/:id/tasks/:taskId` - Update a task
- `DELETE /api/map/locations/:id/tasks/:taskId` - Delete a task

#### Weather
- `GET /api/weather/:location` - Get current weather and 5-day forecast
- `GET /api/weather/current/:location` - Get current weather only
- `GET /api/weather/forecast/:location` - Get 5-day forecast only

## Testing

### Backend Testing

The backend uses both **Vitest** and **Mocha** for testing:

```bash
cd back-end

# Run Vitest tests
npm test
npm run test:watch

# Run Mocha tests
npm run test:mocha
npm run test:mocha:watch

# Run tests with coverage
npm run test:cov
npm run coverage:mocha
```

### Frontend Testing

```bash
cd front-end
npm test
```

## Docker Deployment

### Quick Start

1. **Set up environment variables:**
   ```bash
   cp back-end/.env.example back-end/.env
   cp front-end/.env.example front-end/.env
   # Edit .env files with your API keys
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:4001
   - Health Check: http://localhost:4001/api/health

   **Note:** Ports 3001 and 4001 are used to avoid conflicts with local development servers.

### Common Commands

- **View logs:** `docker-compose logs -f`
- **Stop services:** `docker-compose down`
- **Rebuild:** `docker-compose up -d --build`

### Using MongoDB Atlas

To use MongoDB Atlas instead of the local container, update `back-end/.env` with your Atlas connection string and remove the `mongodb` service from `docker-compose.yml`.

## CI/CD

This project uses GitHub Actions for Continuous Integration and Continuous Deployment.

### Continuous Integration (CI)

The CI workflow (`.github/workflows/ci.yml`) automatically runs on every push and pull request:

- **Backend Tests:** Runs Vitest and Mocha test suites
- **Frontend Build:** Builds the React application to verify it compiles
- **Docker Build:** Tests that Docker images build successfully

View CI status in the "Actions" tab on GitHub.

### Continuous Deployment (CD)

The CD workflow (`.github/workflows/cd.yml`) automatically deploys to DigitalOcean when code is pushed to `master` or `main`.

**Setup Requirements:**

1. Add GitHub Secrets in repository settings (Settings → Secrets and variables → Actions):
   - `DROPLET_HOST` - Your DigitalOcean droplet IP address
   - `DROPLET_USER` - SSH username (usually `root`)
   - `DROPLET_SSH_KEY` - Private SSH key for authentication
   - `REACT_APP_API_URL` - Production API URL
   - `REACT_APP_GOOGLE_MAPS_API_KEY` - Google Maps API key
   - `REACT_APP_UNSPLASH_ACCESS_KEY` - Unsplash API key (optional)

2. On your DigitalOcean droplet, set up the repository:
   ```bash
   git clone <your-repo-url> /opt/tripmate
   cd /opt/tripmate
   cp back-end/.env.example back-end/.env
   cp front-end/.env.example front-end/.env
   # Edit .env files with production values
   ```

**Note:** If secrets are not configured, the CD workflow will build images but skip deployment, providing instructions for manual setup.

## Deployment

TripMate is deployed on DigitalOcean

### Live Application

🌐 **Frontend**: http://143.198.20.180:3001

🔌 **Backend API**: http://143.198.20.180:4001
- Health Check: http://143.198.20.180:4001/api/health

