import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
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

// 🔒 Only allow logged-in users
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

// 🚪 Only allow logged-out users (login/register)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageParams, setPageParams] = useState({});
  const { login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    // userData shape: { user, token }
    if (userData.user && userData.token) {
      login(userData.user, userData.token);
      setCurrentPage("home");
      navigate("/"); // after login/registration, go to Home
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("home");
    navigate("/login"); // after logout, go to login
  };

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);

    if (page === "home") {
      navigate("/");
    } else if (page === "trips") {
      navigate("/trips");
    } else if (page === "map") {
      navigate("/map");
    } else if (page === "budget") {
      navigate("/budget");
    } else if (page === "weather") {
      navigate("/weather");
    } else if (page === "reminders") {
      navigate("/reminders");
    } else if (page === "login") {
      navigate("/login");
    } else if (page === "register") {
      navigate("/register");
    } else if (page === "profile") {
      navigate("/profile");
    }
  };

  // Keep currentPage in sync with the URL
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setCurrentPage("home");
    } else if (path.startsWith("/share/")) {
      setCurrentPage("share");
    } else if (path === "/trips") {
      setCurrentPage("trips");
    } else if (path === "/map") {
      setCurrentPage("map");
    } else if (path === "/budget") {
      setCurrentPage("budget");
    } else if (path === "/weather") {
      setCurrentPage("weather");
    } else if (path === "/reminders") {
      setCurrentPage("reminders");
    } else if (path === "/login") {
      setCurrentPage("login");
    } else if (path === "/register") {
      setCurrentPage("register");
    } else if (path === "/profile") {
      setCurrentPage("profile");
    }
  }, [location]);

  return (
    <div className="App">
      {/* Hide nav on share links */}
      {!location.pathname.startsWith("/share/") && (
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
      <main className="main-content">
        <Routes>
          {/* Public-only routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage
                  onLogin={handleLogin}
                  onNavigateRegister={() => handleNavigate("register")}
                />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegistrationPage
                  onRegister={handleLogin}
                  onNavigateLogin={() => handleNavigate("login")}
                />
              </PublicRoute>
            }
          />

          {/* Protected routes (require login) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <TripPlanningPage initialTripId={pageParams.tripId} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <RemindersPage onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <BudgetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weather"
            element={
              <ProtectedRoute>
                <WeatherPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage
                  onLogout={handleLogout}
                  onNavigate={(page) => handleNavigate(page)}
                />
              </ProtectedRoute>
            }
          />

          {/* Share route — keeps working without login */}
          <Route path="/share/:tripId" element={<ShareTripPageWrapper />} />
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
