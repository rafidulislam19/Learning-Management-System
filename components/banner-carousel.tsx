"use client";

import { useState, useEffect } from "react";
import { SearchInput } from "./search-input";

const bannerImages = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner3.jpg",
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = bannerImages.map((src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Failed to load images", error);
      }
    };

    loadImages();
  }, []);

  // Function to show next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
  };

  // Auto slide every 3 seconds
  useEffect(() => {
    if (imagesLoaded) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [imagesLoaded]);

  // if (!imagesLoaded) {
  //   return <div>Loading...</div>; // or a loading spinner
  // }

  return (
    <div className="relative mt-16 overflow-hidden">
      <div
        className="relative bg-cover bg-center py-36 px-4 text-center transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url(${bannerImages[currentIndex]})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-3xl mx-auto space-y-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Find the Best Courses for You
          </h1>
          <p className="text-gray-200 dark:text-gray-300 mb-8 text-sm md:text-xl">
            Discover, Learn, and Upskill with our wide range of courses
          </p>

          <form className="flex items-center bg-white dark:bg-gray-800 dark:text-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6">
            <div className="flex-grow">
              <SearchInput />
            </div>
          </form>

          <a href="#courses">
            <button className="bg-white text-gray-600 rounded-full px-4 md:px-5 py-2 hover:bg-gray-200 mt-5 transition-all font-medium">
              Explore Courses
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;