import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      className="w-full bg-gray-50 py-20 px-6 md:px-10 lg:px-20"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 md:gap-14 items-start">
        {/* LEFT SECTION */}
        <div>
          <p className="text-[#0a66c2] text-sm font-semibold tracking-wide text-center md:text-left uppercase mb-2">
            About
          </p>
          <h2 className="text-2xl sm:text-4xl text-center md:text-left lg:text-5xl font-semibold leading-snug text-[#0a66c2] mb-5">
            Celebrating Expatriate{" "}
            <span className="text-gray-700 font-bold">Success Stories</span>{" "}
            in Bahrain
          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed text-justify hyphens-auto mb-10 max-w-md md:max-w-2xl">
            <span className="font-semibold">The Expatpedia</span> is an
            exclusive platform curated to recognize and celebrate the remarkable
            achievements of expatriate professionals residing in the Kingdom of
            Bahrain. Conceived and managed by{" "}
            <span className="font-semibold">
              Update Media W.L.L. & The Daily Tribune
            </span>
            , this prestigious publication and online directory highlights the
            invaluable contributions of non-Bahraini individuals across sectors
            such as business, healthcare, education, technology, arts, and
            media.
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-[#e8f0f8] p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full ">
          <p className="text-[#0a66c2] text-base md:text-lg leading-relaxed text-justify hyphens-auto mb-6">
            Our vision is to document and celebrate the journeys of outstanding
            expatriates while serving as a trusted reference for organizations,
            communities, and individuals seeking to connect with accomplished
            professionals in Bahrain.
            <br />
            <br />
            Whether you’re an organization aiming to spotlight top talent or a
            professional eager to share your story,{" "}
            <span className="font-semibold">The Expatpedia</span> offers a
            platform of prestige, recognition, and inspiration.
          </p>

          {/* LEARN MORE BUTTON */}
          <button
            onClick={() => navigate("/about")}
            className="flex items-center gap-2 w-fit px-6 py-3 bg-[#0a66c2] text-white rounded-full hover:bg-[#0080ff] transition"
          >
            Learn more <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
