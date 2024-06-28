import { Suspense } from "react";
import { getRoverData } from "../../../actions/getRoverData";
import PhotoCard from "../../components/PhotoCard";
import styles from "./Rover.module.css";

export default async function Rover({ params }) {
  const { rover } = params;
  const photos = await getRoverData(rover);

  return (
    <div>
      <h1>{rover.charAt(0).toUpperCase() + rover.slice(1)} Latest Photos</h1>
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
