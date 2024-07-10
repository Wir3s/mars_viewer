"use client";
import PhotoCard from "./PhotoCard";
import styles from "./PhotoGallery.module.css"; // Make sure to create this CSS file

export default function PhotoGallery({ photos }) {
  return (
    <div className={styles.gallery}>
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}