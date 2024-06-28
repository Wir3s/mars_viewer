"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";

export default function PhotoCard({ photo }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <div onClick={openModal} style={{ cursor: "pointer" }}>
        <p>{`Sol: ${photo.sol}, Earth Date: ${photo.earth_date}, Camera: ${photo.camera.full_name}`}</p>
        <Image
          src={photo.img_src}
          alt={`Photo taken by ${photo.camera.full_name}`}
          width={150}
          height={150}
        />
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <Image
            src={photo.img_src}
            alt={`Photo by ${photo.rover.name}`}
            height={500}
            width={500}
          />
          <div style={{ color: "black", textAlign: "center" }}>
            <p>ID: {photo.id}</p>
            <p>Rover: {photo.rover.name}</p>
            <p>Earth Date: {photo.earth_date}</p>
            <p>Camera: {photo.camera.full_name}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
