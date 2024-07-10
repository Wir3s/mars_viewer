"use client";
import { useState, useEffect, Suspense } from "react";
import { getRoverData } from "../../../actions/getRoverData";
import PhotoCard from "../../components/PhotoCard";
import Link from "next/link";
import styles from "./Rover.module.css";

export default function Rover({ params }) {
  const { rover } = params;
  const [photos, setPhotos] = useState([]);
  const [camera, setCamera] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getRoverData(rover, camera);
      setPhotos(data);
    }
    fetchData();
  }, [rover, camera]);

  const handleCameraChange = (event) => {
    setCamera(event.target.value);
  };

  return (
    <div>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          Back
        </Link>
        <h1 className={styles.headerTitle}>
          {rover.charAt(0).toUpperCase() + rover.slice(1)} Latest Photos
        </h1>
        <select value={camera} onChange={handleCameraChange}>
          <option value="">All Cameras</option>
          <option value="fhaz">Front Hazard Avoidance Camera</option>
          <option value="rhaz">Rear Hazard Avoidance Camera</option>
          <option value="mast">Mast Camera</option>
          <option value="chemcam">Chemistry and Camera Complex</option>
          <option value="mahli">Mars Hand Lens Imager</option>
          <option value="mardi">Mars Descent Imager</option>
          <option value="navcam">Navigation Camera</option>
          <option value="pancam">Panoramic Camera</option>
          <option value="minites">
            Miniature Thermal Emission Spectrometer
          </option>
        </select>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <PhotoGallery photos={photos} />
      </Suspense>
    </div>
  );
}

function PhotoGallery({ photos }) {
  return (
    <div className={styles.gallery}>
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}
