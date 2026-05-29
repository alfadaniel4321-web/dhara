import { useState, useEffect } from "react";
import { Languages, Globe } from "lucide-react";
import { setLanguage, getLanguage } from "../data/i18n";

const LANGUAGES = [
  { code: "ml", label: "മലയാളം", flag: "🇮🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

export default function LanguageSelector({ onLanguageChange, variant = "dropdown" }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(getLanguage());

  useEffect(() => {
    setCurrent(getLanguage());
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setCurrent(code);
    setOpen(false);
    if (onLanguageChange) onLanguageChange(code);
  };

  if (variant === "inline") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          padding: "4px 6px",
          borderRadius: "12px",
          background: "rgba(1,50,32,0.04)",
        }}
      >
        <Globe size={14} color="#666" style={{ marginRight: "2px" }} />
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            style={{
              padding: "0.4rem 0.6rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.7rem",
              lineHeight: 1.2,
              fontWeight: current === lang.code ? 700 : 500,
              color: current === lang.code ? "#fff" : "#666",
              background: current === lang.code ? "#2D6A4F" : "transparent",
              transition: "all 0.2s ease",
            }}
            aria-label={`Switch to ${lang.label}`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  const currentLang = LANGUAGES.find((l) => l.code === current);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
        style={{
          background: open ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.8)",
          cursor: "pointer",
        }}
      >
        <Languages size={14} />
        <span>{currentLang ? currentLang.label : "മലയാളം"}</span>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-xl overflow-hidden"
            style={{
              background: "rgba(4,47,26,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200"
                style={{
                  background:
                    current === lang.code
                      ? "rgba(34,197,94,0.15)"
                      : "transparent",
                  color:
                    current === lang.code
                      ? "#22c55e"
                      : "rgba(255,255,255,0.7)",
                }}
                onMouseEnter={(e) => {
                  if (current !== lang.code)
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (current !== lang.code)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
