import React from "react";
import heroVideo from "../assets/hero.mp4";
import { ChevronDown } from "lucide-react";
const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Overlay (optional for better readability) */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Centered Text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-white font-semibold leading-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Honouring Expatriate <br className="hidden sm:block" /> Excellence in Bahrain
        </h1>
        <p className="text-gray-200 text-base md:text-lg max-w-2xl mt-4 leading-relaxed">
    Celebrating the remarkable contributions of expatriates who inspire progress,
    unity, and innovation across the Kingdom.
  </p>
        <a
          href="/contact"
          className="backdrop-blur-md bg-white/10 border border-white/30 text-white font-semibold md:py-2 md:px-6 px-5 py-1.5 mt-2 rounded-full text-lg shadow-md hover:bg-white/20 transition duration-300"
        >
          Join Now
        </a>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
              <a href="#about" aria-label="Scroll Down">
                <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-white animate-bounce">
                  <ChevronDown size={28} className="text-white" />
                </div>
              </a>
            </div>
    </section>
  );
};

export default Hero;
