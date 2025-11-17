# TripMate Frontend

## Setup Instructions

1. Navigate to the front-end directory:
```bash
cd front-end
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js
│   ├── Navigation.js
│   ├── Footer.js
│   ├── MapComponent.js
│   ├── TripCard.js
│   ├── BudgetTracker.js
│   └── WeatherWidget.js
├── pages/              # Page components
│   ├── HomePage.js
│   ├── TripPlanningPage.js
│   ├── MapPage.js
│   ├── BudgetPage.js
│   ├── WeatherPage.js
│   ├── LoginPage.js
│   └── RegisterPage.js
├── context/            # React Context providers
│   └── AppContext.js
├── utils/              # Utility functions
│   ├── helpers.js
│   ├── api.js
│	└── mapApi.js
├── App.js              # Main App component
├── App.css             # App styles
├── index.js            # React entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)
