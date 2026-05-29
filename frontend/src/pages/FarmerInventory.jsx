import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BarChart3, Package, AlertTriangle, PlusCircle, Search,
  CheckCircle, XCircle, TrendingUp, Edit3
} from "lucide-react";
import { api } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function FarmerInventory() {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleUpdateStock = async (id) => {
    setSuccess("");
    try {
      await api.products.updateProduct(id, { stock: Number(editStock) });
      setSuccess("Stock updated!");
      setEditingId(null);
      loadProducts();
    } catch (err) {
      alert(err.message || "Failed to update stock");
    }
  };

  const filtered = products.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const outOfStock = products.filter(p => p.stock <= 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  const inStock = products.filter(p => p.stock > 5);

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-100">Inventory Management</h1>
        <p className="text-xs text-emerald-400/50 mt-1">Track stock levels and manage product availability</p>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-xl bg-emerald-900/20 border border-emerald-700/30 text-emerald-400 text-sm font-medium flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-900/30 flex items-center justify-center">
              <XCircle size={18} className="text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">{outOfStock.length}</p>
          <p className="text-[10px] text-emerald-400/50 font-medium mt-1">Out of Stock</p>
        </div>
        <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-900/30 flex items-center justify-center">
              <AlertTriangle size={18} className="text-yellow-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{lowStock.length}</p>
          <p className="text-[10px] text-emerald-400/50 font-medium mt-1">Low Stock (≤5)</p>
        </div>
        <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-900/30 flex items-center justify-center">
              <CheckCircle size={18} className="text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-400">{inStock.length}</p>
          <p className="text-[10px] text-emerald-400/50 font-medium mt-1">In Stock</p>
        </div>
      </div>

      {/* Out of Stock Alert */}
      {outOfStock.length > 0 && (
        <div className="px-4 py-3 rounded-xl bg-red-900/10 border border-red-800/30 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-400/80 font-medium">
            {outOfStock.length} product{outOfStock.length > 1 ? "s are" : " is"} out of stock. Update inventory or add new products.
          </p>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/40" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#111811] border border-emerald-900/30 rounded-xl text-sm text-emerald-100 placeholder-emerald-600/40 outline-none focus:border-emerald-600/50"
        />
      </div>

      {/* Inventory Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#111811] border border-emerald-900/20 rounded-2xl">
          <BarChart3 size={40} className="mx-auto text-emerald-700/40 mb-3" />
          <p className="text-sm text-emerald-400/60 font-medium">No products found</p>
        </div>
      ) : (
        <div className="bg-[#111811] border border-emerald-900/20 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-emerald-900/30 text-emerald-400/60 uppercase tracking-wider">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Current Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/10">
              {filtered.map((p) => {
                const isEditing = editingId === (p._id || p.id);
                const stockStatus = p.stock <= 0 ? "out" : p.stock <= 5 ? "low" : "good";
                return (
                  <tr key={p._id || p.id} className="hover:bg-emerald-900/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-900/20 overflow-hidden flex-shrink-0">
                          {p.image ? <img src={p.image} className="w-full h-full object-cover" /> :
                            <Package size={14} className="m-auto mt-2 text-emerald-700/40" />}
                        </div>
                        <span className="font-semibold text-emerald-200">{p.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-emerald-400/70">{p.category}</td>
                    <td className="p-4 font-mono text-emerald-300 font-bold">₹{p.price}</td>
                    <td className="p-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)}
                            className="w-16 px-2 py-1 bg-emerald-900/30 border border-emerald-700/30 rounded-lg text-xs text-emerald-100 outline-none"
                          />
                          <button onClick={() => handleUpdateStock(p._id || p.id)}
                            className="p-1 bg-emerald-600 rounded text-white"
                          ><CheckCircle size={12} /></button>
                          <button onClick={() => setEditingId(null)}
                            className="p-1 bg-emerald-900/30 rounded text-emerald-400"
                          ><XCircle size={12} /></button>
                        </div>
                      ) : (
                        <span className={`font-bold ${
                          stockStatus === "out" ? "text-red-400" :
                          stockStatus === "low" ? "text-yellow-400" : "text-emerald-400"
                        }`}>{p.stock ?? 0}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        stockStatus === "out" ? "bg-red-900/30 text-red-400" :
                        stockStatus === "low" ? "bg-yellow-900/30 text-yellow-400" :
                        "bg-green-900/30 text-green-400"
                      }`}>
                        {stockStatus === "out" ? "Out of Stock" : stockStatus === "low" ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditingId(p._id || p.id); setEditStock(String(p.stock ?? 0)); }}
                        className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-emerald-900/20"
                      ><Edit3 size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Link to="/farmer/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all"
        >
          <PlusCircle size={16} /> Add New Product
        </Link>
      </div>
    </motion.div>
  );
}
