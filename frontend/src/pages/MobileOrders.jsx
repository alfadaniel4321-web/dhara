import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCartSuccess } from '../redux/slices/cartSlice';
import { api } from '../services/api';
import {
  ShoppingBag, Package, Clock, CheckCircle, XCircle,
  Truck, MapPin, CreditCard, ChevronDown, ChevronUp,
  RefreshCw, Leaf, User, Search, Menu, Home,
} from 'lucide-react';

const STATUS_META = {
  'Delivered': { color: '#2D6A4F', bg: '#EBF5EB', icon: CheckCircle },
  'In Transit': { color: '#1A73E8', bg: '#E8F4FD', icon: Truck },
  'Processing': { color: '#D4A017', bg: '#FFF8E7', icon: Package },
  'Pending': { color: '#D4A017', bg: '#FFF8E7', icon: Clock },
  'Cancelled': { color: '#DC2626', bg: '#FEE2E2', icon: XCircle },
};

const TABS = ['All', 'Processing', 'Delivered', 'Cancelled'];

function filterByTab(order, tab) {
  if (tab === 'All') return true;
  const s = order.orderStatus;
  if (tab === 'Processing') return s === 'Pending' || s === 'Processing' || s === 'In Transit';
  return s === tab;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatID(id) {
  return '#' + (id || '').slice(-8).toUpperCase();
}

function getTimelineStages(orderStatus) {
  const stages = [
    { label: 'Order Placed', desc: 'Your order has been received', key: 'placed' },
    { label: 'Confirmed', desc: 'Farmer has accepted the order', key: 'confirmed' },
    { label: 'Packed', desc: 'Items are being packed fresh', key: 'packed' },
    { label: 'Out For Delivery', desc: 'On its way to your door', key: 'outfordelivery' },
    { label: 'Delivered', desc: 'Successfully delivered', key: 'delivered' },
  ];
  let current = 0;
  if (orderStatus === 'Processing') current = 1;
  else if (orderStatus === 'In Transit') current = 2;
  else if (orderStatus === 'Delivered') current = 4;
  return { stages, current };
}

function Timeline({ orderStatus }) {
  const { stages, current } = getTimelineStages(orderStatus);
  return (
    <div style={{ padding: '0.5rem 0' }}>
      {stages.map((stage, i) => {
        const done = i <= current;
        const isNow = i === current;
        return (
          <div key={stage.key} style={{ display: 'flex', gap: '0.75rem', position: 'relative', paddingBottom: i < stages.length - 1 ? '1.25rem' : 0 }}>
            {/* Line */}
            {i < stages.length - 1 && (
              <div style={{
                position: 'absolute', left: '11px', top: '24px',
                width: '2px', height: 'calc(100% - 8px)',
                background: done ? '#2D6A4F' : 'rgba(27,67,50,0.1)',
              }} />
            )}
            {/* Dot */}
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
              background: done ? '#1B4332' : 'rgba(27,67,50,0.06)',
              border: done ? 'none' : '2px solid rgba(27,67,50,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {done && <CheckCircle size={14} color="#A3C87A" fill="#1B4332" />}
              {isNow && !done && (
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#D4A017',
                }} />
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingTop: '2px' }}>
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.78rem', fontWeight: done ? 700 : 500,
                color: done ? '#1B4332' : 'rgba(27,67,50,0.35)',
                margin: 0,
              }}>{stage.label}</p>
              <p style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.65rem', color: done ? 'rgba(27,67,50,0.5)' : 'rgba(27,67,50,0.2)',
                margin: '2px 0 0 0',
              }}>{stage.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HomeIcon({ size, strokeWidth }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export default function MobileOrders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.count, 0);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.orders.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleReorder = async (order) => {
    try {
      for (const item of (order.products || [])) {
        await api.cart.addToCart(item.productId || item._id, item.count || 1);
      }
      dispatch(setCartSuccess(true));
      navigate('/cart');
    } catch (err) {
      console.error('Failed to reorder', err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.orders.updateOrderStatus(orderId, { orderStatus: 'Cancelled' });
      await loadOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  const filtered = orders.filter(o => {
    const matchTab = filterByTab(o, tab);
    if (!matchTab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    const idMatch = (o._id || o.id || '').toLowerCase().includes(q);
    const nameMatch = (o.products || []).some(p => (p.title || '').toLowerCase().includes(q));
    return idMatch || nameMatch;
  });

  const pendingCount = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
  const pendingItems = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (o.products?.length || 0), 0);
  const pendingAmount = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div style={{
      background: '#F5F3E7',
      minHeight: '100vh',
      paddingBottom: '88px',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .scale-in { animation: scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .o-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(245,243,231,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(27,67,50,0.06);
        }
        .order-card {
          background: #FFFFFF; border-radius: 20px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(27,67,50,0.06);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .order-card:active { transform: scale(0.98); }
        .status-badge {
          display: inline-flex; align-items: center; gap: 0.3rem;
          padding: 0.25rem 0.7rem; border-radius: 20px;
          font-family: '"DM Sans", sans-serif';
          font-size: 0.6rem; font-weight: 700;
          white-space: nowrap;
        }
        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(27,67,50,0.06);
          padding: 0.5rem 0;
          padding-bottom: env(safe-area-inset-bottom, 0.5rem);
        }
        .nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          background: none; border: none; cursor: pointer; padding: 0.25rem 0;
          transition: transform 0.2s ease; text-decoration: none; min-width: 56px;
        }
        .nav-item:active { transform: scale(0.9); }
        .center-btn {
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, #1B4332, #2D6A4F);
          border: none; cursor: pointer; display: flex;
          align-items: center; justify-content: center; margin-top: -20px;
          box-shadow: 0 4px 20px rgba(27,67,50,0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .center-btn:active { transform: scale(0.92); }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="o-header">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1.25rem', maxWidth: '480px', margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Package size={16} color="#A3C87A" strokeWidth={2} />
            </div>
            <div>
              <span style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.05rem', fontWeight: 700, color: '#1B4332',
                letterSpacing: '-0.02em', lineHeight: 1, display: 'block',
              }}>My Orders</span>
              <span style={{
                fontFamily: '"Courier New", monospace', fontSize: '0.4rem',
                letterSpacing: '0.25em', color: '#6A994E', textTransform: 'uppercase',
              }}>Track & Manage</span>
            </div>
          </div>
          {/* empty */}
        </div>
      </header>

      {/* ─── CONTENT ─── */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1rem' }}>

        {/* ─── STATS BAR ─── */}
        <div style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, #1B4332, #0F1E14)',
          borderRadius: '20px', padding: '1rem 1.25rem',
          display: 'flex', justifyContent: 'space-between',
          animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {[
            { label: 'Active', value: pendingCount },
            { label: 'Items', value: pendingItems },
            { label: 'Total', value: `₹${pendingAmount}` },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '1.15rem', fontWeight: 700, color: '#F5F3E7', lineHeight: 1.2,
              }}>{s.value}</div>
              <div style={{
                fontFamily: '"Courier New", monospace', fontSize: '0.45rem',
                letterSpacing: '0.1em', color: 'rgba(163,200,122,0.6)',
                textTransform: 'uppercase', marginTop: '0.15rem',
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ─── SEARCH + TABS ─── */}
        <div style={{ marginTop: '0.75rem' }}>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#FFFFFF', borderRadius: '14px',
            padding: '0 0.85rem', boxShadow: '0 2px 12px rgba(27,67,50,0.04)',
            marginBottom: '0.65rem',
          }}>
            <Search size={16} color="rgba(27,67,50,0.25)" strokeWidth={1.5} />
            <input
              type="text" placeholder="Search by ID or product..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.78rem',
                color: '#1B4332', background: 'transparent',
                padding: '0.75rem 0',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: 'rgba(27,67,50,0.25)', fontSize: '0.8rem',
              }}>✕</button>
            )}
          </div>

          {/* Tabs */}
          <div className="tab-scroll" style={{
            display: 'flex', gap: '0.5rem', overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flexShrink: 0, fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.72rem', fontWeight: 700,
                padding: '0.55rem 1.1rem', borderRadius: '12px',
                border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                background: tab === t ? '#1B4332' : '#FFFFFF',
                color: tab === t ? '#FFFFFF' : 'rgba(27,67,50,0.5)',
                boxShadow: tab === t ? '0 2px 12px rgba(27,67,50,0.15)' : '0 1px 4px rgba(27,67,50,0.04)',
                transition: 'all 0.25s ease',
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ─── ORDER LIST ─── */}
        <div style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '36px', height: '36px', margin: '0 auto 0.75rem',
                border: '3px solid rgba(27,67,50,0.06)', borderTopColor: '#1B4332',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: 'rgba(27,67,50,0.4)' }}>Loading orders...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '3rem 1.5rem',
              background: '#FFFFFF', borderRadius: '24px',
              boxShadow: '0 2px 16px rgba(27,67,50,0.04)',
            }}>
              <div style={{
                width: '56px', height: '56px', margin: '0 auto 0.75rem',
                borderRadius: '20px', background: 'rgba(27,67,50,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Package size={24} color="rgba(27,67,50,0.2)" strokeWidth={1.5} />
              </div>
              <p style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.9rem',
                fontWeight: 600, color: '#1B4332', margin: '0 0 0.25rem',
              }}>No orders found</p>
              <p style={{
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
                color: 'rgba(27,67,50,0.4)', margin: 0,
              }}>{search ? 'Try a different search term' : 'Start exploring our products!'}</p>
            </div>
          ) : (
            filtered.map((order, idx) => {
              const oid = order._id || order.id;
              const status = order.orderStatus || 'Pending';
              const meta = STATUS_META[status] || STATUS_META['Pending'];
              const StatusIcon = meta.icon;
              const isExpanded = expandedId === oid;
              const itemCount = (order.products || []).reduce((sum, p) => sum + (p.count || 1), 0);

              return (
                <div key={oid} className="order-card fade-up" style={{ animationDelay: `${0.04 * idx}s` }}>
                  {/* ─── CARD HEADER ─── */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : oid)}
                    style={{
                      padding: '1rem 1.1rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}
                  >
                    {/* Status icon */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '16px',
                      background: meta.bg, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <StatusIcon size={20} color={meta.color} strokeWidth={2} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        <span style={{
                          fontFamily: '"Courier New", monospace', fontSize: '0.65rem',
                          fontWeight: 700, color: '#1B4332', letterSpacing: '0.02em',
                        }}>{formatID(oid)}</span>
                        <span className="status-badge" style={{ background: meta.bg, color: meta.color }}>
                          <StatusIcon size={10} /> {status}
                        </span>
                      </div>
                      <div style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem',
                        color: 'rgba(27,67,50,0.4)',
                      }}>
                        {formatDate(order.createdAt)} · {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Expand icon */}
                    <div style={{ color: 'rgba(27,67,50,0.2)' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* ─── PRICE BAR ─── */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0 1.1rem 0.85rem',
                  }}>
                    <span style={{
                      fontFamily: '"DM Sans", sans-serif', fontSize: '1.1rem',
                      fontWeight: 700, color: '#1B4332',
                    }}>₹{order.totalPrice || 0}</span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {status !== 'Cancelled' && status !== 'Delivered' && (
                        <button onClick={(e) => { e.stopPropagation(); handleCancelOrder(oid); }} style={{
                          fontFamily: '"DM Sans", sans-serif', fontSize: '0.55rem',
                          fontWeight: 600, color: '#DC2626', background: '#FEE2E2',
                          border: 'none', borderRadius: '10px', padding: '0.4rem 0.75rem',
                          cursor: 'pointer',
                        }}>
                          Cancel
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleReorder(order); }} style={{
                        fontFamily: '"DM Sans", sans-serif', fontSize: '0.55rem',
                        fontWeight: 600, color: '#1B4332', background: '#EBF5EB',
                        border: 'none', borderRadius: '10px', padding: '0.4rem 0.75rem',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                      }}>
                        <RefreshCw size={11} /> Reorder
                      </button>
                    </div>
                  </div>

                  {/* ─── EXPANDED DETAILS ─── */}
                  {isExpanded && (
                    <div className="scale-in" style={{
                      borderTop: '1px solid rgba(27,67,50,0.06)',
                      padding: '1rem 1.1rem',
                    }}>
                      {/* Products */}
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{
                          fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
                          letterSpacing: '0.12em', color: 'rgba(27,67,50,0.4)',
                          textTransform: 'uppercase', marginBottom: '0.5rem',
                        }}>Products Ordered</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {(order.products || []).map((item, i) => (
                            <div key={i} style={{
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              padding: '0.4rem 0.65rem', background: 'rgba(27,67,50,0.03)',
                              borderRadius: '10px',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                                <Leaf size={12} color="#6A994E" strokeWidth={2} />
                                <span style={{
                                  fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
                                  fontWeight: 500, color: '#1B4332',
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                }}>{item.title || 'Product'}</span>
                              </div>
                              <span style={{
                                fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem',
                                fontWeight: 600, color: 'rgba(27,67,50,0.6)',
                              }}>x{item.count || 1} · ₹{item.price || 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
                        marginBottom: '1rem',
                      }}>
                        <div style={{
                          background: 'rgba(27,67,50,0.03)', borderRadius: '12px',
                          padding: '0.65rem',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                            <MapPin size={11} color="#6A994E" strokeWidth={2} />
                            <span style={{
                              fontFamily: '"Courier New", monospace', fontSize: '0.45rem',
                              letterSpacing: '0.08em', color: 'rgba(27,67,50,0.4)',
                              textTransform: 'uppercase',
                            }}>Delivery</span>
                          </div>
                          <p style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem',
                            color: '#1B4332', margin: 0, lineHeight: 1.3,
                          }}>{order.address || 'Kerala, India'}</p>
                        </div>
                        <div style={{
                          background: 'rgba(27,67,50,0.03)', borderRadius: '12px',
                          padding: '0.65rem',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                            <CreditCard size={11} color="#6A994E" strokeWidth={2} />
                            <span style={{
                              fontFamily: '"Courier New", monospace', fontSize: '0.45rem',
                              letterSpacing: '0.08em', color: 'rgba(27,67,50,0.4)',
                              textTransform: 'uppercase',
                            }}>Payment</span>
                          </div>
                          <p style={{
                            fontFamily: '"DM Sans", sans-serif', fontSize: '0.65rem',
                            fontWeight: 600, color: order.paymentStatus === 'Paid' ? '#2D6A4F' : '#D4A017',
                            margin: 0,
                          }}>{order.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <p style={{
                          fontFamily: '"Courier New", monospace', fontSize: '0.5rem',
                          letterSpacing: '0.12em', color: 'rgba(27,67,50,0.4)',
                          textTransform: 'uppercase', marginBottom: '0.35rem',
                        }}>Delivery Status</p>
                        <Timeline orderStatus={status} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ─── BOTTOM NAV ─── */}
      <nav className="bottom-nav">
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
          maxWidth: '480px', margin: '0 auto', padding: '0 0.5rem',
        }}>
          <Link to="/dashboard" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
            <HomeIcon size={20} strokeWidth={1.5} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Home</span>
          </Link>
          <Link to="/products" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
            <Search size={20} strokeWidth={1.5} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Products</span>
          </Link>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '60px' }}>
            <Link to="/cart" className="center-btn" style={{ textDecoration: 'none' }}>
              <ShoppingBag size={22} color="#FFFFFF" strokeWidth={2} />
            </Link>
          </div>
          <Link to="/my-orders" className="nav-item" style={{ color: '#1B4332' }}>
            <Package size={20} strokeWidth={2} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1B4332',
            }}>Orders</span>
          </Link>
          <Link to="/profile" className="nav-item" style={{ color: 'rgba(27,67,50,0.4)' }}>
            <User size={20} strokeWidth={1.5} />
            <span style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '0.45rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
