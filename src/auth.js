// src/auth.js
import React, { useEffect, useState } from 'react';

// Env variables
const CLIENT_ID = process.env.REACT_APP_COGNITO_CLIENT_ID;
const COGNITO_DOMAIN = process.env.REACT_APP_COGNITO_DOMAIN;
const REDIRECT_URI = process.env.REACT_APP_COGNITO_REDIRECT_URI;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Your Lambda API URL

const Auth = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Check if Cognito code is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      setUser({ code });
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  // Fetch appointments
  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${user.code}`,
        },
      });
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      alert('Could not fetch appointments. Check console.');
    }
  };

  const login = () => {
    const loginUrl = `https://${COGNITO_DOMAIN}/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    window.location.href = loginUrl;
  };

  const logout = () => {
    setUser(null);
    setAppointments([]);
    const logoutUrl = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${REDIRECT_URI}`;
    window.location.href = logoutUrl;
  };

  const bookAppointment = async () => {
    if (!user) return;
    const time = new Date().toISOString();
    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.code}`,
        },
        body: JSON.stringify({ appointmentTime: time }),
      });
      if (!res.ok) throw new Error('Failed to create appointment');
      alert(`Appointment booked at ${time}`);
      fetchAppointments();
    } catch (err) {
      console.error('Error creating appointment:', err);
      alert('Could not create appointment.');
    }
  };

  return (
    <div style={{
      padding: '3rem',
      maxWidth: '500px',
      margin: '2rem auto',
      textAlign: 'center',
      backgroundColor: '#ffe6f0',
      borderRadius: '25px',
      boxShadow: '0 0 20px #ff99cc',
      fontFamily: 'cursive',
    }}>
      <h1 style={{ color: '#ff3399', fontSize: '2.5rem', marginBottom: '1rem' }}>💅 Nail Appointment</h1>

      {user ? (
        <>
          <p style={{ color: '#cc0066', fontSize: '1.2rem' }}>You are logged in!</p>

          <button
            onClick={bookAppointment}
            style={{
              backgroundColor: '#ff99cc',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              border: 'none',
              margin: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Book Appointment
          </button>

          <button
            onClick={fetchAppointments}
            style={{
              backgroundColor: '#ff66aa',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              border: 'none',
              margin: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            View My Appointments
          </button>

          <button
            onClick={logout}
            style={{
              backgroundColor: '#ff3399',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              border: 'none',
              marginTop: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Logout
          </button>

          {appointments.length > 0 && (
            <div style={{ marginTop: '1rem', color: '#cc0066' }}>
              <h3>My Appointments:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {appointments.map((a, idx) => (
                  <li key={idx} style={{ backgroundColor: '#ffb3d9', margin: '0.3rem 0', padding: '0.5rem', borderRadius: '8px' }}>
                    {a.appointmentTime}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          <p style={{ color: '#cc0066', fontSize: '1.2rem' }}>Please log in to book an appointment.</p>
          <button
            onClick={login}
            style={{
              backgroundColor: '#ff99cc',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default Auth;
