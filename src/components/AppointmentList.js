export default function AppointmentList({ appointments }) {
  return (
    <ul className="appointment-list">
      {appointments.map((appt, idx) => (
        <li key={idx}>
          🌷 {new Date(appt.appointmentTime).toLocaleString()}
        </li>
      ))}
    </ul>
  );
}
