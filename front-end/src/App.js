import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import TripPlanningPage from './pages/TripPlanningPage';
import MapPage from './pages/MapPage'; // Updated for MapPage feature ✅
import BudgetPage from './pages/BudgetPage';
import WeatherPage from './pages/WeatherPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'trips':
        return <TripPlanningPage />;
      case 'map':
        return <MapPage />; // Updated for MapPage feature ✅
      case 'budget':
        return <BudgetPage />;
      case 'weather':
        return <WeatherPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
