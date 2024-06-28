export default function Head({ params }) {
  const { rover } = params;
  return (
    <>
      <title>
        {rover.charAt(0).toUpperCase() + rover.slice(1)} Rover Photos
      </title>
      <meta
        name="description"
        content={`Latest photos from NASA's ${
          rover.charAt(0).toUpperCase() + rover.slice(1)
        } rover`}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
    </>
  );
}
