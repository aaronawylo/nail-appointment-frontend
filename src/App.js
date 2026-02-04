import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { handleRedirect, isAuthenticated, isAdmin } from './auth';
import { getAppointments } from './api';
import NailGallery from './components/NailGallery';
import './styles.css';

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
      const initAuth = async () => {
        const codeExchanged = await handleRedirect();
        
        if (codeExchanged || isAuthenticated()) {
          try {
            setLoggedIn(true);
            setUserIsAdmin(isAdmin());
            
            // Load data
            const data = await getAppointments();
            setAppointments(data.appointments || []);
          } catch (err) {
            if (err.message === "UNAUTHORIZED") {
              setLoggedIn(false);
            } else {
              console.error("Failed to load appointments:", err);
            }
          }
        }
      };
      initAuth();
    }, []);

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />;

  const handleLogout = () => {
    localStorage.removeItem('id_token');
    setLoggedIn(false);
    setUserIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app-container">
        {/* Banner / Navbar */}
        <nav className="navbar">
          <div className="nav-logo">🌸 Nail Magic</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/schedule" className="nav-link">Book Now</Link>
            <Link to="/my-appointments" className="nav-link">My Bookings</Link>
            {userIsAdmin && <Link to="/admin" className="nav-link admin-link">Admin View 👑</Link>}
            
            {/* The Logout Button */}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="home-page">
              <h1>Welcome to the Salon 🌺</h1>
              <p>Experience the magic of beautiful nails.</p>
              <Link to="/schedule"><button>Start Booking</button></Link>
            </div>
          } />
          
          <Route path="/gallery" element={<NailGallery />} />

          <Route path="/schedule" element={
            <AppointmentForm onNewAppointment={(appt) => setAppointments([...appointments, appt])} />
          } />

          <Route path="/my-appointments" element={
            <AppointmentList appointments={appointments} />
          } />

          {userIsAdmin && (
            <Route path="/admin" element={
              <div className="admin-page">
                <h1>Admin Dashboard 👑</h1>
                <p>All client appointments across the salon appear here.</p>
                <AdminDashboard />
              </div>
            } />
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;