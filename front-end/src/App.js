import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import TripPlanningPage from "./pages/TripPlanningPage";
import MapPage from "./pages/MapPage";
import BudgetPage from "./pages/BudgetPage";
import WeatherPage from "./pages/WeatherPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import { BudgetProvider } from "./context/BudgetContext";
import { TripsProvider } from "./context/TripContext";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageParams, setPageParams] = useState({});
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage("profile"); // go to profile page after login/registration
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("home");
  };

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "trips":
        return <TripPlanningPage initialTripId={pageParams.tripId} />;
      case "map":
        return <MapPage />;
      case "budget":
        return <BudgetPage />;
      case "weather":
        return <WeatherPage />;
      case "login":
        return <LoginPage onLogin={handleLogin} onNavigateRegister={() => setCurrentPage("register")} />;
      case "register":
        return <RegistrationPage onRegister={handleLogin} onNavigateLogin={() => setCurrentPage("login")} />;
      case "profile":
        return <ProfilePage user={user} onLogout={handleLogout} onClose={() => setCurrentPage("home")} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <TripsProvider>
      <BudgetProvider>
        <div className="App">
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} user={user} />
          <main className="main-content">{renderPage()}</main>
        </div>
      </BudgetProvider>
    </TripsProvider>
  );
}

export default App;