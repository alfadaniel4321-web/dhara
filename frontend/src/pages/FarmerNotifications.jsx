import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Bell, Package, CheckCheck, ChevronLeft, Info, Clock } from 'lucide-react';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { t, getLanguage, onLanguageChange } from '../data/i18n';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function FarmerNotifications() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [, forceUpdate] = useState(0);
  const lang = getLanguage();

  useEffect(() => onLanguageChange(() => forceUpdate(n => n + 1)), []);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const loadNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.notifications.getNotifications();
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, [user]);

  const handleMarkRead = async () => {
    setMarking(true);
    try {
      await api.notifications.markNotificationsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/farmer')}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '0.5rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c09402', margin: 0 }}>
              <Bell size={22} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: '2px 0 0' }}>
                {unreadCount} unread
              </p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkRead}
            disabled={marking}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '10px', padding: '0.5rem 1rem', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600, color: '#22c55e',
              opacity: marking ? 0.6 : 1,
            }}
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        )}
      </motion.div>

      {notifications.length === 0 ? (
        <motion.div
          variants={itemVariants}
          style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '16px', padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <Bell size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
          <p style={{ fontWeight: 700, color: '#013220', marginBottom: '4px' }}>
            No notifications yet
          </p>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>
            Notifications about pre-orders and updates will appear here
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((notif) => {
            const Icon = notif.type === 'preorder' || notif.type === 'order' ? Package : Info;
            return (
              <motion.div
                key={notif.id || notif._id}
                variants={itemVariants}
                style={{
                  background: notif.read ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.96)',
                  borderRadius: '14px', padding: '1rem 1.25rem',
                  border: notif.read ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(34,197,94,0.15)',
                  boxShadow: notif.read ? 'none' : '0 2px 12px rgba(34,197,94,0.08)',
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: notif.read ? '#F4F6F3' : 'rgba(34,197,94,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={16} color={notif.read ? '#999' : '#22c55e'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '0.85rem', fontWeight: 600,
                    color: '#013220', margin: 0,
                  }}>
                    {notif.title}
                  </p>
                  <p style={{
                    fontSize: '0.78rem', color: '#666', margin: '4px 0 0',
                    lineHeight: 1.4,
                  }}>
                    {notif.message}
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    marginTop: '6px',
                  }}>
                    <Clock size={11} color="#aaa" />
                    <span style={{ fontSize: '0.65rem', color: '#aaa' }}>
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                    {!notif.read && (
                      <span style={{
                        fontSize: '0.6rem', fontWeight: 700, color: '#22c55e',
                        background: 'rgba(34,197,94,0.1)', padding: '2px 6px',
                        borderRadius: '4px', marginLeft: '4px',
                      }}>
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
