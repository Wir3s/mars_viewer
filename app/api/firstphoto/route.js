export async function GET() {
  const apiKey = process.env.NASA_API_KEY;

  // Fetch the manifest to get the latest sol or Earth date
  const manifestUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/perseverance?api_key=${apiKey}`;
  const manifestRes = await fetch(manifestUrl);
  if (!manifestRes.ok) {
    throw new Error("Failed to fetch manifest data");
  }
  const manifestData = await manifestRes.json();

  // Get the most recent sol or Earth date from the manifest
  const latestSol = manifestData.photo_manifest.max_sol;
  const latestEarthDate = manifestData.photo_manifest.max_date;

  // Fetch the most recent photos using the latest sol or Earth date
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/photos?earth_date=${latestEarthDate}&api_key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch photo data");
  }
  const data = await res.json();
  console.log("Data received on the server:", data);

  // Optionally, select only the first 10 images
  const latestPhotos = data.photos.slice(0, 10);

  return new Response(JSON.stringify(latestPhotos), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
