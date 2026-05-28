'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { DECISION_GATES, KPI_BENCHMARKS } from '@/lib/bible-data';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { exportToPng } from '@/lib/export';
import { requestNotificationPermission } from '@/lib/notifications';

interface DailyData {
  date: string;
  fb_spend: number; fb_inbox: number; fb_orders: number; fb_revenue: number;
  sp_organic: number; sp_paid: number; sp_revenue: number; sp_spend: number;
  tt_views: number; tt_orders: number; tt_revenue: number;
  fl_shipped: number; fl_delivered: number; fl_boom: number; fl_return: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DailyData[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    requestNotificationPermission();
    loadData();
    loadSettings();
  }, []);

  async function loadData() {
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }
    const { data: rows } = await supabase
      .from('daily_data')
      .select('*')
      .in('date', dates)
      .order('date');
    if (rows) setData(rows as DailyData[]);
  }

  async function loadSettings() {
    const { data: row } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'start_date')
      .single();
    if (row?.value) setStartDate(row.value);
  }

  const today = data.find(d => d.date === new Date().toISOString().slice(0, 10));
  const totalOrders = today ? (today.fb_orders + today.sp_organic + today.sp_paid + today.tt_orders) : 0;
  const totalRevenue = today ? (today.fb_revenue + today.sp_revenue + today.tt_revenue) : 0;
  const totalSpend = today ? (today.fb_spend + today.sp_spend) : 0;
  const cpa = today && today.fb_orders > 0 ? Math.round(today.fb_spend / today.fb_orders) : 0;
  const roas = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(1) : '0';

  // Chart data
  const chartData = data.map(d => ({
    date: d.date.slice(5),
    fb: d.fb_orders,
    shopee: d.sp_organic + d.sp_paid,
    tiktok: d.tt_orders,
    total: d.fb_orders + d.sp_organic + d.sp_paid + d.tt_orders,
    cpa: d.fb_orders > 0 ? Math.round(d.fb_spend / d.fb_orders) : 0,
  }));

  // Decision Gate
  let gateName = 'Chưa set ngày bắt đầu';
  let gateCountdown = '';
  let gateChecks = '';
  let gateProgress = 0;
  if (startDate) {
    const daysPassed = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000);
    const gate = DECISION_GATES.find(g => daysPassed < g.day) || DECISION_GATES[DECISION_GATES.length - 1];
    const daysLeft = gate.day - daysPassed;
    gateName = gate.name;
    gateCountdown = daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'ĐÃ TỚI!';
    gateChecks = gate.checks;
    gateProgress = Math.min(100, Math.round(daysPassed / gate.day * 100));
  }

  function kpiStatus(value: number, benchmark: { good: number; ok: number; lowerBetter: boolean }) {
    if (value === 0) return '';
    if (benchmark.lowerBetter) return value <= benchmark.good ? 'ok' : value <= benchmark.ok ? 'warn' : 'bad';
    return value >= benchmark.good ? 'ok' : value >= benchmark.ok ? 'warn' : 'bad';
  }

  const now = new Date();
  const dayNames = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];

  return (
    <div className="container" id="dashboard-export">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Chào bạn 👋</h1>
          <p className="text-secondary">{dayNames[now.getDay()]}, {now.toLocaleDateString('vi-VN')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => exportToPng('dashboard-export', 'dashboard')}>
          📥 Xuất báo cáo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="glass kpi-card">
          <div className="kpi-top"><span>Đơn hôm nay</span><span>📦</span></div>
          <div className="kpi-value">{totalOrders || '—'}</div>
          <div className="kpi-trend text-muted">FB + Shopee + TikTok</div>
        </div>
        <div className="glass kpi-card">
          <div className="kpi-top"><span>Doanh thu</span><span>💰</span></div>
          <div className="kpi-value">{totalRevenue > 0 ? `${Math.round(totalRevenue)}K` : '—'}</div>
          <div className="kpi-trend text-muted">Tổng 3 kênh</div>
        </div>
        <div className="glass kpi-card">
          <div className="kpi-top"><span>CPA (FB)</span><span>📊</span></div>
          <div className={`kpi-value ${kpiStatus(cpa, KPI_BENCHMARKS.cpa)}`}>{cpa > 0 ? `${cpa}K` : '—'}</div>
          <div className={`kpi-trend ${kpiStatus(cpa, KPI_BENCHMARKS.cpa) === 'ok' ? 'text-success' : kpiStatus(cpa, KPI_BENCHMARKS.cpa) === 'warn' ? 'text-warning' : 'text-muted'}`}>
            {cpa > 0 ? `Ngưỡng: < 25K` : 'Chưa có data'}
          </div>
        </div>
        <div className="glass kpi-card">
          <div className="kpi-top"><span>ROAS</span><span>📈</span></div>
          <div className="kpi-value">{parseFloat(roas) > 0 ? `${roas}x` : '—'}</div>
          <div className="kpi-trend text-muted">{parseFloat(roas) > 0 ? 'Ngưỡng: > 3.5x' : 'Chưa có data'}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-grid" style={{ marginBottom: 24 }}>
        <div className="glass panel">
          <div className="panel-title">📊 Đơn hàng 7 ngày</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#5e5e78" fontSize={11} />
              <YAxis stroke="#5e5e78" fontSize={11} />
              <Tooltip contentStyle={{ background: '#111119', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="fb" name="FB Ads" fill="#a78bfa" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="shopee" name="Shopee" fill="#60a5fa" radius={[4, 4, 0, 0]} stackId="a" />
              <Bar dataKey="tiktok" name="TikTok" fill="#f472b6" radius={[4, 4, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass panel">
          <div className="panel-title">📈 CPA Trend 7 ngày</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#5e5e78" fontSize={11} />
              <YAxis stroke="#5e5e78" fontSize={11} />
              <Tooltip contentStyle={{ background: '#111119', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <ReferenceLine y={25} stroke="#34d399" strokeDasharray="5 5" label={{ value: '25K ✅', fill: '#34d399', fontSize: 10 }} />
              <ReferenceLine y={40} stroke="#f87171" strokeDasharray="5 5" label={{ value: '40K 🔴', fill: '#f87171', fontSize: 10 }} />
              <Line type="monotone" dataKey="cpa" name="CPA" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Decision Gate */}
      <div className="glass panel" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="panel-title" style={{ margin: 0 }}>🚦 {gateName}</div>
          <span className="font-mono" style={{ color: 'var(--accent)', fontSize: 13 }}>{gateCountdown}</span>
        </div>
        <p className="text-secondary" style={{ fontSize: 13, marginBottom: 10 }}>{gateChecks}</p>
        <div className="progress-wrapper">
          <div className="progress-fill" style={{ width: `${gateProgress}%` }}></div>
        </div>
      </div>

      {/* Quick Stats */}
      {today && today.fl_shipped > 0 && (
        <div className="glass panel">
          <div className="panel-title">📋 Quick Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {today.fb_inbox > 0 && (
              <div className="stat-bar">
                <div className="stat-bar-header">
                  <span>Tỷ lệ chốt</span>
                  <span className="font-mono">{Math.round(today.fb_orders / today.fb_inbox * 100)}%</span>
                </div>
                <div className="stat-bar-track"><div className="stat-bar-fill" style={{ width: `${Math.round(today.fb_orders / today.fb_inbox * 100)}%`, background: 'var(--green)' }}></div></div>
              </div>
            )}
            <div className="stat-bar">
              <div className="stat-bar-header">
                <span>Giao thành</span>
                <span className="font-mono">{Math.round(today.fl_delivered / today.fl_shipped * 100)}%</span>
              </div>
              <div className="stat-bar-track"><div className="stat-bar-fill" style={{ width: `${Math.round(today.fl_delivered / today.fl_shipped * 100)}%`, background: 'var(--green)' }}></div></div>
            </div>
            <div className="stat-bar">
              <div className="stat-bar-header">
                <span>Boom COD</span>
                <span className="font-mono">{Math.round(today.fl_boom / today.fl_shipped * 100)}%</span>
              </div>
              <div className="stat-bar-track"><div className="stat-bar-fill" style={{ width: `${Math.round(today.fl_boom / today.fl_shipped * 100)}%`, background: 'var(--red)' }}></div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
