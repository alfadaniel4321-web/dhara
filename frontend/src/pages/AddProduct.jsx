import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ChevronLeft, Check } from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1 kg');
  const [stock, setStock] = useState('');
  const [availTime, setAvailTime] = useState('06:00 AM - 12:00 PM');
  const [nutrition, setNutrition] = useState('Energy: 80 kcal, Fiber: 2g');
  const [protein, setProtein] = useState('1.5g');
  const [freshnessScore, setFreshnessScore] = useState(98);
  const [image, setImage] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400');
  
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !price || !stock) {
      alert('Please fill out Title, Price, and Stock.');
      return;
    }

    setSubmitting(true);
    setSuccess('');
    try {
      await api.products.createProduct({
        title,
        category,
        price: Number(price),
        quantity,
        stock: Number(stock),
        harvestDate: new Date().toISOString(),
        availableTime: availTime,
        nutrition,
        protein,
        freshnessScore: Number(freshnessScore),
        image
      });
      setSuccess('🌿 Harvest record added successfully and listed on the marketplace!');
      // Reset inputs
      setTitle('');
      setPrice('');
      setStock('');
    } catch (err) {
      alert(err.message || 'Failed to list product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link 
        to="/farmer" 
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Farmer Hub</span>
      </Link>

      <div className="border-b border-emerald-900/60 pb-4">
        <h2 className="text-2xl font-bold text-white">Record Daily Harvest</h2>
        <p className="text-sm text-emerald-300/70">List your fresh farm products for customer order routing.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glassmorphism p-6 rounded-3xl border border-emerald-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Product Title</label>
            <input 
              type="text" 
              placeholder="e.g. Malabar Cow Milk"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all"
            >
              <option value="Milk">Milk</option>
              <option value="Eggs">Eggs</option>
              <option value="Vegetables">Vegetables</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Price (₹)</label>
            <input 
              type="number" 
              placeholder="e.g. 60"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Unit / Quantity</label>
            <input 
              type="text" 
              placeholder="e.g. 1 Litre, 12 Nos"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Initial Stock Count</label>
            <input 
              type="number" 
              placeholder="e.g. 50"
              value={stock}
              onChange={e => setStock(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Delivery Time Slot</label>
            <input 
              type="text" 
              placeholder="e.g. 06:00 AM - 10:00 AM"
              value={availTime}
              onChange={e => setAvailTime(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">AI Freshness Score</label>
            <input 
              type="number" 
              value={freshnessScore}
              onChange={e => setFreshnessScore(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Nutrition Facts</label>
            <input 
              type="text" 
              value={nutrition}
              onChange={e => setNutrition(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Protein Amount</label>
            <input 
              type="text" 
              value={protein}
              onChange={e => setProtein(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400 transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Photo Image URL</label>
          <input 
            type="text" 
            value={image}
            onChange={e => setImage(e.target.value)}
            className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all font-mono"
            required
          />
        </div>

        <button 
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-extrabold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 text-xs disabled:opacity-50"
        >
          {submitting ? 'Publishing Harvest...' : 'Publish Harvest Entry'}
        </button>
      </form>
    </div>
  );
}
