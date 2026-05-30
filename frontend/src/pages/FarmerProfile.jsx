import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, Save, Edit3, User, MapPin, Phone, Home, Globe, FileText, Check } from "lucide-react";
import { motion } from "framer-motion";
import SpeechReader from "../components/SpeechReader";
import { api } from "../services/api";
import { t, getLanguage } from "../data/i18n";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function FarmerProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const lang = getLanguage();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    address: user?.address || "",
    phone: user?.phone || "",
    village: user?.village || "",
    district: user?.district || "",
    description: user?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.farmer.updateProfile(form);
      const updatedUser = { ...user, ...form };
      localStorage.setItem("dhara_user", JSON.stringify(updatedUser));
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "name", icon: User, label: t("profile.name", lang), placeholder: "Madhavan Nair" },
    { key: "address", icon: MapPin, label: t("profile.address", lang), placeholder: "Wayanad, Kerala", multiline: true },
    { key: "phone", icon: Phone, label: t("profile.phone", lang), placeholder: "+91 94471 23456" },
    { key: "village", icon: Home, label: t("profile.village", lang), placeholder: "Muttil" },
    { key: "district", icon: Globe, label: t("profile.district", lang), placeholder: "Wayanad" },
    { key: "description", icon: FileText, label: t("profile.description", lang), placeholder: "Organic farming since 1998", multiline: true },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl mx-auto pb-12">
      <motion.div variants={item} className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/farmer")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#666",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem 0",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2D6A4F")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
        >
          <ChevronLeft size={16} />
          {t("dashboard.home", lang)}
        </button>
        <SpeechReader
          text={`${t("profile.title", lang)} - ${form.name}, ${form.village}, ${form.district}`}
          lang={lang === "ml" ? "ml-IN" : lang === "hi" ? "hi-IN" : "en-IN"}
        />
      </motion.div>

      <motion.div
        variants={item}
        style={{
          background: "rgba(255,255,255,0.92)",
          borderRadius: "20px",
          padding: "2rem",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "#EBF5EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#2D6A4F",
              }}
            >
              {form.name ? form.name.charAt(0).toUpperCase() : "F"}
            </div>
            <div>
              <h1
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#013220",
                  margin: 0,
                }}
              >
                {t("profile.title", lang)}
              </h1>
              <p style={{ color: "#888", fontSize: "0.8rem", margin: "2px 0 0" }}>
                {form.name || user?.name}
              </p>
            </div>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1.25rem",
                borderRadius: "10px",
                fontSize: "0.8rem",
                fontWeight: 600,
                background: "#EBF5EB",
                border: "1px solid rgba(45,106,79,0.15)",
                color: "#2D6A4F",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#D7F3DC";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#EBF5EB";
              }}
            >
              <Edit3 size={14} />
              {t("profile.edit", lang)}
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 1.25rem",
                borderRadius: "10px",
                fontSize: "0.8rem",
                fontWeight: 600,
                background: "#013220",
                border: "none",
                color: "white",
                cursor: "pointer",
                opacity: saving ? 0.6 : 1,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.background = "#2D6A4F";
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.background = "#013220";
              }}
            >
              {saving ? (
                <div
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                  }}
                />
              ) : (
                <Save size={14} />
              )}
              {t("profile.save", lang)}
            </button>
          )}
        </div>

        {saved && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              background: "#EBF5EB",
              color: "#22c55e",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            <Check size={14} />
            Profile saved successfully!
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {fields.map((f) => {
            const Icon = f.icon;
            const val = form[f.key];
            return (
              <div key={f.key}>
                {editing ? (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#2D6A4F",
                        marginBottom: "6px",
                      }}
                    >
                      {f.label}
                    </label>
                    {f.multiline ? (
                      <textarea
                        value={val}
                        onChange={handleChange(f.key)}
                        placeholder={f.placeholder}
                        rows={2}
                        style={{
                          width: "100%",
                          borderRadius: "12px",
                          padding: "0.75rem 1rem",
                          fontSize: "0.85rem",
                          color: "#013220",
                          background: "#F4F6F3",
                          border: "1px solid #E0EAE0",
                          outline: "none",
                          resize: "vertical",
                          transition: "border-color 0.2s ease",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#E0EAE0")}
                      />
                    ) : (
                      <input
                        type={f.key === "phone" ? "tel" : "text"}
                        value={val}
                        onChange={handleChange(f.key)}
                        placeholder={f.placeholder}
                        style={{
                          width: "100%",
                          borderRadius: "12px",
                          padding: "0.75rem 1rem",
                          fontSize: "0.85rem",
                          color: "#013220",
                          background: "#F4F6F3",
                          border: "1px solid #E0EAE0",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#E0EAE0")}
                      />
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      background: "#F4F6F3",
                    }}
                  >
                    <Icon size={16} color="#2D6A4F" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "0.7rem",
                          color: "#888",
                          margin: 0,
                          fontWeight: 500,
                        }}
                      >
                        {f.label}
                      </p>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#013220",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {val || <span style={{ color: "rgba(1,50,32,0.25)", fontStyle: "italic" }}>Not set</span>}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
