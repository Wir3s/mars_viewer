export async function getRoverData(rover) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  // Utility function for introducing a delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Try to get photos for today or the last 7 days
  const getPhotosForDate = async (date) => {
    const formattedDate = formatDate(date);
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${formattedDate}&api_key=${apiKey}&page=1`;

    console.log(`Fetching photos for ${rover} on ${formattedDate} from ${url}`);

    try {
      const res = await fetch(url, {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });

      if (!res.ok) {
        console.error(
          `Failed to fetch photos: ${res.status} ${res.statusText}`
        );
        return [];
      }

      const data = await res.json();
      return data.photos || [];
    } catch (error) {
      console.error(`Error fetching photos for ${formattedDate}:`, error);
      return [];
    }
  };

  try {
    let photos = [];
    let attempts = rover === "Curiosity" ? 60 : 7; // Try 60 days for Curiosity, 7 for Perseverance
    let currentDate = new Date();

    while (attempts > 0 && photos.length === 0) {
      photos = await getPhotosForDate(currentDate);

      if (photos.length === 0) {
        console.warn(
          `No photos found for ${formatDate(
            currentDate
          )}, trying previous day...`
        );
        currentDate.setDate(currentDate.getDate() - 1); // Go back one day
        await delay(500); // Delay to avoid rate limits (500ms delay between attempts)
      }

      attempts--;
    }

    if (photos.length === 0) {
      console.error(
        `No photos found for the last ${rover === "Curiosity" ? 60 : 7} days.`
      );
      return [];
    }

    console.log(`Returning ${photos.length} photos for rover ${rover}`);
    return photos.slice(0, 50); // Return the 50 most recent photos
  } catch (error) {
    console.error(`Error in getRoverData for rover ${rover}:`, error);
    throw error;
  }
}
