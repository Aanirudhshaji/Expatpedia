import React, { useState, useEffect, useCallback, useRef } from "react";

// Constants
const BACKEND_DOMAIN = "https://exaptpedia.onrender.com";

// Helper to build query strings
const buildQueryString = (paramsObj) => {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined)
      params.append(key, value);
  });
  return params.toString();
};

// Main Component
const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterType, setFilterType] = useState("all");
  const [flippedCards, setFlippedCards] = useState({});
  const [isEliteMode, setIsEliteMode] = useState(false);
  const abortRef = useRef(null);

  // Fetch job categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_DOMAIN}/api/job-categories/`);
      const data = await res.json();
      setJobCategories(data.results || data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  // Fetch members (backend-driven)
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const params = {
      page,
      page_size: 8, // 8 members per page
      search: searchQuery || undefined,
      category:
        !isEliteMode && filterType === "occupation" ? selectedCategory : undefined,
      starts_with:
        !isEliteMode && filterType === "letter" ? selectedLetter : undefined,
      sort: sortOrder === "asc" ? "name_asc" : "name_desc",
      elite: isEliteMode ? "true" : undefined, // Elite filter
    };

    const query = buildQueryString(params);
    const url = `${BACKEND_DOMAIN}/api/members/?${query}`;

    try {
      const res = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Normalize backend response
      const normalized = (data.results || data || []).map((m) => {
        const raw = m.profile_image || "";
        const absoluteImg =
          !raw
            ? null
            : raw.startsWith("http")
            ? raw
            : `${BACKEND_DOMAIN}${raw.startsWith("/") ? "" : "/"}${raw}`;
        return {
          ...m,
          _img: absoluteImg,
          email: m.email || "",
          phone: m.phone || "",
        };
      });

      setMembers(normalized);
      setTotalPages(Math.ceil(data.count / 8) || 1);
    } catch (err) {
      if (err.name !== "AbortError") setError("Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    searchQuery,
    selectedCategory,
    selectedLetter,
    sortOrder,
    filterType,
    isEliteMode,
  ]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleFilterChange = (type, value) => {
    setFilterType(type);
    setPage(1);
    if (type === "occupation") {
      setSelectedCategory(value);
      setSelectedLetter("");
      setIsEliteMode(false);
    } else if (type === "letter") {
      setSelectedLetter(value);
      setSelectedCategory("");
      setIsEliteMode(false);
    } else {
      setSelectedCategory("");
      setSelectedLetter("");
    }
  };

  const clearAllFilters = () => {
    setFilterType("all");
    setSelectedCategory("");
    setSelectedLetter("");
    setSearchQuery("");
    setIsEliteMode(false);
    setPage(1);
  };

  const toggleFlip = useCallback((id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta))
        range.push(i);
    }
    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg font-medium tracking-wide">
          Loading members...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-red-100 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops!</h2>
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-6 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-700 mb-6">
            Meet Our Members
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Driven by creativity and collaboration, <br /> our members deliver
            tailored solutions to bring your ideas to life.
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-10">
          <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2">
              {/* All Button */}
              <button
                onClick={() => {
                  setIsEliteMode(false);
                  handleFilterChange("all", "");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  !isEliteMode && filterType === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                }`}
              >
                All
              </button>

              {/* 🌟 Elite Members Button */}
              <button
                onClick={() => {
                  setIsEliteMode(true);
                  setFilterType("elite");
                  setSelectedCategory("");
                  setSelectedLetter("");
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isEliteMode
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-yellow-100"
                }`}
              >
                🌟 Elite Members
              </button>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange("occupation", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 text-gray-700 text-sm w-48"
              >
                <option value="">Job Category</option>
                {jobCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* A–Z Filter */}
              <select
                value={selectedLetter}
                onChange={(e) => handleFilterChange("letter", e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 text-gray-700 text-sm w-20"
              >
                <option value="">A–Z</option>
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Search + Sort + Clear */}
            <div className="ml-auto flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by name or occupation..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-blue-600 text-gray-700 text-sm"
              />
              <button
                onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0a66c2] text-white hover:bg-[#88c2fb]"
              >
                Sort {sortOrder === "asc" ? "A–Z" : "Z–A"}
              </button>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-500 text-white hover:bg-gray-600"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="group relative w-full h-[280px] sm:h-[380px] lg:h-[420px] cursor-pointer perspective"
                onClick={() => toggleFlip(member.id)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                    flippedCards[member.id] ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg bg-white"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src={
                        member._img ||
                        "https://via.placeholder.com/600x400?text=No+Image"
                      }
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 text-white">
                      <h3 className="text-sm sm:text-lg font-semibold">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-200">
                        {member.position}
                      </p>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-3xl bg-blue-600 text-white px-4 sm:px-6 py-6 flex flex-col justify-between"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {member.name}
                      </h3>
                      <p className="text-sm opacity-90 mb-4">
                        {member.position}
                      </p>
                      <p className="text-sm opacity-90">
                        {member.occupation_category?.name}
                      </p>
                    </div>

                    {/* Contact Section */}
                    {(member.email || member.phone) && (
                      <div className="text-center mt-8">
                        <p className="text-sm opacity-80 mb-3">Get in touch</p>
                        <div className="flex justify-center gap-5">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-300 flex items-center justify-center"
                              title="Send Email"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21.75 8.25v7.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25v-7.5m19.5 0L12 13.5 2.25 8.25"
                                />
                              </svg>
                            </a>
                          )}
                          {member.phone && (
                            <a
                              href={`tel:${member.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-300 flex items-center justify-center"
                              title="Call"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 6.75c0 8.284 6.716 15 15 15a2.25 2.25 0 0 0 2.25-2.25v-1.286a1.125 1.125 0 0 0-.852-1.09l-3.105-.776a1.125 1.125 0 0 0-1.173.417l-.97 1.293a11.954 11.954 0 0 1-5.297-5.297l1.293-.97a1.125 1.125 0 0 0 .417-1.173l-.776-3.105a1.125 1.125 0 0 0-1.09-.852H4.5A2.25 2.25 0 0 0 2.25 6.75z"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-20">
              No members found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center justify-center gap-2 flex-wrap bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white"
                }`}
              >
                Prev
              </button>

              {getPaginationRange().map((num, idx) =>
                num === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className="px-3 py-2 text-gray-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      num === page
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;
