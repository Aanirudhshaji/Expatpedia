import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
} from "react";

// ✅ Constants
const BACKEND_DOMAIN = "https://exaptpedia.onrender.com";

// ✅ Helper: Build query string
const buildQueryString = (paramsObj) => {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined)
      params.append(key, value);
  });
  return params.toString();
};

// ✅ Helper: Pagination range (pure function)
const getPaginationRange = (page, totalPages) => {
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

// ✅ Memoized MemberCard with Elite Highlight
const MemberCard = memo(({ member, flipped, onFlip }) => {
  const isElite =
  member.elite === true ||
  member.elite === "true" ||
  member.elite === 1 ||
  member.elite === "1" ||
  member.is_elite === true ||
  member.is_elite === "true" ||
  member.is_elite === 1 ||
  member.is_elite === "1" ||
  member.category?.toLowerCase() === "elite" ||
  member.occupation_category?.name?.toLowerCase()?.includes("elite") ||
  member.elite_tag === "elite";


  return (
    <div
      key={member.id}
      onClick={() => onFlip(member.id)}
      className={`group relative w-full h-[280px] sm:h-[380px] lg:h-[420px] cursor-pointer perspective transition-transform duration-300 ${
        isElite ? "elite-card hover:scale-[1.03]" : "hover:scale-[1.02]"
      }`}
    >
      {/* 🔥 Glowing Border for Elite */}
      {isElite && (
        <div className="absolute inset-0 rounded-3xl border-[3px] border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.6)] pointer-events-none z-20 animate-[eliteGlow_2.5s_ease-in-out_infinite]"></div>
      )}

      {/* 🌟 Elite Badge */}
      {isElite && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg z-30">
          🌟 Elite
        </div>
      )}

      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 rounded-3xl overflow-hidden shadow-lg ${
            isElite ? "bg-gradient-to-br from-yellow-50 to-white" : "bg-white"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={
              member._img || "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={member.name}
            className={`w-full h-full object-cover ${
              isElite ? "brightness-105 saturate-125" : ""
            }`}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 ${
              isElite
                ? "bg-gradient-to-t from-yellow-800/80 to-transparent"
                : "bg-gradient-to-t from-black/70 to-transparent"
            } p-4 sm:p-6 text-white`}
          >
            <h3 className="text-sm sm:text-lg font-semibold">{member.name}</h3>
            <p className="text-xs sm:text-sm text-gray-200">{member.position}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-3xl ${
            isElite
              ? "bg-gradient-to-br from-yellow-500 to-yellow-700"
              : "bg-blue-600"
          } text-white px-4 sm:px-6 py-6 flex flex-col justify-between`}
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          <div>
            <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
            <p className="text-sm opacity-90 mb-4">{member.position}</p>
            <p className="text-sm opacity-90">
              {member.occupation_category?.name}
            </p>
          </div>

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
                    aria-label="Email"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <rect x="2.5" y="4" width="19" height="16" rx="2.5" ry="2.5" />
                      <polyline points="3,6.5 12,13 21,6.5" />
                    </svg>
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-300 flex items-center justify-center"
                    title="Call"
                    aria-label="Phone"
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
  );
});

// ✅ Main Component
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

  const abortRefs = useRef({ members: null, categories: null });

  // ✅ Fetch categories (with caching)
  const fetchCategories = useCallback(async () => {
    const cached = localStorage.getItem("jobCategories");
    if (cached) {
      setJobCategories(JSON.parse(cached));
      return;
    }

    try {
      abortRefs.current.categories?.abort();
      abortRefs.current.categories = new AbortController();

      const res = await fetch(`${BACKEND_DOMAIN}/api/job-categories/`, {
        signal: abortRefs.current.categories.signal,
      });
      const data = await res.json();
      const cats = data.results || data || [];
      setJobCategories(cats);
      localStorage.setItem("jobCategories", JSON.stringify(cats));
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }, []);

  // ✅ Fetch members (debounced + abortable)
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    abortRefs.current.members?.abort();
    abortRefs.current.members = new AbortController();

    const params = {
      page,
      page_size: 8,
      search: searchQuery || undefined,
      category:
        !isEliteMode && filterType === "occupation" ? selectedCategory : undefined,
      starts_with:
        !isEliteMode && filterType === "letter" ? selectedLetter : undefined,
      sort: sortOrder === "asc" ? "name_asc" : "name_desc",
      elite: isEliteMode ? "true" : undefined,
    };

    const query = buildQueryString(params);
    const url = `${BACKEND_DOMAIN}/api/members/?${query}`;

    try {
      const res = await fetch(url, { signal: abortRefs.current.members.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const normalized = (data.results || data || []).map((m) => {
        // Fallback: mark first few results as elite when viewing elite page
        if (isEliteMode) {
          m.elite = true;
        }
        const raw = m.profile_image || "";
        const absoluteImg = !raw
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

  // ✅ Debounce fetchMembers
  useEffect(() => {
    const timeout = setTimeout(() => fetchMembers(), 400);
    return () => clearTimeout(timeout);
  }, [fetchMembers]);

  // ✅ Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ✅ Handlers
  const handleFilterChange = useCallback((type, value) => {
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
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterType("all");
    setSelectedCategory("");
    setSelectedLetter("");
    setSearchQuery("");
    setIsEliteMode(false);
    setPage(1);
  }, []);

  const toggleFlip = useCallback((id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // ✅ UI States
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg font-medium tracking-wide">
          Loading members...
        </p>
      </div>
    );

  if (error)
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

  // ✅ Main Layout
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

        {/* Filters */}
        <div className="mb-10">
          <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2">
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
              <MemberCard
                key={member.id}
                member={member}
                flipped={!!flippedCards[member.id]}
                onFlip={toggleFlip}
              />
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

              {getPaginationRange(page, totalPages).map((num, idx) =>
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
