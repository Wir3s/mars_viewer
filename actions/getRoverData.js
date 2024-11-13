// Utility function for introducing a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split("T")[0];

// Function to get photos for a given Earth date
const getPhotosForDate = async (rover, date, apiKey) => {
  const formattedDate = formatDate(date);
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${formattedDate}&api_key=${apiKey}&page=1`;

  console.log(`Fetching photos for ${rover} on ${formattedDate} from ${url}`);

  try {
    const res = await fetch(url, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });

    if (!res.ok) {
      console.error(`Failed to fetch photos: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    console.log(
      `Response for ${formattedDate}:`,
      JSON.stringify(data, null, 2)
    );

    return data.photos || [];
  } catch (error) {
    console.error(`Error fetching photos for ${formattedDate}:`, error);
    return [];
  }
};

// Function to get photos for a given Martian sol
const getPhotosForSol = async (rover, sol, apiKey) => {
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${apiKey}&page=1`;

  console.log(`Fetching photos for ${rover} on sol ${sol} from ${url}`);

  try {
    const res = await fetch(url, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });

    if (!res.ok) {
      console.error(`Failed to fetch photos: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return data.photos || [];
  } catch (error) {
    console.error(`Error fetching photos for sol ${sol}:`, error);
    return [];
  }
};

// Main function to get rover data
export async function getRoverData(rover) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  let photos = [];
  let attempts = rover === "Curiosity" ? 60 : 7; // Try more recent days for Curiosity
  let currentDate = new Date();

  // Try getting photos for recent Earth dates
  while (attempts > 0 && photos.length === 0) {
    photos = await getPhotosForDate(rover, currentDate, apiKey);

    if (photos.length === 0) {
      console.warn(
        `No photos found for ${formatDate(currentDate)}, trying previous day...`
      );
      currentDate.setDate(currentDate.getDate() - 1);
      await delay(500); // Delay to avoid rate limiting
    }

    attempts--;
  }

  // If no photos found, fallback to Martian sols
  if (photos.length === 0) {
    console.log("No photos found with Earth date, trying sols...");
    let sol = 3000; // Adjust this sol value to get more recent sols if needed
    while (attempts > 0 && photos.length === 0) {
      photos = await getPhotosForSol(rover, sol, apiKey);
      sol--;
      attempts--;
      await delay(500);
    }
  }

  if (photos.length === 0) {
    console.error(`No photos found for the given dates and sols.`);
    return [];
  }

  console.log(`Returning ${photos.length} photos for rover ${rover}`);
  return photos.slice(0, 50); // Return the 50 most recent photos
}
