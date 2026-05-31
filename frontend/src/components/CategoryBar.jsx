import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from '../services/api';

const EMOJI_MAP = {
  'Vegetables': '🥬', 'Fruits': '🍎', 'Milk': '🥛', 'Eggs': '🥚',
  'Rice & Grains': '🌾', 'Fresh Herbs': '🌿', 'Spices': '🧂',
  'Honey & Jams': '🍯', 'Dry Products': '🏝️', 'Snacks': '🥜',
  'Drinks': '🧃', 'Meat': '🥩', 'Fish': '🐟', 'Others': '🌱'
};

function getCategoryEmoji(name) {
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  return '🌱';
}

function formatCategoryLabel(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
}

export default function CategoryBar({ selectedCat, onSelect }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.products.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const checkArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 4);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkArrows);
    window.addEventListener("resize", checkArrows);
    return () => {
      el.removeEventListener("scroll", checkArrows);
      window.removeEventListener("resize", checkArrows);
    };
  }, []);

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  return (
    <div className="relative group/bar">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-[#013220] hover:shadow-xl transition-all duration-200 opacity-0 group-hover/bar:opacity-100"
          style={{ backdropFilter: "blur(8px)" }}
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto py-3 px-1 hide-scrollbar"
        style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
      >
        {/* All button */}
        <button
          onClick={() => onSelect("All")}
          className={`
            relative flex flex-col items-center justify-center gap-1.5 px-5 py-3 rounded-2xl
            font-semibold text-sm shrink-0 transition-all duration-300 ease-out
            ${selectedCat === "All"
              ? "bg-[#013220] text-white shadow-lg shadow-[#013220]/20 scale-105"
              : "bg-white text-gray-700 border border-gray-100 hover:border-[#A3C87A]/40 hover:shadow-lg hover:shadow-[#A3C87A]/10 hover:-translate-y-0.5"
            }
          `}
        >
          <span className="text-xl leading-none">🌱</span>
          <span>All</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`
              relative flex flex-col items-center justify-center gap-1.5 px-5 py-3 rounded-2xl
              font-medium text-sm shrink-0 transition-all duration-300 ease-out
              ${selectedCat === cat
                ? "bg-[#013220] text-white shadow-lg shadow-[#013220]/20 scale-105"
                : "bg-white text-gray-600 border border-gray-100 hover:border-[#A3C87A]/40 hover:shadow-lg hover:shadow-[#A3C87A]/10 hover:-translate-y-0.5"
              }
            `}
          >
            <span className="text-xl leading-none">{getCategoryEmoji(cat)}</span>
            <span className="whitespace-nowrap">{formatCategoryLabel(cat)}</span>
            {selectedCat === cat && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#A3C87A]" />
            )}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-gray-600 hover:text-[#013220] hover:shadow-xl transition-all duration-200 opacity-0 group-hover/bar:opacity-100"
          style={{ backdropFilter: "blur(8px)" }}
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Gradient fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#F4F6F3] to-transparent z-[1]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#F4F6F3] to-transparent z-[1]" />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (hover: hover) {
          .group\\/bar:hover .opacity-0 { opacity: 1; }
        }
        @media (max-width: 640px) {
          .group\\/bar .opacity-0 { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
