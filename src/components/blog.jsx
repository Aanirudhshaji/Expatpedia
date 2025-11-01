import React, { useState, useEffect } from "react";
import { Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ added for navigation

const API_URL = "https://exaptpedia.onrender.com/api/Blog/";

const placeholderImages = [
  "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80",
];

// Helper: Placeholder
const getPlaceholderImage = (index) => placeholderImages[index % placeholderImages.length];

// Helper: Estimate read time
const getReadTime = (content = "") => `${Math.max(1, Math.ceil(content.length / 200))} Min`;

// Helper: Video thumbnail
const getVideoThumbnail = (url) => {
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : null;
};

// Helper: Scroll to top
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const Blog = () => {
  const navigate = useNavigate(); // ✅ initialize navigation hook

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Fetch blogs
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const formatted = (data.results || [])
          .filter((b) => b.is_published)
          .map((b, i) => {
            const isVideo =
              b.media &&
              [".mp4", ".webm", ".mov", ".avi"].some((ext) => b.media.includes(ext));
            return {
              id: b.id,
              title: b.title,
              date: new Date(b.created_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              }),
              readTime: getReadTime(b.content),
              image: b.banner || getPlaceholderImage(i),
              video: isVideo ? b.media : null,
              mediaType: isVideo ? "video" : "image",
              desc: b.content || "Discover more about this topic.",
              author: b.author,
            };
          });
        setBlogs(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const currentBlogs = blogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (p) => {
    setCurrentPage(p);
    scrollToTop();
  };

  const paginationRange = (() => {
    const delta = 1;
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }
    return range.reduce((acc, i, idx, arr) => {
      if (idx && i - arr[idx - 1] > 1) acc.push("...");
      acc.push(i);
      return acc;
    }, []);
  })();

  // --- RENDER STATES ---
  if (loading || error) {
    const isError = Boolean(error);
    return (
      <section className="bg-white mb-8 py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center mb-14">
          <p className="text-[#0a66c2] text-sm font-semibold uppercase mb-2">
            News & Articles
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Insights and Updates from <br className="hidden md:block" />
            <span className="text-[#0a66c2]">The Expatpedia</span>
          </h2>
          {!isError && (
            <p className="text-gray-600 text-base mt-4 max-w-2xl mx-auto">
              Discover inspiring stories, essential information, and updates from Bahrain's exclusive platform celebrating expatriate excellence.
            </p>
          )}
        </div>

        <div className="max-w-7xl mx-auto text-center py-20">
          {isError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Failed to Load Blogs
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading blogs...</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  // --- MAIN UI ---
  return (
    <section className="bg-white mb-8 py-10 md:py-16 px-6 md:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <p className="text-[#0a66c2] text-sm font-semibold uppercase mb-2">News & Articles</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          Insights and Updates from <br className="hidden md:block" />
          <span className="text-[#0a66c2]">The Expatpedia</span>
        </h2>
        <p className="text-gray-600 text-base mt-4 max-w-2xl mx-auto">
          Discover inspiring stories, essential information, and updates from Bahrain's exclusive platform celebrating expatriate excellence.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-4 snap-x snap-mandatory scroll-smooth">
          {currentBlogs.map((b, i) => (
            <div
              key={b.id}
              onClick={() => navigate(`/blog/${b.id}`)} // ✅ redirect to blog detail page
              className="bg-[#e8f0f8] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col min-w-[85%] sm:min-w-[60%] md:min-w-0 snap-center cursor-pointer"
            >
              {/* Media */}
              <div className="relative h-52 w-full overflow-hidden bg-gray-200">
                {b.mediaType === "video" ? (
                  <>
                    <img
                      src={getVideoThumbnail(b.video) || b.image}
                      alt={b.title}
                      className="h-full w-full object-cover"
                      onError={(e) => (e.target.src = getPlaceholderImage(i))}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ prevent card navigation
                        window.open(b.video, "_blank");
                      }}
                      className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-20 transition-all duration-300 group"
                    >
                      <div className="bg-white bg-opacity-90 rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-blue-600 fill-blue-600 ml-1" />
                      </div>
                    </button>
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Video
                    </div>
                  </>
                ) : (
                  <img
                    src={b.image}
                    alt={b.title}
                    className="h-full w-full object-cover"
                    onError={(e) => (e.target.src = getPlaceholderImage(i))}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#0080ff] transition-colors duration-200">
                    {b.title}
                  </h3>
                  {/* Content description is now hidden - removed the <p> tag */}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                  <span>{b.date}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{b.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {/* (same as your existing pagination, unchanged) */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-12">
            <div className="sm:hidden text-sm text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
              {/* First */}
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>

              {/* Prev */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Pages */}
              <div className="flex items-center gap-1 mx-2">
                {paginationRange.map((p, idx) =>
                  p === "..." ? (
                    <span key={idx} className="px-2 py-1 text-gray-400 text-sm font-medium">
                      •••
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                        p === currentPage
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              {/* Next */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Last */}
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
              <div className="font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <div className="text-gray-500">
                Showing {currentBlogs.length} of {blogs.length} blogs
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;