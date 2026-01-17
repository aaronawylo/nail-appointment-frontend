import React, { useEffect, useState } from 'react';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import Login from './components/Login';
import { handleRedirect, isAuthenticated } from './auth'; // Import your auth helpers
import './styles.css';

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('id_token'); 
    if (!token) return;

    setLoadingAppointments(true);
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

      const data = await response.json();
      // Ensure we set an empty array if data.appointments is missing
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check if we just arrived back from Cognito with a ?code=...
      const codeExchanged = await handleRedirect();
      
      // 2. Check if we are logged in (either just now or from a previous session)
      if (codeExchanged || isAuthenticated()) {
        setLoggedIn(true);
        fetchAppointments();
      }
    };

    initAuth();
  }, []);

  return (
    <div className="app-container">
      {!loggedIn ? (
        <Login setLoggedIn={setLoggedIn} />
      ) : (
        <>
          <h1>💅 Nail Appointment Scheduler</h1>
          
          <AppointmentForm
            onNewAppointment={(appt) => {
              // Only add to state if the object has the required 'appointmentTime' property
              if (appt && appt.appointmentTime) {
                setAppointments((prev) => [...prev, appt]);
              } else {
                // If the response is malformed, refresh the whole list from DynamoDB
                fetchAppointments();
              }
            }}
          />

          {loadingAppointments ? (
            <div className="spinner">
              <p>Loading your appointments...</p>
            </div>
          ) : (
            <AppointmentList appointments={appointments} />
          )}
        </>
      )}
    </div>
  );
};

export default App;