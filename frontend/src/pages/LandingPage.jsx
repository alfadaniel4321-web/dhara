import { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import farmVideo from "../assets/farm-video.mp4";
import philosophyImg from "../assets/WhatsApp Image 2026-05-27 at 10.24.29 AM.jpeg";
import growersImg from "../assets/WhatsApp Image 2026-05-27 at 10.23.55 AM.jpeg";
import traceabilityImg from "../assets/WhatsApp Image 2026-05-27 at 10.24.52 AM.jpeg";
import harvestTomato from "../assets/product-tomato.jpg";
import harvestGreens from "../assets/product-greens.jpg";
import storyGroveImg from "../assets/story-grove.jpg";
import storySoilImg from "../assets/story-soil.jpg";
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); }
    }, { threshold });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const p = Math.min(Math.max((-rect.top + window.innerHeight * 0.1) / (rect.height * 0.8), 0), 1);
      setProgress(p);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);
  return progress;
}

function AnimatedSection({ children, threshold = 0.15, delay = 0, style }) {
  const [ref, visible] = useReveal(threshold);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ─── Shared data ─────────────────────────────────────────────────────────────
const STATS_DATA = [
  { value: '4.9', suffix: '★', label: 'Customer Rating' },
  { value: '42.5k+', suffix: '', label: 'Organic Deliveries' },
  { value: '980+', suffix: '', label: 'Verified Farmers' },
  { value: '24', suffix: ' min', label: 'Avg Delivery' },
];

function StatCard({ stat, index }) {
  const [ref, visible] = useReveal(0.2);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      textAlign: 'center', padding: '2rem 1rem', borderTop: '2px solid #6A994E',
    }}>
      <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 700, color: '#1B4332', margin: '0 0 0.35rem 0', lineHeight: 1 }}>
        {stat.value}{stat.suffix && <span style={{ color: '#D4A017' }}>{stat.suffix}</span>}
      </p>
      <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#3D6B52', margin: 0 }}>{stat.label}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 3D FARMERS — Depth-layered parallax reveal ──────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function FarmerCard3D({ farmer, index }) {
  const [ref, visible] = useReveal(0.2);
  const [isHovered, setIsHovered] = useState(false);
  const fName = farmer.name || 'Verified Kerala Farmer';
  const fRating = farmer.rating || 5.0;
  const initials = fName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const location = [farmer.village, farmer.district].filter(Boolean).join(', ') || 'Kerala, India';

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible
        ? isHovered ? 'translateZ(16px) translateY(-4px)' : 'translateZ(0)'
        : `translateX(${index % 2 === 0 ? '-60px' : '60px'}) rotateY(${index % 2 === 0 ? '-8deg' : '8deg'})`,
      transition: visible
        ? (isHovered ? 'transform 0.3s cubic-bezier(0.16,1,0.3,1)' : 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.8s ease')
        : `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.2}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.2}s`,
      perspective: '600px',
      boxShadow: isHovered ? '0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(106,153,78,0.1)' : '0 4px 20px rgba(0,0,0,0.06)',
    }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ background: '#FFFFFF', border: '1px solid rgba(106,153,78,0.15)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '8rem', height: '8rem', background: 'radial-gradient(circle at top right, rgba(106,153,78,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '3rem', height: '3rem', background: '#1B4332', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transform: isHovered ? 'rotate(5deg)' : 'rotate(0)', transition: 'transform 0.4s ease' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.85rem', fontWeight: 700, color: '#A3C87A' }}>{initials}</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700, color: '#1B4332', margin: 0 }}>{fName}</h4>
              <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(106,153,78,0.1)', color: '#6A994E', border: '1px solid rgba(106,153,78,0.2)', padding: '0.15rem 0.5rem', fontWeight: 700 }}>Verified</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
              <Star size={12} style={{ fill: '#D4A017', color: '#D4A017' }} />
              <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.7rem', fontWeight: 700, color: '#D4A017' }}>{fRating}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={12} color="#6A994E" />
          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.6rem', letterSpacing: '0.05em', color: 'rgba(27,67,50,0.6)', textTransform: 'uppercase' }}>{location}</span>
        </div>
        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.8rem', fontWeight: 300, lineHeight: 1.7, color: '#3D4F45', margin: 0 }}>{farmer.description || 'Sustainable, family-owned farming producing daily fresh harvests without preservative additives. Certified organic by Kerala State Organic Mission.'}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── 3D TESTIMONIALS — Scroll-driven depth reveal ───────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function TestimonialBlock3D({ testimonial, index }) {
  const [ref, visible] = useReveal(0.25);
  const sectionRef = useRef(null);

  const delay = index * 0.18;
  const depthShift = visible ? 0 : 80;
  const rotateVal = visible ? 0 : (index % 2 === 0 ? -6 : 6);

  return (
    <div style={{ perspective: '800px' }}>
      <div ref={ref} style={{
        padding: '3rem 2.5rem',
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) rotateX(0deg) translateZ(0px)'
          : `translateY(${depthShift}px) rotateX(${rotateVal}deg) translateZ(-80px)`,
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        background: index % 2 === 0 ? 'rgba(27,67,50,0.03)' : 'transparent',
        borderLeft: `1px solid rgba(106,153,78,${index % 2 === 0 ? '0.2' : '0.1'})`,
      }}>
        <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '3.5rem', lineHeight: 0.8, color: '#6A994E', margin: '0 0 0.5rem 0', fontWeight: 400 }}>&ldquo;</p>
        <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.7, color: '#1B4332', margin: '0 0 1.5rem 0' }}>{testimonial.text}</p>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', fontWeight: 700, color: '#6A994E', margin: '0 0 0.15rem 0' }}>{testimonial.author}</p>
        <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(163,200,122,0.4)', margin: 0 }}>Verified Marketplace Member</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── CTA SECTION — 3D parallax earth / sphere ────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function CTASection3D() {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);
  const [ref, visible] = useReveal(0.2);

  const sphereRotate = progress * 60;
  const textY = progress * -30;

  return (
    <section ref={sectionRef} className="lp-section-cta" style={{ position: 'relative', background: '#1B4332', overflow: 'hidden', padding: '10rem 1.5rem' }}>
      {/* 3D Sphere decoration */}
      <div style={{
        position: 'absolute', right: '-8rem', top: '50%', width: '42rem', height: '42rem',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #2D6A4F 0%, #1B4332 55%, transparent 75%)',
        opacity: 0.35, pointerEvents: 'none',
        transform: `translateY(calc(-50% + ${(progress - 0.5) * -40}px)) rotate(${sphereRotate}deg)`,
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid rgba(106,153,78,${0.06 + i * 0.02})`, transform: `scale(${0.3 + i * 0.14}) rotateX(${60 + i * 5}deg)` }} />
        ))}
      </div>

      <div ref={ref} className="cta-grid" style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 2, opacity: visible ? 1 : 0, transform: `translateY(${textY}px)`, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.1s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem, 4vw, 4rem)', alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D4A017', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'inline-block', width: '3rem', height: '1px', background: '#D4A017' }} />
            Begin Your Journey
          </p>
          <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.8rem, 4vw, 5rem)', fontWeight: 400, color: '#F5F3E7', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.0, margin: '0 0 2rem 0' }}>From Soil<br /><span style={{ color: '#6A994E' }}>To Your</span><br />Table.</h2>
          <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '1rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(245,243,231,0.6)', margin: '0 0 3rem 0', maxWidth: '480px' }}>Join thousands of Kerala households receiving peak-freshness organic produce directly from verified farming families every single morning.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/login" style={{ fontFamily: '"Courier New", monospace', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1B4332', background: '#A3C87A', padding: '1rem 2.5rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease', boxShadow: '0 0 0 0 rgba(163,200,122,0)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#D4A017'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,160,23,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#A3C87A'; e.currentTarget.style.boxShadow = '0 0 0 0 rgba(163,200,122,0)'; }}>
              Shop the Harvest <ArrowRight size={14} />
            </Link>
            <Link to="/about" style={{ fontFamily: '"Courier New", monospace', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A3C87A', textDecoration: 'none', borderBottom: '1px solid rgba(163,200,122,0.3)', paddingBottom: '0.25rem', transition: 'color 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#D4A017'}
              onMouseLeave={e => e.currentTarget.style.color = '#A3C87A'}>
              Our Story →
            </Link>
          </div>
        </div>
        <div style={{ position: 'relative', height: 'clamp(300px, 35vw, 500px)', overflow: 'hidden' }}>
          <img src={storySoilImg} alt="Kerala soil" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: `scale(${1 + progress * 0.05})`, transition: 'transform 0.1s linear' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(27,67,50,0.3) 0%, transparent 30%)' }} />
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(27,67,50,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(163,200,122,0.1)', padding: '0.5rem 1rem' }}>
            <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(163,200,122,0.5)', textTransform: 'uppercase' }}>Wayanad · Kerala</span>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){.cta-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── HARVEST SECTION ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

function HarvestSection() {
  const [ref] = useReveal(0.15);
  const [harvestItems, setHarvestItems] = useState([]);

  useEffect(() => {
    const fetchHarvest = async () => {
      try {
        const products = await api.products.getProducts();
        if (products && products.length > 0) {
          const items = products.slice(0, 4).map((p, i) => ({
            index: String(i + 1).padStart(2, '0'),
            name: p.title,
            price: p.price ?? 0,
            unit: (p.quantity || '').toUpperCase(),
            region: (p.farmerId?.address || p.farmerId?.district || '').toUpperCase(),
            farmer: (p.farmerId?.name || '').toUpperCase(),
            image: p.image,
          }));
          setHarvestItems(items);
        }
      } catch {
        // API unavailable, show nothing
      }
    };
    fetchHarvest();
  }, []);

  if (harvestItems.length === 0) return null;

  const displayItems = harvestItems;

  return (
    <section style={{ background: '#1B4332', padding: '5rem 2.5rem' }}>
      <div ref={ref} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A3C87A', margin: 0 }}>THIS WEEK'S HARVEST</p>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.8rem, 4vw, 5rem)', fontWeight: 400, margin: '1rem 0 0 0', lineHeight: 1.05 }}>
              <span style={{ color: '#F5F3E7', display: 'block' }}>Picked at dawn,</span>
              <span style={{ color: '#D4A017', display: 'block' }}>priced honestly.</span>
            </h2>
          </div>
          <Link to="/login" style={{ fontFamily: '"Courier New", monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F5F3E7', textDecoration: 'none', flexShrink: 0 }}>VIEW ENTIRE HARVEST →</Link>
        </div>
        <div className="harvest-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px',
          background: 'rgba(245,243,231,0.12)', marginTop: '3rem',
        }}>
          {displayItems.map((item) => (
            <div key={item.index} style={{ background: '#1B4332' }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: 'clamp(180px, 22vw, 320px)', objectFit: 'cover', display: 'block', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
                <span style={{ position: 'absolute', top: '1rem', left: '1rem', fontFamily: '"Courier New", monospace', fontSize: '0.65rem', color: '#F5F3E7', pointerEvents: 'none' }}>{item.index}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(245,243,231,0.12)' }} />
              <div style={{ padding: '1rem 0.75rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.2rem', color: '#F5F3E7', fontWeight: 400 }}>{item.name}</span>
                  <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.72rem', color: '#F5F3E7' }}>₹ {item.price} / {item.unit}</span>
                </div>
                <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.6rem', textTransform: 'uppercase', color: '#A3C87A', letterSpacing: '0.08em', margin: '0.4rem 0 0 0' }}>{item.region} · {item.farmer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:768px){.harvest-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:480px){.harvest-grid{grid-template-columns:1fr!important}}
        .harvest-grid > div:hover img { transform: scale(1.04); }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── HORIZONTAL STORY — Cinematic scroll-driven panels ──────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const STORY_SECTIONS = [
  { label: '01 / Fresh Harvest', heading: 'Fresh Harvest\nEcosystem', body: 'Every morning before sunrise, our network of 980+ verified organic farmers hand-picks produce at peak ripeness. No cold storage. No intermediaries. Just pure, honest food harvested within hours of your order.', cta: 'Explore the Harvest', ctaLink: '/login', image: harvestTomato },
  { label: '02 / Farm Logistics', heading: 'Soil To Table\nLogistics', body: 'Our hyperlocal delivery network transports produce directly from farm to your doorstep within a single circadian cycle. Each route is optimized for speed, ensuring maximum freshness with minimal carbon footprint.', cta: 'See How It Works', ctaLink: '/about', image: philosophyImg },
  { label: '03 / Our Growers', heading: 'Organic Kerala\nFarmers', body: 'We partner with generational farming families who have preserved native agricultural traditions for decades. Every grower is verified, certified organic, and committed to sustainable farming practices.', cta: 'Meet Our Farmers', ctaLink: '/about', image: growersImg },
  { label: '04 / Smart Tracking', heading: 'AI Freshness\nTracking', body: 'Every product carries a digital freshness passport — tracking soil-to-door journey in real-time. Our AI monitors temperature, handling, and transit conditions to guarantee peak quality upon arrival.', cta: 'See The Technology', ctaLink: '/about', image: traceabilityImg },
  { label: '05 / Local Delivery', heading: 'Hyperlocal\nDelivery Network', body: 'Our delivery network spans 12 Kerala districts with an average farm-to-door distance of just 11 km. We deliver within 6 hours of harvest, redefining what fresh truly means.', cta: 'Check Your Area', ctaLink: '/login', image: harvestGreens },
];

function HorizontalScrollStory() {
  const sectionRef = useRef(null);
  const isLockedRef = useRef(false);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const total = STORY_SECTIONS.length;

  const goToNext = () => {
    if (activeIndexRef.current < total - 1) {
      activeIndexRef.current += 1;
      setActiveIndex(activeIndexRef.current);
    } else {
      isLockedRef.current = false;
      setIsLocked(false);
    }
  };

  const goToPrev = () => {
    if (activeIndexRef.current > 0) {
      activeIndexRef.current -= 1;
      setActiveIndex(activeIndexRef.current);
    } else {
      isLockedRef.current = false;
      setIsLocked(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.85) {
          isLockedRef.current = true;
          setIsLocked(true);
        } else {
          isLockedRef.current = false;
          setIsLocked(false);
        }
      },
      { threshold: 0.85 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [isMobile]);



  useEffect(() => {
    if (isMobile) return;
    const onScroll = () => {
      if (isLockedRef.current) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top >= -10 && rect.bottom <= window.innerHeight + 10) {
        isLockedRef.current = true;
        setIsLocked(true);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  if (!isMobile) {
    return (
      <div ref={sectionRef} style={{ minHeight: '70vh', height: 'auto', position: 'relative', overflow: 'hidden', background: '#F5F3E7' }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', width: '60rem', height: '60rem', borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(106,153,78,0.06) 0%, transparent 70%)', top: '-20rem', right: '-10rem', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '40rem', height: '40rem', borderRadius: '50%', background: 'radial-gradient(circle at center, rgba(212,160,23,0.04) 0%, transparent 70%)', bottom: '-10rem', left: '-10rem', pointerEvents: 'none' }} />

        {/* Panels track */}
        <div style={{ display: 'flex', height: '100%', transform: `translate3d(-${activeIndex * 100}vw, 0, 0)`, transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform' }}>
          {STORY_SECTIONS.map((panel, i) => {
            const isActive = i === activeIndex;
            const isNext = i === activeIndex + 1;
            const imgScale = isActive ? 1.08 : 1;
            const imgY = isActive ? 0 : 20;
            const opacity = i < activeIndex ? 0 : i === activeIndex ? 1 : i === activeIndex + 1 ? 0.4 : 0.2;
            return (
              <div key={i} style={{ minWidth: '100vw', minHeight: '70vh', height: 'auto', display: 'flex', position: 'relative', overflow: 'hidden' }}>
                {(() => {
                  const textSide = (
                    <div style={{ width: '50%', display: 'flex', alignItems: 'center', padding: '3rem 4rem', position: 'relative', zIndex: 2, opacity, transition: 'opacity 0.6s ease' }}>
                      <div style={{ maxWidth: '480px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                          <span style={{ display: 'inline-block', width: '1.5rem', height: '1px', background: '#D4A017' }} />
                          <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', letterSpacing: '0.22em', color: 'rgba(27,67,50,0.45)', textTransform: 'uppercase' }}>{panel.label}</span>
                        </div>
                        <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', fontWeight: 400, lineHeight: 1.0, color: '#1B4332', letterSpacing: '-0.03em', textTransform: 'uppercase', margin: '0 0 1.25rem 0', whiteSpace: 'pre-line' }}>{panel.heading}</h2>
                        <div style={{ width: '2.5rem', height: '1px', background: 'rgba(106,153,78,0.2)', marginBottom: '1.25rem' }} />
                        <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.8rem', fontWeight: 300, lineHeight: 1.8, color: 'rgba(27,67,50,0.65)', margin: '0 0 1.5rem 0' }}>{panel.body}</p>
                        <Link to={panel.ctaLink} style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6A994E', textDecoration: 'none', borderBottom: '1px solid rgba(106,153,78,0.3)', paddingBottom: '0.3rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.3s, border-color 0.3s' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#D4A017'; e.currentTarget.style.borderBottomColor = '#D4A017'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#6A994E'; e.currentTarget.style.borderBottomColor = 'rgba(106,153,78,0.3)'; }}>
                          {panel.cta} <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.75rem' }}>→</span>
                        </Link>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                          <div><span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', color: 'rgba(27,67,50,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block' }}>{String(i + 1).padStart(2, '0')}</span></div>
                          <div style={{ width: '1px', height: '0.85rem', background: 'rgba(27,67,50,0.12)' }} />
                          <div><span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', color: 'rgba(27,67,50,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>DHARA</span></div>
                        </div>
                      </div>
                    </div>
                  );

                  const isEven = i % 2 === 0;
                  const accentPosition = isEven ? { right: '1.5rem' } : { left: '1.5rem' };
                  const ringPosition = isEven ? { right: '2rem' } : { left: '2rem' };
                  const gradientDeg = isEven
                    ? '90deg, rgba(245,243,231,0.92) 0%, rgba(245,243,231,0.2) 40%, transparent 60%'
                    : '-90deg, rgba(245,243,231,0.92) 0%, rgba(245,243,231,0.2) 40%, transparent 60%';

                  const imageSide = (
                    <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: '#F5F3E7' }}>
                      <div style={{
                        width: '75%',
                        height: '68%',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 24px rgba(27,67,50,0.08)',
                        border: '1px solid rgba(27,67,50,0.1)',
                        transform: `translate3d(0, ${isActive ? 0 : 20 - imgY}px, 0) scale(${imgScale})`,
                        transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.8s ease',
                        opacity: isActive ? 1 : isNext ? 0.6 : 0,
                      }}>
                        <img src={panel.image} alt={panel.heading} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${gradientDeg})`, pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(0deg, rgba(245,243,231,0.6) 0%, transparent 100%)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', top: '1.5rem', ...accentPosition, background: 'rgba(27,67,50,0.04)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(27,67,50,0.08)', padding: '0.5rem 0.85rem' }}>
                        <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.4rem', letterSpacing: '0.18em', color: 'rgba(27,67,50,0.35)', textTransform: 'uppercase' }}>Live · Kerala</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '2rem', ...ringPosition, width: '5rem', height: '5rem', borderRadius: '50%', border: '1px solid rgba(106,153,78,0.12)', pointerEvents: 'none' }} />
                    </div>
                  );

                  return isEven ? [textSide, imageSide] : [imageSide, textSide];
                })()}
              </div>
            );
          })}
        </div>

        {/* Side navigation buttons */}
        {isLocked && (
          <>
            {activeIndex > 0 && (
              <button onClick={goToPrev} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, background: 'rgba(27,67,50,0.06)', border: '1px solid rgba(27,67,50,0.1)', color: '#1B4332', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '1.1rem' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#D4A017'; e.currentTarget.style.color = '#F5F3E7'; e.currentTarget.style.borderColor = '#D4A017'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(27,67,50,0.06)'; e.currentTarget.style.color = '#1B4332'; e.currentTarget.style.borderColor = 'rgba(27,67,50,0.1)'; }}>
                ‹
              </button>
            )}
            {activeIndex < total - 1 && (
              <button onClick={goToNext} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 30, background: 'rgba(27,67,50,0.06)', border: '1px solid rgba(27,67,50,0.1)', color: '#1B4332', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '1.1rem' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#D4A017'; e.currentTarget.style.color = '#F5F3E7'; e.currentTarget.style.borderColor = '#D4A017'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(27,67,50,0.06)'; e.currentTarget.style.color = '#1B4332'; e.currentTarget.style.borderColor = 'rgba(27,67,50,0.1)'; }}>
                ›
              </button>
            )}
          </>
        )}

        {/* Scroll progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
          <div style={{ height: '1px', background: 'rgba(106,153,78,0.1)', position: 'relative' }}>
            <div style={{ height: '1px', width: `${(activeIndex / (total - 1)) * 100}%`, background: '#D4A017', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 2.5rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              {STORY_SECTIONS.map((_, i) => (
                <button key={i} onClick={() => { activeIndexRef.current = i; setActiveIndex(i); }} style={{ height: '2px', width: i === activeIndex ? '28px' : '14px', background: i === activeIndex ? '#D4A017' : 'rgba(106,153,78,0.2)', transition: 'width 0.4s, background 0.4s', borderRadius: 0, border: 'none', padding: 0, cursor: 'pointer' }} />
              ))}
            </div>
            <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', letterSpacing: '0.15em', color: 'rgba(27,67,50,0.35)' }}>{String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    );
  }

  function MobileStoryPanel({ panel, index }) {
    const [ref, visible] = useReveal(0.12);
    return (
      <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s` }}>
        <div style={{ height: '50vh', overflow: 'hidden', position: 'relative' }}>
          <img src={panel.image} alt={panel.heading} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #F5F3E7 0%, rgba(245,243,231,0.8) 50%, transparent 70%)' }} />
          <span style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', fontFamily: '"Courier New", monospace', fontSize: '0.55rem', letterSpacing: '0.18em', color: 'rgba(27,67,50,0.6)', textTransform: 'uppercase', background: 'rgba(245,243,231,0.9)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '0.35rem 0.75rem' }}>{panel.label}</span>
        </div>
        <div style={{ padding: '2rem 1.5rem 3rem' }}>
          <div style={{ width: '1.5rem', height: '1px', background: '#D4A017', marginBottom: '0.85rem' }} />
          <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 400, lineHeight: 1.05, color: '#1B4332', letterSpacing: '-0.02em', margin: '0 0 0.85rem 0', whiteSpace: 'pre-line' }}>{panel.heading}</h2>
          <p style={{ fontFamily: '-apple-system, sans-serif', fontSize: '0.8rem', fontWeight: 300, lineHeight: 1.75, color: 'rgba(27,67,50,0.65)', margin: '0 0 1.5rem 0' }}>{panel.body}</p>
          <Link to={panel.ctaLink} style={{ fontFamily: '"Courier New", monospace', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6A994E', textDecoration: 'none', borderBottom: '1px solid rgba(106,153,78,0.3)', paddingBottom: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>{panel.cta} →</Link>
        </div>
      </div>
    );
  }

  return (
    <section style={{ background: '#F5F3E7', padding: 0 }}>
      {STORY_SECTIONS.map((panel, i) => <MobileStoryPanel key={i} panel={panel} index={i} />)}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── BRAND STORY SECTION ────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function BrandStorySection() {
  const [imgRef, imgVisible] = useReveal(0.15);

  return (
    <section
      className="brand-story-section"
      style={{ background: '#1B4332', width: '100%', minHeight: '70vh' }}
    >
      <div
        className="brand-story-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 1fr',
          minHeight: '70vh',
        }}
      >
        {/* ── LEFT TEXT PANEL ── */}
        <AnimatedSection delay={0} style={{ height: '100%' }}>
          <div
            style={{
              background: '#1B4332',
              padding: '3rem 2rem 3rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              borderRight: '1px solid rgba(163,200,122,0.08)',
            }}
          >
            <div style={{ maxWidth: '300px' }}>
              <p
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.22em',
                  color: '#A3C87A',
                  margin: '0 0 1rem 0',
                  textTransform: 'uppercase',
                }}
              >
                OUR BEGINNING
              </p>
              <div
                style={{
                  width: '1.5rem',
                  height: '1px',
                  background: '#D4A017',
                  marginBottom: '1.25rem',
                }}
              />
              <h2
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
                  fontWeight: 400,
                  lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                  textTransform: 'uppercase',
                  color: '#F5F3E7',
                  margin: '0 0 1.5rem 0',
                }}
              >
                <span style={{ display: 'block' }}>Born from</span>
                <span style={{ display: 'block' }}>Kerala's oldest</span>
                <span style={{ display: 'block' }}>farming families.</span>
              </h2>
              <p
                style={{
                  fontFamily: '-apple-system, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'rgba(245,243,231,0.65)',
                  margin: 0,
                }}
              >
                Dhara was founded in 2023 after witnessing generational organic
                farmers in Wayanad and Idukki selling heirloom produce at
                throwaway prices to aggregators — while urban households paid a
                premium for imported, cold-stored substitutes.
              </p>
              <Link
                to="/about"
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#A3C87A',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(163,200,122,0.3)',
                  paddingBottom: '0.25rem',
                  display: 'inline-block',
                  marginTop: '1.75rem',
                  transition: 'color 0.3s ease, border-bottom-color 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#D4A017';
                  e.currentTarget.style.borderBottomColor = '#D4A017';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#A3C87A';
                  e.currentTarget.style.borderBottomColor =
                    'rgba(163,200,122,0.3)';
                }}
              >
                Read our full story →
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* ── CENTER IMAGE ── */}
        <div
          ref={imgRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '70vh',
            opacity: imgVisible ? 1 : 0,
            transform: imgVisible ? 'scale(1)' : 'scale(1.04)',
            transition:
              'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.1s',
          }}
        >
          <img
            src={storyGroveImg}
            alt="Kerala farmland"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Subtle side gradients to blend into panels */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(27,67,50,0.35) 0%, transparent 20%, transparent 80%, rgba(27,67,50,0.35) 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* Location badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(27,67,50,0.75)',
              padding: '0.5rem 1.25rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                color: '#A3C87A',
                textTransform: 'uppercase',
              }}
            >
              Idukki District · Kerala
            </span>
          </div>
        </div>

        {/* ── RIGHT TEXT PANEL ── */}
        <AnimatedSection delay={0.3} style={{ height: '100%' }}>
          <div
            style={{
              background: '#1B4332',
              padding: '3rem 2.5rem 3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              borderLeft: '1px solid rgba(163,200,122,0.08)',
            }}
          >
            <div style={{ maxWidth: '300px' }}>
              <p
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.22em',
                  color: '#A3C87A',
                  margin: '0 0 1rem 0',
                  textTransform: 'uppercase',
                }}
              >
                WHERE WE ARE TODAY
              </p>
              <div
                style={{
                  width: '1.5rem',
                  height: '1px',
                  background: '#D4A017',
                  marginBottom: '1.25rem',
                }}
              />
              <p
                style={{
                  fontFamily: '-apple-system, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'rgba(245,243,231,0.65)',
                  margin: '0 0 1.25rem 0',
                }}
              >
                We started with seven farming families and a single WhatsApp
                group. Today we work with 980+ verified growers across 12 Kerala
                districts.
              </p>
              <div
                style={{
                  height: '1px',
                  background: 'rgba(163,200,122,0.15)',
                  margin: '1.5rem 0',
                }}
              />
              {/* Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '1.8rem',
                      color: '#F5F3E7',
                      fontWeight: 400,
                      display: 'block',
                      lineHeight: 1,
                    }}
                  >
                    2023
                  </span>
                  <span
                    style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize: '0.55rem',
                      color: '#A3C87A',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}
                  >
                    Founded
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '1.8rem',
                      color: '#F5F3E7',
                      fontWeight: 400,
                      display: 'block',
                      lineHeight: 1,
                    }}
                  >
                    7undo
                  </span>
                  <span
                    style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize: '0.55rem',
                      color: '#A3C87A',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}
                  >
                    Founding farmers
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                      fontSize: '1.8rem',
                      color: '#F5F3E7',
                      fontWeight: 400,
                      display: 'block',
                      lineHeight: 1,
                    }}
                  >
                    980+
                  </span>
                  <span
                    style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize: '0.55rem',
                      color: '#A3C87A',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginTop: '0.25rem',
                      display: 'block',
                    }}
                  >
                    Verified growers today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @media(max-width:1024px){
          .brand-story-grid { grid-template-columns: 1fr !important; }
          .brand-story-grid > div:nth-child(2) { min-height: 40vh !important; }
        }
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MANIFESTO SECTION ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function ManifestoSection() {
  return (
    <section className="lp-section-manifesto" style={{ background: '#1B4332', width: '100%', padding: '8rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', pointerEvents: 'none', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <div style={{ width: '40rem', height: '40rem', borderRadius: '50%', border: '1px solid rgba(163,200,122,0.06)', position: 'absolute', top: '-10rem', right: '-10rem' }} />
        <div style={{ width: '25rem', height: '25rem', borderRadius: '50%', border: '1px solid rgba(163,200,122,0.04)', position: 'absolute', bottom: '-8rem', left: '-6rem' }} />
      </div>

      <AnimatedSection threshold={0.15}>
        <div className="manifesto-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem, 4vw, 6rem)', alignItems: 'center', position: 'relative', zIndex: 1 }}>

          <AnimatedSection delay={0}>
            <div>
              <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'rgba(163,200,122,0.6)', margin: '0 0 1.5rem 0' }}>WHY WE EXIST</p>
              <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.03em', textTransform: 'uppercase', margin: '0 0 2rem 0' }}>
                <span style={{ color: '#F5F3E7', display: 'block' }}>Kerala's soil</span>
                <span style={{ color: '#A3C87A', display: 'block' }}>deserves better</span>
                <span style={{ color: '#F5F3E7', display: 'block' }}>than a cold chain.</span>
              </h2>
              <p style={{ color: 'rgba(245,243,231,0.65)', fontFamily: '-apple-system, sans-serif', fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.9, maxWidth: '420px', margin: 0 }}>
                For decades, the richest organic farmland in India has been filtered through distributors, warehouses, and refrigeration units — arriving on your plate days late and nutrients short. Dhara exists to end that.
              </p>
              <p style={{ color: 'rgba(245,243,231,0.65)', fontFamily: '-apple-system, sans-serif', fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.9, maxWidth: '420px', marginTop: '1.25rem' }}>
                We rebuild the direct relationship between the farmer who grew it and the family who eats it. Every order. Every morning.
              </p>
              <Link to="/about" style={{ fontFamily: '"Courier New", monospace', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A3C87A', textDecoration: 'none', borderBottom: '1px solid rgba(163,200,122,0.3)', paddingBottom: '0.3rem', display: 'inline-block', marginTop: '2.5rem' }}>
                Read our full story →
              </Link>
            </div>
          </AnimatedSection>

            <AnimatedSection delay={0.2}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(1rem, 2vw, 1.5rem) 0', borderBottom: '1px solid rgba(163,200,122,0.12)' }}>
                <span style={{ fontFamily: '-apple-system, sans-serif', fontSize: 'clamp(0.75rem, 1.2vw, 0.82rem)', fontWeight: 300, color: 'rgba(245,243,231,0.5)' }}>Average farm-to-door distance</span>
                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 400, color: '#A3C87A' }}>11 km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(1rem, 2vw, 1.5rem) 0', borderBottom: '1px solid rgba(163,200,122,0.12)' }}>
                <span style={{ fontFamily: '-apple-system, sans-serif', fontSize: 'clamp(0.75rem, 1.2vw, 0.82rem)', fontWeight: 300, color: 'rgba(245,243,231,0.5)' }}>Time from harvest to delivery</span>
                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 400, color: '#A3C87A' }}>&lt; 6 hrs</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(1rem, 2vw, 1.5rem) 0', borderBottom: '1px solid rgba(163,200,122,0.12)' }}>
                <span style={{ fontFamily: '-apple-system, sans-serif', fontSize: 'clamp(0.75rem, 1.2vw, 0.82rem)', fontWeight: 300, color: 'rgba(245,243,231,0.5)' }}>Farmers paid above MSP</span>
                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 400, color: '#A3C87A' }}>100%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(1rem, 2vw, 1.5rem) 0' }}>
                <span style={{ fontFamily: '-apple-system, sans-serif', fontSize: 'clamp(0.75rem, 1.2vw, 0.82rem)', fontWeight: 300, color: 'rgba(245,243,231,0.5)' }}>Produce rejected for quality</span>
                <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 400, color: '#A3C87A' }}>&lt; 3%</span>
              </div>
              <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.55rem', color: 'rgba(163,200,122,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1rem' }}>
                Numbers audited quarterly by Kerala State Organic Mission
              </p>
            </div>
          </AnimatedSection>

        </div>
      </AnimatedSection>

      <style>{`
        @media(max-width:768px){.manifesto-grid{grid-template-columns:1fr!important;gap:3rem!important}}
      `}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN LANDING PAGE ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const [topFarmers, setTopFarmers] = useState([]);
  const [introPhase, setIntroPhase] = useState('visible');
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const farmers = await api.auth.getFarmers();
        setTopFarmers(farmers.slice(0, 2));
      } catch {
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const farmers = mockUsers.filter(u => u.role === 'farmer' && !u.blocked);
        setTopFarmers(farmers.slice(0, 2));
      }
    };
    fetchFarmers();
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-intro', 'true');
    document.body.style.overflow = 'hidden';
    const t1 = setTimeout(() => setIntroPhase('exiting'), 2400);
    const t2 = setTimeout(() => {
      setIntroPhase('done');
      document.body.removeAttribute('data-intro');
      document.body.style.overflow = '';
      setVideoReady(true);
    }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); document.body.removeAttribute('data-intro'); document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (videoReady && videoRef.current) videoRef.current.play().catch(() => {});
  }, [videoReady]);

  const testimonials = useMemo(() => [
    { text: 'Dhara completely redefined how we secure fresh organic cow milk in Kottayam. The freshness timer is incredibly reliable.', author: 'Aravind K., Kochi Customer' },
    { text: 'Selling farm duck eggs directly to urban households doubled my farm profitability. The trust rating maintains our quality standards.', author: 'Madhavan Nair, Wayanad Farmer Partner' },
  ], []);

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden', background: '#F5F3E7' }}>
      <style>{`
        @keyframes introNameReveal { 0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)} }
        @keyframes introTaglineReveal { 0%{opacity:0;letter-spacing:0.5em}100%{opacity:1;letter-spacing:0.25em} }
        @keyframes introPanelUp { 0%{transform:translateY(0)}100%{transform:translateY(-100%)} }
        @keyframes introPanelDown { 0%{transform:translateY(0)}100%{transform:translateY(100%)} }

        /* ── Small College Laptops (1025px–1366px) ── */
        @media(min-width:1025px)and(max-width:1366px){
          .lp-section-hero{height:100vh!important}
          .lp-section-farmers{padding:6rem 1.5rem!important}
          .lp-section-testimonials{padding:6rem 1.5rem!important}
          .lp-section-manifesto{padding:6rem 2rem!important}
          .lp-section-cta{padding:7rem 1.5rem!important}
        }

        /* ── Tablet (769px–1024px) ── */
        @media(min-width:769px)and(max-width:1024px){
          .stats-grid{grid-template-columns:repeat(2,1fr)!important}
          .lp-section-farmers{padding:5rem 1.5rem!important}
          .lp-section-testimonials{padding:5rem 1.5rem!important}
          .lp-section-manifesto{padding:5rem 2rem!important}
          .lp-section-cta{padding:6rem 1.5rem!important}
          .lp-section-hero{height:100vh!important}
        }

        /* ── Large Mobile / Small Tablet (481px–768px) ── */
        @media(max-width:768px){
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;gap:1rem!important}
          .lp-section-hero{height:100vh!important}
          .lp-section-farmers{padding:3.5rem 1.25rem!important}
          .lp-section-testimonials{padding:3.5rem 1.25rem!important}
          .lp-section-manifesto{padding:3.5rem 1.25rem!important}
          .lp-section-cta{padding:4rem 1.25rem!important}
          .hero-cta-wrapper{flex-direction:column!important;gap:1.5rem!important;align-items:center!important}
        }

        /* ── Small Mobile (≤480px) ── */
        @media(max-width:480px){
          .stats-grid{grid-template-columns:1fr!important;gap:0.75rem!important}
          .lp-section-hero{height:100vh!important}
          .lp-section-farmers{padding:2.5rem 1rem!important}
          .lp-section-testimonials{padding:2.5rem 1rem!important}
          .lp-section-manifesto{padding:2.5rem 1rem!important}
          .lp-section-cta{padding:3rem 1rem!important}
        }
      `}</style>

      {/* ── INTRO OVERLAY ── */}
      {introPhase !== 'done' && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '50vh', background: '#1B4332', zIndex: 9999, animation: introPhase === 'exiting' ? 'introPanelUp 0.9s cubic-bezier(0.76,0,0.24,1) forwards' : 'none' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '50vh', background: '#1B4332', zIndex: 9999, animation: introPhase === 'exiting' ? 'introPanelDown 0.9s cubic-bezier(0.76,0,0.24,1) forwards' : 'none' }} />
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: introPhase === 'exiting' ? 0 : 1, transition: 'opacity 0.35s ease' }}>
            <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(4rem, 12vw, 10rem)', fontWeight: 700, color: '#F5F3E7', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0, lineHeight: 1, animation: 'introNameReveal 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both' }}>DHARA</h1>
            <p style={{ fontFamily: '"Courier New", monospace', fontSize: 'clamp(0.65rem, 1.5vw, 0.9rem)', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#D4A017', margin: '1rem 0 0 0', animation: 'introTaglineReveal 1s cubic-bezier(0.16,1,0.3,1) 0.7s both' }}>Organic Kerala</p>
          </div>
          {introPhase === 'visible' && <div style={{ position: 'fixed', top: '50vh', left: 0, right: 0, height: '1px', background: 'rgba(212,160,23,0.35)', zIndex: 10001, pointerEvents: 'none' }} />}
        </>
      )}

      <div style={{ opacity: introPhase === 'done' ? 1 : 0, transition: introPhase === 'done' ? 'opacity 0.6s ease 0.1s' : 'none' }}>

        {/* ── HERO ── */}
        <section className="lp-section-hero" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
          <video ref={videoRef} loop muted playsInline preload="auto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
            <source src={farmVideo} type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,14,10,0.88) 0%, rgba(8,14,10,0.50) 50%, rgba(8,14,10,0.20) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeroSection />
          </div>
        </section>

        {/* ── STATISTICS BAND ── */}
        <section style={{ padding: '4rem 1.5rem', background: '#F5F3E7' }}>
          <div className="stats-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            {STATS_DATA.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
          </div>
        </section>

        <BrandStorySection />

        <HorizontalScrollStory />

        <ManifestoSection />

        {/* ══════════════════════════════════════════════════ */}
        {/* ── FARMER PROFILES with 3D depth reveal ── */}
        {/* ══════════════════════════════════════════════════ */}
        <section className="lp-section-farmers" style={{ padding: '8rem 1.5rem', background: '#F5F3E7', perspective: '1000px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2rem, 4vw, 4rem)', alignItems: 'start' }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {topFarmers.map((farmer, i) => <FarmerCard3D key={farmer.id || farmer._id} farmer={farmer} index={i} />)}
              </div>
            </div>
          </div>
        </section>

        <HarvestSection />

        {/* ══════════════════════════════════════════════════ */}
        {/* ── TESTIMONIALS with 3D depth ── */}
        {/* ══════════════════════════════════════════════════ */}
        <section className="lp-section-testimonials" style={{ padding: '8rem 1.5rem', background: '#F5F3E7' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <AnimatedSection>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6A994E', margin: '0 0 0.75rem 0' }}>Testimonials</p>
                <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400, color: '#1B4332', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>Voice of the Marketplace</h2>
              </div>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'rgba(106,153,78,0.1)', perspective: '1000px' }}>
              {testimonials.map((t, i) => <TestimonialBlock3D key={i} testimonial={t} index={i} />)}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════ */}
        {/* ── CTA SECTION ── */}
        {/* ══════════════════════════════════════════════════ */}
        <CTASection3D />

      </div>
    </div>
  );
}
