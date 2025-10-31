import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const API_URL = "https://exaptpedia.onrender.com/api/Blog/";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Blog API Response:", data); // Debug log
        
        // Filter only published blogs and map to required format
        const formattedBlogs = (data.results || [])
          .filter(blog => blog.is_published)
          .map((blog, index) => ({
            id: blog.id,
            title: blog.title,
            date: new Date(blog.created_at).toLocaleDateString('en-US', { 
              day: 'numeric', 
              month: 'short' 
            }),
            readTime: `${Math.max(1, Math.ceil((blog.content?.length || 0) / 200))} Min`, // Estimate read time
            image: blog.banner || getPlaceholderImage(index),
            desc: blog.content || "Discover more about this topic.",
            author: blog.author
          }));
        
        setBlogs(formattedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get placeholder images based on index
  const getPlaceholderImage = (index) => {
    const placeholderImages = [
      "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80",
    ];
    return placeholderImages[index % placeholderImages.length];
  };

  // Pagination calculations
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  // Generate pagination range with ellipsis
  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let prev = 0;
    for (let i of range) {
      if (i - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="bg-white mb-8 py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center mb-14">
          <p className="text-[#0a66c2] text-sm font-semibold tracking-wide uppercase mb-2">
            News & Articles
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Insights and Updates from <br className="hidden md:block" />
            <span className="text-[#0a66c2]">The Expatpedia</span>
          </h2>
          <p className="text-gray-600 text-base mt-4 max-w-2xl mx-auto">
            Discover inspiring stories, essential information, and updates from
            Bahrain's exclusive platform celebrating expatriate excellence.
          </p>
        </div>
        <div className="max-w-7xl mx-auto flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white mb-8 py-10 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto text-center mb-14">
          <p className="text-[#0a66c2] text-sm font-semibold tracking-wide uppercase mb-2">
            News & Articles
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Insights and Updates from <br className="hidden md:block" />
            <span className="text-[#0a66c2]">The Expatpedia</span>
          </h2>
        </div>
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Failed to Load Blogs</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white mb-8 py-10 md:py-16 px-6 md:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <p className="text-[#0a66c2] text-sm font-semibold tracking-wide uppercase mb-2">
          News & Articles
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          Insights and Updates from <br className="hidden md:block" />
          <span className="text-[#0a66c2]">The Expatpedia</span>
        </h2>
        <p className="text-gray-600 text-base mt-4 max-w-2xl mx-auto">
          Discover inspiring stories, essential information, and updates from
          Bahrain's exclusive platform celebrating expatriate excellence.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="max-w-7xl mx-auto">
        <div
          className="
            flex md:grid md:grid-cols-2 lg:grid-cols-4 
            gap-6 
            overflow-x-auto md:overflow-visible
            pb-4 
            snap-x snap-mandatory 
            scroll-smooth
          "
        >
          {currentBlogs.map((blog) => (
            <div
              key={blog.id}
              className="
                bg-[#e8f0f8] 
                rounded-2xl 
                shadow-sm hover:shadow-lg 
                transition-all duration-300 
                overflow-hidden flex flex-col
                min-w-[85%] sm:min-w-[60%] md:min-w-0
                snap-center
              "
            >
              {/* Image */}
              <img
                src={blog.image}
                alt={blog.title}
                className="h-52 w-full object-cover"
                onError={(e) => {
                  e.target.src = getPlaceholderImage(blog.id);
                }}
              />

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#0080ff] transition-colors duration-200 cursor-pointer">
                    {blog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.desc}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                  <span>{blog.date}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - Only show if more than 4 blogs */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-12">
            {/* Mobile pagination info */}
            <div className="sm:hidden text-sm text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3">
              {/* First Page Button */}
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg transition-all duration-200 disabled:text-gray-300 disabled:cursor-not-allowed text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                title="First Page"
                aria-label="Go to first page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>

              {/* Previous Page Button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:text-gray-300 disabled:cursor-not-allowed text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                aria-label="Go to previous page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-2">
                {getPaginationRange().map((page, index) =>
                  page === '...' ? (
                    <span
                      key={`dots-${index}`}
                      className="px-2 py-1 text-gray-400 text-sm font-medium"
                      aria-hidden="true"
                    >
                      •••
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(Number(page))}
                      className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                        page === currentPage
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              {/* Next Page Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:text-gray-300 disabled:cursor-not-allowed text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                aria-label="Go to next page"
              >
                <span className="hidden sm:inline">Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Last Page Button */}
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg transition-all duration-200 disabled:text-gray-300 disabled:cursor-not-allowed text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                title="Last Page"
                aria-label="Go to last page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Desktop pagination info */}
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