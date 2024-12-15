// lib/nasa-api-utils.ts
export async function diagnosticRoverData(rover: string) {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not defined");
    }
  
    // Try multiple recent dates
    const datesToTry = [];
    const baseDate = new Date();
    for (let i = 0; i < 10; i++) {
      const testDate = new Date(baseDate);
      testDate.setDate(baseDate.getDate() - i);
      datesToTry.push(testDate);
    }
  
    const results = [];
  
    for (const date of datesToTry) {
      const formattedDate = date.toISOString().split("T")[0];
      const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover.toLowerCase()}/photos?earth_date=${formattedDate}&api_key=${apiKey}`;
  
      console.log(`Diagnostics: Checking ${url}`);
  
      try {
        const res = await fetch(url);
        const data = await res.json();
  
        results.push({
          date: formattedDate,
          totalPhotos: data.photos ? data.photos.length : 0,
          cameras: data.photos ? Array.from(new Set(data.photos.map(p => p.camera.name))) : []
        });
  
        // If we find photos, break the loop
        if (data.photos && data.photos.length > 0) {
          break;
        }
      } catch (error) {
        console.error(`Error fetching for ${formattedDate}:`, error);
        results.push({
          date: formattedDate,
          error: error.message
        });
      }
    }
  
    return results;
  }