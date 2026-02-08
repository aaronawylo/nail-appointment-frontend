import React, { useEffect, useState } from 'react';
import { getAppointments } from '../api';

const MyAppointments = () => {
  const [myAppts, setMyAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointments()
      .then(data => setMyAppts(data.appointments || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
      <h3>My Scheduled Sessions ✨</h3>
      {loading ? <p>Loading...</p> : (
        myAppts.length === 0 ? <p>You have no upcoming appointments.</p> : (
          myAppts.map((appt, i) => (
            <div key={i} style={{ 
              padding: '15px', 
              marginBottom: '10px', 
              background: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #d4a5a5' 
            }}>
              <strong>{new Date(appt.appointmentTime).toLocaleDateString()}</strong> at {new Date(appt.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Service: {appt.service}</div>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default MyAppointments;