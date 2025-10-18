import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../assets/logo1.png"; // replace with your logo file path

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🟦 Scroll Effect: Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`hidden lg:flex fixed left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[100vw] items-center justify-between px-16 transition-all duration-500 ${
          isScrolled
            ? "-top-2 bg-black/60 backdrop-blur-md shadow-md h-[100px]"
            : "-top-10 bg-transparent w-[90%] h-[165px]"
        }`}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center h-full">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className={`object-contain cursor-pointer transition-all duration-500 ${
                isScrolled ? "h-[130px]" : "h-[130px]"
              }`}
            />
          </Link>
        </div>

        {/* Nav Links Container */}
        <div
          className={`ml-auto flex items-center rounded-full px-6 py-2 space-x-12 transition-all duration-200 ${
            isScrolled
              ? "bg-transparent border-transparent shadow-none backdrop-blur-0"
              : "bg-black/30 border border-white/40 backdrop-blur-md shadow-md"
          }`}
        >
          <Link to="/" className="text-white text-md hover:opacity-80">
            Home
          </Link>
          <Link to="/about" className="text-white text-md hover:opacity-80">
            About
          </Link>
          <Link to="/members" className="text-white text-md hover:opacity-80">
            Community
          </Link>
          <Link to="#blog" className="text-white text-md hover:opacity-80">
            Blog
          </Link>

          {/* CTA Button */}
          <Link
            to="#contact"
            className="bg-[#0a66c2] text-white text-md font-medium px-5 py-2 rounded-xl hover:bg-[#0080ff] transition"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Mobile Navbar */}
      <header
        className={`lg:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 sm:px-10 transition-all duration-500 ${
          isScrolled ? "h-16 sm:h-20 bg-black/60 backdrop-blur-md shadow-md" : "h-20 sm:h-28 bg-transparent"
        }`}
      >
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className={`w-auto object-contain transition-all duration-500 ${
              isScrolled ? "h-20 sm:h-24 opacity-90" : "h-28 sm:h-32 opacity-100"
            }`}
          />
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className={`text-white transition-all duration-500 ${
            isScrolled ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
          }`}
          aria-label="Open menu"
        >
          <Menu size={32} />
        </button>
      </header>

      {/* Blur Background Overlay */}
      {menuOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Slide-in Menu Overlay */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white text-black transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 ease-in-out z-50`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-6 border-b border-gray-300">
          <button onClick={() => setMenuOpen(false)} className="text-black" aria-label="Close menu">
            <X size={28} />
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col mt-10 space-y-4 px-6 text-4xl sm:text-5xl text-[#2155a5] font-extrabold tracking-tight">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:opacity-70">
            Home
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:opacity-70">
            About
          </Link>
          <Link to="/members" onClick={() => setMenuOpen(false)} className="hover:opacity-70">
            Community
          </Link>
          <Link to="#blog" onClick={() => setMenuOpen(false)} className="hover:opacity-70">
            Blog
          </Link>
          <Link to="#contact" onClick={() => setMenuOpen(false)} className="hover:opacity-70">
            Contact
          </Link>
        </nav>

        {/* Social Icons */}
        <div className="absolute bottom-6 left-6 flex space-x-5 text-2xl">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 text-[#0a66c2]"
          >
            <FaInstagram />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 text-[#0a66c2]"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 text-[#2155a5]"
          >
            <FaFacebook />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 text-[#2155a5]"
          >
            <FaXTwitter />
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
