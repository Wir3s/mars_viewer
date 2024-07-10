import { getRoverData } from "../../../actions/getRoverData";
import PhotoCard from "../../components/PhotoCard";
import CameraSelector from "../../components/CameraSelector";
import Link from "next/link";
import styles from "./Rover.module.css";
import { useState } from "react";

export default function Rover({ params }) {
  const { rover } = params;
  const [photos, setPhotos] = useState([]);
  const [camera, setCamera] = useState("");

  async function handleCameraChange(selectedCamera) {
    setCamera(selectedCamera);
    const data = await getRoverData(rover, selectedCamera);
    setPhotos(data);
  }

  return (
    <div>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          Back
        </Link>
        <h1 className={styles.headerTitle}>
          {rover.charAt(0).toUpperCase() + rover.slice(1)} Latest Photos
        </h1>
        <CameraSelector rover={rover} onCameraChange={handleCameraChange} />
      </div>
      <PhotoGallery photos={photos} />
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
