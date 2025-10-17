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

// Pages
import Aboutsec from "./aboutus/Aboutsec";
import Members from "./community/Members";

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="relative w-full min-h-screen overflow-hidden">
        <Navbar />

        <Routes>
          {/* Home Page */}
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
                <Footer />
              </>
            }
          />

          {/* About Page */}
          <Route
            path="/about"
            element={
              <>
                <Aboutsec />
                <Footer />
              </>
            }
          />

          {/* Members Page */}
          <Route
            path="/members"
            element={
              <>
                <Members />
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
