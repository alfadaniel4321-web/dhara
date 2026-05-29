import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Package, PlusCircle, Edit3, Trash2, Search, Grid3X3, List,
  ChevronLeft, ChevronRight, AlertTriangle, Check, X, Image
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function FarmerProducts() {
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [success, setSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const perPage = 12;

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const all = await api.products.getProducts();
      const mine = (Array.isArray(all) ? all : []).filter(p => {
        const fId = p.farmerId?._id || p.farmerId?.id || p.farmerId;
        return fId === user.id || fId === user._id;
      });
      setProducts(mine);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, [user]);

  const filtered = products.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const startEdit = (p) => {
    setEditingId(p._id || p.id);
    setEditData({
      title: p.title || "",
      price: p.price || "",
      category: p.category || "",
      stock: p.stock ?? "",
      quantity: p.quantity || "",
      description: p.description || "",
    });
  };

  const saveEdit = async (id) => {
    setSuccess("");
    try {
      await api.products.updateProduct(id, editData);
      setSuccess("Product updated!");
      setEditingId(null);
      loadProducts();
    } catch (err) {
      alert(err.message || "Failed to update");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.products.deleteProduct(id);
      setSuccess("Product deleted.");
      setDeleteConfirm(null);
      loadProducts();
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-emerald-100">Products</h1>
          <p className="text-xs text-emerald-400/50 mt-1">{products.length} total products</p>
        </div>
        <Link
          to="/farmer/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/30"
        >
          <PlusCircle size={16} />
          Add Product
        </Link>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm font-medium flex items-center gap-2">
          <Check size={16} /> {success}
        </div>
      )}

      {/* Search & View Toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/40" />
          <input
            type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#111811] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50 transition-all"
          />
        </div>
        <div className="flex bg-[#111811] border border-emerald-900/30 rounded-xl overflow-hidden">
          <button onClick={() => setViewMode("grid")}
            className={`p-2.5 ${viewMode === "grid" ? "bg-emerald-600/20 text-emerald-400" : "text-emerald-400/40 hover:text-emerald-400"}`}
          ><Grid3X3 size={16} /></button>
          <button onClick={() => setViewMode("list")}
            className={`p-2.5 ${viewMode === "list" ? "bg-emerald-600/20 text-emerald-400" : "text-emerald-400/40 hover:text-emerald-400"}`}
          ><List size={16} /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#111811] border border-emerald-900/20 rounded-2xl">
          <Package size={40} className="mx-auto text-emerald-700/40 mb-3" />
          <p className="text-sm text-emerald-400/60 font-medium">No products found</p>
          <Link to="/farmer/add" className="inline-flex items-center gap-1.5 mt-3 text-xs text-emerald-500 hover:text-emerald-400">
            <PlusCircle size={14} /> Add your first product
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginated.map((p) => {
            const isEditing = editingId === (p._id || p.id);
            return (
              <motion.div key={p._id || p.id} layout
                className="bg-[#111811] border border-emerald-900/20 rounded-2xl overflow-hidden hover:border-emerald-700/30 transition-all group"
              >
                <div className="relative h-36 bg-emerald-900/20">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-emerald-700/40">
                      <Image size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(p)}
                      className="p-1.5 bg-black/60 backdrop-blur rounded-lg text-emerald-400 hover:text-emerald-300"
                    ><Edit3 size={14} /></button>
                    <button onClick={() => setDeleteConfirm(p._id || p.id)}
                      className="p-1.5 bg-black/60 backdrop-blur rounded-lg text-red-400 hover:text-red-300"
                    ><Trash2 size={14} /></button>
                  </div>
                  {p.stock <= 5 && (
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-bold ${p.stock <= 0 ? "bg-red-600 text-white" : "bg-yellow-600 text-white"}`}>
                      {p.stock <= 0 ? "Out of Stock" : `${p.stock} left`}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input value={editData.title} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                        className="w-full px-2.5 py-1.5 bg-emerald-900/20 border border-emerald-700/30 rounded-lg text-xs text-emerald-100 outline-none" />
                      <div className="flex gap-2">
                        <input value={editData.price} onChange={e => setEditData(d => ({ ...d, price: e.target.value }))}
                          className="w-1/2 px-2.5 py-1.5 bg-emerald-900/20 border border-emerald-700/30 rounded-lg text-xs text-emerald-100 outline-none" placeholder="Price" />
                        <input value={editData.stock} onChange={e => setEditData(d => ({ ...d, stock: e.target.value }))}
                          className="w-1/2 px-2.5 py-1.5 bg-emerald-900/20 border border-emerald-700/30 rounded-lg text-xs text-emerald-100 outline-none" placeholder="Stock" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(p._id || p.id)}
                          className="flex-1 py-1.5 bg-emerald-600 rounded-lg text-[10px] font-bold text-white"
                        >Save</button>
                        <button onClick={() => setEditingId(null)}
                          className="py-1.5 px-3 bg-emerald-900/30 rounded-lg text-[10px] text-emerald-400"
                        >Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider mb-0.5">{p.category}</p>
                      <h3 className="text-sm font-bold text-emerald-100 truncate">{p.title}</h3>
                      <p className="text-[10px] text-emerald-400/50 mt-0.5">Stock: {p.stock ?? "N/A"} · ₹{p.price}</p>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-900/30 text-emerald-400/60 uppercase tracking-wider">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold hidden md:table-cell">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/10">
              {paginated.map((p) => (
                <tr key={p._id || p.id} className="hover:bg-emerald-900/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-900/20 overflow-hidden flex-shrink-0">
                        {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Image size={16} className="m-auto text-emerald-700/40" />}
                      </div>
                      <span className="font-semibold text-emerald-200 truncate max-w-[150px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-emerald-400/70 hidden md:table-cell">{p.category}</td>
                  <td className="p-4 font-mono text-emerald-300 font-bold">₹{p.price}</td>
                  <td className="p-4">
                    <span className={`font-bold ${p.stock <= 0 ? "text-red-400" : p.stock <= 5 ? "text-yellow-400" : "text-emerald-400"}`}>
                      {p.stock ?? 0}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => startEdit(p)} className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-emerald-900/20">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => setDeleteConfirm(p._id || p.id)} className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-900/20 ml-1">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg bg-[#111811] border border-emerald-900/30 text-emerald-400/60 hover:text-emerald-400 disabled:opacity-30"
          ><ChevronLeft size={16} /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-bold ${page === p ? "bg-emerald-600 text-white" : "bg-[#111811] border border-emerald-900/30 text-emerald-400/60 hover:text-emerald-400"}`}
            >{p}</button>
          ))}
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg bg-[#111811] border border-emerald-900/30 text-emerald-400/60 hover:text-emerald-400 disabled:opacity-30"
          ><ChevronRight size={16} /></button>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111811] border border-emerald-900/30 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
            <AlertTriangle size={32} className="mx-auto text-red-400 mb-3" />
            <h3 className="text-lg font-bold text-emerald-100 text-center mb-2">Delete Product?</h3>
            <p className="text-xs text-emerald-400/60 text-center mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-emerald-900/30 hover:bg-emerald-900/50 rounded-xl text-sm font-semibold text-emerald-300 transition-all"
              >Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-bold text-white transition-all"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
