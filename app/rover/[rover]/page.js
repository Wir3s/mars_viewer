"use client";

import { Suspense, useState } from "react";
import { getRoverData } from "../../../actions/getRoverData";
import Image from "next/image";
import Modal from "../../components/Modal";

// Helper to fetch data and wrap in Suspense
function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (res) => {
      status = "success";
      result = res;
    },
    (err) => {
      status = "error";
      result = err;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
}

export default function Rover({ params }) {
  const { rover } = params;
  const dataResource = wrapPromise(getRoverData(rover));
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <h1>{rover.charAt(0).toUpperCase() + rover.slice(1)} Latest Photos</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <PhotoGallery resource={dataResource} openModal={openModal} />
      </Suspense>
      {selectedImage && (
        <Modal onClose={closeModal}>
          <Image
            src={selectedImage.img_src}
            alt={`Photo by ${selectedImage.rover.name}`}
            height={500}
            width={500}
          />
          <div style={{ color: "black", textAlign: "center" }}>
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

function PhotoGallery({ resource, openModal }) {
  const photos = resource.read();

  return (
    <div>
      {photos.map((photo) => (
        <div
          key={photo.id}
          style={{
            padding: "10px",
            display: "inline-block",
            cursor: "pointer",
          }}
          onClick={() => openModal(photo)}
        >
          <Image
            src={photo.img_src}
            alt={`Photo by ${photo.rover.name}`}
            width={150}
            height={150}
          />
          <p>ID: {photo.id}</p>
          <p>Rover: {photo.rover.name}</p>
          <p>Earth Date: {photo.earth_date}</p>
          <p>Camera: {photo.camera.full_name}</p>
        </div>
      ))}
    </div>
  );
}
