"use client";
import { useState, useEffect } from "react";
import CameraSelector from "./CameraSelector";
import PhotoCard from "./PhotoCard";
import styles from "./ClientComponent.module.css";

export default function ClientComponent({ initialPhotos, rover }) {
  const [photos, setPhotos] = useState(initialPhotos);

  const handleCameraChange = async (camera) => {
    const res = await fetch(`/api/getRoverData?rover=${rover}&camera=${camera}`);
    const data = await res.json();
    setPhotos(data);
  };

  return (
    <div>
      <CameraSelector onCameraChange={handleCameraChange} />
      <div className={styles.gallery}>
        {photos.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
}