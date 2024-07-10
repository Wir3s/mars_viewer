"use client";
import { useState, useEffect } from "react";

export default function CameraSelector({ rover, onCameraChange }) {
  const [camera, setCamera] = useState("");

  useEffect(() => {
    onCameraChange(camera);
  }, [camera, onCameraChange]);

  const handleCameraChange = (event) => {
    setCamera(event.target.value);
  };

  return (
    <select value={camera} onChange={handleCameraChange}>
      <option value="">All Cameras</option>
      <option value="fhaz">Front Hazard Avoidance Camera</option>
      <option value="rhaz">Rear Hazard Avoidance Camera</option>
      <option value="mast">Mast Camera</option>
      <option value="chemcam">Chemistry and Camera Complex</option>
      <option value="mahli">Mars Hand Lens Imager</option>
      <option value="mardi">Mars Descent Imager</option>
      <option value="navcam">Navigation Camera</option>
      <option value="pancam">Panoramic Camera</option>
      <option value="minites">Miniature Thermal Emission Spectrometer</option>
    </select>
  );
}
