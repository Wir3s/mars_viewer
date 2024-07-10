import { Suspense } from "react";
import Link from "next/link";
import PhotoFetcher from "../../components/PhotoFetcher";
import styles from "./Rover.module.css";

export default async function Rover({ params }) {
  const { rover } = params;

  return (
    <div>
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          Back
        </Link>
        <h1 className={styles.headerTitle}>
          {rover.charAt(0).toUpperCase() + rover.slice(1)} Latest Photos
        </h1>
        <Suspense fallback={<p>Loading...</p>}>
          <PhotoFetcher rover={rover} />
        </Suspense>
      </div>
    </div>
  );
}
