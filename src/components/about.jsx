import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, ArrowRight } from "lucide-react";
import aboutVideo from "../assets/about.mp4"; // ✅ replace with your video path

const AboutSection = () => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animated counters
  const [counts, setCounts] = useState({
    sectors: 0,
    professionals: 0,
    reach: 0,
    vision: 0,
  });

  const handleVideoToggle = () => {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Observe section visibility to trigger count animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
  }, []);

  // Counting animation logic
  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500; // in ms
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setCounts({
        sectors: Math.floor(progress * 7),
        professionals: Math.floor(progress * 1000),
        reach: Math.floor(progress * 100), // we’ll use suffix later
        vision: Math.floor(progress * 1),
      });
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isVisible]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full bg-white py-20 px-6 md:px-10 lg:px-20"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-start">
        {/* LEFT SECTION */}
        <div>
          <p className="text-[#0a66c2] text-sm font-semibold tracking-wide text-center md:text-left uppercase mb-2">
          About
        </p>
          <h2 className="text-2xl sm:text-4xl text-center md:text-left lg:text-5xl font-semibold leading-snug text-[#0a66c2] mb-5">
            Celebrating Expatriate{" "}
            <span className="text-gray-700 font-bold">
              Success Stories
            </span>{" "}
            in Bahrain
          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed text-justify hyphens-auto mb-10 max-w-md md:max-w-2xl">
            <span className="font-semibold">The Expatpedia</span> is an
            exclusive platform curated to recognize and celebrate the remarkable
            achievements of expatriate professionals residing in the Kingdom of
            Bahrain. Conceived and managed by{" "}
            <span className="font-semibold">
              Update Media W.L.L.  The Daily Tribune
            </span>
            , this prestigious publication and online directory highlights the
            invaluable contributions of non-Bahraini individuals across sectors
            such as business, healthcare, education, technology, arts, and
            media.
          </p>

          {/* GRID STATS SECTION */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-5">
            <div className="bg-[#e8f0f8] text-black rounded-2xl p-6 flex flex-col justify-center items-center">
              <h3 className="text-3xl font-semibold mb-1">{counts.sectors}+</h3>
              <p className="text-sm text-black">Key Sectors</p>
            </div>

            <div className="bg-[#e8f0f8] rounded-2xl p-6 flex flex-col justify-center items-center border border-gray-100">
              <h3 className="text-3xl font-semibold mb-1">
                {counts.professionals}+
              </h3>
              <p className="text-sm text-center text-gray-600">Professionals Honoured</p>
            </div>

            <div className="bg-[#e8f0f8] rounded-2xl p-6 flex flex-col justify-center items-center border border-gray-100">
              <h3 className="text-xl md:text-3xl font-semibold mb-1">
                {counts.reach >= 100 ? "Nationwide" : `${counts.reach}%`}
              </h3>
              <p className="text-sm text-center text-gray-600">Print & Online Reach</p>
            </div>

            <div className="bg-[#e8f0f8] rounded-2xl p-6 flex flex-col justify-center items-center border border-gray-100">
              <h3 className="text-3xl font-semibold mb-1">{counts.vision}</h3>
              <p className="text-sm text-gray-600">Shared Vision</p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-[#e8f0f8] p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full">
          <div>
            <p className="text-[#0a66c2] text-base md:text-lg leading-relaxed text-justify hyphens-auto mb-6">
              Our vision is to document and celebrate the journeys of
              outstanding expatriates while serving as a trusted reference for
              organizations, communities, and individuals seeking to connect
              with accomplished professionals in Bahrain. <br /> <br />
              Whether you’re an organization aiming to spotlight top talent or a
              professional eager to share your story,{" "}
              <span className="font-semibold">The Expatpedia</span> offers a
              platform of prestige, recognition, and inspiration.
            </p>

            {/* VIDEO CARD */}
            <div className="relative w-full rounded-2xl overflow-hidden mb-6">
              <video
                ref={videoRef}
                src={aboutVideo}
                className="w-full h-60 md:h-72 object-cover"
                onClick={handleVideoToggle}
              ></video>

              {/* Play / Pause Overlay */}
              <button
                onClick={handleVideoToggle}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
              >
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-white" />
                ) : (
                  <Play className="w-12 h-12 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* LEARN MORE BUTTON */}
          <button className="flex items-center gap-2 w-fit px-6 py-3 bg-[#0a66c2] text-white rounded-full hover:bg-[#0080ff] transition">
            Learn more <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
