import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import TripPlanningPage from './pages/TripPlanningPage';
import MapPage from './pages/MapPage';
import BudgetPage from './pages/BudgetPage';
import WeatherPage from './pages/WeatherPage';
import { BudgetProvider } from './context/BudgetContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'trips':
        return <TripPlanningPage />;
      case 'map':
        return <MapPage />;
      case 'budget':
        return <BudgetPage />;
      case 'weather':
        return <WeatherPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <BudgetProvider>
      <div className="App">
        <Navigation
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
        {renderPage()}
      </div>
    </BudgetProvider>
  );
}

export default App;
