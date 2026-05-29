import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, X, TrendingUp, Clock, Loader2 } from "lucide-react";
import { api } from "../services/api";

const TRENDING = ["Organic Vegetables", "Fresh Milk", "Free Range Eggs", "Raw Honey", "Coconut Oil"];
const RECENT_KEY = "dhara_recent_searches";
const MAX_RECENT = 5;

function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecent(query) {
  const existing = getRecent().filter(s => s.toLowerCase() !== query.toLowerCase());
  existing.unshift(query);
  localStorage.setItem(RECENT_KEY, JSON.stringify(existing.slice(0, MAX_RECENT)));
}

export default function SearchBar({ onSearchChange }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const recentSearches = getRecent();

  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.products.searchProducts(q);
      setSuggestions(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIdx(-1);
    if (onSearchChange) onSearchChange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 250);
  };

  const handleSubmit = (q) => {
    const term = (q || query).trim();
    if (!term) return;
    saveRecent(term);
    setQuery(term);
    setFocused(false);
    setSuggestions([]);
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  const handleSelect = (product) => {
    const id = product.id || product._id;
    if (id) {
      saveRecent(product.title || query);
      setFocused(false);
      setSuggestions([]);
      navigate(`/product/${id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIdx >= 0 && selectedIdx < suggestions.length) {
        handleSelect(suggestions[selectedIdx]);
      } else {
        handleSubmit();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setSelectedIdx(-1);
    if (onSearchChange) onSearchChange("");
    inputRef.current?.focus();
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    if (onSearchChange) onSearchChange(term);
    fetchSuggestions(term);
  };

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = focused && (query.trim() || suggestions.length > 0 || loading || recentSearches.length > 0);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { setFocused(true); setShowTrending(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search products, categories, farmers..."
          className="w-full h-12 pl-12 pr-20 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-all"
          autoComplete="off"
          aria-label="Search products"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button onClick={handleClear} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors" aria-label="Clear search">
              <X size={16} className="text-gray-400" />
            </button>
          )}
          <button
            onClick={() => handleSubmit()}
            className="p-2 rounded-lg bg-green-700 hover:bg-green-800 transition-colors"
            aria-label="Search"
          >
            <Search size={16} className="text-white" />
          </button>
        </div>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {loading && (
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 border-b border-gray-100">
              <Loader2 size={16} className="animate-spin text-green-700" />
              Searching products...
            </div>
          )}

          {!loading && query.trim() && suggestions.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-400">
              <Search size={32} className="mx-auto mb-2 text-gray-300" />
              <div className="font-medium text-gray-500 mb-1">No products found</div>
              <div className="text-xs">Try a different keyword</div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                Suggestions
              </div>
              {suggestions.map((p, i) => (
                <button
                  key={p._id || p.id || i}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(p); }}
                  onMouseEnter={() => setSelectedIdx(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${selectedIdx === i ? "bg-green-50" : "hover:bg-gray-50"}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img src={p.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{p.title}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {p.farmerName && <span className="truncate">{p.farmerName}</span>}
                      {p.category && <span className="text-gray-300">·</span>}
                      {p.category && <span>{p.category}</span>}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-green-800 flex-shrink-0">₹{p.price}</div>
                </button>
              ))}
              <button
                onMouseDown={(e) => { e.preventDefault(); handleSubmit(query); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-green-700 border-t border-gray-100 hover:bg-green-50 transition-colors"
              >
                <Search size={14} />
                See all results for "{query}"
              </button>
            </div>
          )}

          {!query.trim() && recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Clock size={12} /> Recent Searches</span>
              </div>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => { e.preventDefault(); handleRecentClick(term); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <Clock size={14} className="text-gray-300 flex-shrink-0" />
                  <span className="truncate">{term}</span>
                </button>
              ))}
            </div>
          )}

          {!query.trim() && recentSearches.length === 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 flex items-center gap-1.5">
                <TrendingUp size={12} /> Trending Searches
              </div>
              <div className="p-3 flex flex-wrap gap-2">
                {TRENDING.map((term, i) => (
                  <button
                    key={i}
                    onMouseDown={(e) => { e.preventDefault(); handleRecentClick(term); }}
                    className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
