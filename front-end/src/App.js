import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import TripPlanningPage from "./pages/TripPlanningPage";
import ShareTripPage from "./pages/ShareTripPage";
import RemindersPage from "./pages/RemindersPage";
import MapPage from "./pages/MapPage";
import BudgetPage from "./pages/BudgetPage";
import WeatherPage from "./pages/WeatherPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import { BudgetProvider } from "./context/BudgetContext";
import { TripsProvider } from "./context/TripContext";
import { RemindersProvider } from "./context/RemindersContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageParams, setPageParams] = useState({});
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    if (userData.user && userData.token) {
      login(userData.user, userData.token);
      setCurrentPage("profile");
      navigate('/profile');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("home");
    navigate('/');
  };

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    
    // Update URL using React Router
    if (page === 'home') {
      navigate('/');
    } else if (page === 'trips') {
      if (params.tripId) {
        // Navigate to trips page - the tripId will be passed via pageParams
        navigate('/trips');
      } else {
        navigate('/trips');
      }
    } else if (page === 'map') {
      navigate('/map');
    } else if (page === 'budget') {
      navigate('/budget');
    } else if (page === 'weather') {
      navigate('/weather');
    } else if (page === 'reminders') {
      navigate('/reminders');
    } else if (page === 'login') {
      navigate('/login');
    } else if (page === 'register') {
      navigate('/register');
    } else if (page === 'profile') {
      navigate('/profile');
    }
  };

  // Update currentPage based on location
  React.useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrentPage('home');
    } else if (path.startsWith('/share/')) {
      setCurrentPage('share');
    } else if (path === '/trips') {
      setCurrentPage('trips');
    } else if (path === '/map') {
      setCurrentPage('map');
    } else if (path === '/budget') {
      setCurrentPage('budget');
    } else if (path === '/weather') {
      setCurrentPage('weather');
    } else if (path === '/reminders') {
      setCurrentPage('reminders');
    } else if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/register') {
      setCurrentPage('register');
    } else if (path === '/profile') {
      setCurrentPage('profile');
    }
  }, [location]);

  return (
    <div className="App">
      {!location.pathname.startsWith('/share/') && (
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/trips" element={<TripPlanningPage initialTripId={pageParams.tripId} />} />
          <Route path="/share/:tripId" element={<ShareTripPageWrapper />} />
          <Route path="/reminders" element={<RemindersPage onNavigate={handleNavigate} />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} onNavigateRegister={() => setCurrentPage("register")} />} />
          <Route path="/register" element={<RegistrationPage onRegister={handleLogin} onNavigateLogin={() => setCurrentPage("login")} />} />
          <Route path="/profile" element={<ProfilePage onLogout={handleLogout} onNavigate={(page) => handleNavigate(page)} />} />
        </Routes>
      </main>
    </div>
  );
}

function ShareTripPageWrapper() {
  const { tripId } = useParams();
  return <ShareTripPage tripId={tripId} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripsProvider>
          <BudgetProvider>
            <RemindersProvider>
              <AppContent />
            </RemindersProvider>
          </BudgetProvider>
        </TripsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;