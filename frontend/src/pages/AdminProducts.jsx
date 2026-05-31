import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package, Search, Trash2, Star, Filter, Image, Tag, X, Check
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [success, setSuccess] = useState("");
  const [editingOffer, setEditingOffer] = useState(null);
  const [offerText, setOfferText] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this product permanently?")) return;
    try {
      await api.admin.deleteProduct(id);
      setSuccess("Product removed");
      load();
    } catch (err) { alert(err.message); }
  };

  const handleSetOffer = async (id) => {
    try {
      await api.admin.setOffer(id, offerText);
      setSuccess(offerText ? "Offer added" : "Offer removed");
      setEditingOffer(null);
      setOfferText("");
      load();
    } catch (err) { alert(err.message); }
  };

  const startEditOffer = (product) => {
    setEditingOffer(product._id || product.id);
    setOfferText(product.offerDetails || "");
  };

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = products.filter(p => {
    const s = !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.farmerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const c = categoryFilter === "All" || p.category === categoryFilter;
    return s && c;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">Product Moderation</h1>
        <p className="text-xs text-emerald-400/50 mt-1">{products.length} total products</p>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm font-medium flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-emerald-400/60 hover:text-emerald-400"><X size={14} /></button>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/40" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a1a0e] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {categories.slice(0, 6).map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${categoryFilter === cat ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-900/10 text-emerald-400/60 hover:bg-emerald-900/20"}`}
            >{cat}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl">
          <Package size={40} className="mx-auto text-emerald-700/40 mb-3" />
          <p className="text-sm text-emerald-400/60 font-medium">No products found</p>
        </div>
      ) : (
        <div className="bg-[#0a1a0e] border border-emerald-900/20 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs responsive-table">
            <thead>
              <tr className="border-b border-emerald-900/30 text-emerald-400/60 uppercase tracking-wider">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold hidden md:table-cell">Farmer</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold hidden sm:table-cell">Stock</th>
                <th className="p-4 font-semibold">Offer</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/10">
              {filtered.map((p) => {
                const pid = p._id || p.id;
                const isEditing = editingOffer === pid;
                return (
                  <tr key={pid} className="hover:bg-emerald-900/5 transition-colors">
                    <td className="p-4" data-label="Product">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-900/20 overflow-hidden flex-shrink-0">
                          {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Image size={16} className="m-auto mt-2.5 text-emerald-700/40" />}
                        </div>
                        <span className="font-semibold text-emerald-200 truncate max-w-[180px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-emerald-400/70 hidden md:table-cell" data-label="Farmer">{p.farmerName || "Unknown"}</td>
                    <td className="p-4" data-label="Category"><span className="text-[10px] font-medium px-2 py-0.5 bg-emerald-900/20 text-emerald-400 rounded-lg">{p.category}</span></td>
                    <td className="p-4 font-mono text-emerald-300 font-bold" data-label="Price">₹{p.price}</td>
                    <td className="p-4 hidden sm:table-cell" data-label="Stock">
                      <span className={`font-bold ${(p.stock ?? 0) <= 0 ? "text-red-400" : (p.stock ?? 0) <= 5 ? "text-yellow-400" : "text-emerald-400"}`}>{p.stock ?? 0}</span>
                    </td>
                    <td className="p-4" data-label="Offer">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={offerText}
                            onChange={e => setOfferText(e.target.value)}
                            placeholder="e.g. Buy 1 Get 1 Free"
                            className="w-28 bg-emerald-900/20 border border-emerald-600/30 rounded px-2 py-1 text-[10px] text-emerald-200 placeholder-emerald-600/40 outline-none focus:border-emerald-500/50"
                            autoFocus
                          />
                          <button onClick={() => handleSetOffer(pid)} className="p-1 text-emerald-400 hover:text-emerald-300"><Check size={12} /></button>
                          <button onClick={() => setEditingOffer(null)} className="p-1 text-red-400 hover:text-red-300"><X size={12} /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEditOffer(p)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${p.offerDetails ? "bg-amber-900/20 text-amber-400 border border-amber-600/20" : "bg-emerald-900/10 text-emerald-400/40 hover:text-emerald-400 hover:bg-emerald-900/20"}`}
                        >
                          <Tag size={10} />
                          {p.offerDetails ? p.offerDetails : "Set Offer"}
                        </button>
                      )}
                    </td>
                    <td className="p-4 text-right" data-label="">
                      <button onClick={() => handleDelete(pid)}
                        className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-900/20"
                      ><Trash2 size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
