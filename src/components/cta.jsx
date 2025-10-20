import React from "react";
import { logo2, ctabg } from "../assets/image";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center h-auto md:min-h-screen py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{
        backgroundImage: `url(${ctabg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Custom CSS for animation */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-white flex flex-col items-center">
        {/* Rotating Circular Text with Logo */}
        <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
          {/* Rotating Text */}
          <svg
            viewBox="0 0 200 200"
            className="absolute w-full h-full animate-spin-slow"
          >
            <path
              id="circlePath"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
              fill="none"
            />
            <text fontSize="14" fill="white" letterSpacing="4">
              <textPath href="#circlePath">
                JOIN NOW • JOIN NOW • JOIN NOW • JOIN NOW • JOIN NOW •
              </textPath>
            </text>
          </svg>

          {/* Center Logo */}
          <img
            src={logo2}
            alt="Logo"
            className="w-20 h-40 object-contain relative z-10"
          />
        </div>

        {/* New Title */}
        <h2 className="text-3xl md:text-5xl font-semibold mb-2 leading-snug text-white">
          Building Communities, Not Just Houses
        </h2>

        {/* Paragraph */}
        <p className="text-base md:text-sm font-light text-gray-200 leading-relaxed max-w-2xl mb-8">
          True community begins when we recognize housing not as a privilege,
          but as a shared responsibility and a right for all. Together, we can
          shape a future where every individual has a place to belong.
        </p>

        {/* CTA Button */}
        <a
          href="/contact"
          className="flex items-center gap-2 text-sm md:text-base tracking-widest uppercase bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all"
        >
          Contact Us <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default CTA;
