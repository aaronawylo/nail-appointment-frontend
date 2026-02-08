import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppointmentForm from './components/AppointmentForm';
import MyAppointments from './components/MyAppointments'; // Updated component
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { handleRedirect, isAuthenticated, isAdmin, getUserName } from './auth'; // Added getUserName
import { getAppointments } from './api';
import NailGallery from './components/NailGallery';
import './styles.css';

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [userName, setUserName] = useState(""); // New state for the name

  useEffect(() => {
    const initAuth = async () => {
      const codeExchanged = await handleRedirect();
      
      if (codeExchanged || isAuthenticated()) {
        try {
          setLoggedIn(true);
          setUserIsAdmin(isAdmin());
          setUserName(getUserName()); // Set the name from the token
          
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
    localStorage.removeItem('access_token');
    setLoggedIn(false);
    setUserIsAdmin(false);
    setUserName("");
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-logo">Nail Salon</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/schedule" className="nav-link">Book Now</Link>
            <Link to="/my-appointments" className="nav-link">My Bookings</Link>
            {userIsAdmin && <Link to="/admin" className="nav-link admin-link">Admin</Link>}
            
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="home-page">
              {/* Added the dynamic name greeting here */}
              <h1>Welcome to the Nail Salon{userName ? `, ${userName}` : ''} 🌺</h1>
              <p>Experience the magic of beautiful nails.</p>
              <Link to="/schedule"><button className="primary-button">Start Booking</button></Link>
            </div>
          } />
          
          <Route path="/gallery" element={<NailGallery />} />

          <Route path="/schedule" element={
            <AppointmentForm onNewAppointment={() => {
              getAppointments().then(data => setAppointments(data.appointments || []));
            }} />
          } />

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