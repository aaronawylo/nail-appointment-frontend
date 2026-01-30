import React, { useEffect, useState } from 'react';
import { getAllAppointments } from '../api';

const AdminDashboard = () => {
  const [allAppts, setAllAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getAllAppointments()
      .then(data => setAllAppts(data.appointments || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Get the Pre-signed URL from your API
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/get-upload-url`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('id_token')}` 
        },
        body: JSON.stringify({ fileName: file.name, fileType: file.type })
      });
      
      const { uploadUrl } = await res.json();

      // 2. Upload directly to S3 using the URL
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      });

      alert("Photo uploaded successfully! ✨");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Control Panel 👑</h2>

      {/* NEW UPLOAD SECTION */}
      <div className="admin-upload-card" style={{ marginBottom: '2rem', padding: '1rem', border: '1px dashed #ccc' }}>
        <h3>Add to Gallery ✨</h3>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={uploading}
        />
        {uploading && <p>Uploading your masterpiece...</p>}
      </div>

      <hr />

      <h2>Master Schedule</h2>
      {loading ? <p>Loading all bookings...</p> : (
        <div className="admin-list">
          {allAppts.length === 0 ? <p>No bookings found.</p> : (
            allAppts.map((appt, index) => (
              <div key={index} className="appointment-item admin-item">
                <div className="admin-details">
                  <strong>User:</strong> {appt.userId.split('-')[0]}... <br/>
                  <strong>Time:</strong> {new Date(appt.appointmentTime).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;