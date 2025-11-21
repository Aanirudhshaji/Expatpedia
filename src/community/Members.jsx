import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
} from "react";
import { Mail, Phone } from "lucide-react";

const BACKEND_DOMAIN = "https://exaptpedia.onrender.com";

const buildQueryString = (paramsObj) => {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined)
      params.append(key, value);
  });
  return params.toString();
};

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
      className={`group relative w-full h-[400px] sm:h-[380px] lg:h-[420px] cursor-pointer perspective transition-transform duration-300 ${
        isElite ? "elite-card hover:scale-[1.03]" : "hover:scale-[1.02]"
      }`}
    >
      {isElite && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg z-30">
          🌟 Elite Members
        </div>
      )}

      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div
          className={`absolute inset-0 rounded-3xl overflow-hidden shadow-lg ${
            isElite ? "bg-gradient-to-br from-white" : "bg-white"
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 text-white">
            <h3 className="text-sm sm:text-lg font-semibold">{member.name}</h3>
            <p className="text-xs sm:text-sm text-gray-200">{member.position}</p>
          </div>
        </div>

        <div
          className={`absolute inset-0 rounded-3xl ${
            isElite
              ? "bg-gradient-to-br from-blue-500 to-blue-700"
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
                  >
                    <Mail className="w-5 h-5 text-white" />
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-300 flex items-center justify-center"
                    title="Call"
                  >
                    <Phone className="w-5 h-5 text-white" />
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

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // 🔥 NEW

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterType, setFilterType] = useState("all");
  const [flippedCards, setFlippedCards] = useState({});
  const [isEliteMode, setIsEliteMode] = useState(false);

  const abortRefs = useRef({ members: null, categories: null });

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
    } catch (_) {}
  }, []);

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

      // FIXED HERE
      ordering: sortOrder === "asc" ? "name" : "-name",

      elite: isEliteMode ? "true" : undefined,
    };

    const query = buildQueryString(params);
    const url = `${BACKEND_DOMAIN}/api/members/?${query}`;

    try {
      const res = await fetch(url, { signal: abortRefs.current.members.signal });
      const data = await res.json();

      const normalized = (data.results || data || []).map((m) => {
        const eliteFlag =
          m.elite_member === true ||
          m.elite_member === "true" ||
          m.elite === true ||
          m.is_elite === true ||
          m.category?.toLowerCase() === "elite" ||
          m.occupation_category?.name?.toLowerCase()?.includes("elite");

        const raw = m.profile_image || "";
        const absoluteImg = !raw
          ? null
          : raw.startsWith("http")
          ? raw
          : `${BACKEND_DOMAIN}${raw.startsWith("/") ? "" : "/"}${raw}`;

        return {
          ...m,
          _img: absoluteImg,
          elite: eliteFlag,
          email: m.email || "",
          phone: m.phone || "",
        };
      });

      const filteredMembers = isEliteMode
        ? normalized.filter((m) => m.elite)
        : normalized;

      setMembers(filteredMembers);

      setTotalPages(
        Math.ceil(
          (isEliteMode ? filteredMembers.length : data.count || filteredMembers.length) / 8
        ) || 1
      );
    } catch (_) {
      setError("Failed to fetch members.");
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
    const timeout = setTimeout(() => fetchMembers(), 400);
    return () => clearTimeout(timeout);
  }, [fetchMembers]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
    setSearchInput(""); // reset input also
    setIsEliteMode(false);
    setPage(1);
  }, []);

  const toggleFlip = useCallback((id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-0 pb-24">
      <section className="relative w-full min-h-[450px] md:min-h-[620px] flex flex-col justify-end items-center overflow-hidden mb-16">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://res.cloudinary.com/demeflwme/video/upload/v1761030149/timelapse-of-a-dramatic-sunset-over-almuharraq-isl-2025-08-28-23-15-34-utc_ilctbl.mp4"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-10"></div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-28 text-center text-white">
          <h1 className="text-white font-medium leading-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Honouring Expatriate <br className="hidden sm:block" /> Excellence in Bahrain
          </h1>
          <p className="text-gray-200 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Celebrating the remarkable contributions of expatriates who inspire progress,
            unity, and innovation across the Kingdom.
          </p>

          {/* 🔥 FILTERS */}
          <div className="relative w-full mt-6 px-4">
            <div className="w-[90%] max-w-5xl mx-auto rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 shadow-lg flex flex-wrap justify-center items-center gap-3 sm:gap-4 py-3 sm:py-4">
              
              {/* All */}
              <button
                onClick={() => {
                  setIsEliteMode(false);
                  handleFilterChange("all", "");
                }}
                className={`w-[90%] sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition ${
                  !isEliteMode && filterType === "all"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                All
              </button>

              {/* Elite */}
              <button
                onClick={() => {
                  setIsEliteMode(true);
                  setFilterType("elite");
                  setSelectedCategory("");
                  setSelectedLetter("");
                  setPage(1);
                }}
                className={`w-[90%] sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isEliteMode
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg"
                    : "bg-white/20 hover:bg-white/30 text-white"
                }`}
              >
                🌟 Elite Members
              </button>

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => handleFilterChange("occupation", e.target.value)}
                className="w-[90%] sm:w-auto px-3 py-2 rounded-lg border border-white/40 bg-white/10 text-white focus:ring-2 focus:ring-yellow-400 text-sm"
              >
                <option value="">Job Category</option>
                {jobCategories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="text-gray-900">
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* A–Z */}
              <select
                value={selectedLetter}
                onChange={(e) => handleFilterChange("letter", e.target.value)}
                className="w-[90%] sm:w-auto px-3 py-2 rounded-lg border border-white/40 bg-white/10 text-white focus:ring-2 focus:ring-yellow-400 text-sm"
              >
                <option value="">A–Z</option>
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
                  <option key={l} value={l} className="text-gray-900">
                    {l}
                  </option>
                ))}
              </select>

              {/* 🔥 SEARCH INPUT */}
              <input
                type="text"
                placeholder="Search by name or occupation..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-[90%] sm:w-auto border border-white/40 rounded-lg px-4 py-2 bg-white/10 text-white placeholder-white/70 focus:ring-2 focus:ring-yellow-400 text-sm"
              />

              {/* 🔥 SEARCH BUTTON */}
              <button
                onClick={() => {
                  setSearchQuery(searchInput);
                  setPage(1);
                }}
                className="w-[90%] sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-green-600 transition"
              >
                Search
              </button>

              {/* Sort */}
              <button
                onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
                className="w-[90%] sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Sort {sortOrder === "asc" ? "A–Z" : "Z–A"}
              </button>

              <button
                onClick={clearAllFilters}
                className="w-[90%] sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
