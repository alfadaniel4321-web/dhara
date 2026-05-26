import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 pb-12 text-center flex-grow flex flex-col justify-center">
      <div className="animate-fade-in space-y-6">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-widest">
          <span>🌿 Kerala Hyperlocal Direct</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-4xl mx-auto">
          Fresh Direct From <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-yellow-300 bg-clip-text text-transparent">Kerala Farmers</span>
        </h1>

        <p className="text-base md:text-xl text-emerald-100/90 max-w-xl mx-auto font-light leading-relaxed">
          No middlemen. Better quality. Better life. Purchase premium organic harvests directly from local farms.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link 
            to="/dashboard" 
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-farmgreen-950 font-extrabold px-8 py-4 rounded-xl transition-all shadow-xl shadow-emerald-500/10 active:scale-95 text-base flex items-center justify-center space-x-2"
          >
            <span>Shop Fresh Products</span>
            <ChevronRight className="w-5 h-5" />
          </Link>

          <Link 
            to="/signup?role=farmer" 
            className="w-full sm:w-auto bg-farmgreen-950/60 hover:bg-farmgreen-900 border border-emerald-800 text-emerald-400 hover:text-emerald-300 font-extrabold px-8 py-4 rounded-xl transition-all active:scale-95 text-base text-center"
          >
            Become a Farmer
          </Link>
        </div>
      </div>
    </div>
  );
}
