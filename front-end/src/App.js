import React, { useState } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import TripPlanningPage from './pages/TripPlanningPage';
import MapPage from './pages/MapPage';
import BudgetPage from './pages/BudgetPage';
import WeatherPage from './pages/WeatherPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('profile');
  };

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
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
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
