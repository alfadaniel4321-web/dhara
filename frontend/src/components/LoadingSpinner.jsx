import React from 'react';
import { Leaf } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading fresh harvests...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/25 relative pulse-glow">
        <Leaf className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
      <p className="text-sm font-medium text-emerald-300 font-mono tracking-wider animate-pulse">{message}</p>
    </div>
  );
}
