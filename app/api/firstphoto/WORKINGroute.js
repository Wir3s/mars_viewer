export async function GET() {
  const apiKey = process.env.NASA_API_KEY;
  const today = new Date().toISOString().split("T")[0]; // Gets today's date in YYYY-MM-DD format
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2023-12-1&page=1&api_key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  console.log("Data received on the server:", data);
  // Optionally, select only the first 5 images
  const latestPhotos = data.photos.slice(0, 10);

  return new Response(JSON.stringify(latestPhotos), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
