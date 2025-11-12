import React from "react";
import { Routes, Route } from "react-router-dom";

// Global Components
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";

// Page Sections
import AboutSection from "./components/about";
import CTA from "./components/cta";
import ImageScroll from "./components/imagescroll";
import FAQ from "./components/faq";
import Blog from "./components/blog";

// Pages
import Aboutsec from "./aboutus/Aboutsec";
import Members from "./community/Members";
import Terms from "./Terms&Conditions/terms";
import Policy from "./Terms&Conditions/policy";
import Contact from "./contactus/contact";
import Events from "./events/eventui";
import BlogDetail from "./components/blogDetail";

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
                <Members />
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
            path="/terms"
            element={
              <>
                <Terms />
                <Footer />
              </>
            }
          />
          <Route
            path="/policy"
            element={
              <>
                <Policy />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Contact />
                <Footer />
              </>
            }
          />
          <Route
            path="/eventui"
            element={
              <>
                <Events />
                <Footer />
              </>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <>
                <BlogDetail />
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
