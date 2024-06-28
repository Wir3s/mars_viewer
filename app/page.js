import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Select a Rover to View Latest Photos</h1>
      <div>
        <Link href="/rover/curiosity">
          Curiosity
        </Link>
      </div>
      <div>
        <Link href="/rover/perseverance">
          Perseverance
        </Link>
      </div>
    </div>
  );
}
