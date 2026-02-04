console.log('API URL:', process.env.REACT_APP_API_URL);
const API_URL = process.env.REACT_APP_API_URL;

export async function createAppointment(appointmentData) {
    const token = localStorage.getItem('id_token');
    const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Booking failed");
    }
    return data;
}

export async function getAppointments() {
    const token = localStorage.getItem('id_token');
    const response = await fetch(`${API_URL}/appointments`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    });

    if (response.status === 401) {
        localStorage.removeItem('id_token');
        throw new Error("UNAUTHORIZED"); 
    }

    if (!response.ok) throw new Error("Fetch failed");
    return response.json();
}

export async function getAllAppointments() {
    const token = localStorage.getItem('id_token');
    const response = await fetch(`${API_URL}/admin/all-appointments`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error("Failed to fetch schedule");
    return response.json();
}

export async function getPublicAvailability() {
    const response = await fetch(`${API_URL}/availability`);
    if (!response.ok) throw new Error("Could not load availability");
    return response.json();
}

export async function deleteAppointment(userId, appointmentTime) {
    const token = localStorage.getItem('id_token');
    const response = await fetch(`${API_URL}/admin/delete`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, appointmentTime })
    });
    if (!response.ok) throw new Error("Failed to delete");
    return response.json();
}