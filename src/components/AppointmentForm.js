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
      alert("Booking confirmed! ✨");
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
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Book Your Appointment 💅</h2>

      {/* DATE SELECTOR */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Select Date:</label>
        <input 
          type="date" 
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: '2px solid #d4a5a5', width: '80%' }}
        />
      </div>

      {/* TIME GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {hours.map(h => {
          const slot = `${selectedDate}T${h}`;
          const isTaken = bookedSlots.includes(slot);

          return (
            <button
              key={slot}
              disabled={isTaken || loading}
              onClick={() => handleBook(slot)}
              style={{
                padding: '18px 10px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: isTaken ? '#555' : '#d4a5a5', 
                color: '#ffffff', 
                cursor: isTaken ? 'not-allowed' : 'pointer',
                boxShadow: isTaken ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                opacity: isTaken ? 0.7 : 1,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.2rem' }}>{h}</div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {isTaken ? "Unavailable" : "Select Slot"}
              </div>
            </button>
          );
        })}
      </div>
      {loading && <p style={{ textAlign: 'center', marginTop: '15px', color: '#d4a5a5' }}>Processing...</p>}
    </div>
  );
};

export default AppointmentForm;