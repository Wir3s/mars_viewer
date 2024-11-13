export async function getRoverData(rover) {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const formatDate = (date) => date.toISOString().split("T")[0];

  let photos = [];
  let attempts = rover === "Curiosity" ? 60 : 7; // More recent attempts for Curiosity
  let currentDate = new Date();

  while (attempts > 0 && photos.length === 0) {
    photos = await getPhotosForDate(currentDate);

    if (photos.length === 0) {
      console.warn(
        `No photos found for ${formatDate(currentDate)}, trying previous day...`
      );
      currentDate.setDate(currentDate.getDate() - 1);
      await delay(500);
    }

    attempts--;
  }

  // If no photos are found with Earth dates, fallback to Martian sols.
  if (photos.length === 0) {
    console.log("No photos found with Earth date, trying sols...");
    let sol = 3000; // You may need to adjust this to get recent sol values
    while (attempts > 0 && photos.length === 0) {
      photos = await getPhotosForSol(rover, sol);
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
  return photos.slice(0, 50);
}
