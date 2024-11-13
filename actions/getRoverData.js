// Step 1: Utility function for introducing a delay between API requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Step 2: Helper function to format date as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split("T")[0];

// Step 3: Fetch manifest data for a given rover with retry mechanism
const getManifestData = async (rover, apiKey, retries = 3) => {
  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${apiKey}`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(
          `Failed to fetch manifest data: ${res.status} ${res.statusText}`
        );

        // Retry if we get a 500 error
        if (res.status === 500 && attempt < retries - 1) {
          console.log(
            `Retrying manifest fetch for ${rover} (attempt ${attempt + 1})...`
          );
          await delay(1000); // Wait for 1 second before retrying
          continue;
        }

        return null; // If it's not a 500 error or max retries reached, return null
      }

      const data = await res.json();
      console.log(`Manifest data for ${rover}:`, JSON.stringify(data, null, 2));
      return data.photo_manifest;
    } catch (error) {
      console.error(`Error fetching manifest data for ${rover}:`, error);

      // Retry on network errors
      if (attempt < retries - 1) {
        console.log(
          `Retrying manifest fetch for ${rover} (attempt ${attempt + 1})...`
        );
        await delay(1000); // Wait for 1 second before retrying
        continue;
      }

      return null;
    }
  }
};

// Step 4: Extract available sols from the manifest data
const getAvailableSols = (manifestData) => {
  if (!manifestData || !manifestData.photos) {
    console.error("No manifest data available to extract sols.");
    return [];
  }

  // Extract sols that have at least one photo
  return manifestData.photos
    .filter((photo) => photo.total_photos > 0)
    .map((photo) => photo.sol);
};

// Step 5: Fetch photos for a given sol and camera
const getPhotosForSolAndCamera = async (rover, sol, camera, apiKey) => {
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&camera=${camera}&api_key=${apiKey}`;

  console.log(
    `Fetching photos for ${rover} on sol ${sol} with camera ${camera} from ${url}`
  );

  try {
    const res = await fetch(url, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch photos for ${camera} camera: ${res.status} ${res.statusText}`
      );
      return [];
    }

    const data = await res.json();
    return data.photos || [];
  } catch (error) {
    console.error(
      `Error fetching photos for sol ${sol} with camera ${camera}:`,
      error
    );
    return [];
  }
};

// Step 6: Main function to get rover data with fallback mechanism
export async function getRoverData(rover) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  // Step 1: Get manifest data (retry mechanism in place)
  let availableSols = [];
  const manifestData = await getManifestData(rover, apiKey);

  if (!manifestData) {
    console.warn("Could not retrieve manifest data, using fallback sols...");
    // Provide a fallback list of sols in case manifest retrieval fails
    availableSols = [3000, 2999, 2998, 2997]; // Replace with sensible fallback sols
  } else {
    availableSols = getAvailableSols(manifestData);
  }

  if (availableSols.length === 0) {
    console.error("No available sols with photos for the rover.");
    return [];
  }

  console.log(`Available sols for ${rover}: ${availableSols.join(", ")}`);

  // Step 2: Iterate over available sols and fetch photos
  let photos = [];
  const cameras = ["FHAZ", "RHAZ", "MAST", "CHEMCAM", "MAHLI", "NAVCAM"];

  for (let sol of availableSols) {
    if (photos.length > 0) {
      break; // Stop once we have some photos
    }

    for (let camera of cameras) {
      const cameraPhotos = await getPhotosForSolAndCamera(
        rover,
        sol,
        camera,
        apiKey
      );
      if (cameraPhotos.length > 0) {
        photos = photos.concat(cameraPhotos);
        console.log(
          `Found ${cameraPhotos.length} photos for sol ${sol} using camera ${camera}`
        );
      }

      await delay(500); // Delay between requests to avoid rate limiting
    }
  }

  if (photos.length === 0) {
    console.error(`No photos found for the available sols and cameras.`);
    return [];
  }

  console.log(`Returning ${photos.length} photos for rover ${rover}`);
  return photos.slice(0, 50); // Return the 50 most recent photos
}
