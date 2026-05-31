import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Camera,
  MessageCircle,
  Play,
  Globe,
  ChevronDown,
  Leaf,
  ShieldCheck,
  Truck,
  Star,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const linkBase = {
  fontSize: '0.8rem',
  color: 'rgba(245, 243, 231, 0.5)',
  textDecoration: 'none',
  transition: 'color 0.25s ease, transform 0.25s ease',
  display: 'inline-block',
};

const headingLabel = {
  fontFamily: '"Courier New", monospace',
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#6A994E',
  margin: '0 0 1.25rem 0',
};

function AccordionSection({ title, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <div className="md:hidden" style={{ borderBottom: '1px solid rgba(106, 153, 78, 0.08)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 transition-all"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#6A994E',
          fontFamily: '"Courier New", monospace',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        {title}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-4 space-y-2.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Footer() {
  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [siteContent, setSiteContent] = useState({});

  useEffect(() => {
    api.siteContent.getAll().then(setSiteContent).catch(() => {});
  }, []);

  const trustBadges = siteContent.trustBadges || [];
  const quickLinks = siteContent.quickLinks || [];
  const supportLinks = siteContent.supportLinks || [];
  const contactInfo = siteContent.contactInfo || [];
  const socialLinks = siteContent.socialLinks || [];
  const footerBadges = siteContent.footerBadges || [];
  const legalLinks = siteContent.legalLinks || [];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setEmail('');
    }
  };

  return (
    <>
      {/* ───── NEWSLETTER CARD ───── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F1E14 0%, #1B4332 50%, #0F1E14 100%)',
          padding: '3rem 1.5rem',
        }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(106, 153, 78, 0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="p-6 sm:p-8 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'rgba(106, 153, 78, 0.1)',
                border: '1px solid rgba(106, 153, 78, 0.15)',
              }}
            >
              <Leaf size={20} color="#A3C87A" />
            </div>
            <h2
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                fontWeight: 400,
                color: '#F5F3E7',
                margin: '0 0 0.5rem 0',
                lineHeight: 1.2,
              }}
            >
              Stay Connected With Fresh Harvests
            </h2>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'rgba(245, 243, 231, 0.45)',
                margin: '0 0 1.5rem 0',
                lineHeight: 1.5,
              }}
            >
              Get seasonal offers, fresh arrivals, and farm updates.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email for newsletter"
                className="flex-1 rounded-xl px-4 py-3 text-sm transition-all"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(106, 153, 78, 0.15)',
                  color: '#F5F3E7',
                  outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#6A994E' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(106, 153, 78, 0.15)' }}
              />
              <button
                type="submit"
                className="rounded-xl px-6 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #6A994E, #2D6A4F)',
                  color: '#F5F3E7',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(106, 153, 78, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #2D6A4F, #6A994E)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(106, 153, 78, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #6A994E, #2D6A4F)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(106, 153, 78, 0.2)';
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ───── MAIN FOOTER ───── */}
      <footer
        style={{
          background: 'linear-gradient(180deg, #080E0A 0%, #0a120c 50%, #080E0A 100%)',
          width: '100%',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          marginTop: '-16px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* Top separator glow */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(106, 153, 78, 0.2), transparent)',
            margin: '0 2rem',
          }}
        />

        {/* ───── TRUST & SECURITY STRIP ───── */}
        <div
          style={{
            padding: '2rem 1.5rem 0.5rem',
          }}
        >
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
            style={{ maxWidth: '1200px', margin: '0 auto' }}
          >
            {trustBadges.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 px-3 py-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(106, 153, 78, 0.06)',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(106, 153, 78, 0.08)' }}
                >
                  <Leaf size={14} color="#6A994E" />
                </div>
                <span
                  style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: '0.55rem',
                    letterSpacing: '0.06em',
                    color: 'rgba(245, 243, 231, 0.5)',
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ───── MAIN GRID ───── */}
        <div style={{ padding: '2.5rem 1.5rem 1.5rem' }}>
          <div
            className="md:grid"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2.5rem',
            }}
          >
            {/* Column 1 — Brand Story (always visible) */}
            <div className="md:col-span-1" style={{ gridColumn: 'span 1' }}>
              <h3
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: '1.6rem',
                  fontWeight: 400,
                  color: '#F5F3E7',
                  letterSpacing: '-0.02em',
                  margin: '0 0 0.1rem 0',
                  lineHeight: 1,
                }}
              >
                DHARA
              </h3>
              <p
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#6A994E',
                  margin: '0 0 1rem 0',
                }}
              >
                Organic Kerala
              </p>
              <p
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'rgba(245, 243, 231, 0.4)',
                  margin: '0 0 1.25rem 0',
                  maxWidth: '280px',
                }}
              >
                Connecting Kerala's trusted farmers directly with families.
              </p>

              {/* Trust badges */}
              {footerBadges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {footerBadges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-medium"
                      style={{
                        background: 'rgba(106, 153, 78, 0.06)',
                        border: '1px solid rgba(106, 153, 78, 0.1)',
                        color: 'rgba(163, 200, 122, 0.6)',
                        fontFamily: '"Courier New", monospace',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <CheckCircle size={8} />
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="hidden md:flex items-center gap-2.5 mt-4">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href || '#'}
                      aria-label={s.label}
                      className="flex items-center justify-center transition-all duration-300"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '1px solid rgba(106, 153, 78, 0.15)',
                        color: 'rgba(245, 243, 231, 0.4)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#6A994E';
                        e.currentTarget.style.color = '#A3C87A';
                        e.currentTarget.style.background = 'rgba(106, 153, 78, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(106, 153, 78, 0.15)';
                        e.currentTarget.style.color = 'rgba(245, 243, 231, 0.4)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Camera size={15} />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {quickLinks.length > 0 && (
              <div className="hidden md:block">
                <h4 style={headingLabel}>Quick Links</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {quickLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        style={linkBase}
                        className="hover:translate-x-0.5"
                        onMouseEnter={e => { e.currentTarget.style.color = '#A3C87A' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.5)' }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {supportLinks.length > 0 && (
              <div className="hidden md:block">
                <h4 style={headingLabel}>Customer Support</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {supportLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        style={linkBase}
                        className="hover:translate-x-0.5"
                        onMouseEnter={e => { e.currentTarget.style.color = '#A3C87A' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.5)' }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {contactInfo.length > 0 && (
              <div className="hidden md:block">
                <h4 style={headingLabel}>Connect With Us</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {contactInfo.map((item) => {
                    const content = (
                      <span className="flex items-center gap-2.5" style={linkBase}>
                        <span style={{ color: '#6A994E', display: 'flex', flexShrink: 0 }}>
                          <Phone size={13} />
                        </span>
                        <span style={{ fontSize: '0.75rem' }}>{item.text}</span>
                      </span>
                    );
                    return item.href ? (
                      <a key={item.text} href={item.href} style={{ textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.querySelector('span:last-child').style.color = '#A3C87A' }}
                        onMouseLeave={e => { e.currentTarget.querySelector('span:last-child').style.color = 'rgba(245, 243, 231, 0.5)' }}
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={item.text}>{content}</div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ───── MOBILE ACCORDIONS ───── */}
          <div className="md:hidden mt-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {quickLinks.length > 0 && (
              <AccordionSection title="Quick Links">
                {quickLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={{ ...linkBase, display: 'block', padding: '0.25rem 0' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#A3C87A' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.5)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </AccordionSection>
            )}

            {supportLinks.length > 0 && (
              <AccordionSection title="Customer Support">
                {supportLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={{ ...linkBase, display: 'block', padding: '0.25rem 0' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#A3C87A' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.5)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </AccordionSection>
            )}

            {contactInfo.length > 0 && (
              <AccordionSection title="Connect With Us" defaultOpen>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {contactInfo.map((item) => {
                    const content = (
                      <span className="flex items-center gap-2.5" style={{ ...linkBase, fontSize: '0.75rem' }}>
                        <span style={{ color: '#6A994E', display: 'flex', flexShrink: 0 }}>
                          <Phone size={13} />
                        </span>
                        {item.text}
                      </span>
                    );
                    return item.href ? (
                      <a key={item.text} href={item.href} style={{ textDecoration: 'none' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#A3C87A' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.5)' }}
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={item.text}>{content}</div>
                    );
                  })}
                </div>

                {socialLinks.length > 0 && (
                  <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(106, 153, 78, 0.06)' }}>
                    {socialLinks.map((s) => (
                      <a
                        key={s.label}
                        href={s.href || '#'}
                        aria-label={s.label}
                        className="flex items-center justify-center transition-all duration-300"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: '1px solid rgba(106, 153, 78, 0.12)',
                          color: 'rgba(245, 243, 231, 0.4)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#6A994E';
                          e.currentTarget.style.color = '#A3C87A';
                          e.currentTarget.style.background = 'rgba(106, 153, 78, 0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(106, 153, 78, 0.12)';
                          e.currentTarget.style.color = 'rgba(245, 243, 231, 0.4)';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Camera size={16} />
                      </a>
                    ))}
                  </div>
                )}
              </AccordionSection>
            )}
          </div>
        </div>

        {/* ───── BOTTOM BAR ───── */}
        <div
          style={{
            borderTop: '1px solid rgba(106, 153, 78, 0.06)',
            padding: '1.25rem 1.5rem',
          }}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ maxWidth: '1200px', margin: '0 auto' }}
          >
            <p
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: '0.55rem',
                letterSpacing: '0.05em',
                color: 'rgba(245, 243, 231, 0.25)',
                margin: 0,
                textAlign: 'center',
              }}
            >
              &copy; 2026 DHARA Organic Kerala. All Rights Reserved.
            </p>

            {legalLinks.length > 0 && (
              <div className="flex items-center gap-4 flex-wrap justify-center">
                {legalLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize: '0.5rem',
                      letterSpacing: '0.05em',
                      color: 'rgba(245, 243, 231, 0.25)',
                      textDecoration: 'none',
                      transition: 'color 0.25s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#F5F3E7' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245, 243, 231, 0.25)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
