import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

// Constants
const ITEMS_PER_PAGE = 8;
const BACKEND_DOMAIN = "https://exaptpedia.onrender.com";
const INITIAL_FETCH_PAGE_LIMIT = 50;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Utility functions
const normalizeNameForLetterCheck = (name = "") =>
  name.replace(/^\s*(dr\.?\s*)/i, "").trim();

const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 7;
};

const extractField = (member, fields) => {
  const field = fields.find((f) => {
    const v = member[f];
    return typeof v === "string" ? v.trim() : Boolean(v);
  });
  return field && typeof member[field] === "string"
    ? member[field].trim()
    : field
    ? String(member[field])
    : "";
};

// Custom hook for mounted state
const useIsMounted = () => {
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return isMountedRef;
};

// Custom hook for API calls
const useApi = () => {
  const isMountedRef = useIsMounted();
  
  // Cache cleanup function
  const cleanupOldCache = useCallback(() => {
    try {
      const now = Date.now();
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('api_cache_')) {
          try {
            const cached = sessionStorage.getItem(key);
            if (cached) {
              const { timestamp } = JSON.parse(cached);
              if (now - timestamp > CACHE_TTL) {
                sessionStorage.removeItem(key);
              }
            }
          } catch (e) {
            // Remove invalid cache entries
            sessionStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }, []);

  const fetchWithCache = useCallback(async (url, signal) => {
    const cacheKey = `api_cache_${btoa(url)}`;
    
    try {
      // Check cache first
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          return data;
        }
      }

      // Fetch fresh data
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the data with timestamp
      if (isMountedRef.current) {
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('Cache storage failed:', e);
        }
      }
      
      return data;
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
      return null;
    }
  }, [isMountedRef]);

  // Cleanup old cache on initial load
  useEffect(() => {
    cleanupOldCache();
  }, [cleanupOldCache]);

  return { fetchWithCache };
};

