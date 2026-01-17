const apiUrl = process.env.REACT_APP_API_URL;

// Get appointments
export async function getAppointments(token) {
  const response = await fetch(`${apiUrl}/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Create appointment
export async function createAppointment(appointmentTime, token) {
  const response = await fetch(`${apiUrl}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ appointmentTime }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
