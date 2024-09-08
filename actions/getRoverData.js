export async function getRoverData(rover) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  const manifestUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${apiKey}`;

  try {
    console.log(`Fetching manifest data for ${rover} from ${manifestUrl}`);
    const manifestRes = await fetch(manifestUrl, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });
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

    console.log(
      `Latest Sol: ${latestSol}, Latest Earth Date: ${latestEarthDate} for rover ${rover}`
    );
    console.log(`Manifest Data for ${rover}:`, manifestData);

    let photos = [];

    // Create an array of sol numbers to fetch concurrently
    const solNumbers = Array.from({ length: Math.min(50, latestSol + 1) }, (_, i) => latestSol - i);

    // Use Promise.all to fetch photos from multiple sols concurrently
    const requests = solNumbers.map(async (sol) => {
      const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${apiKey}&page=1`;
      console.log(`Fetching photos from ${url}`);

      try {
        const res = await fetch(url, {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.photos.length > 0) {
            return data.photos;
          } else {
            console.warn(`No photos found for sol ${sol}`);
            return [];
          }
        } else {
          console.error(
            `Failed to fetch photos for sol ${sol}: ${res.status} ${res.statusText}`
          );
          return [];
        }
      } catch (error) {
        console.error(`Error fetching data for sol ${sol}:`, error);
        return [];
      }
    });

    // Wait for all requests to complete
    const results = await Promise.all(requests);

    // Flatten the results into a single array of photos
    photos = results.flat();

    console.log(`Returning ${photos.length} photos for rover ${rover}`);
    return photos.slice(0, 50);
  } catch (error) {
    console.error(`Error in getRoverData for rover ${rover}:`, error);
    throw error;
  }
}
