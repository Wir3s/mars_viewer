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

    let photos = [];
    let sol = latestSol;
    let retries = 3;

    // Fetch photos incrementally from the latest sol
    while (photos.length < 50 && sol >= 0 && retries > 0) {
      try {
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${apiKey}&page=1`;
        console.log(`Fetching photos from ${url}`);
        const res = await fetch(url, {
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
        });
        const data = await res.json();

        if (res.ok && data.photos.length > 0) {
          photos = photos.concat(data.photos);
        } else {
          retries--;
          console.warn(
            `No photos found for sol ${sol}, retries left: ${retries}`
          );
        }
      } catch (error) {
        retries--;
        console.error(
          `Error fetching data for sol ${sol}, retries left: ${retries}`,
          error
        );
      }

      sol--;
    }

    // If fewer than 50 photos, use pagination with the latest Earth date
    if (photos.length < 50) {
      let page = 1;
      retries = 3;

      while (photos.length < 50 && retries > 0) {
        try {
          const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${latestEarthDate}&api_key=${apiKey}&page=${page}`;
          console.log(`Fetching photos from ${url}`);
          const res = await fetch(url, {
            headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
          });
          const data = await res.json();

          if (res.ok && data.photos.length > 0) {
            photos = photos.concat(data.photos);
          } else {
            retries--;
            console.warn(
              `No photos found for earth date ${latestEarthDate}, page ${page}, retries left: ${retries}`
            );
          }
        } catch (error) {
          retries--;
          console.error(
            `Error fetching data for earth date ${latestEarthDate}, page ${page}, retries left: ${retries}`,
            error
          );
        }

        page++;
      }
    }

    console.log(`Returning ${photos.length} photos for rover ${rover}`);
    return photos.slice(0, 50);
  } catch (error) {
    console.error(`Error in getRoverData for rover ${rover}:`, error);
    throw error;
  }
}
