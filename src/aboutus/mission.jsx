import React from "react";

const MissionSection = () => {
  return (
    <section className="w-full bg-[#0a66c2] text-white py-20 px-6 md:px-10 lg:px-20 text-center">
      {/* Section Header */}
      <p className="uppercase text-sm tracking-widest text-white/80 mb-4">
        Our Mission
      </p>

      {/* Main Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight max-w-4xl mx-auto mb-10">
        Honouring Expatriate Excellence and Inspiring Global Connection in the
        Kingdom of Bahrain.
      </h2>

      {/* Description */}
      <div className="max-w-8xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20 text-justify hyphens-auto text-white/90 text-base md:text-lg leading-relaxed">
        <p>
          The Expatpedia is a unique platform dedicated to celebrating the
          achievements and impact of expatriate professionals across Bahrain.
          Curated by Update Media W.L.L. – The Daily Tribune, it highlights
          individuals who have played a key role in the nation’s progress across
          sectors such as business, education, healthcare, media, and the arts.
        </p>
        <p>
          Our mission is to create a trusted reference that connects, informs,
          and empowers professionals and organizations alike. By documenting
          stories of innovation, dedication, and cultural collaboration,
          Expatpedia aims to build bridges between communities and celebrate the
          spirit of unity that defines Bahrain’s global identity.
        </p>
      </div>

      {/* Footer Line */}
      <p className="text-white/70 mt-12 text-base md:text-lg font-light">
        Together, we honour talent, inspire excellence, and shape a shared
        future.
      </p>
    </section>
  );
};

export default MissionSection;
