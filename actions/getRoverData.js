export async function getRoverData(rover) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Build the URL to fetch the most recent photos based on today's date
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${today}&api_key=${apiKey}&page=1`;

  try {
    console.log(`Fetching recent photos for ${rover} from ${url}`);
    const res = await fetch(url, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });

    if (!res.ok) {
      console.error(
        `Failed to fetch recent photos: ${res.status} ${res.statusText}`
      );
      throw new Error(`Failed to fetch recent photos: ${res.statusText}`);
    }

    const data = await res.json();

    // If no photos were found for today, you can implement fallback logic (e.g., try previous days)
    if (data.photos.length === 0) {
      console.warn(`No photos found for ${today}, trying previous dates...`);
      // Optionally, you can implement logic to fetch photos from earlier dates here
    }

    console.log(`Returning ${data.photos.length} photos for rover ${rover}`);
    return data.photos.slice(0, 50); // Return the 50 most recent photos
  } catch (error) {
    console.error(`Error in getRoverData for rover ${rover}:`, error);
    throw error;
  }
}
