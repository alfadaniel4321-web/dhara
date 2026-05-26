import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { api } from '../services/api';
import farmVideo from "../assets/farm-video.mp4";

import {
  Star,
  MapPin,
  Leaf,
  Calendar,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {

  const navigate = useNavigate();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topFarmers, setTopFarmers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {

        const prods = await api.products.getProducts();
        setFeaturedProducts(prods.slice(0, 3));

        // Load top farmers from local storage
        const mockUsers = JSON.parse(
          localStorage.getItem('mock_users') || '[]'
        );

        const farmers = mockUsers.filter(
          (u) => u.role === 'farmer' && !u.blocked
        );

        setTopFarmers(farmers.slice(0, 2));

      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  const stats = [
    { value: '4.9★', label: 'Customer Rating' },
    { value: '42.5k+', label: 'Organic Deliveries' },
    { value: '980+', label: 'Verified Farmers' },
    { value: '24 min', label: 'Avg Delivery Proximity' },
  ];

  const features = [
    {
      title: 'Hyperlocal Proximity Sourcing',
      description:
        'Products harvested and dispatched from organic farms within a strict 15km radius of your doorstep.',
      icon: MapPin,
    },

    {
      title: 'Zero Middlemen Pricing',
      description:
        'Direct transaction channels mapping 100% of organic listing prices straight to the farmer.',
      icon: Leaf,
    },

    {
      title: 'AI Freshness Indexes',
      description:
        'Validation parameters that calculate exact time-since-harvest to score and guarantee quality.',
      icon: ShieldCheck,
    },

    {
      title: 'Routine Delivery Calendars',
      description:
        'Seamless automated morning and evening schedules for fresh daily eggs, dairy, and crops.',
      icon: Calendar,
    },
  ];

  const testimonials = [
    {
      text:
        'Dhara completely redefined how we secure fresh organic cow milk in Kottayam. The freshness timer is incredibly reliable.',
      author: 'Aravind K., Kochi Customer',
    },

    {
      text:
        'Selling farm duck eggs directly to urban households doubled my farm profitability. The trust rating maintains our quality.',
      author: 'Madhavan Nair, Wayanad Farmer Partner',
    },
  ];

  return (

    <div className="relative w-full overflow-x-hidden bg-[#F5F3E7]">

      {/* FULLSCREEN HERO VIDEO */}
      <section className="relative h-screen w-full overflow-hidden">

        {/* Fullscreen Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={farmVideo} type="video/mp4" />
        </video>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <HeroSection />
        </div>

      </section>

      {/* MAIN CONTENT WITH WHITE BACKGROUND */}
      <section className="relative z-20 bg-[#F5F3E7] py-20">

        <div className="max-w-6xl mx-auto px-4 space-y-24">

          {/* SECTION 1: STATISTICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {stats.map((st, i) => (

              <div
                key={i}
                className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl border border-[#6A994E]/20 text-center hover:border-[#D4A017]/40 hover:shadow-2xl transition-all duration-300 group"
              >

                <p className="text-3xl md:text-4xl font-black text-[#1B4332] group-hover:scale-105 transition-transform duration-300">
                  {st.value}
                </p>

                <p className="text-[10px] uppercase tracking-widest text-[#6A994E] mt-1.5 font-bold">
                  {st.label}
                </p>

              </div>

            ))}

          </div>

          {/* SECTION 2: FEATURES */}
          <div className="space-y-12">

            <div className="text-center space-y-2">

              <span className="text-[10px] uppercase tracking-widest text-[#6A994E] font-bold bg-[#1B4332]/10 border border-[#6A994E]/20 px-3 py-1 rounded-full">
                E-Commerce Features
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B4332] tracking-tight pt-1">
                Luxury direct farm trading infrastructure
              </h2>

              <p className="text-xs text-[#1B4332]/70 max-w-lg mx-auto font-light leading-relaxed">
                We implement cutting-edge agricultural metrics to bridge local farmers directly to customers.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {features.map((feat, idx) => {

                const FeatIcon = feat.icon;

                return (

                  <div
                    key={idx}
                    className="bg-white/70 backdrop-blur-lg border border-[#6A994E]/20 rounded-3xl p-6 space-y-4 hover:border-[#D4A017]/30 transition-all duration-300 flex flex-col justify-between"
                  >

                    <div className="space-y-3">

                      <div className="w-10 h-10 rounded-xl bg-[#6A994E]/10 border border-[#6A994E]/20 flex items-center justify-center text-[#6A994E] shrink-0">
                        <FeatIcon className="w-5 h-5" />
                      </div>

                      <h4 className="text-sm font-bold text-[#1B4332] leading-snug">
                        {feat.title}
                      </h4>

                      <p className="text-xs text-[#1B4332]/70 leading-relaxed font-light">
                        {feat.description}
                      </p>

                    </div>

                  </div>

                );
              })}

            </div>

          </div>

          {/* SECTION 3: FEATURED PRODUCTS */}
          <div className="space-y-10">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#6A994E]/20 pb-4">

              <div className="space-y-1">

                <h3 className="text-2xl font-bold text-[#1B4332] tracking-tight flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-[#6A994E]" />
                  Today's Organic Sourcing Highlights
                </h3>

                <p className="text-xs text-[#1B4332]/70 font-light">
                  Sourced, harvested, and packaged in local zones this morning.
                </p>

              </div>

              <Link
                to="/dashboard"
                className="text-xs text-[#6A994E] hover:text-[#D4A017] font-bold flex items-center space-x-1 shrink-0"
              >

                <span>View Full Catalog</span>

                <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {featuredProducts.map((p) => {

                const discount = Math.round((p.price || 50) * 0.15);

                return (

                  <div
                    key={p.id || p._id}
                    className="bg-white/80 backdrop-blur-lg rounded-3xl border border-[#6A994E]/20 overflow-hidden p-4 flex flex-col justify-between hover:border-[#D4A017]/40 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                    onClick={() => navigate(`/product/${p.id || p._id}`)}
                  >

                    <div className="space-y-3">

                      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#6A994E]/10">

                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        <div className="absolute top-2 left-2 flex flex-col space-y-1.5 items-start">

                          <span className="bg-[#6A994E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Harvested Today
                          </span>

                          {discount > 0 && (

                            <span className="bg-[#D4A017] text-[#1B4332] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              SAVE ₹{discount}
                            </span>

                          )}

                        </div>

                      </div>

                      <div className="space-y-1">

                        <span className="text-[10px] bg-[#1B4332] text-[#F5F3E7] font-bold px-2.5 py-0.5 rounded border border-[#6A994E]/20 uppercase tracking-widest">
                          {p.category}
                        </span>

                        <h4 className="text-base font-bold text-[#1B4332] mt-2 truncate group-hover:text-[#6A994E] transition-colors">
                          {p.title}
                        </h4>

                        <div className="flex items-center justify-between text-xs pt-1">

                          <span className="text-[#6A994E] font-black text-sm">
                            ₹{p.price}
                          </span>

                          <span className="text-[#1B4332]/60 font-medium">
                            {p.quantity} unit
                          </span>

                        </div>

                      </div>

                    </div>

                    <Link
                      to="/dashboard"
                      className="text-center block bg-[#6A994E] hover:bg-[#D4A017] text-white font-extrabold py-2.5 rounded-xl text-xs mt-5 transition-all shadow-md"
                    >
                      Shop Fresh Sourcing
                    </Link>

                  </div>

                );
              })}

            </div>

          </div>

          {/* SECTION 4: TOP FARMERS */}
          <div className="space-y-10">

            <div className="text-center space-y-2">

              <span className="text-[10px] uppercase tracking-widest text-[#6A994E] font-bold bg-[#1B4332]/10 border border-[#6A994E]/20 px-3 py-1 rounded-full">
                Featured Farmer Partners
              </span>

              <h3 className="text-2xl font-bold text-[#1B4332] pt-1">
                Verified Kerala Sourcing Partners
              </h3>

              <p className="text-xs text-[#1B4332]/70 font-light">
                Direct bios and ratings logs of our regional agriculturalists.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

              {topFarmers.map((farmer) => {

                const fName = farmer.name || 'Verified Kerala Farmer';
                const fRating = farmer.rating || 5.0;

                return (

                  <div
                    key={farmer.id || farmer._id}
                    className="bg-white/70 backdrop-blur-lg border border-[#6A994E]/20 rounded-3xl p-6 space-y-4 hover:border-[#D4A017]/30 transition-all duration-300"
                  >

                    <div className="flex items-center space-x-3.5">

                      <div className="w-12 h-12 rounded-full bg-[#6A994E]/10 border-2 border-[#6A994E] flex items-center justify-center text-lg font-bold text-[#6A994E] shadow-lg">
                        {fName.substring(0, 2).toUpperCase()}
                      </div>

                      <div>

                        <h4 className="text-base font-bold text-[#1B4332] flex items-center">

                          <span>{fName}</span>

                          <span className="ml-2 bg-[#6A994E]/10 text-[#6A994E] border border-[#6A994E]/20 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                            Verified Producer
                          </span>

                        </h4>

                        <div className="flex items-center text-xs text-[#D4A017] font-bold mt-0.5">

                          <Star className="w-3.5 h-3.5 fill-[#D4A017] mr-1" />

                          <span>{fRating}★ Trust Rating</span>

                        </div>

                      </div>

                    </div>

                    <div className="bg-[#1B4332]/5 p-4 rounded-xl border border-[#6A994E]/20 text-xs text-[#1B4332]/80 space-y-2">

                      <div className="flex items-center space-x-2">

                        <MapPin className="w-4 h-4 text-[#6A994E] shrink-0" />

                        <span>
                          Farm Sector: {farmer.address || 'Kerala, India'}
                        </span>

                      </div>

                      <p className="font-light text-[#1B4332]/70 mt-1 leading-relaxed">
                        Sustainable, family-owned farming producing daily fresh harvests without preservative additives.
                      </p>

                    </div>

                  </div>

                );
              })}

            </div>

          </div>

          {/* SECTION 5: TESTIMONIALS */}
          <div className="space-y-12">

            <div className="text-center space-y-2">

              <span className="text-[10px] uppercase tracking-widest text-[#6A994E] font-bold bg-[#1B4332]/10 border border-[#6A994E]/20 px-3 py-1 rounded-full">
                Testimonials
              </span>

              <h3 className="text-2xl font-bold text-[#1B4332] pt-1">
                Voice of our Marketplace
              </h3>

              <p className="text-xs text-[#1B4332]/70 font-light">
                Feedback from our customers and merchant agriculturalists.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

              {testimonials.map((t, idx) => (

                <div
                  key={idx}
                  className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl border border-[#6A994E]/20 hover:border-[#D4A017]/30 transition-all"
                >

                  <p className="text-xs md:text-sm text-[#1B4332] italic leading-relaxed font-light">
                    "{t.text}"
                  </p>

                  <p className="text-[10px] text-[#6A994E] uppercase tracking-wider font-bold mt-4 text-right">
                    — {t.author}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
