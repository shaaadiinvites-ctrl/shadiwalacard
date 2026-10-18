'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  CreditCard,
  Mail,
  MapPin,
  ExternalLink,
  Search,
  LogOut,
  RefreshCw,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
  X,
  Share2,
  Navigation,
  Smartphone,
  Eye,
} from 'lucide-react';

interface CardAnalytics {
  views: number;
  uniqueVisitors: number;
  cities: Record<string, number>;
  sources: Record<string, number>;
  mapClicks: number;
  lastViewedAt: string | null;
}

interface WeddingItem {
  id: string;
  slug: string;
  names: string;
  bride: string;
  groom: string;
  hashtag: string | null;
  email: string;
  phone: string;
  templateId: string;
  templateName: string;
  city: string;
  country: string;
  eventsCount: number;
  price: number;
  createdAt: string;
  isTest?: boolean;
  analytics: CardAnalytics;
  liveUrl: string;
}

interface AnalyticsData {
  user: string;
  kpis: {
    totalRevenue: number;
    totalDiscountsGiven: number;
    totalOrders: number;
    totalLiveInvites: number;
    averageOrderValue: number;
    topCity: string;
  };
  revenueTrend: Array<{
    date: string;
    label: string;
    revenue: number;
    orders: number;
  }>;
  topCities: Array<{
    city: string;
    count: number;
    percentage: number;
  }>;
  recentWeddings: WeddingItem[];
  ordersSummary: {
    totalPaid: number;
    pending: number;
    totalOrders: number;
    testOrdersArchived: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);
  const [selectedWeddingForAnalytics, setSelectedWeddingForAnalytics] = useState<WeddingItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setError(null);
      const res = await fetch('/api/admin/analytics');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load analytics.');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err?.message || 'Error fetching analytics data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      router.push('/admin/login');
    }
  };

  // Filtered weddings search
  const filteredWeddings = useMemo(() => {
    if (!data?.recentWeddings) return [];
    if (!searchQuery.trim()) return data.recentWeddings;
    const q = searchQuery.toLowerCase();
    return data.recentWeddings.filter(
      (w) =>
        w.names.toLowerCase().includes(q) ||
        w.slug.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q) ||
        w.email.toLowerCase().includes(q)
    );
  }, [data?.recentWeddings, searchQuery]);

  // SVG Chart computation
  const chartMetrics = useMemo(() => {
    if (!data?.revenueTrend || data.revenueTrend.length === 0) return null;
    const list = data.revenueTrend;
    const maxRev = Math.max(...list.map((d) => d.revenue), 1500);
    const width = 800;
    const height = 220;
    const paddingX = 40;
    const paddingY = 25;

    const points = list.map((item, idx) => {
      const x = paddingX + (idx / (list.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - (item.revenue / maxRev) * (height - paddingY * 2);
      return { x, y, ...item };
    });

    const pathD = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

    return { points, pathD, areaD, width, height, maxRev, paddingY };
  }, [data?.revenueTrend]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#050505',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          color: '#FFFFFF',
          fontFamily: "var(--font-body), -apple-system, sans-serif",
        }}
      >
        <div style={{ fontSize: '32px' }} className="animate-bounce">
          👑
        </div>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px' }}>
          Initializing ShadiwalaCard Owner Intelligence...
        </p>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalRevenue: 0,
    totalDiscountsGiven: 0,
    totalOrders: 0,
    totalLiveInvites: 0,
    averageOrderValue: 0,
    topCity: 'Awaiting live orders',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        color: '#FFFFFF',
        fontFamily: "var(--font-body), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        paddingBottom: '80px',
      }}
    >
      {/* Top Navigation Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: '#FFFFFF',
              }}
            >
              <span style={{ fontSize: '24px' }}>👑</span>
              <span
                style={{
                  fontFamily: "var(--font-display), 'Montserrat', sans-serif",
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #C9A84C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ShadiwalaCard
              </span>
            </Link>
            <div
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                background: 'rgba(201, 168, 76, 0.12)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                color: '#ffbc4b',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
              }}
            >
              Owner Intelligence
            </div>
          </div>

          {/* User Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 10px #10b981',
                }}
              />
              <span>{data?.user || 'Admin'}</span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Refresh Analytics"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'rgba(225, 29, 72, 0.1)',
                border: '1px solid rgba(225, 29, 72, 0.25)',
                color: '#fda4af',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '32px 24px' }}>
        {error && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '14px',
              background: 'rgba(225, 29, 72, 0.12)',
              border: '1px solid rgba(225, 29, 72, 0.3)',
              color: '#fda4af',
              fontSize: '14px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Section Title */}
        <div style={{ marginBottom: '28px' }}>
          <h1
            style={{
              fontFamily: "var(--font-display), 'Montserrat', sans-serif",
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              margin: '0 0 8px 0',
              background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Business & Product Performance
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)' }}>
            Real-time sales, live invite publications, and guest engagement across India.
          </p>
        </div>

        {/* Executive KPI Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {/* Total Revenue */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(24, 24, 24, 0.95) 0%, rgba(12, 12, 12, 0.98) 100%)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(201, 168, 76, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffbc4b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Revenue
              </span>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(201, 168, 76, 0.12)', color: '#ffbc4b' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
              ₹{kpis.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {kpis.totalOrders > 0 ? (
                <>
                  <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                  <span>
                    {kpis.totalOrders} live customer checkout{kpis.totalOrders === 1 ? '' : 's'}
                    {kpis.totalDiscountsGiven > 0 && ` (₹${kpis.totalDiscountsGiven} coupon saved)`}
                  </span>
                </>
              ) : (
                <>
                  <Clock size={13} style={{ color: '#ffbc4b' }} />
                  <span>Counting checkouts from launch onwards</span>
                </>
              )}
            </div>
          </div>

          {/* Live Invites Published */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Wedding Invites
              </span>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(225, 29, 72, 0.12)', color: '#e11d48' }}>
                <Mail size={18} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
              {kpis.totalLiveInvites}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
              {kpis.totalLiveInvites === 0 ? 'Awaiting first live customer publication' : 'Live customer weddings'}
            </div>
          </div>

          {/* Average Ticket Size */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Average Ticket Size
              </span>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
              ₹{kpis.averageOrderValue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
              Reflects net discounts applied
            </div>
          </div>

          {/* Top Customer Hub */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Primary Market Hub
              </span>
              <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa' }}>
                <MapPin size={18} />
              </div>
            </div>
            <div style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {kpis.topCity}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
              Regional customer concentration
            </div>
          </div>
        </div>

        {/* Charts & Breakdown Grid (Template Popularity removed) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Revenue Curve Chart */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                  14-Day Sales & Revenue Trend
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)' }}>
                  Daily trajectory of new customer checkouts
                </p>
              </div>

              {activeHoverIndex !== null && chartMetrics && (
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '10px',
                    background: 'rgba(201, 168, 76, 0.15)',
                    border: '1px solid rgba(201, 168, 76, 0.4)',
                    color: '#ffbc4b',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  {chartMetrics.points[activeHoverIndex].label}: ₹
                  {chartMetrics.points[activeHoverIndex].revenue.toLocaleString('en-IN')} (
                  {chartMetrics.points[activeHoverIndex].orders} Orders)
                </div>
              )}
            </div>

            {chartMetrics && (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg
                  viewBox={`0 0 ${chartMetrics.width} ${chartMetrics.height}`}
                  style={{ width: '100%', height: 'auto', maxHeight: '220px', overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = chartMetrics.height - chartMetrics.paddingY - ratio * (chartMetrics.height - chartMetrics.paddingY * 2);
                    return (
                      <line
                        key={i}
                        x1="30"
                        y1={y}
                        x2={chartMetrics.width - 30}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeDasharray="4 4"
                      />
                    );
                  })}

                  <path d={chartMetrics.areaD} fill="url(#revGrad)" />

                  <path
                    d={chartMetrics.pathD}
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {chartMetrics.points.map((pt, idx) => {
                    const isHovered = activeHoverIndex === idx;
                    return (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 4}
                          fill={isHovered ? '#FFFFFF' : '#C9A84C'}
                          stroke="#000000"
                          strokeWidth="2"
                          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={() => setActiveHoverIndex(idx)}
                          onMouseLeave={() => setActiveHoverIndex(null)}
                        />
                        <text
                          x={pt.x}
                          y={chartMetrics.height - 5}
                          textAnchor="middle"
                          fill={isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)'}
                          fontSize="11"
                          fontFamily="sans-serif"
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          {/* Regional Market Hubs */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Globe size={18} style={{ color: '#60a5fa' }} />
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#FFFFFF' }}>
                Customer Location Hubs
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data?.topCities && data.topCities.length > 0 ? (
                data.topCities.map((cityItem, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#ffbc4b', width: '18px' }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>
                        {cityItem.city}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {cityItem.count} weddings ({cityItem.percentage}%)
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'rgba(255, 255, 255, 0.45)', fontSize: '13px' }}>
                  Location hubs will populate as live customer weddings are published.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Wedding Directory Table */}
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Header & Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0', color: '#FFFFFF' }}>
                Published Wedding Invites ({filteredWeddings.length})
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)' }}>
                Inspect card-specific guest opens, regional views, and direct preview links
              </p>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                }}
              >
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search couple, slug, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '880px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Couple Names</th>
                  <th style={{ padding: '12px 14px' }}>Location</th>
                  <th style={{ padding: '12px 14px' }}>Ceremonies</th>
                  <th style={{ padding: '12px 14px' }}>Guest Opens</th>
                  <th style={{ padding: '12px 14px' }}>Published Date</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWeddings.length > 0 ? (
                  filteredWeddings.map((w) => {
                    const createdDate = w.createdAt
                      ? new Date(w.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Recent';

                    const viewsCount = w.analytics?.views || 0;
                    const mapClicksCount = w.analytics?.mapClicks || 0;

                    return (
                      <tr
                        key={w.slug}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '14px' }}>{w.names}</span>
                            {w.isTest && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(255, 255, 255, 0.08)',
                                  color: 'rgba(255, 255, 255, 0.45)',
                                  textTransform: 'uppercase',
                                  fontWeight: 600,
                                  letterSpacing: '0.5px',
                                }}
                              >
                                Test Run
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                            /{w.slug} {w.hashtag && `• ${w.hashtag}`}
                          </div>
                        </td>

                        <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin size={13} style={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                            <span>{w.city}</span>
                          </div>
                        </td>

                        <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)' }}>
                          {w.eventsCount} {w.eventsCount === 1 ? 'ceremony' : 'ceremonies'}
                        </td>

                        <td style={{ padding: '14px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Eye size={13} style={{ color: '#ffbc4b' }} />
                            <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{viewsCount}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
                              ({mapClicksCount} maps)
                            </span>
                          </div>
                        </td>

                        <td style={{ padding: '14px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {createdDate}
                        </td>

                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            {/* Card Analytics Button */}
                            <button
                              onClick={() => setSelectedWeddingForAnalytics(w)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: 'rgba(201, 168, 76, 0.12)',
                                border: '1px solid rgba(201, 168, 76, 0.3)',
                                color: '#ffbc4b',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#C9A84C';
                                e.currentTarget.style.color = '#000000';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(201, 168, 76, 0.12)';
                                e.currentTarget.style.color = '#ffbc4b';
                              }}
                            >
                              <BarChart3 size={13} />
                              <span>Analytics</span>
                            </button>

                            {/* Open Invite Link */}
                            <a
                              href={`/${w.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: '#FFFFFF',
                                textDecoration: 'none',
                                fontSize: '12px',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                              }}
                            >
                              <span>Preview</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'rgba(255, 255, 255, 0.4)' }}>
                      No wedding invites matched your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Card Analytics Deep Dive Modal */}
      {selectedWeddingForAnalytics && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedWeddingForAnalytics(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '620px',
              background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.98) 0%, rgba(10, 10, 10, 1) 100%)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(201, 168, 76, 0.1)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '20px' }}>💍</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                    {selectedWeddingForAnalytics.names}
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)' }}>
                  Live URL: shadiwalacard.com/{selectedWeddingForAnalytics.slug}
                </p>
              </div>

              <button
                onClick={() => setSelectedWeddingForAnalytics(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Total Opens
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#ffbc4b' }}>
                  {selectedWeddingForAnalytics.analytics?.views || 0}
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Map Clicks
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#60a5fa' }}>
                  {selectedWeddingForAnalytics.analytics?.mapClicks || 0}
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Map Tap Rate
                </div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#10b981' }}>
                  {selectedWeddingForAnalytics.analytics?.views > 0
                    ? `${Math.round(
                        ((selectedWeddingForAnalytics.analytics.mapClicks || 0) /
                          selectedWeddingForAnalytics.analytics.views) *
                          100
                      )}%`
                    : '0%'}
                </div>
              </div>
            </div>

            {/* Geographic Breakdown by Area/City */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <MapPin size={15} style={{ color: '#ffbc4b' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Views by City / Area
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedWeddingForAnalytics.analytics?.cities &&
                Object.keys(selectedWeddingForAnalytics.analytics.cities).length > 0 ? (
                  Object.entries(selectedWeddingForAnalytics.analytics.cities)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cityName, count], idx) => {
                      const totalViews = selectedWeddingForAnalytics.analytics.views || 1;
                      const pct = Math.round((count / totalViews) * 100);
                      return (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{cityName}</span>
                            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              {count} opens ({pct}%)
                            </span>
                          </div>
                          <div style={{ height: '6px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.06)', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.max(pct, 5)}%`, height: '100%', background: '#ffbc4b', borderRadius: '999px' }} />
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', textAlign: 'center', fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                    No regional views recorded yet. Opening the invite link from mobile will log the visitor's city automatically.
                  </div>
                )}
              </div>
            </div>

            {/* Traffic Source / In-App Browser */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Smartphone size={15} style={{ color: '#60a5fa' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Opening Platform / App
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedWeddingForAnalytics.analytics?.sources &&
                Object.keys(selectedWeddingForAnalytics.analytics.sources).length > 0 ? (
                  Object.entries(selectedWeddingForAnalytics.analytics.sources)
                    .sort((a, b) => b[1] - a[1])
                    .map(([sourceName, count], idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{sourceName}</span>
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{count} visits</span>
                      </div>
                    ))
                ) : (
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.02)', textAlign: 'center', fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                    Traffic sources (WhatsApp, Safari, Chrome) will populate upon guest opens.
                  </div>
                )}
              </div>
            </div>

            {/* Last Viewed Timestamp & Action Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} />
                <span>
                  Last Viewed:{' '}
                  {selectedWeddingForAnalytics.analytics?.lastViewedAt
                    ? new Date(selectedWeddingForAnalytics.analytics.lastViewedAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short',
                      })
                    : 'Not opened yet'}
                </span>
              </div>

              <a
                href={selectedWeddingForAnalytics.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ffbc4b 0%, #C9A84C 100%)',
                  color: '#000000',
                  fontWeight: 600,
                  fontSize: '12px',
                  textDecoration: 'none',
                }}
              >
                <span>Visit Live Invite</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
