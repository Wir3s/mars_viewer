"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "./components/Modal";

export default function MainPage() {
  const [photoData, setPhotoData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const response = await fetch("/api/firstphoto");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Data received on the client:", data);
        setPhotoData(data);
      } catch (error) {
        console.error("Failed to fetch the first photo:", error);
      }
    }

    fetchPhoto();
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <h1>Mars Rover Photos</h1>
      <div>
        {photoData &&
          photoData.map((photo) => (
            <div
              key={photo.id}
              style={{ padding: "10px", display: "inline-block" }}
              onClick={() => openModal(photo)}
            >
              <Image
                src={photo.img_src}
                alt={`Photo by ${photo.rover.name}`}
                width={150} // Or desired thumbnail width
                height={150} // Or desired thumbnail height, maintaining aspect ratio
                // layout="responsive"
              />
              <p>ID: {photo.id}</p>
              <p>Rover: {photo.rover.name}</p>
              <p>Earth Date: {photo.earth_date}</p>
              <p>Camera: {photo.camera.full_name}</p>
            </div>
          ))}
      </div>
      {selectedImage && (
        <Modal onClose={closeModal}>
          <Image
            src={selectedImage.img_src}
            alt={`Photo by ${selectedImage.rover.name}`}
            height={500}
            width={500}
            // layout="fill"
          />
          <div style={{ color: "white", textAlign: "center" }}>
            {" "}
            {/* Styling for visibility */}
            <p>ID: {selectedImage.id}</p>
            <p>Rover: {selectedImage.rover.name}</p>
            <p>Earth Date: {selectedImage.earth_date}</p>
            <p>Camera: {selectedImage.camera.full_name}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
