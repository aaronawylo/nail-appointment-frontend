import React, { useState } from 'react';
import { createAppointment } from '../api';

const AppointmentForm = ({ onNewAppointment }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('00'); // Default to :00
  const [selectedHour, setSelectedHour] = useState('12');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate the 30-min options for the dropdown
  const timeSlots = ["00", "30"];
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    // Combine Date + Hour + Minute into an ISO string
    const combinedISO = `${selectedDate}T${selectedHour}:${selectedSlot}:00`;

    setLoading(true);
    try {
      const result = await createAppointment(combinedISO);
      if (result && result.appointmentTime) {
        onNewAppointment(result);
        setSelectedDate(''); // Reset form
      }
    } catch (err) {
      setError('Failed to book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section">
      <div className="appointment-form">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>1. Pick a Date</label>
            <input
              type="date"
              className="appointment-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>2. Pick a 30-Min Slot</label>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <select 
                className="appointment-input" 
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
              >
                {hours.map(h => <option key={h} value={h}>{h}:00</option>)}
              </select>
              
              <select 
                className="appointment-input" 
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="00">:00</option>
                <option value="30">:30</option>
              </select>
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="submit-button" disabled={loading || !selectedDate}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;