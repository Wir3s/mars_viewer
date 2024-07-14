export async function getRoverData(rover) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  const manifestUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${apiKey}`;

  try {
    const manifestRes = await fetch(manifestUrl, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
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
      `Latest Sol: ${latestSol}, Latest Earth Date: ${latestEarthDate}`
    );

    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${latestSol}&api_key=${apiKey}`;
    let res = await fetch(url, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
    let data = await res.json();

    console.log(`Fetched ${data.photos.length} photos for Sol: ${latestSol}`);

    if (!res.ok || data.photos.length === 0) {
      url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${latestEarthDate}&api_key=${apiKey}`;
      res = await fetch(url, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
      if (!res.ok) {
        console.error(
          `Failed to fetch photo data: ${res.status} ${res.statusText}`
        );
        throw new Error(`Failed to fetch photo data: ${res.statusText}`);
      }
      data = await res.json();

      console.log(
        `Fetched ${data.photos.length} photos for Earth Date: ${latestEarthDate}`
      );
    }

    console.log(`Returning ${data.photos.length} photos`);
    return data.photos.slice(0, 50);
  } catch (error) {
    console.error("Error in getRoverData:", error);
    throw error;
  }
}
