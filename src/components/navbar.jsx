import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Menu, X } from "lucide-react";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../assets/logo1.png"; // replace with your logo file path

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:flex fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-9xl h-[30px] items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center h-full">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-[130px] w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Glassmorphic Nav Container */}
        <div className="ml-auto flex items-center bg-black/30 border border-white/40 backdrop-blur-md rounded-full px-6 py-2 space-x-12 shadow-md">
          <Link to="/about" className="text-white text-sm hover:opacity-80">
            About
          </Link>
          <Link to="/members" className="text-white text-sm hover:opacity-80">
            Community
          </Link>
          <Link to="#blog" className="text-white text-sm hover:opacity-80">
            Blog
          </Link>

          {/* CTA Button */}
          <Link
            to="#contact"
            className="bg-[#0a66c2] text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-[#0080ff] transition"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Mobile Navbar (unchanged) */}
      <header className="lg:hidden fixed top-0 left-0 w-full z-50 bg-transparent flex justify-between items-center h-16 sm:h-20 px-6 sm:px-10">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-28 sm:h-38 w-auto object-contain"
          />
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-3xl sm:text-4xl"
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
        {/* Close Button with Border */}
        <div className="flex justify-end p-6 border-b border-gray-300">
          <button onClick={() => setMenuOpen(false)} className="text-black">
            <X size={28} />
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col mt-10 space-y-4 px-6 text-4xl sm:text-5xl text-[#2155a5] font-extrabold tracking-tight">
          <a href="/about" className="hover:opacity-70">About</a>
          <a href="#work" className="hover:opacity-70">Work</a>
          <a href="#news" className="hover:opacity-70">News</a>
          <a href="#team" className="hover:opacity-70">Team</a>
          <a href="#contact" className="hover:opacity-70">Contact</a>
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
