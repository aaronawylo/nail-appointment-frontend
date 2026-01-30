console.log('API URL:', process.env.REACT_APP_API_URL);
const API_URL = process.env.REACT_APP_API_URL;

export async function createAppointment(appointmentTime) {
    const token = localStorage.getItem('id_token');
    const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ appointmentTime })
    });
    return await response.json();
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
            Authorization: token ? `Bearer ${token}` : ''
        }
    });
    if (!response.ok) throw new Error("Failed to fetch all appointments");
    return response.json();
}