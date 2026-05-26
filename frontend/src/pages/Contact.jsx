import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Check } from 'lucide-react';

export default function Contact() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('📨 Message sent! Our team will get back to you within 24 hours.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-12 px-4 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-xs text-emerald-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Go Back</span>
      </button>

      <div className="border-b border-emerald-900/60 pb-4">
        <h2 className="text-2xl font-bold text-white">Contact Us</h2>
        <p className="text-sm text-emerald-300/70">Need assistance? Reach our hyperlocal farm support desk.</p>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Support channels */}
        <div className="space-y-4 text-xs text-emerald-300">
          <h3 className="text-sm font-bold text-white">Support Channels</h3>
          <p className="font-light">
            Feel free to contact us regarding logistics, onboarding, or platform features.
          </p>
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-900/60 space-y-2.5 font-mono">
            <p>Hotline: <span className="text-white font-bold font-mono">+91 94471 23456</span></p>
            <p>Email: <span className="text-white font-bold select-all">support@dhara.com</span></p>
            <p>Location: <span className="text-white font-bold">Kochi Hub, Kerala, India</span></p>
          </div>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="glassmorphism p-5 rounded-2xl border border-emerald-800 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-emerald-400 uppercase mb-1">Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Albin Joseph"
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-emerald-400 uppercase mb-1">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-800/80"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-emerald-400 uppercase mb-1">Your Message</label>
            <textarea 
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your inquiry..."
              rows="3"
              className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-400 transition-all placeholder:text-emerald-850"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-farmgreen-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
}
