import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronLeft, Edit, Trash2, Check, Sliders } from 'lucide-react';

export default function ManageProducts() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [success, setSuccess] = useState('');

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const all = await api.products.getProducts();
      const mine = all.filter(p => {
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

  useEffect(() => {
    loadProducts();
  }, [user]);

  const handleUpdateStock = async (id) => {
    setSuccess('');
    try {
      await api.products.updateProductStock(id, Number(editStock));
      setSuccess('Stock count updated!');
      setEditingId(null);
      loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this harvest entry?')) return;
    try {
      await api.products.deleteProduct(id);
      setSuccess('Product entry deleted successfully.');
      loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Link 
        to="/farmer" 
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Farmer Hub</span>
      </Link>

      <div className="border-b border-emerald-900/60 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Harvest Inventory Control</h2>
          <p className="text-sm text-emerald-300/70">Modify product stock counts and delete stale listings.</p>
        </div>
        <Sliders className="w-8 h-8 text-emerald-400 hidden sm:block" />
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-305 p-3.5 rounded-xl text-xs">
          {success}
        </div>
      )}

      {products.length === 0 ? (
        <div className="glassmorphism p-12 rounded-3xl text-center">
          <p className="text-xs text-emerald-305/75 italic">You haven't listed any harvests yet.</p>
          <Link to="/farmer/add" className="text-xs text-emerald-500 hover:underline mt-2 inline-block font-bold">List first harvest</Link>
        </div>
      ) : (
        <div className="bg-emerald-950/20 border border-emerald-900 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-950/50 border-b border-emerald-900 text-emerald-400 uppercase tracking-widest font-bold">
                  <th className="p-4">Produce Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price / Unit</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/50">
                {products.map(product => {
                  const isEditing = editingId === product.id || editingId === product._id;
                  
                  return (
                    <tr key={product.id || product._id} className="hover:bg-emerald-950/10 transition-colors">
                      <td className="p-4 flex items-center space-x-3">
                        <img src={product.image} alt={product.title} className="w-10 h-10 object-cover rounded-lg bg-emerald-900/20" />
                        <span className="font-bold text-white block truncate max-w-[120px]">{product.title}</span>
                      </td>
                      <td className="p-4 text-emerald-300 font-semibold">{product.category}</td>
                      <td className="p-4 font-mono font-bold text-emerald-200">₹{product.price} / {product.quantity}</td>
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex items-center space-x-1.5">
                            <input 
                              type="number" 
                              value={editStock}
                              onChange={e => setEditStock(e.target.value)}
                              className="w-16 bg-emerald-950 border border-emerald-800 rounded px-2 py-1 text-xs text-white focus:outline-none"
                            />
                            <button 
                              onClick={() => handleUpdateStock(product.id || product._id)}
                              className="p-1 text-emerald-400 hover:text-white bg-emerald-900/60 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`font-mono font-bold ${product.stock <= 5 ? 'text-red-400' : 'text-white'}`}>
                              {product.stock} units
                            </span>
                            <button 
                              onClick={() => {
                                setEditingId(product.id || product._id);
                                setEditStock(product.stock.toString());
                              }}
                              className="text-emerald-500 hover:text-emerald-450"
                              title="Edit Stock"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDelete(product.id || product._id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
