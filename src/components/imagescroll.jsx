import React from "react";
import img1 from "../assets/ctabg.jpg";
import img2 from "../assets/ctabg.jpg";
import img3 from "../assets/ctabg.jpg";
import img4 from "../assets/ctabg.jpg";

const ImageScroll = () => {
  const images = [img1, img2, img3, img4];
  const scrollImages = [...images, ...images]; // duplicate for infinite loop

  return (
    <section className="relative w-full overflow-hidden py-10 mb-10 bg-white">
      {/* Custom CSS for smooth infinite scroll */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scroll-track {
          display: flex;
          width: calc(200%);
          animation: scrollLeft 20s linear infinite;
        }
      `}</style>

      <div className="scroll-container w-full overflow-hidden">
        <div className="scroll-track">
          {scrollImages.map((img, i) => {
            const isBig = i % 2 === 0; // alternate big and small
            return (
              <div
                key={i}
                className={`flex-shrink-0 mx-3 rounded-3xl overflow-hidden ${
                  isBig
                    ? "w-[400px] md:w-[500px] h-[280px] md:h-[350px]"
                    : "w-[250px] md:w-[300px] h-[200px] md:h-[220px]"
                }`}
              >
                <img
                  src={img}
                  alt={`scroll-img-${i}`}
                  className="w-full h-full object-cover"
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
