import { Suspense } from "react";
import { getRoverData } from "../../../actions/getRoverData";
import PhotoCard from "../../components/PhotoCard";
import Link from "next/link";
import styles from "./Rover.module.css";

export default async function Rover({ params }) {
  const { rover } = params;
  const photos = await getRoverData(rover);

  return (
    <div>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          Back
        </Link>
        <h1 className={styles.headerTitle}>
          {rover.charAt(0).toUpperCase() + rover.slice(1)} Latest Photos
        </h1>
      </div>
      <Suspense fallback={<p>Loading latest photos...</p>}>
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
