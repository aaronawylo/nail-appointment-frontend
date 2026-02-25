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
    <div className="admin-container">
      <h2>Admin Master Schedule</h2>

      {loading ? <p>Loading schedule...</p> : (
        <div className="admin-list">
          {allAppts.length === 0 ? <p>No bookings found.</p> : (
            allAppts.map((appt, index) => (
              <div key={index} className="admin-appt-card">
                <div className="admin-appt-info">
                  <div className="customer-name">
                    {appt.userName || "Unknown Customer"}
                  </div>
                  <div className="appt-time">
                    {new Date(appt.appointmentTime).toLocaleString([], {
                      weekday: 'short', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(appt.userId, appt.appointmentTime)}
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