import React, { useEffect, useState } from 'react';

const NailGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/gallery-images`)
      .then(res => res.json())
      .then(data => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(err => console.error("Error loading gallery:", err));
  }, []);

  return (
    <div className="gallery-container">
      <h2>Our Masterpieces</h2>
      {loading ? <p>Polishing the photos...</p> : (
        <div className="gallery-grid">
          {images.length === 0 ? (
            <p>No photos yet. Check back soon!</p>
          ) : (
            images.map((img) => (
              <div key={img.key} className="gallery-card">
                <img src={img.url} alt="Nail Art" className="gallery-image" />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NailGallery;