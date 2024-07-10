import { getRoverData } from "../../../actions/getRoverData";
import Link from "next/link";
import ClientComponent from "../../components/ClientComponent";
import styles from "./Rover.module.css";

export default async function Rover({ params }) {
  const { rover } = params;
  const initialPhotos = await getRoverData(rover, "");

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
      <ClientComponent initialPhotos={initialPhotos} rover={rover} />
    </div>
  );
}
