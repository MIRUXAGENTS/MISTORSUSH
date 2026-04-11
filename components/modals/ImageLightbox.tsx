'use client';

import Image from 'next/image';

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageLightbox({ isOpen, imageUrl, onClose }: ImageLightboxProps) {
  return (
    <div
      className={`fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl transition-all duration-300 flex items-center justify-center p-4 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition-all z-[110] hover:bg-brand shadow-2xl border border-white/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {imageUrl && (
        <div
          className={`relative max-w-2xl w-full max-h-[80vh] aspect-square transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10'
            }`}
          onClick={onClose}
        >
          <Image
            src={imageUrl}
            alt="Product"
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-contain drop-shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
