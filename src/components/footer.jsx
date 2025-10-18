import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import logo from "../assets/logo1.png";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-10 md:py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-0.5 flex flex-col md:flex-row md:justify-between md:items-center gap-10">
        {/* Left Section */}
        <div className="flex flex-col gap-4 max-w-lg">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Expatpedia Logo" className="w-28 h-auto" />
          </div>
          <p className="text-sm md:text-base leading-relaxed text-gray-400">
            Celebrating Excellence, Recognizing Impact — The Expatpedia honours the invaluable contributions of expatriates shaping Bahrain’s growth and diversity.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col md:items-end gap-4 text-sm md:text-base">
          <p className="text-gray-400 md:max-w-md leading-relaxed md:self-start">
            Connect, Inspire & Empower — Explore the stories and journeys of exceptional professionals in the Kingdom of Bahrain.
          </p>
          <button className="md:mr-1.5 mt-3 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition">
            Join The Directory →
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 mt-10 pt-6">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          {/* Navigation */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/about" className="hover:text-white transition">About Us</Link>
            <Link to="/members" className="hover:text-white transition">Community</Link>
            <Link to="/register" className="hover:text-white transition">Contact</Link>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center md:justify-end gap-4">
            <a href="#" className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition">
              <FaLinkedinIn className="text-gray-400 hover:text-white text-lg" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition">
              <FaXTwitter className="text-gray-400 hover:text-white text-lg" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition">
              <FaFacebookF className="text-gray-400 hover:text-white text-lg" />
            </a>
            <a href="#" className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition">
              <FaInstagram className="text-gray-400 hover:text-white text-lg" />
            </a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2025 The Expatpedia. All rights reserved</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/policy" className="hover:text-white transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
