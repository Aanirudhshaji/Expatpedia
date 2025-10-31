import React, { useState, useEffect } from "react";

const ImageScroll = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://exaptpedia.onrender.com/api/Gallery/";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Gallery API Response:", data); // Debug log
        
        // Extract image URLs from the results array
        const imageUrls = data.results?.map(item => item.image) || [];
        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
        // Fallback to empty array if API fails
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // If no images from API, show nothing or a placeholder
  if (loading) {
    return (
      <section className="relative w-full overflow-hidden py-10 mb-10 bg-white">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null; // Don't show anything if no images
  }

  // For proper infinite loop, we need at least 2 sets of images
  // But we'll use a different approach to avoid repetition
  const scrollImages = images.length <= 3 ? [...images, ...images, ...images] : [...images, ...images];

  return (
    <section className="relative w-full overflow-hidden py-10 mb-20 bg-white">
      {/* Custom CSS for smooth infinite scroll */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scroll-track {
          display: flex;
          width: fit-content;
          animation: scrollLeft ${images.length * 3}s linear infinite;
        }
        .scroll-container {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
      `}</style>

      <div className="scroll-container w-full overflow-hidden">
        <div className="scroll-track">
          {scrollImages.map((img, i) => {
            const isBig = i % 2 === 0; // alternate big and small
            const originalIndex = i % images.length; // Get original image index to avoid repetition
            
            return (
              <div
                key={`${originalIndex}-${i}`} // Unique key for each instance
                className={`flex-shrink-0 mx-3 rounded-3xl overflow-hidden ${
                  isBig
                    ? "w-[400px] md:w-[500px] h-[280px] md:h-[350px]"
                    : "w-[250px] md:w-[300px] h-[200px] md:h-[220px]"
                }`}
              >
                <img
                  src={images[originalIndex]} // Always use original image from array
                  alt={`gallery-image-${originalIndex}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImageScroll;