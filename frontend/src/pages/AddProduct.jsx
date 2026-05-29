import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Check, Image, Clock, IndianRupee, Package, Truck, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { getProductImage } from "../data/productImages";
import { getNutrition } from "../data/nutritionDB";
import SpeechReader from "../components/SpeechReader";
import { t, getLanguage } from "../data/i18n";

export default function AddProduct() {
  const navigate = useNavigate();
  const lang = getLanguage();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split("T")[0]);
  const [available, setAvailable] = useState(true);
  const [delivery, setDelivery] = useState("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [nutrition, setNutritionInfo] = useState(null);

  useEffect(() => {
    if (name.trim()) {
      const img = getProductImage(name);
      setPreviewImg(img);
      const nut = getNutrition(name);
      setNutritionInfo(nut);
    } else {
      setPreviewImg(null);
      setNutritionInfo(null);
    }
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !quantity) {
      alert("Please fill name, price, and quantity");
      return;
    }
    setSubmitting(true);
    try {
      const nut = getNutrition(name);
      await api.products.createProduct({
        title: name,
        image: previewImg || getProductImage(name),
        category: "Vegetables",
        price: Number(price),
        quantity: quantity,
        stock: 100,
        harvestDate: new Date(harvestDate).toISOString(),
        availableTime: "06:00 AM - 12:00 PM",
        nutrition: nut ? nut.items.join(", ") : "Fresh farm produce",
        protein: nut ? nut.protein : "Fresh",
        freshnessScore: 98,
      });
      setSuccess("Product added successfully!");
      setName("");
      setPrice("");
      setQuantity("");
      setHarvestDate(new Date().toISOString().split("T")[0]);
      setPreviewImg(null);
      setNutritionInfo(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/farmer"
          className="flex items-center gap-2 text-xs no-underline"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          <ChevronLeft size={16} />
          {t("dashboard.home", lang)}
        </Link>
        <SpeechReader
          text={`Add product. Product name: ${name || "not entered"}. Price: ${price || "not set"}. Quantity: ${quantity || "not set"}.`}
          lang={lang === "ml" ? "ml-IN" : lang === "hi" ? "hi-IN" : "en-IN"}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(45,106,79,0.2) 0%, rgba(4,47,26,0.6) 100%)",
          border: "1px solid rgba(149,213,178,0.12)",
        }}
      >
        <h1 className="text-xl font-bold text-white mb-1">{t("product.add", lang)}</h1>
        <p className="text-xs mb-6" style={{ color: "rgba(149,213,178,0.5)" }}>
          Fill in the details below
        </p>

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl text-xs font-medium"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              color: "#22c55e",
            }}
          >
            <Check size={14} />
            {success}
          </motion.div>
        )}

        {/* Image preview */}
        {previewImg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(149,213,178,0.15)",
            }}
          >
            <div className="relative">
              <img
                src={previewImg}
                alt={name}
                className="w-full h-48 object-cover"
              />
              <div
                className="absolute top-2 right-2 px-3 py-1 rounded-full text-[10px] font-bold"
                style={{
                  background: "rgba(34,197,94,0.9)",
                  color: "#fff",
                }}
              >
                {t("product.available", lang)}
              </div>
            </div>
            {nutrition && (
              <div className="p-3" style={{ background: "rgba(0,0,0,0.2)" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "#95D5B2" }}>
                  {nutrition.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {nutrition.items.slice(0, 4).map((item, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-lg text-[10px] font-medium"
                      style={{
                        background: "rgba(149,213,178,0.1)",
                        color: "rgba(149,213,178,0.8)",
                        border: "1px solid rgba(149,213,178,0.1)",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 mt-2 text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <span>Protein: {nutrition.protein}</span>
                  <span>Energy: {nutrition.energy}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(149,213,178,0.7)" }}>
              <Image size={12} style={{ display: "inline", marginRight: 4 }} />
              {t("product.name", lang)}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Banana, Coconut, Egg..."
              className="w-full rounded-xl px-4 py-3.5 text-base text-white transition-all"
              style={{
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.08)",
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(149,213,178,0.4)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(149,213,178,0.7)" }}>
                <IndianRupee size={12} style={{ display: "inline", marginRight: 4 }} />
                {t("product.price", lang)}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="₹"
                min="0"
                className="w-full rounded-xl px-4 py-3.5 text-base text-white transition-all"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(149,213,178,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(149,213,178,0.7)" }}>
                <Package size={12} style={{ display: "inline", marginRight: 4 }} />
                {t("product.quantity", lang)}
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1 kg, 12 nos"
                className="w-full rounded-xl px-4 py-3.5 text-base text-white transition-all"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(149,213,178,0.4)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                required
              />
            </div>
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(149,213,178,0.7)" }}>
              <Clock size={12} style={{ display: "inline", marginRight: 4 }} />
              {t("product.harvestTime", lang)}
            </label>
            <input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 text-base text-white transition-all"
              style={{
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.08)",
                outline: "none",
                colorScheme: "dark",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(149,213,178,0.4)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              required
            />
          </div>

          {/* Availability toggle */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(149,213,178,0.7)" }}>
              <AlertCircle size={12} style={{ display: "inline", marginRight: 4 }} />
              {t("product.availability", lang)}
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAvailable(true)}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: available ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${available ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`,
                  color: available ? "#22c55e" : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                }}
              >
                {t("product.available", lang)}
              </button>
              <button
                type="button"
                onClick={() => setAvailable(false)}
                className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: !available ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${!available ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
                  color: !available ? "#ef4444" : "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                }}
              >
                {t("product.notAvailable", lang)}
              </button>
            </div>
          </div>

          {/* Delivery option */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(149,213,178,0.7)" }}>
              <Truck size={12} style={{ display: "inline", marginRight: 4 }} />
              {t("product.delivery", lang)}
            </label>
            <select
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 text-base text-white transition-all"
              style={{
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.08)",
                outline: "none",
              }}
            >
              <option value="pickup" style={{ background: "#042f1a" }}>Farmer Pickup</option>
              <option value="delivery" style={{ background: "#042f1a" }}>Home Delivery</option>
              <option value="both" style={{ background: "#042f1a" }}>Both</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl text-sm font-extrabold transition-all"
            style={{
              background: "linear-gradient(135deg, #2D6A4F, #1B4332)",
              border: "1px solid rgba(149,213,178,0.2)",
              color: "#fff",
              cursor: "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.background = "linear-gradient(135deg, #40916C, #2D6A4F)";
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.background = "linear-gradient(135deg, #2D6A4F, #1B4332)";
              }
            }}
          >
            {submitting ? "Adding..." : t("product.add", lang)}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
