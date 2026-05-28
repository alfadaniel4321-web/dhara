import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, Heart, Star, X, SlidersHorizontal,
  ChevronLeft, ChevronRight, Grid3X3, Sun, Moon, Eye,
  ArrowUpDown, Filter,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setCartSuccess } from "../redux/slices/cartSlice";
import CategoryBar from '../components/CategoryBar';

const CATEGORIES = [
  { id: "Vegetables", label: "Fresh Vegetables", icon: "🥬" },
  { id: "Fruits", label: "Organic Fruits", icon: "🍎" },
  { id: "Milk", label: "Farm Dairy", icon: "🥛" },
  { id: "Rice & Grains", label: "Rice & Grains", icon: "🌾" },
  { id: "Fresh Herbs", label: "Fresh Herbs", icon: "🌿" },
  { id: "Natural Spices", label: "Natural Spices", icon: "🧂" },
  { id: "Honey & Jams", label: "Honey & Jams", icon: "🍯" },
  { id: "Bakery Products", label: "Bakery Products", icon: "🍞" },
  { id: "Healthy Snacks", label: "Healthy Snacks", icon: "🥜" },
  { id: "Farm Drinks", label: "Farm Drinks", icon: "🧃" },
];

const ALL_PRODUCTS = [
  { id: 1, title: "Fresh Organic Spinach", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", category: "Vegetables", price: 45, originalPrice: 65, rating: 4.6, reviews: 345, brand: "GreenValley", description: "Locally grown organic spinach, rich in iron and vitamins. 250g bunch." },
  { id: 2, title: "Farm Fresh Tomatoes", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400", category: "Vegetables", price: 35, originalPrice: 50, rating: 4.5, reviews: 567, brand: "KeralaFresh", description: "Sun-ripened juicy tomatoes straight from Kuttanad farms. 500g." },
  { id: 3, title: "Organic Brinjal (Eggplant)", image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400", category: "Vegetables", price: 30, originalPrice: 45, rating: 4.4, reviews: 234, brand: "GreenValley", description: "Chemical-free purple brinjal from Wayanad organic farms. 500g." },
  { id: 4, title: "Fresh Ladyfinger (Okra)", image: "https://images.unsplash.com/photo-1425543103986-22abb7d7e6d2?w=400", category: "Vegetables", price: 28, originalPrice: 40, rating: 4.3, reviews: 189, brand: "FarmDirect", description: "Tender okra harvested fresh daily. 250g pack." },
  { id: 5, title: "Organic Nendran Bananas", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", category: "Fruits", price: 40, originalPrice: 55, rating: 4.8, reviews: 890, brand: "PalakkadFarms", description: "Traditional Nendran bananas from Palakkad. Naturally sweet. 6 pcs." },
  { id: 6, title: "Juicy Alphonso Mangoes", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", category: "Fruits", price: 120, originalPrice: 180, rating: 4.9, reviews: 1234, brand: "RatnagiriFresh", description: "Premium Alphonso mangoes, direct from Ratnagiri. 1 kg box." },
  { id: 7, title: "Fresh Farm Papaya", image: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400", category: "Fruits", price: 55, originalPrice: 75, rating: 4.5, reviews: 432, brand: "KeralaFresh", description: "Tree-ripened red papaya from Malabar farms. 1 kg." },
  { id: 8, title: "Organic Green Grapes", image: "https://images.unsplash.com/photo-1537640538966-9f369d0c8d1d?w=400", category: "Fruits", price: 80, originalPrice: 110, rating: 4.6, reviews: 654, brand: "NashikValley", description: "Seedless green grapes from Nashik valley farms. 500g." },
  { id: 9, title: "Fresh A2 Cow Milk", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", category: "Milk", price: 65, originalPrice: 80, rating: 4.7, reviews: 2345, brand: "MalabarDairy", description: "Pure A2 milk from grass-fed cows. Unadulterated, 1 litre." },
  { id: 10, title: "Farm Fresh Curd", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400", category: "Milk", price: 50, originalPrice: 65, rating: 4.6, reviews: 1678, brand: "MalabarDairy", description: "Thick creamy curd made from fresh A2 milk. 500g." },
  { id: 11, title: "Traditional Buttermilk", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", category: "Milk", price: 30, originalPrice: 40, rating: 4.4, reviews: 876, brand: "KeralaFresh", description: "Spiced traditional buttermilk (moru). 1 litre." },
  { id: 12, title: "Organic Basmati Rice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", category: "Rice & Grains", price: 249, originalPrice: 349, rating: 4.8, reviews: 3456, brand: "PunjabHarvest", description: "Premium aged basmati rice. Long grain, aromatic. 1 kg." },
  { id: 13, title: "Mattai Rice (Palakkadan)", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", category: "Rice & Grains", price: 180, originalPrice: 250, rating: 4.7, reviews: 1234, brand: "PalakkadFarms", description: "Traditional red Matta rice, unpolished and nutrient-rich. 1 kg." },
  { id: 14, title: "Organic Whole Wheat Flour", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", category: "Rice & Grains", price: 80, originalPrice: 110, rating: 4.5, reviews: 987, brand: "FarmFresh", description: "Stone-ground whole wheat atta from organic farms. 2 kg." },
  { id: 15, title: "Fresh Curry Leaves", image: "https://images.unsplash.com/photo-1602332612206-5b99b2c4e122?w=400", category: "Fresh Herbs", price: 15, originalPrice: 25, rating: 4.6, reviews: 654, brand: "GreenValley", description: "Freshly plucked curry leaves from homestead gardens. 100g." },
  { id: 16, title: "Organic Coriander Leaves", image: "https://images.unsplash.com/photo-1616077168070-5cb5f5f0e1b5?w=400", category: "Fresh Herbs", price: 12, originalPrice: 20, rating: 4.4, reviews: 543, brand: "FarmDirect", description: "Fresh fragrant coriander grown without pesticides. 100g bunch." },
  { id: 17, title: "Fresh Mint Leaves", image: "https://images.unsplash.com/photo-1627417513787-1e5e2eac8d3a?w=400", category: "Fresh Herbs", price: 15, originalPrice: 25, rating: 4.5, reviews: 432, brand: "GreenValley", description: "Home-grown mint leaves, perfect for chutneys and tea. 100g." },
  { id: 18, title: "Organic Turmeric Powder", image: "https://images.unsplash.com/photo-1615485290382-441e4b049d0f?w=400", category: "Natural Spices", price: 65, originalPrice: 90, rating: 4.8, reviews: 2345, brand: "SpiceValley", description: "Pure organic turmeric from Himachal farms. No additives. 200g." },
  { id: 19, title: "Coconut Oil (Cold Pressed)", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", category: "Natural Spices", price: 349, originalPrice: 449, rating: 4.9, reviews: 3456, brand: "KeralaPure", description: "Virgin cold-pressed coconut oil from fresh coconuts. 500ml." },
  { id: 20, title: "Organic Black Pepper", image: "https://images.unsplash.com/photo-1596097635121-14b800fd9bb3?w=400", category: "Natural Spices", price: 120, originalPrice: 160, rating: 4.7, reviews: 1876, brand: "SpiceValley", description: "Premium Tellicherry black pepper from Wayanad estates. 200g." },
  { id: 21, title: "Wild Forest Honey", image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400", category: "Honey & Jams", price: 450, originalPrice: 599, rating: 4.9, reviews: 2876, brand: "BeeNatural", description: "Pure wild honey collected from Western Ghat forests. 500g." },
  { id: 22, title: "Mixed Fruit Jam", image: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400", category: "Honey & Jams", price: 120, originalPrice: 160, rating: 4.5, reviews: 876, brand: "FarmFresh", description: "Homemade mixed fruit jam with real fruit pieces. 300g." },
  { id: 23, title: "Coconut Jaggery", image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400", category: "Honey & Jams", price: 85, originalPrice: 110, rating: 4.6, reviews: 654, brand: "KeralaPure", description: "Traditional coconut palm jaggery (karupatti). 500g block." },
  { id: 24, title: "Whole Wheat Bread (Sourdough)", image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400", category: "Bakery Products", price: 65, originalPrice: 85, rating: 4.5, reviews: 1234, brand: "CountryOven", description: "Artisan sourdough bread made with organic whole wheat. 400g." },
  { id: 25, title: "Banana Bread (Homemade)", image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400", category: "Bakery Products", price: 110, originalPrice: 150, rating: 4.6, reviews: 567, brand: "CountryOven", description: "Moist banana bread made with real Nendran bananas. 350g." },
  { id: 26, title: "Multi-Seed Crackers", image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa125f6?w=400", category: "Bakery Products", price: 95, originalPrice: 130, rating: 4.4, reviews: 345, brand: "CountryOven", description: "Crunchy multi-seed crackers with flax, sesame, sunflower. 200g." },
  { id: 27, title: "Roasted Almonds", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400", category: "Healthy Snacks", price: 249, originalPrice: 349, rating: 4.7, reviews: 2345, brand: "NutriKing", description: "Premium roasted almonds with Himalayan pink salt. 200g." },
  { id: 28, title: "Mixed Seeds Trail Mix", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400", category: "Healthy Snacks", price: 180, originalPrice: 250, rating: 4.6, reviews: 1234, brand: "NutriKing", description: "Pumpkin, sunflower, chia seeds with dried berries. 250g." },
  { id: 29, title: "Organic Peanut Butter", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400", category: "Healthy Snacks", price: 220, originalPrice: 299, rating: 4.5, reviews: 987, brand: "NutriKing", description: "100% organic peanut butter, no added sugar or oil. 350g." },
  { id: 30, title: "Fresh Tender Coconut Water", image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400", category: "Farm Drinks", price: 40, originalPrice: 55, rating: 4.8, reviews: 3456, brand: "KeralaPure", description: "Chilled tender coconut water from young green coconuts. 500ml." },
  { id: 31, title: "Sugarcane Juice (Farm Fresh)", image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400", category: "Farm Drinks", price: 35, originalPrice: 50, rating: 4.4, reviews: 876, brand: "FarmDirect", description: "Freshly extracted sugarcane juice with ginger & lime. 500ml." },
  { id: 32, title: "Herbal Lemonade", image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400", category: "Farm Drinks", price: 55, originalPrice: 75, rating: 4.5, reviews: 654, brand: "FarmFresh", description: "Lemonade with fresh mint and basil from the farm. 500ml." },
];

const BRANDS = [...new Set(ALL_PRODUCTS.map(p => p.brand))].sort();
const PRICE_RANGES = [
  { label: "Budget Fresh Picks", min: 0, max: 100 },
  { label: "Daily Essentials", min: 100, max: 300 },
  { label: "Organic Family Packs", min: 300, max: 700 },
  { label: "Premium Farm Selection", min: 700, max: 1500 },
  { label: "Luxury Organic Collection", min: 1500, max: Infinity },
];

const ITEMS_PER_PAGE = 12;

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
      </div>
    </div>
  );
}

function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <X size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="h-48 sm:h-64 md:h-full min-h-[200px] sm:min-h-[300px] bg-gray-100 dark:bg-gray-700">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">{product.category}</p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{product.title}</h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  {product.rating} <Star size={10} fill="currentColor" />
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{product.reviews} reviews</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Brand: <span className="font-medium">{product.brand}</span></p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              </div>
            </div>
            <button onClick={() => { onAddToCart(product); onClose(); }} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingsFilter({ selected, onChange }) {
  const ratings = [4, 3, 2, 1];
  return (
    <div className="space-y-2">
      {ratings.map(r => (
        <label key={r} className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" checked={selected.includes(r)} onChange={() => onChange(r)} className="rounded border-gray-300 text-green-700 focus:ring-green-500" />
          <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400">
            {r} <Star size={12} fill="currentColor" className="text-amber-400" /> & above
          </span>
        </label>
      ))}
    </div>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDark = () => setDarkMode(prev => !prev);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleBrand = useCallback((brand) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  }, []);

  const toggleRating = useCallback((rating) => {
    setSelectedRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);
  }, []);

  const handleAddToCart = useCallback((product) => {
    dispatch(setCartSuccess({
      products: [{ productId: product.id, count: 1 }],
      totalPrice: product.price,
    }));
    navigate('/cart');
  }, [dispatch, navigate]);

  const filteredProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      result = result.filter(p => p.rating >= minRating);
    }
    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    else if (sortBy === "newest") result.sort((a, b) => b.id - a.id);
    else result.sort((a, b) => b.reviews - a.reviews);

    return result;
  }, [selectedCategory, search, priceRange, selectedBrands, selectedRatings, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, search, priceRange, selectedBrands, selectedRatings, sortBy]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearch("");
    setPriceRange({ min: 0, max: Infinity });
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSortBy("popular");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || search || priceRange.min > 0 || priceRange.max < Infinity || selectedBrands.length > 0 || selectedRatings.length > 0;

  function renderStars(rating, size = 12) {
    return (
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={size} fill={i <= Math.round(rating) ? "#F59E0B" : "#E5E7EB"} color={i <= Math.round(rating) ? "#F59E0B" : "#E5E7EB"} />
        ))}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F3] dark:bg-gray-900 transition-colors duration-300">
      {/* Dark Mode Toggle */}
      <button onClick={toggleDark} className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all" aria-label="Toggle dark mode">
        {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-700" />}
      </button>

      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-800 dark:bg-green-700">
              <Grid3X3 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Products</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{filteredProducts.length} products found</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setShowSortMenu(!showSortMenu)} onBlur={() => setTimeout(() => setShowSortMenu(false), 200)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-600 transition-colors">
                <ArrowUpDown size={15} />
                <span className="hidden sm:inline">Sort</span>
              </button>
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-30 py-1">
                  {[
                    { key: "popular", label: "Most Popular" },
                    { key: "price-low", label: "Price: Low to High" },
                    { key: "price-high", label: "Price: High to Low" },
                    { key: "rating", label: "Highest Rated" },
                    { key: "newest", label: "Newest First" },
                  ].map(opt => (
                    <button key={opt.key} onClick={() => { setSortBy(opt.key); setShowSortMenu(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${sortBy === opt.key ? "text-green-700 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/20" : "text-gray-700 dark:text-gray-300"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-green-600 transition-colors">
              <Filter size={15} />
              Filters
            </button>
          </div>
        </div>

        {/* Category Bar */}
        <div className="mb-6">
          <CategoryBar
            selectedCat={selectedCategory || "All"}
            onSelect={(cat) => setSelectedCategory(cat === "All" ? null : cat)}
          />
        </div>

        {/* Search + Active Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products, brands, categories..." className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600 transition-all" />
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors whitespace-nowrap">
              <X size={16} /> Clear
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><SlidersHorizontal size={16} /> Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-green-700 dark:text-green-400 hover:underline font-medium">Reset</button>
                )}
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Price Range</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map(pr => (
                    <label key={pr.label} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="price" checked={priceRange.min === pr.min && priceRange.max === pr.max} onChange={() => setPriceRange({ min: pr.min, max: pr.max })} className="border-gray-300 text-green-700 focus:ring-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{pr.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Brand */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Brand</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {BRANDS.map(b => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} className="rounded border-gray-300 text-green-700 focus:ring-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors truncate">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Ratings */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Rating</h4>
                <RatingsFilter selected={selectedRatings} onChange={toggleRating} />
              </div>
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><SlidersHorizontal size={16} /> Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <X size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Price Range</h4>
                  {PRICE_RANGES.map(pr => (
                    <label key={pr.label} className="flex items-center gap-2 py-1.5 cursor-pointer">
                      <input type="radio" name="m-price" checked={priceRange.min === pr.min && priceRange.max === pr.max} onChange={() => setPriceRange({ min: pr.min, max: pr.max })} className="border-gray-300 text-green-700 focus:ring-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{pr.label}</span>
                    </label>
                  ))}
                </div>
                <hr className="border-gray-200 dark:border-gray-700 mb-6" />
                {/* Brand */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Brand</h4>
                  {BRANDS.map(b => (
                    <label key={b} className="flex items-center gap-2 py-1.5 cursor-pointer">
                      <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} className="rounded border-gray-300 text-green-700 focus:ring-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{b}</span>
                    </label>
                  ))}
                </div>
                <hr className="border-gray-200 dark:border-gray-700 mb-6" />
                {/* Ratings */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Rating</h4>
                  <RatingsFilter selected={selectedRatings} onChange={toggleRating} />
                </div>
                <button onClick={() => setShowFilters(false)} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No products found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                <button onClick={clearFilters} className="px-6 py-2.5 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginatedProducts.map(product => (
                    <div key={product.id} className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:-translate-y-0.5 max-w-full">
                      {/* Image */}
                      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700" style={{ paddingBottom: "100%" }}>
                        <img src={product.image} alt={product.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {/* Wishlist */}
                        <button onClick={() => toggleWishlist(product.id)} className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 shadow-sm transition-all opacity-0 group-hover:opacity-100">
                          <Heart size={16} className={wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-400"} />
                        </button>
                        {/* Discount Badge */}
                        <div className="absolute top-2 left-2 bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </div>
                        {/* Quick View */}
                        <button onClick={() => setQuickViewProduct(product)} className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-white dark:hover:bg-gray-800 shadow-sm flex items-center gap-1.5">
                          <Eye size={14} /> Quick View
                        </button>
                      </div>
                      {/* Info */}
                      <div className="p-3">
                        <p className="text-[10px] font-medium text-green-700 dark:text-green-400 uppercase tracking-wider mb-1">{product.category}</p>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">{product.title}</h3>
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="flex items-center gap-0.5 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            {product.rating} <Star size={9} fill="currentColor" />
                          </span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">({product.reviews})</span>
                        </div>
                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 mb-3">
                          <span className="text-base font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                        </div>
                        {/* Add to Cart */}
                        <button onClick={() => handleAddToCart(product)} className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-[0.97]">
                          <ShoppingCart size={15} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setCurrentPage(p)} className={`min-w-[32px] h-8 sm:min-w-[36px] sm:h-9 rounded-lg text-sm font-semibold transition-all ${currentPage === p ? "bg-green-800 text-white shadow-md" : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 480px) {
          .product-card-grid { gap: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
