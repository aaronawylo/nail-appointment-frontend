import React from 'react';

const AppointmentList = ({ appointments }) => {
  // Helper function to turn a string into a readable date
  const formatDateTime = (dateString) => {
    try {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      const date = new Date(dateString);
      
      // Check if the date is actually valid before formatting
      return isNaN(date.getTime()) 
        ? dateString 
        : date.toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="appointment-list">
      <h2>Your Appointments</h2>
      
      {(!appointments || appointments.length === 0) ? (
        <p className="no-appointments">No appointments booked yet. ✨</p>
      ) : (
        <ul className="appointment-ul">
          {appointments.map((appt, index) => {
            if (!appt || !appt.appointmentTime) {
              console.warn("Found a malformed appointment at index:", index);
              return null;
            }

            return (
              <li key={index} className="appointment-item">
                <div className="appointment-details">
                  <span className="calendar-icon">📅</span>
                  <span className="appointment-time">
                    {formatDateTime(appt.appointmentTime)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AppointmentList;