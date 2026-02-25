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
    <div className="my-appointments-container">
      <h3>My Scheduled Sessions</h3>
      {loading ? <p>Loading...</p> : (
        myAppts.length === 0 ? <p>You have no upcoming appointments.</p> : (
          myAppts.map((appt, i) => (
            <div key={i} className="appt-card">
              <div className="appt-card-date">
                <strong>{new Date(appt.appointmentTime).toLocaleDateString()}</strong>
                {' '}at {new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="appt-card-service">Service: {appt.service}</div>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default MyAppointments;