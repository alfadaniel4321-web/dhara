import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { api } from '../services/api';
import {
  ChevronLeft, Bell, MapPin, Package, Clock, Truck, Home,
  CheckCircle, Phone, MessageSquare, Share2, HelpCircle,
  Navigation, Star, Leaf, User, ShoppingBag, Heart, Menu,
} from 'lucide-react';

const STAGES_DATA = [
  { label: 'Order Confirmed', desc: 'Your order has been confirmed', key: 'confirmed' },
  { label: 'Farmer Packed Order', desc: 'Farm-fresh produce packed with care', key: 'packed' },
  { label: 'Picked Up', desc: 'Picked up from the farm', key: 'picked' },
  { label: 'Out For Delivery', desc: 'Your order is on its way', key: 'outfordelivery' },
  { label: 'Delivered', desc: 'Successfully delivered', key: 'delivered' },
];

function getStageIndex(status) {
  switch (status) {
    case 'Pending': return 0;
    case 'Processing': return 1;
    case 'In Transit': return 2;
    case 'Delivered': return 4;
    default: return 0;
  }
}

function Timeline({ currentStage }) {
  return (
    <div style={{ padding: '0' }}>
      {STAGES_DATA.map((stage, i) => {
        const done = i <= currentStage;
        const isNow = i === currentStage;
        return (
          <div key={stage.key} style={{ display: 'flex', gap: '0.65rem', position: 'relative', paddingBottom: i < STAGES_DATA.length - 1 ? '1rem' : 0 }}>
            {i < STAGES_DATA.length - 1 && (
              <div style={{
                position: 'absolute', left: '11px', top: '24px',
                width: '2px', height: 'calc(100% - 2px)',
                background: done ? '#2D6A4F' : 'rgba(27,67,50,0.08)',
              }} />
            )}
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              background: done ? '#1B4332' : 'rgba(27,67,50,0.04)',
              border: done ? 'none' : '2px solid rgba(27,67,50,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {done ? (
                <CheckCircle size={14} color="#A3C87A" fill="#1B4332" />
              ) : isNow ? (
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4A017', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ) : null}
            </div>
            <div style={{ flex: 1, paddingTop: '2px' }}>
              <p style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.78rem',
                fontWeight: done ? 700 : 500,
                color: done ? '#1B4332' : 'rgba(27,67,50,0.3)',
                margin: 0,
              }}>
                {stage.label}
                {isNow && done && (
                  <span style={{
                    display: 'inline-block', marginLeft: '0.4rem',
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#D4A017', animation: 'pulse 1.5s ease-in-out infinite',
                    verticalAlign: 'middle',
                  }} />
                )}
              </p>
              <p style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.62rem',
                color: done ? 'rgba(27,67,50,0.45)' : 'rgba(27,67,50,0.15)',
                margin: '2px 0 0 0',
              }}>{stage.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MapCard({ eta }) {
  return (
    <div style={{
      borderRadius: '22px', overflow: 'hidden', position: 'relative',
      background: 'linear-gradient(145deg, #1B4332 0%, #0F1E14 50%, #080E0A 100%)',
      minHeight: '200px', boxShadow: '0 4px 24px rgba(27,67,50,0.15)',
    }}>
      {/* Decorative grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: `
          linear-gradient(rgba(163,200,122,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(163,200,122,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px',
      }} />

      {/* Route line decoration */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 200" preserveAspectRatio="none">
        <path d="M 50 160 Q 120 40 200 100 Q 280 160 350 60" fill="none" stroke="rgba(163,200,122,0.3)" strokeWidth="2.5" strokeDasharray="6 4" />
        <path d="M 50 160 Q 120 40 200 100 Q 280 160 350 60" fill="none" stroke="#A3C87A" strokeWidth="2" />
        <circle cx="50" cy="160" r="6" fill="#D4A017" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="350" cy="60" r="6" fill="#1B4332" stroke="#A3C87A" strokeWidth="2" />
        <g transform="translate(200, 100)">
          <rect x="-10" y="-8" width="20" height="16" rx="4" fill="#A3C87A" />
          <polygon points="0,-12 -4,-8 4,-8" fill="#A3C87A" />
        </g>
      </svg>

      {/* Location pins */}
      <div style={{
        position: 'absolute', top: '1rem', left: '1rem',
        display: 'flex', alignItems: 'center', gap: '0.35rem',
        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
        borderRadius: '10px', padding: '0.35rem 0.65rem',
      }}>
        <Navigation size={12} color="#A3C87A" strokeWidth={2} />
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.55rem', fontWeight: 600, color: '#A3C87A' }}>Live</span>
      </div>

      {/* ETA badge */}
      <div style={{
        position: 'absolute', bottom: '1rem', right: '1rem',
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
        borderRadius: '12px', padding: '0.5rem 0.85rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }}>
        <p style={{
          fontFamily: '"DM Sans", sans-serif', fontSize: '0.55rem',
          color: 'rgba(27,67,50,0.45)', margin: 0, lineHeight: 1.2,
        }}>Arriving in</p>
        <p style={{
          fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1rem',
          fontWeight: 700, color: '#1B4332', margin: 0, lineHeight: 1.3,
        }}>{eta}</p>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px',
        background: 'linear-gradient(to top, rgba(245,243,231,0.15), transparent)',
      }} />
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div style={{ marginTop: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <span style={{
          fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
          letterSpacing: '0.08em', color: 'rgba(27,67,50,0.3)', textTransform: 'uppercase',
        }}>Delivery Progress</span>
        <span style={{
          fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem',
          fontWeight: 700, color: '#1B4332',
        }}>{percent}%</span>
      </div>
      <div style={{
        width: '100%', height: '6px', borderRadius: '3px',
        background: 'rgba(27,67,50,0.06)', overflow: 'hidden',
      }}>
        <div style={{
          width: `${percent}%`, height: '100%', borderRadius: '3px',
          background: 'linear-gradient(90deg, #6A994E, #1B4332)',
          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  );
}

export default function MobileOrderTracking() {
  const { oid } = useParams();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.count, 0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const ord = await api.orders.trackOrder(oid);
        setOrder(ord);
        const fItem = ord.products?.[0];
        if (fItem?.farmerId) {
          try {
            const farmers = await api.auth.getFarmers();
            const found = farmers.find(u => u.id === fItem.farmerId || u._id === fItem.farmerId);
            setFarmer(found || null);
          } catch {}
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [oid]);

  if (loading) {
    return (
      <div style={{ background: '#F5F3E7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '36px', height: '36px', margin: '0 auto 0.75rem',
            border: '3px solid rgba(27,67,50,0.06)', borderTopColor: '#1B4332',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: 'rgba(27,67,50,0.4)' }}>Loading tracking...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ background: '#F5F3E7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '20px',
            background: 'rgba(27,67,50,0.04)', margin: '0 auto 0.75rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={24} color="rgba(27,67,50,0.2)" strokeWidth={1.5} />
          </div>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#1B4332', margin: '0 0 0.25rem' }}>Order not found</p>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', color: 'rgba(27,67,50,0.4)', margin: '0 0 1rem' }}>We couldn't find tracking details for this order.</p>
          <button onClick={() => navigate('/my-orders')} style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', fontWeight: 600,
            color: '#FFFFFF', background: '#1B4332', border: 'none', borderRadius: '12px',
            padding: '0.65rem 1.5rem', cursor: 'pointer',
          }}>Back to Orders</button>
        </div>
      </div>
    );
  }

  const orderStatus = order.orderStatus || 'Pending';
  const currentStage = getStageIndex(orderStatus);
  const progressPct = Math.round((currentStage / (STAGES_DATA.length - 1)) * 100);
  const displayOid = order._id || order.id;

  // Mock delivery partner data (since real data isn't available from API)
  const partner = {
    name: farmer?.name || 'Rahul S.',
    vehicle: 'KL 07 AR 1234',
    phone: farmer?.phone || '+91 98765 43210',
    rating: farmer?.rating || 4.8,
  };

  return (
    <div style={{
      background: '#F5F3E7',
      minHeight: '100vh',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .scale-in { animation: scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .track-card {
          background: #FFFFFF; border-radius: 20px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(27,67,50,0.06);
        }
        .action-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          padding: 0.75rem; border-radius: 14px; border: none; cursor: pointer;
          font-family: '"DM Sans", sans-serif'; font-size: 0.7rem; font-weight: 600;
          transition: all 0.2s ease; text-decoration: none;
        }
        .action-btn:active { transform: scale(0.97); }
      `}</style>

      {/* ─── HEADER ─── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(245,243,231,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(27,67,50,0.06)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1.25rem', maxWidth: '480px', margin: '0 auto',
        }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Leaf size={16} color="#A3C87A" strokeWidth={2} />
            </div>
            <div>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.2rem', fontWeight: 700, color: '#1B4332',
                letterSpacing: '-0.02em', lineHeight: 1,
              }}>DHARA</span>
              <span style={{
                fontFamily: '"Courier New", monospace', fontSize: '0.4rem',
                letterSpacing: '0.3em', color: '#6A994E',
                display: 'block', textTransform: 'uppercase',
              }}>Organic Kerala</span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/wishlist" style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none', position: 'relative',
            }}>
              <Heart size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none', position: 'relative',
            }}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              {totalCartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#D4A017', color: '#FFFFFF',
                  fontSize: '9px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"DM Sans", sans-serif',
                }}>{totalCartCount}</span>
              )}
            </Link>
            <Link to="/profile" style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'rgba(27,67,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#1B4332', textDecoration: 'none',
            }}>
              <Menu size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── SCROLLABLE CONTENT ─── */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem 8rem' }}>

        {/* ═══ MAP CARD ═══ */}
        <section style={{ marginTop: '0.85rem', animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <MapCard eta={orderStatus === 'Delivered' ? 'Delivered' : '18 mins'} />
        </section>

        {/* ═══ LIVE PROGRESS ═══ */}
        <section className="track-card" style={{ marginTop: '0.75rem', padding: '1rem 1.1rem', animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '0.05s' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', letterSpacing: '0.08em', color: 'rgba(27,67,50,0.35)', textTransform: 'uppercase', margin: '0 0 0.2rem' }}>Distance</p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#1B4332', margin: 0 }}>12.4 km</p>
            </div>
            <div style={{ width: '1px', background: 'rgba(27,67,50,0.06)', alignSelf: 'stretch' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', letterSpacing: '0.08em', color: 'rgba(27,67,50,0.35)', textTransform: 'uppercase', margin: '0 0 0.2rem' }}>Est. Time</p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#1B4332', margin: 0 }}>18 min</p>
            </div>
            <div style={{ width: '1px', background: 'rgba(27,67,50,0.06)', alignSelf: 'stretch' }} />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.45rem', letterSpacing: '0.08em', color: 'rgba(27,67,50,0.35)', textTransform: 'uppercase', margin: '0 0 0.2rem' }}>Status</p>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', fontWeight: 700, color: orderStatus === 'Delivered' ? '#2D6A4F' : '#D4A017', margin: 0 }}>{orderStatus}</p>
            </div>
          </div>
          <ProgressBar percent={progressPct} />
        </section>

        {/* ═══ TIMELINE ═══ */}
        <section className="track-card" style={{ marginTop: '0.75rem', padding: '1.1rem', animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '10px',
              background: 'rgba(27,67,50,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Clock size={14} color="rgba(27,67,50,0.5)" strokeWidth={1.5} />
            </div>
            <span style={{ fontFamily: '"Courier New", monospace', fontSize: '0.5rem', letterSpacing: '0.12em', color: 'rgba(27,67,50,0.4)', textTransform: 'uppercase' }}>
              Order Timeline
            </span>
          </div>
          <Timeline currentStage={currentStage} />
        </section>

        {/* ═══ DELIVERY PARTNER ═══ */}
        <section className="track-card" style={{ marginTop: '0.75rem', padding: '1.1rem', animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '0.15s' }}>
          <p style={{
            fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
            letterSpacing: '0.12em', color: 'rgba(27,67,50,0.4)',
            textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>Delivery Partner</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.1rem', fontWeight: 700, color: '#A3C87A' }}>
                {partner.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#1B4332', margin: 0 }}>{partner.name}</p>
              <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.6rem', color: 'rgba(27,67,50,0.4)', margin: '0.1rem 0 0 0' }}>{partner.vehicle}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                <Star size={10} color="#D4A017" fill="#D4A017" strokeWidth={0} />
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.6rem', fontWeight: 600, color: '#D4A017' }}>{partner.rating}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem' }}>
            <a href={`tel:${partner.phone}`} className="action-btn" style={{
              background: '#1B4332', color: '#FFFFFF',
            }}>
              <Phone size={15} strokeWidth={2} /> Call
            </a>
            <button className="action-btn" style={{
              background: 'rgba(27,67,50,0.05)', color: '#1B4332',
            }}>
              <MessageSquare size={15} strokeWidth={1.5} /> Chat
            </button>
          </div>
        </section>

        {/* ═══ DELIVERY INFO ═══ */}
        <section className="track-card" style={{ marginTop: '0.75rem', padding: '1.1rem', animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '0.2s' }}>
          <p style={{
            fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
            letterSpacing: '0.12em', color: 'rgba(27,67,50,0.4)',
            textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>Delivery Information</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {[
              { icon: MapPin, label: 'Delivery Address', value: order.address || 'Kerala, India' },
              { icon: User, label: 'Customer Name', value: order.customerId?.name || order.deliveryName || 'Valued Customer' },
              { icon: Clock, label: 'Expected Arrival', value: order.deliveryTime === 'Morning' ? '8:00 - 10:00 AM' : '4:00 - 6:00 PM' },
              { icon: Package, label: 'Order Total', value: `₹${order.totalPrice || 0}` },
              { icon: CheckCircle, label: 'Payment Status', value: order.paymentStatus === 'Paid' ? 'Paid' : 'Pending', highlight: order.paymentStatus === 'Paid' ? '#2D6A4F' : '#D4A017' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: 'rgba(27,67,50,0.04)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={13} color="rgba(27,67,50,0.4)" strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: '"Courier New", monospace', fontSize: '0.48rem', letterSpacing: '0.06em', color: 'rgba(27,67,50,0.35)', textTransform: 'uppercase', margin: 0 }}>{item.label}</p>
                    <p style={{
                      fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem',
                      fontWeight: 500, color: item.highlight || '#1B4332', margin: '0.05rem 0 0 0',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ ORDERED PRODUCTS ═══ */}
        <section className="track-card" style={{ marginTop: '0.75rem', padding: '1.1rem', animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both', animationDelay: '0.25s' }}>
          <p style={{
            fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
            letterSpacing: '0.12em', color: 'rgba(27,67,50,0.4)',
            textTransform: 'uppercase', marginBottom: '0.65rem',
          }}>Ordered Products</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(order.products || []).map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <Leaf size={12} color="#6A994E" strokeWidth={2} />
                  <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', fontWeight: 500, color: '#1B4332', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title || 'Product'}</span>
                </div>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.7rem', fontWeight: 600, color: 'rgba(27,67,50,0.5)' }}>x{p.count || 1}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ─── BOTTOM ACTION BAR ─── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(27,67,50,0.06)',
        padding: '0.75rem 1rem', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '480px', margin: '0 auto' }}>
          <a href={`tel:${partner.phone}`} className="action-btn" style={{
            background: '#1B4332', color: '#FFFFFF', flex: 2,
          }}>
            <Phone size={16} strokeWidth={2} /> Call Driver
          </a>
          <button className="action-btn" style={{
            background: 'rgba(27,67,50,0.05)', color: '#1B4332',
          }}>
            <Share2 size={16} strokeWidth={1.5} /> Share
          </button>
          <button className="action-btn" style={{
            background: 'rgba(27,67,50,0.05)', color: '#1B4332',
          }}>
            <HelpCircle size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
