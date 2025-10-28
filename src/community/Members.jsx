import React, { useState, useEffect } from "react";
const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [flippedCards, setFlippedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const ITEMS_PER_PAGE = 8;

  const normalizeNameForLetterCheck = (name = "") => {
    return name.replace(/^\s*(dr\.?\s*)/i, "").trim();
  };

  // Helper functions
  const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    if (!phone || typeof phone !== 'string') return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 7;
  };

  const extractField = (member, fields) => {
    const field = fields.find(f => member[f]?.trim());
    return field ? member[field].trim() : '';
  };

  const generatePlaceholderImage = (name) => {
    const baseColor = "4F46E5";
    const textColor = "FFFFFF"; 
    const cleanName = (name || "Team Member").replace(/\s+/g, '+');
    return `https://via.placeholder.com/400x400/${baseColor}/${textColor}?text=${cleanName}`;
  };

  // -- Fetching all data from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        let allMembers = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(
            `https://admin.texbay.in/api/accounts/customUser/?page=${page}`
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          
          const data = await response.json();
          const members = data.results || [];
          
          // Process members with contact info extraction
          const processedMembers = members.map(member => ({
            ...member,
            email: extractField(member, ['email', 'user_email', 'contact_email']),
            phone: extractField(member, ['phone', 'mobile', 'phone_number', 'contact_number']),
            name: member.name || 'Unknown Name',
            occupation: member.occupation || 'Not specified',
            description: member.description || 'This team member is a key part of our organization, driving growth and innovation.',
            image: member.image || ''
          }));

          allMembers = allMembers.concat(processedMembers);
          
          // Check if there are more pages
          hasMore = data.next && members.length > 0;
          page++;
          
          // Safety limit
          if (page > 50) {
            console.warn("Page limit reached, stopping pagination");
            break;
          }
        }

        // Sort members by name starting with A
        const sortedMembers = allMembers.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );

        setTimeout(() => {
          setTeamMembers(sortedMembers);
          setFilteredMembers(sortedMembers);
          setLoading(false);
        }, 300);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // -- Filtering, searching, sorting
  useEffect(() => {
    let filtered = [...teamMembers];

    if (filterType === "doctor") {
      filtered = filtered.filter((member) => {
        const name = (member?.name || "").toLowerCase();
        const occupation = (member?.occupation || "").toLowerCase();
        return (
          name.startsWith("dr.") ||
          name.startsWith("dr ") ||
          occupation.includes("doctor")
        );
      });
    } else if (filterType === "letter" && selectedLetter) {
      const letter = selectedLetter.toLowerCase();
      filtered = filtered.filter((member) => {
        const normalized = normalizeNameForLetterCheck(member?.name || "")
          .toLowerCase();
        return normalized.startsWith(letter);
      });
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((member) =>
        (member?.name || "").toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => {
      const nameA = (a?.name || "").toLowerCase();
      const nameB = (b?.name || "").toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setFilteredMembers(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterType, selectedLetter, teamMembers, sortOrder]);

  // Clamp currentPage whenever filteredMembers changes
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredMembers.length / ITEMS_PER_PAGE));
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [filteredMembers, ITEMS_PER_PAGE]);

  // Helper to get a stable key for a member
  const getMemberKey = (member, idxGlobal) => {
    return (
      member?.id ??
      member?.pk ??
      member?.email ??
      member?.username ??
      `idx-${idxGlobal}`
    );
  };

  // Toggle flip by stable key
  const toggleFlip = (memberKey) => {
    setFlippedCards((prev) => ({
      ...prev,
      [memberKey]: !prev[memberKey],
    }));
  };

  // Handle image error
  const handleImageError = (e, memberKey) => {
    e.target.src = generatePlaceholderImage("Team Member");
  };

  // Pagination helpers
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE) || 1;

  const getPageNumbers = () => {
    const total = totalPages;
    const current = currentPage;
    const pages = [];

    // If small number of pages, show all
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Always show first
    pages.push(1);

    // Determine window around current page
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);

    // If current is near beginning, extend right
    if (current <= 3) {
      start = 2;
      end = 4;
    }

    // If current near end, extend left
    if (current >= total - 2) {
      start = total - 3;
      end = total - 1;
    }

    if (start > 2) {
      pages.push("left-ellipsis");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total - 1) {
      pages.push("right-ellipsis");
    }

    // Always show last
    pages.push(total);

    return pages;
  };

  // Slice for current page
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Clear all filters
  const clearAllFilters = () => {
    setFilterType("all");
    setSelectedLetter("");
    setSearchQuery("");
  };

  // ------------------ RENDER ------------------

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 mb-6"></div>
        <p className="text-gray-600 text-lg font-medium tracking-wide">
          Loading team members...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-red-100 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-14 h-14 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-red-700 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-transform transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Meet Our Exceptional Team
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Driven by creativity and collaboration, our experts deliver tailored
            solutions to bring your ideas to life.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFilterType("all");
                  setSelectedLetter("");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  filterType === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
              >
                All
              </button>

              <button
                onClick={() => {
                  setFilterType("doctor");
                  setSelectedLetter("");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  filterType === "doctor"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
              >
                Doctor
              </button>

              <select
                value={selectedLetter}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedLetter(val);
                  setFilterType(val ? "letter" : "all");
                }}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-700 text-sm"
              >
                <option value="">A–Z</option>
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                  <option key={letter} value={letter}>
                    {letter}
                  </option>
                ))}
              </select>
            </div>

            <div className="ml-auto flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Search by name..."
                className="border border-gray-300 rounded-lg px-4 py-2 w-48 sm:w-64 focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-700 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition"
              >
                Sort {sortOrder === "asc" ? "A–Z" : "Z–A"}
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-gray-600">
          Showing {paginatedMembers.length} of {filteredMembers.length} team members
          {filteredMembers.length !== teamMembers.length && 
            ` (filtered from ${teamMembers.length} total)`
          }
        </div>

        {/* Members Grid - 1 column on mobile */}
        {paginatedMembers.length === 0 ? (
          <div className="py-24 bg-gradient-to-b from-gray-50 to-white text-center">
            <div className="bg-white shadow-md rounded-2xl p-10 inline-block">
              <svg
                className="w-20 h-20 text-gray-300 mx-auto mb-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Team Members Found</h3>
              <p className="text-gray-500 text-sm mb-4">Try changing your filter or search query.</p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedMembers.map((member, idxLocal) => {
              const idxGlobal = (currentPage - 1) * ITEMS_PER_PAGE + idxLocal;
              const memberKey = getMemberKey(member, idxGlobal);
              const isFlipped = !!flippedCards[memberKey];
              const hasEmail = isValidEmail(member.email);
              const hasPhone = isValidPhone(member.phone);

              return (
                <div
                  key={memberKey}
                  className="group relative w-full h-[280px] sm:h-[380px] lg:h-[420px] cursor-pointer perspective"
                  onClick={() => toggleFlip(memberKey)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg bg-white"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <img
                        src={member.image || generatePlaceholderImage(member.name)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, memberKey)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 text-white">
                        <h3 className="text-sm sm:text-lg font-semibold">{member.name || "Unknown Name"}</h3>
                        <p className="text-xs sm:text-sm text-gray-200">{member.occupation || "Not specified"}</p>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        Click to flip
                      </div>
                    </div>

                    {/* Back with Contact Icons */}
                    <div
                      className="absolute inset-0 rounded-3xl bg-blue-600 text-white px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-between"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <div>
                        <h3 className="text-sm sm:text-2xl font-semibold mb-2">{member.name || "Unknown Name"}</h3>
                        <p className="text-xs sm:text-base opacity-90 mb-4">{member.occupation || "Not specified"}</p>
                        <p className="text-sm sm:text-sm leading-relaxed opacity-90 mb-6">
                          {member.description}
                        </p>
                      </div>
                      
                      {/* Contact Icons */}
                      <div className="flex flex-col items-center space-y-3">
                        <p className="text-xs text-white/70">Get in touch</p>
                        <div className="flex justify-center space-x-4">
                          {/* Email Icon */}
                          {hasEmail && (
                            <a 
                              href={`mailto:${member.email}`}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white hover:text-blue-600 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                              title="Send Email"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </a>
                          )}
                          
                          {/* Phone Icon */}
                          {hasPhone && (
                            <a 
                              href={`tel:${member.phone}`}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white hover:text-blue-600 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                              title="Call"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </a>
                          )}
                          
                          {/* No contact info */}
                          {!hasEmail && !hasPhone && (
                            <div className="text-center">
                              <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-xs text-white/70">No contact info</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredMembers.length > ITEMS_PER_PAGE && (
          <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {getPageNumbers().map((item, idx) => {
              if (item === "left-ellipsis" || item === "right-ellipsis") {
                return <span key={item + idx} className="px-3 py-2 text-gray-500">...</span>;
              }

              return (
                <button
                  key={item}
                  onClick={() => setCurrentPage(Number(item))}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === item
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {item}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;