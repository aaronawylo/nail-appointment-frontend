import { useState } from "react";
import { createAppointment } from "../api";

export default function AppointmentForm({ token, onNewAppointment }) {
  const [time, setTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createAppointment(time, token);
      onNewAppointment(result); // Update the list
      setTime("");
    } catch (err) {
      alert("Error creating appointment: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <button type="submit">Book My Appointment 🌸</button>
    </form>
  );
}
