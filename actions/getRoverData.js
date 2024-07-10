export async function getRoverData(rover, camera) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  const manifestUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${apiKey}`;

  try {
    const manifestRes = await fetch(manifestUrl);
    if (!manifestRes.ok) {
      console.error(
        `Failed to fetch manifest data: ${manifestRes.status} ${manifestRes.statusText}`
      );
      throw new Error(
        `Failed to fetch manifest data: ${manifestRes.statusText}`
      );
    }

    const manifestData = await manifestRes.json();
    const latestSol = manifestData.photo_manifest.max_sol;
    const latestEarthDate = manifestData.photo_manifest.max_date;

    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${latestSol}&camera=${camera}&api_key=${apiKey}`;
    let res = await fetch(url);
    let data = await res.json();

    if (!res.ok || data.photos.length === 0) {
      url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${latestEarthDate}&camera=${camera}&api_key=${apiKey}`;
      res = await fetch(url);
      if (!res.ok) {
        console.error(
          `Failed to fetch photo data: ${res.status} ${res.statusText}`
        );
        throw new Error(`Failed to fetch photo data: ${res.statusText}`);
      }
      data = await res.json();
    }

    return data.photos.slice(0, 25); // Adjust the number of photos as needed
  } catch (error) {
    console.error("Error in getRoverData:", error);
    throw error;
  }
}
