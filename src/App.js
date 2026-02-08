import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import MyAppointments from './components/MyAppointments'; // Updated component
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
        <nav className="navbar">
          <div className="nav-logo">🌸 Nail Magic</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/schedule" className="nav-link">Book Now</Link>
            {/* Swapped AppointmentList for the new MyAppointments */}
            <Link to="/my-appointments" className="nav-link">My Bookings</Link>
            {userIsAdmin && <Link to="/admin" className="nav-link admin-link">Admin 👑</Link>}
            
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="home-page">
              <h1>Welcome to the Salon 🌺</h1>
              <p>Experience the magic of beautiful nails.</p>
              <Link to="/schedule"><button className="primary-button">Start Booking</button></Link>
            </div>
          } />
          
          <Route path="/gallery" element={<NailGallery />} />

          <Route path="/schedule" element={
            <AppointmentForm onNewAppointment={() => {
              // Refresh data when a new booking is made
              getAppointments().then(data => setAppointments(data.appointments || []));
            }} />
          } />

          {/* Using the new component that handles its own fetching/formatting */}
          <Route path="/my-appointments" element={<MyAppointments />} />

          {userIsAdmin && (
            <Route path="/admin" element={
              <div className="admin-page">
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