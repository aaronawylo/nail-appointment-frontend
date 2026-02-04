import React, { useEffect, useState } from 'react';
import { getAllAppointments, deleteAppointment } from '../api';

const AdminDashboard = () => {
  const [allAppts, setAllAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    getAllAppointments()
      .then(data => setAllAppts(data.appointments || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (userId, time) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await deleteAppointment(userId, time);
      alert("Appointment removed.");
      loadData();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>Admin Master Schedule 👑</h2>
      
      {loading ? <p>Loading schedule...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {allAppts.length === 0 ? <p>No bookings found.</p> : (
            allAppts.map((appt, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '15px', 
                backgroundColor: '#f9f9f9', 
                borderRadius: '8px',
                borderLeft: '5px solid #d4a5a5'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {appt.userName || "Unknown Customer"}
                  </div>
                  <div style={{ color: '#666' }}>
                    {new Date(appt.appointmentTime).toLocaleString([], { 
                        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(appt.userId, appt.appointmentTime)}
                  style={{
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;