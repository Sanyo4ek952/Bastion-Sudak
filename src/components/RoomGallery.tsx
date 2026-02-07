"use client";

import { useState } from "react";

import { Modal } from "./Modal";

type RoomGalleryProps = {
  name: string;
  images: Array<{ id: string; url: string; alt: string | null }>;
};

export function RoomGallery({ name, images }: RoomGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (images.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setIsOpen(true)}
            className="h-56 overflow-hidden rounded-3xl border border-sand-100 bg-sand-100 focus-ring"
          >
            <img
              src={image.url}
              alt={image.alt ?? name}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      <Modal
        isOpen={isOpen}
        title={`Галерея ${name}`}
        onClose={() => setIsOpen(false)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt={image.alt ?? name}
              className="h-40 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}
