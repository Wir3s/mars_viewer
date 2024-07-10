"use client";
import { useState, useEffect } from "react";
import { getRoverData } from "../../../actions/getRoverData";
import PhotoGallery from "./PhotoGallery";
import CameraSelector from "./CameraSelector";

export default function PhotoFetcher({ rover }) {
  const [photos, setPhotos] = useState([]);
  const [camera, setCamera] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getRoverData(rover, camera);
      setPhotos(data);
    }
    fetchData();
  }, [rover, camera]);

  return (
    <div>
      <CameraSelector rover={rover} onCameraChange={setCamera} />
      <PhotoGallery photos={photos} />
    </div>
  );
}
