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
   > **Note:** Get .env files from discord channel: fishy

4. **Run the backend server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will start on `http://143.198.20.180:3001`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd front-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `front-end` directory
> **Note:** Get .env files from discord channel: fishy


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
http://143.198.20.180:3001
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
