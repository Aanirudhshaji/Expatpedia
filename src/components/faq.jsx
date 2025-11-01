import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ctabg } from "../assets/image"; // ✅ replace with your actual image path

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

    const faqs = [
    {
      question: "What is The Expatpedia?",
      answer:
        "The Expatpedia is an exclusive initiative by Update Media W.L.L. – The Daily Tribune, created to celebrate the achievements of expatriates across various sectors in the Kingdom of Bahrain. It’s both a printed and digital platform that highlights professionals, innovators, and changemakers contributing to Bahrain’s growth.",
    },
    {
      question: "Who can participate in The Expatpedia?",
      answer:
        "Participation is open exclusively to expatriates (non-Bahrainis) currently residing and working in the Kingdom of Bahrain. The platform recognizes individuals who have made meaningful contributions in fields such as business, healthcare, education, technology, arts, and media.",
    },
    {
      question: "Is there any registration fee or cost involved?",
      answer:
        "No. Participation in The Expatpedia is completely free. There are no registration or inclusion fees for being featured in the directory, either in print or online.",
    },
    {
      question: "How can I submit my profile to be featured?",
      answer:
        "You can fill out the registration form available on our website by providing your name, designation, organization, contact details, and a high-resolution photograph. Once submitted, our editorial team will review your profile and notify selected candidates via email.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-12 px-6 md:px-12 lg:px-20">
      {/* Section Header */}
      <div className="text-center md:text-left mb-12">
        <p className="text-[#0a66c2] text-sm tracking-wide mb-2">
          FAQs
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-black leading-tight text-center md:text-left">
          Common queries <br /> about our{" "}
          <span className="text-[#0a66c2] font-bold">Expatpedia</span>
        </h2>
      </div>

      {/* FAQ Content Grid */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Left Image Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <img
          src={ctabg}
          alt="Yoga help"
          className="w-full h-[400px] md:h-[480px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center md:items-start md:justify-end p-8 md:p-10 text-center md:text-left">
          <h3 className="text-white text-2xl md:text-3xl font-semibold mb-4 leading-snug">
            Need any help? <br /> Don’t hesitate to join us.
          </h3>
          <Link
            to="/contact"
            className="bg-white text-gray-900 font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition-all"
          >
            Join now →
          </Link>
        </div>
      </div>

        {/* Right FAQ Section */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl border ${
                activeIndex === index ? "bg-gray-50 border-gray-300" : "border-gray-200"
              } p-5 transition-all duration-300`}
            >
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-base md:text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all ${
                    activeIndex === index
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              {activeIndex === index && (
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
