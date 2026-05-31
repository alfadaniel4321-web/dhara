import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Users, ShieldCheck, Award, Heart, ArrowLeft, Sprout, Trees, Wheat, Target, Eye, Handshake } from "lucide-react";
import { api } from '../services/api';

const ICON_MAP = {
  Sprout, Trees, Wheat, Target, Eye, Handshake,
  Leaf, Users, ShieldCheck, Award, Heart
};

export default function About() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [team, setTeam] = useState([]);
  const [values, setValues] = useState([]);
  const [mission, setMission] = useState({});

  useEffect(() => {
    api.public.getStats().then(setStats).catch(() => {});
    api.siteContent.getByKey('team').then(r => { if (r?.data) setTeam(r.data); }).catch(() => {});
    api.siteContent.getByKey('values').then(r => { if (r?.data) setValues(r.data); }).catch(() => {});
    api.siteContent.getByKey('mission').then(r => { if (r?.data) setMission(r.data); }).catch(() => {});
  }, []);

  const statCards = [
    { value: stats?.totalFarmers ? `${stats.totalFarmers}+` : '', label: 'Verified Farmers', icon: Users, color: '#1B4332' },
    { value: stats?.totalCustomers ? `${stats.totalCustomers}+` : '', label: 'Happy Customers', icon: Heart, color: '#D4A017' },
    { value: '', label: 'Daily Deliveries', icon: ShieldCheck, color: '#2D6A4F' },
    { value: stats?.avgRating ? `${stats.avgRating}★` : '', label: 'Avg. Rating', icon: Award, color: '#6A994E' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      <button
        onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-8 sm:p-12 mb-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-white/10">
              <Leaf size={24} className="text-green-300" />
            </div>
            <span className="text-green-200 text-xs font-semibold tracking-widest uppercase">Since 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
            About <span className="text-yellow-400">Dhara</span>
          </h1>
          <p className="text-green-100/80 text-base sm:text-lg max-w-2xl leading-relaxed">
            Connecting Kerala's farmers directly to your table — no middlemen, no delays, just pure farm-fresh goodness.
          </p>
        </div>
      </div>

      {mission.content && (
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-green-50">
              <Target size={22} className="text-green-800" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line">{mission.content}</div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${s.color}12` }}>
                <Icon size={22} color={s.color} />
              </div>
              <div className="text-2xl font-extrabold text-gray-900">{s.value || '—'}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {values.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-green-50">
              <Sprout size={22} className="text-green-800" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">What Makes Us Different</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v, i) => {
              const Icon = ICON_MAP[v.icon] || Sprout;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                    <Icon size={20} className="text-green-800" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{v.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {team.length > 0 && (
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-green-50">
              <Users size={22} className="text-green-800" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {team.map((t, i) => (
              <div key={i} className="flex flex-col items-center text-center p-5 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-800 to-green-700 flex items-center justify-center mb-3 shadow-sm">
                  <span className="text-sm font-bold text-white">{t.initial || t.name?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                <div className="text-xs text-green-700 mt-0.5 font-medium">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