// Error Boundary Component
class TeamMembersErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TeamMembers Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white border border-red-100 rounded-2xl shadow-lg p-8 max-w-md text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-700 mb-2">Component Error</h2>
            <p className="text-gray-600 mb-4">Something went wrong loading team members.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-transform transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [flippedCards, setFlippedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [jobCategories, setJobCategories] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [backgroundLoading, setBackgroundLoading] = useState(false);

  const { fetchWithCache } = useApi();
  const isMountedRef = useIsMounted();
  const abortControllerRef = useRef(null);

  // Memoized data processing
  const processMembers = useCallback((members = []) =>
    members.map((member) => {
      const imageUrl = member.profile_image
        ? member.profile_image.startsWith("http")
          ? member.profile_image
          : `${BACKEND_DOMAIN}${member.profile_image}`
        : "";

      return {
        ...member,
        email: extractField(member, ["email", "user_email", "contact_email"]),
        phone: extractField(member, [
          "phone",
          "mobile",
          "phone_number",
          "contact_number",
        ]),
        name: member.name || member.full_name || "Unknown Name",
        occupation: member.position || member.occupation || "Not specified",
        description:
          member.description ||
          "",
        image: imageUrl,
      };
    }), []);

  // Fetch job categories
  const fetchJobCategories = useCallback(async () => {
    if (!isMountedRef.current) return [];
    
    try {
      const controller = new AbortController();
      const data = await fetchWithCache(`${BACKEND_DOMAIN}/api/job-categories/`, controller.signal);
      return data?.results || [];
    } catch (error) {
      if (error.name !== 'AbortError' && isMountedRef.current) {
        console.error("Error fetching job categories:", error);
      }
      return [];
    }
  }, [fetchWithCache, isMountedRef]);

  // Build API URL based on filters
  const buildMembersUrl = useCallback((page = 1, category = "") => {
    let url = `${BACKEND_DOMAIN}/api/members/`;
    const params = new URLSearchParams();
    
    if (page > 1) {
      params.append('page', page);
    }
    
    if (category) {
      params.append('category', category);
    }
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  }, []);

  // Fast fetch for first page only - immediate display
  const fetchFirstPageMembers = useCallback(async (category = "") => {
    if (!isMountedRef.current) return [];
    
    try {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const firstUrl = buildMembersUrl(1, category);
      const firstData = await fetchWithCache(firstUrl, controller.signal);
      
      if (firstData && isMountedRef.current) {
        return processMembers(firstData.results || []);
      }
      return [];
    } catch (error) {
      if (error.name !== 'AbortError' && isMountedRef.current) {
        console.error("Error fetching first page:", error);
      }
      return [];
    }
  }, [fetchWithCache, processMembers, buildMembersUrl, isMountedRef]);

  // Background fetch for remaining pages
  const fetchRemainingPages = useCallback(async (category = "", currentMembers = []) => {
    if (!isMountedRef.current) return;
    
    let page = 2;
    let accumulated = [...currentMembers];

    try {
      if (isMountedRef.current) {
        setBackgroundLoading(true);
      }
      
      // Fetch first page again to get total count and next pages info
      const firstUrl = buildMembersUrl(1, category);
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const firstData = await fetchWithCache(firstUrl, controller.signal);
      
      if (!firstData || !isMountedRef.current) return;

      let hasMorePages = firstData.next;
      
      while (hasMorePages && page <= INITIAL_FETCH_PAGE_LIMIT && isMountedRef.current) {
        const pageUrl = buildMembersUrl(page, category);
        const data = await fetchWithCache(pageUrl, controller.signal);
        
        if (!data || !isMountedRef.current) break;
        
        if (!data.results?.length) break;

        const newMembers = processMembers(data.results);
        accumulated = accumulated.concat(newMembers);
        
        // Update state with new members
        if (isMountedRef.current) {
          setTeamMembers([...accumulated]);
        }

        hasMorePages = data.next;
        if (!hasMorePages) break;
        page++;
      }
      
    } catch (error) {
      if (error.name !== 'AbortError' && isMountedRef.current) {
        console.error("Error in background fetch:", error);
      }
    } finally {
      if (isMountedRef.current) {
        setBackgroundLoading(false);
      }
    }
  }, [fetchWithCache, processMembers, buildMembersUrl, isMountedRef]);

  // Consolidated data fetching effect
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (isMountedRef.current) {
          setLoading(true);
        }

        // Fetch job categories first
        const categories = await fetchJobCategories();
        
        if (isMountedRef.current) {
          setJobCategories(categories);
          
          // Then fetch first page members for immediate display
          const firstPageMembers = await fetchFirstPageMembers();
          if (isMountedRef.current) {
            setTeamMembers(firstPageMembers);
            setLoading(false);
            
            // Start background loading of remaining pages
            if (filterType === "all" && !selectedOccupation && !selectedLetter) {
              fetchRemainingPages("", firstPageMembers);
            }
          }
        }
      } catch (err) {
        if (isMountedRef.current && err.name !== 'AbortError') {
          setError(err.message || "Failed to fetch data");
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchJobCategories, fetchFirstPageMembers, fetchRemainingPages, filterType, selectedOccupation, selectedLetter, isMountedRef]);

  // Effect for filter changes
  useEffect(() => {
    const handleFilterChange = async () => {
      if (!isMountedRef.current) return;

      try {
        if (filterType === "occupation" && selectedOccupation) {
          setLoading(true);
          const firstPageMembers = await fetchFirstPageMembers(selectedOccupation);
          if (isMountedRef.current) {
            setTeamMembers(firstPageMembers);
            setLoading(false);
            fetchRemainingPages(selectedOccupation, firstPageMembers);
          }
        } else if (filterType === "all" && !selectedOccupation && !selectedLetter) {
          setLoading(true);
          const firstPageMembers = await fetchFirstPageMembers();
          if (isMountedRef.current) {
            setTeamMembers(firstPageMembers);
            setLoading(false);
            fetchRemainingPages("", firstPageMembers);
          }
        } else if (filterType === "letter") {
          // Client-side only filter, no API call needed
          if (isMountedRef.current) {
            setLoading(false);
          }
        }
      } catch (err) {
        if (isMountedRef.current && err.name !== 'AbortError') {
          setError(err.message || "Failed to fetch data");
          setLoading(false);
        }
      }
    };

    handleFilterChange();
  }, [filterType, selectedOccupation, selectedLetter, fetchFirstPageMembers, fetchRemainingPages, isMountedRef]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, selectedLetter, sortOrder, selectedOccupation]);

  // Memoized filtered members with better performance
  const filteredMembers = useMemo(() => {
    let filtered = teamMembers;

    // Apply letter filter (client-side since it's alphabetical)
    if (filterType === "letter" && selectedLetter) {
      const letter = selectedLetter.toLowerCase();
      filtered = filtered.filter((member) => {
        const normalized = normalizeNameForLetterCheck(member?.name || "").toLowerCase();
        return normalized.startsWith(letter);
      });
    }

    // Apply search (client-side)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((member) =>
        (member?.name || "").toLowerCase().includes(q) ||
        (member?.occupation || "").toLowerCase().includes(q)
      );
    }

    // Sort (memoize sort function)
    return [...filtered].sort((a, b) => {
      const nameA = (a?.name || "").toLowerCase();
      const nameB = (b?.name || "").toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [teamMembers, searchQuery, filterType, selectedLetter, sortOrder]);

  // Memoized pagination calculations
  const { totalPages, paginatedMembers } = useMemo(() => {
    const total = Math.max(1, Math.ceil(filteredMembers.length / ITEMS_PER_PAGE));
    const current = Math.min(currentPage, total);
    const startIndex = (current - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return {
      totalPages: total,
      paginatedMembers: filteredMembers.slice(startIndex, endIndex)
    };
  }, [filteredMembers, currentPage]);

  // Memoized event handlers with proper dependencies
  const handleFilterChange = useCallback((type, value) => {
    setFilterType(type);
    if (type === "occupation") {
      setSelectedOccupation(value);
      setSelectedLetter("");
    } else if (type === "letter") {
      setSelectedLetter(value);
      setSelectedOccupation("");
    } else {
      // "all" filter
      setSelectedOccupation("");
      setSelectedLetter("");
    }
  }, []);

  const toggleFlip = useCallback((memberKey) => {
    setFlippedCards((prev) => ({
      ...prev,
      [memberKey]: !prev[memberKey],
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilterType("all");
    setSelectedLetter("");
    setSelectedOccupation("");
    setSearchQuery("");
  }, []);

  // Memoized pagination handlers
  const paginationHandlers = useMemo(() => ({
    goToFirstPage: () => setCurrentPage(1),
    goToPreviousPage: () => setCurrentPage(prev => Math.max(1, prev - 1)),
    goToNextPage: () => setCurrentPage(prev => Math.min(totalPages, prev + 1)),
    goToLastPage: () => setCurrentPage(totalPages),
  }), [totalPages]);

  // Memoized member key generator
  const getMemberKey = useCallback((member, idxGlobal) => {
    const baseKey = member?.id ?? member?.pk ?? `idx-${idxGlobal}`;
    return `${baseKey}-${idxGlobal}`;
  }, []);

  // Memoized pagination range calculator
  const paginationRange = useMemo(() => {
    const total = totalPages;
    const current = currentPage;
    const delta = 1;
    
    const range = [1];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (total > 1) range.push(total);

    const rangeWithDots = [];
    let prev = 0;
    
    for (let i = 0; i < range.length; i++) {
      const page = range[i];
      if (i === 0) {
        rangeWithDots.push(page);
        prev = page;
        continue;
      }
      if (page - prev > 1) rangeWithDots.push('...');
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Simple loading component without progress bar
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 text-lg font-medium tracking-wide">
          {filterType === "occupation" && selectedOccupation 
            ? `Loading ${selectedOccupation} members...` 
            : "Loading team members..."
          }
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Loading first page...
        </p>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-red-100 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops! Something went wrong</h2>
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
    <TeamMembersErrorBoundary>
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

          {/* Filters & Search */}
          <FiltersSection
            filterType={filterType}
            selectedOccupation={selectedOccupation}
            selectedLetter={selectedLetter}
            searchQuery={searchQuery}
            sortOrder={sortOrder}
            jobCategories={jobCategories}
            onFilterChange={handleFilterChange}
            onSearchChange={setSearchQuery}
            onSortChange={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            onClearFilters={clearAllFilters}
          />

          {/* Background loading indicator */}
          {backgroundLoading && (
            <div className="mb-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600 mr-2"></div>
              <p className="text-gray-600 text-sm">Loading more members in background...</p>
            </div>
          )}

          {/* Results count */}
          <ResultsCount 
            currentCount={paginatedMembers.length}
            totalCount={filteredMembers.length}
            originalCount={teamMembers.length}
            jobCategoriesCount={jobCategories.length}
            selectedOccupation={selectedOccupation}
            backgroundLoading={backgroundLoading}
          />

          {/* Members Grid */}
          <MembersGrid
            members={paginatedMembers}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            flippedCards={flippedCards}
            onToggleFlip={toggleFlip}
            getMemberKey={getMemberKey}
            onClearFilters={clearAllFilters}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginationRange={paginationRange}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
              handlers={paginationHandlers}
            />
          )}
        </div>
      </div>
    </TeamMembersErrorBoundary>
  );
};

// Optimized sub-components
const FiltersSection = React.memo(({
  filterType,
  selectedOccupation,
  selectedLetter,
  searchQuery,
  sortOrder,
  jobCategories,
  onFilterChange,
  onSearchChange,
  onSortChange,
  onClearFilters
}) => (
  <div className="mb-10">
    {/* Desktop Filters */}
    <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onFilterChange("all", "")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filterType === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          }`}
        >
          All
        </button>

        <select
          value={selectedOccupation}
          onChange={(e) => onFilterChange("occupation", e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-700 text-sm w-48"
        >
          <option value="">Job Category</option>
          {jobCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedLetter}
          onChange={(e) => onFilterChange("letter", e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-700 text-sm w-20"
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
          placeholder="Search by name or occupation..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-48 sm:w-64 focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-700 text-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          onClick={onSortChange}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-[#0a66c2] text-white hover:bg-[#88c2fb] transition"
        >
          Sort {sortOrder === "asc" ? "A–Z" : "Z–A"}
        </button>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition"
        >
          Clear All
        </button>
      </div>
    </div>

    {/* Mobile Filters */}
    <div className="md:hidden space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => onFilterChange("all", "")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
            filterType === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-blue-100"
          }`}
        >
          All
        </button>

        <select
          value={selectedOccupation}
          onChange={(e) => onFilterChange("occupation", e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-700 text-sm w-40"
        >
          <option value="">Job Category</option>
          {jobCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={selectedLetter}
          onChange={(e) => onFilterChange("letter", e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-700 text-sm w-20"
        >
          <option value="">A–Z</option>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by name or occupation..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none text-gray-700 text-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          onClick={onSortChange}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition whitespace-nowrap"
        >
          Sort {sortOrder === "asc" ? "A–Z" : "Z–A"}
        </button>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition whitespace-nowrap"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
));

const ResultsCount = React.memo(({ currentCount, totalCount, originalCount, jobCategoriesCount, selectedOccupation, backgroundLoading }) => (
  <div className="mb-6 text-gray-600">
    {selectedOccupation ? (
      <>
        Showing {currentCount} {selectedOccupation} team members
        {totalCount !== originalCount && ` (filtered from ${originalCount} total)`}
      </>
    ) : (
      <>
        Showing {currentCount} of {totalCount} team members
        {totalCount !== originalCount && ` (filtered from ${originalCount} total)`}
      </>
    )}
    {jobCategoriesCount > 0 && (
      <span className="text-sm text-blue-600 ml-2">
        • {jobCategoriesCount} job categories available
      </span>
    )}
    {backgroundLoading && (
      <span className="text-sm text-green-600 ml-2">
        • Loading more...
      </span>
    )}
  </div>
));

const MembersGrid = React.memo(({ members, currentPage, itemsPerPage, flippedCards, onToggleFlip, getMemberKey, onClearFilters }) => {
  if (members.length === 0) {
    return (
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white text-center">
        <div className="bg-white shadow-md rounded-2xl p-10 inline-block">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Team Members Found</h3>
          <p className="text-gray-500 text-sm mb-4">Try changing your filter or search query.</p>
          <button onClick={onClearFilters} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {members.map((member, idxLocal) => (
        <MemberCard
          key={getMemberKey(member, (currentPage - 1) * itemsPerPage + idxLocal)}
          member={member}
          isFlipped={!!flippedCards[getMemberKey(member, (currentPage - 1) * itemsPerPage + idxLocal)]}
          onToggleFlip={() => onToggleFlip(getMemberKey(member, (currentPage - 1) * itemsPerPage + idxLocal))}
        />
      ))}
    </div>
  );
});

const MemberCard = React.memo(({ member, isFlipped, onToggleFlip }) => {
  const hasEmail = isValidEmail(member.email);
  const hasPhone = isValidPhone(member.phone);
  const [imgError, setImgError] = useState(false);
  const isMountedRef = useIsMounted();
  const placeholderImage = "https://via.placeholder.com/600x400?text=No+Image";

  const handleImageError = useCallback(() => {
    if (isMountedRef.current) {
      setImgError(true);
    }
  }, [isMountedRef]);

  useEffect(() => {
    return () => {
      // Cleanup function for image error state
    };
  }, []);

  return (
    <div 
      className="group relative w-full h-[280px] sm:h-[380px] lg:h-[420px] cursor-pointer perspective" 
      onClick={onToggleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleFlip();
        }
      }}
      aria-label={`Flip card for ${member.name}, ${member.occupation}`}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`} style={{ transformStyle: "preserve-3d" }}>
        {/* Front */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-lg bg-white" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
          <img 
            src={imgError ? placeholderImage : (member.image || placeholderImage)} 
            alt={member.name} 
            loading="lazy" 
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 text-white">
            <h3 className="text-sm sm:text-lg font-semibold">{member.name || "Unknown Name"}</h3>
            <p className="text-xs sm:text-sm text-gray-200">{member.occupation || "Not specified"}</p>
          </div>
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Click to flip</div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-3xl bg-blue-600 text-white px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-between" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
          <div>
            <h3 className="text-sm sm:text-2xl font-semibold mb-2">{member.name || "Unknown Name"}</h3>
            <p className="text-xs sm:text-base opacity-90 mb-4">{member.occupation || "Not specified"}</p>
            <p className="text-sm sm:text-sm leading-relaxed opacity-90 mb-6">{member.description}</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <p className="text-xs text-white/70">Get in touch</p>
            <div className="flex justify-center space-x-4">
              {hasEmail && (
                <a 
                  href={`mailto:${member.email}`} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white hover:text-blue-600 transition-colors" 
                  onClick={(e) => e.stopPropagation()} 
                  title="Send Email"
                  aria-label={`Send email to ${member.name}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              )}
              {hasPhone && (
                <a 
                  href={`tel:${member.phone}`} 
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white hover:text-blue-600 transition-colors" 
                  onClick={(e) => e.stopPropagation()} 
                  title="Call"
                  aria-label={`Call ${member.name}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.684l1.22 3.664a1 1 0 01-.272 1.05l-2.32 2.32a11.042 11.042 0 005.657 5.657l2.32-2.32a1 1 0 011.05-.272l3.664 1.22a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const Pagination = React.memo(({ currentPage, totalPages, paginationRange, itemsPerPage, onPageChange, handlers }) => (
  <div className="flex justify-center mt-12">
    <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
      <div className="sm:hidden text-sm text-gray-600 font-medium">Page {currentPage} of {totalPages}</div>
      
      <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-xl shadow-sm border border-gray-200 px-3 sm:px-4 py-2">
        <PaginationButton onClick={handlers.goToFirstPage} disabled={currentPage === 1} title="First Page" aria-label="Go to first page">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </PaginationButton>

        <PaginationButton onClick={handlers.goToPreviousPage} disabled={currentPage === 1} className="flex items-center gap-1 px-3 py-2 text-sm font-medium" aria-label="Go to previous page">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </PaginationButton>

        <div className="flex items-center gap-1 mx-2">
          {paginationRange.map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} className="px-2 py-1 text-gray-400 text-sm font-medium" aria-hidden="true">•••</span>
            ) : (
              <button 
                key={page} 
                onClick={() => onPageChange(Number(page))} 
                className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${page === currentPage ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <PaginationButton onClick={handlers.goToNextPage} disabled={currentPage === totalPages} className="flex items-center gap-1 px-3 py-2 text-sm font-medium" aria-label="Go to next page">
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </PaginationButton>

        <PaginationButton onClick={handlers.goToLastPage} disabled={currentPage === totalPages} title="Last Page" aria-label="Go to last page">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </PaginationButton>
      </div>

      <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
        <div className="font-medium">Page {currentPage} of {totalPages}</div>
        <div className="text-gray-500">{itemsPerPage} items per page</div>
      </div>
    </div>
  </div>
));

const PaginationButton = React.memo(({ onClick, disabled, title, className = "", children, ...props }) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    className={`p-2 rounded-lg transition-all duration-200 ${disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"} ${className}`} 
    title={title}
    {...props}
  >
    {children}
  </button>
));

export default TeamMembers;