export async function getRoverData(rover) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  const normalizedRover = rover.toLowerCase();

  // Specific camera filtering (sometimes helps)
  const cameras = normalizedRover === 'curiosity' 
    ? ['MAST', 'NAVCAM', 'FHAZ', 'RHAZ'] 
    : [];

  const getPhotosForDate = async (date, cameraFilter = null) => {
    const formattedDate = date.toISOString().split("T")[0];
    
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${normalizedRover}/photos?earth_date=${formattedDate}&api_key=${apiKey}`;
    
    // Add camera filter if specified
    if (cameraFilter) {
      url += `&camera=${cameraFilter}`;
    }

    console.log(`Attempting to fetch from: ${url}`);

    try {
      const res = await fetch(url, {
        headers: { 
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Accept": "application/json"
        }
      });

      if (!res.ok) {
        console.error(`HTTP Error: ${res.status} ${res.statusText}`);
        return [];
      }

      const data = await res.json();
      
      console.log(`Photos found for ${formattedDate} (${cameraFilter || 'all cameras'}):`, data.photos.length);

      return data.photos || [];
    } catch (error) {
      console.error(`Fetch error for ${formattedDate}:`, error);
      return [];
    }
  };

  try {
    let photos = [];
    let currentDate = new Date();
    let attempts = 60; // Extended attempts
    let cameraIndex = 0;

    while (attempts > 0 && photos.length === 0) {
      // Try without camera filter first
      photos = await getPhotosForDate(currentDate);

      // If no photos, try with specific cameras for Curiosity
      if (photos.length === 0 && cameras.length > 0 && cameraIndex < cameras.length) {
        photos = await getPhotosForDate(currentDate, cameras[cameraIndex]);
        cameraIndex++;
      }

      if (photos.length === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
        attempts--;
      }
    }

    if (photos.length === 0) {
      console.error(`Exhausted all attempts to find photos for ${normalizedRover}`);
      return [];
    }

    return photos.slice(0, 50);
  } catch (error) {
    console.error(`Critical error in getRoverData:`, error);
    throw error;
  }
}
