import React from "react";
import Mission from "./mission";
import aboutImage from "../assets/ctabg.jpg";
import Blog from "../components/blog";

const AboutSection = () => {
  return (
    <>
      <section className="w-full bg-white mt-30 px-6 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* LEFT SIDE LABEL */}
          <div className="w-full md:w-1/4">
            <p className="text-sm font-medium text-gray-800 tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-black inline-block rounded-full"></span>
              About Us
            </p>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="w-full md:w-3/4 md:ml-auto text-left md:text-right">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
              <span className="text-[#0a66c2]">Welcome to The Expatpedia:</span>{" "}
              <br className="hidden sm:block" />
              <span className="text-black">Honouring Expatriate Success</span>
            </h1>

            <p className="text-gray-600 text-base md:text-lg max-w-2xl leading-relaxed md:ml-auto text-left md:text-right">
              The Expatpedia, an initiative by Update Media W.L.L. – The Daily Tribune, celebrates expatriates who have made significant contributions across Bahrain’s diverse sectors and recognizes their impact on the Kingdom’s growth.
            </p>
          </div>
        </div>

        {/* FULL-WIDTH IMAGE (IGNORES SECTION PADDING) */}
        <div className="mt-10 md:mt-16 -mx-6 md:-mx-10 lg:-mx-20">
          <img
            src={aboutImage}
            alt="About Expatpedia"
            className="w-full h-64 md:h-108 object-cover"
          />
        </div>
      </section>

      {/* ✅ Mission Section OUTSIDE the padded section */}
      <Mission />
      <Blog />
    </>
  );
};

export default AboutSection;
