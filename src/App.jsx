import React from "react";
import { Routes, Route } from "react-router-dom";
// Global Components
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";
// Page Sections
import Hero from "./components/hero";
import AboutSection from "./components/about";
import CTA from "./components/cta";
import ImageScroll from "./components/imagescroll";
import FAQ from "./components/faq";
import Blog from "./components/blog";
import Aboutsec from "./aboutus/Aboutsec";

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Navbar appears on all pages */}
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <AboutSection />
                <ImageScroll />
                <CTA />
                <FAQ />
                <Blog />
              </>
            }
          />
          <Route path="/about" element={<Aboutsec />} />
        </Routes>

        {/* Footer appears on all pages */}
        <Footer />
      </div>
    </>
  );
}

export default App;
