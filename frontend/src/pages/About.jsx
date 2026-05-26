import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();
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
        <h2 className="text-2xl font-bold text-white">About Dhara</h2>
        <p className="text-sm text-emerald-300/70">Building Kerala's premium direct hyperlocal trade network.</p>
      </div>

      <div className="space-y-4 text-sm text-emerald-250 leading-relaxed font-light">
        <p>
          Dhara was established in 2026 to resolve logistics barriers for small-scale Kerala farmers. By introducing an AI-enabled Freshness Rating algorithm, direct timeline tracking, and routine daily delivery schedules, we guarantee that consumers receive products within hours of harvest.
        </p>

        <h3 className="text-base font-bold text-white pt-4">Direct Sourcing Guarantee</h3>
        <p>
          All produce listed on Dhara is handled directly by the farmer. We enforce zero middlemen, ensuring that farmers receive 100% of their listed price while buyers receive authentic organic harvests.
        </p>

        <div className="bg-emerald-950/20 border border-emerald-900 p-4 rounded-2xl flex items-start space-x-3 mt-6">
          <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-305/70">
            For support regarding delivery zones or merchant partnership agreements, please reach out via our contact panel.
          </p>
        </div>
      </div>
    </div>
  );
}
