import React, { useEffect, useState } from "react";

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const API_URL = "https://exaptpedia.onrender.com/api/Event/";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data); // Debug log
        
        // Set events from results array
        setEvents(data.results || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Format date and time
  const formatEventDateTime = (date, time) => {
    if (!date) return "Date TBA";
    
    const eventDate = new Date(`${date}T${time || '00:00:00'}`);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(time && { hour: '2-digit', minute: '2-digit' })
    });
  };

  // Get placeholder image based on event title
  const getEventImage = (event) => {
    // You can replace this with actual banner images when available
    const placeholderImages = [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=400&fit=crop"
    ];
    
    // Use banner if available, otherwise use placeholder
    return event.banner || placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
  };

  // Pagination calculations
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

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
      <section className="w-full bg-[#f6f6f9] py-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-gray-300 pb-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Latest Events
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading latest events...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-[#f6f6f9] py-24 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-gray-300 pb-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              Latest Events
            </h2>
          </div>
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Failed to Load Events</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f6f6f9] py-24 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-gray-300 pb-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Latest Events
          </h2>
          <div className="text-sm text-gray-500 mt-2 sm:mt-0">
            Showing {currentEvents.length} of {events.length} events
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md mx-auto">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
              <p className="text-gray-500">Check back later for upcoming events.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentEvents.map((event) => (
                <div
                  key={event.id}
                  className="relative rounded-2xl overflow-hidden group shadow-md transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-white"
                >
                  {/* Event Image */}
                  <img
                    src={getEventImage(event)}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=400&fit=crop";
                    }}
                  />

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-white text-gray-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                    {formatEventDateTime(event.date, event.time).split(',')[0]} {/* Day only */}
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {event.description || "Join us for an exciting event!"}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{event.location || "Location TBA"}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatEventDateTime(event.date, event.time)}</span>
                    </div>

                    {event.mainstreamLink && (
                      <a
                        href={event.mainstreamLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Join Event
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Only show if more than one page */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4">
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
                    {itemsPerPage} events per page
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventSection;