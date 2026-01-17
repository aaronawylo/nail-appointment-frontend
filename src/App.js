import { useEffect, useState } from "react";
import { getAppointments } from "./api";
import { getTokenFromUrl, logout } from "./auth";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import Login from "./components/Login";
import "./styles.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Extract token from URL after Cognito redirect
    if (!token) {
      const urlToken = getTokenFromUrl();
      if (urlToken) {
        setToken(urlToken);
        localStorage.setItem("token", urlToken);
        window.location.hash = "";
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    async function fetchData() {
      try {
        const data = await getAppointments(token);
        setAppointments(data.appointments);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [token]);

  if (!token) return <Login />;

  return (
    <div className="App">
      <h1>💖 Nail Appointment Scheduler 💖</h1>
      <button className="logout" onClick={logout}>
        Logout
      </button>
      <AppointmentForm
        token={token}
        onNewAppointment={(appt) =>
          setAppointments((prev) => [...prev, appt])
        }
      />
      <AppointmentList appointments={appointments} />
    </div>
  );
}

export default App;
