import React, { useState, useEffect } from 'react';
import { createAppointment, getPublicAvailability } from '../api';

const AppointmentForm = () => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // 1. Sync Logic
  const refreshBookings = () => {
    getPublicAvailability()
      .then(data => {
        const normalized = (data.bookedSlots || []).map(time => {
          const d = new Date(time);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        });
        setBookedSlots(normalized);
      })
      .catch(err => console.error("Sync error:", err));
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  // 2. The Booking Action
  const handleBook = async (time) => {
    const confirmDone = window.confirm(`Confirm booking for ${new Date(time).toLocaleTimeString()}?`);
    if (!confirmDone) return;

    setLoading(true);
    try {
      await createAppointment({ appointmentTime: time, service: "Nail Magic Session" });
      alert("Booking confirmed!");
      refreshBookings();
    } catch (err) {
      alert(`Booking failed: ${err.message}`);
      refreshBookings();
    } finally {
      setLoading(false);
    }
  };

  // 3. Define the hours you are open
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  return (
    <div className="booking-container">
      <h2>Book Your Appointment</h2>

      {/* DATE SELECTOR */}
      <div className="date-selector">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* TIME GRID */}
      <div className="time-grid">
        {hours.map(h => {
          const slot = `${selectedDate}T${h}`;
          const isTaken = bookedSlots.includes(slot);

          return (
            <button
              key={slot}
              disabled={isTaken || loading}
              onClick={() => handleBook(slot)}
              className="time-slot"
            >
              <span className="time-slot-hour">{h}</span>
              <span className="time-slot-label">
                {isTaken ? "Unavailable" : "Select Slot"}
              </span>
            </button>
          );
        })}
      </div>

      {loading && <p className="booking-status">Processing...</p>}
    </div>
  );
};

export default AppointmentForm;