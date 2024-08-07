import Image from "next/image";
import Link from "next/link";
import styles from "./Homepage.module.css";

<link
  href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
  rel="stylesheet"
></link>;

export default function HomePage() {
  return (
    <div>
      <h1 className={styles.title}>Choose Your Rover</h1>
      <div className={styles.gallery}>
        <Link href="/rover/curiosity">
          <div className={styles.roverCard}>
            <Image
              src="/images/rovers/curiosity_painting.webp"
              alt="Curiosity Rover in the style of Vincent Van Gogh"
              width={400}
              height={400}
            />
            <div className={styles.overlay}>
              <div className={styles.text}>Curiosity</div>
            </div>
          </div>
        </Link>
        <Link href="/rover/perseverance">
          <div className={styles.roverCard}>
            <Image
              src="/images/rovers/perseverance_painting.webp"
              alt="Perseverance Rover in the style of Paul Gauguin"
              width={400}
              height={400}
            />
            <div className={styles.overlay}>
              <div className={styles.text}>Perseverance</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
