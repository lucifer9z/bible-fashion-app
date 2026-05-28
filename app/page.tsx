'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { KPI_BENCHMARKS } from '@/lib/bible-data';
import Link from 'next/link';
import { exportToPng } from '@/lib/export';
import { requestNotificationPermission } from '@/lib/notifications';

interface DailyData {
  date: string;
  fb_spend: number; fb_inbox: number; fb_orders: number; fb_revenue: number;
  sp_organic: number; sp_paid: number; sp_revenue: number; sp_spend: number;
  tt_views: number; tt_orders: number; tt_revenue: number;
  fl_shipped: number; fl_delivered: number; fl_boom: number; fl_return: number;
}

interface Task { id: string; text: string; role: string; time_slot: string; done: boolean; }

export default function Dashboard() {
  const [data, setData] = useState<DailyData[]>([]);
  const [yesterday, setYesterday] = useState<DailyData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skuWarnings, setSkuWarnings] = useState<string[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const supabase = createClient();
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    requestNotificationPermission();
    loadData();
    loadTasks();
    loadWarningData();
  }, []);

  async function loadData() {
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); dates.push(d.toISOString().slice(0, 10)); }
    const { data: rows } = await supabase.from('daily_data').select('*').in('date', dates).order('date');
    if (rows) setData(rows as DailyData[]);

    const yd = new Date(); yd.setDate(yd.getDate() - 1);
    const { data: ydRow } = await supabase.from('daily_data').select('*').eq('date', yd.toISOString().slice(0, 10)).single();
    if (ydRow) setYesterday(ydRow as DailyData);
  }

  async function loadTasks() {
    const { data: rows } = await supabase.from('tasks').select('*').eq('date', todayStr).order('time_slot').limit(5);
    if (rows) setTasks(rows);
  }

  async function loadWarningData() {
    const { data: lowStock } = await supabase.from('skus').select('name, stock').lt('stock', 20);
    if (lowStock) setSkuWarnings(lowStock.map((s: any) => `${s.name} (còn ${s.stock})`));

    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const { count } = await supabase.from('content_items').select('*', { count: 'exact', head: true }).gte('date', weekStart.toISOString().slice(0, 10));
    setContentCount(count || 0);
  }

  async function toggleTask(id: string, done: boolean) {
    await supabase.from('tasks').update({ done: !done }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  const today = data.find(d => d.date === todayStr);
  const hasData = !!today;

  const totalOrders = today ? (today.fb_orders + today.sp_organic + today.sp_paid + today.tt_orders) : 0;
  const totalRevenue = today ? (today.fb_revenue + today.sp_revenue + today.tt_revenue) : 0;
  const totalSpend = today ? (today.fb_spend + today.sp_spend) : 0;
  const cpa = today && today.fb_orders > 0 ? Math.round(today.fb_spend / today.fb_orders) : 0;
  const roas = totalSpend > 0 ? parseFloat((totalRevenue / totalSpend).toFixed(1)) : 0;

  const ydOrders = yesterday ? (yesterday.fb_orders + yesterday.sp_organic + yesterday.sp_paid + yesterday.tt_orders) : 0;
  const ydRevenue = yesterday ? (yesterday.fb_revenue + yesterday.sp_revenue + yesterday.tt_revenue) : 0;
  const ordersDiff = totalOrders - ydOrders;
  const revenuePct = ydRevenue > 0 ? Math.round((totalRevenue - ydRevenue) / ydRevenue * 100) : 0;

  // Targets
  const targetOrders = 20;
  const targetCpa = 30;
  const targetRoas = 3.0;
  const targetRevenue = 6000;

  function kpiCheck(value: number, target: number, lowerBetter: boolean) {
    if (value === 0) return '';
    if (lowerBetter) return value <= target ? 'ok' : value <= target * 1.3 ? 'warn' : 'bad';
    return value >= target ? 'ok' : value >= target * 0.7 ? 'warn' : 'bad';
  }

  // Funnel
  const funnelImpressions = today ? Math.round((today.fb_inbox * 8.5) * 15) : 0;
  const funnelClicks = today ? Math.round(today.fb_inbox * 8.5) : 0;
  const funnelInbox = today ? today.fb_inbox : 0;
  const funnelOrders = totalOrders;
  const funnelDelivered = today ? today.fl_delivered : 0;
  const maxFunnel = funnelImpressions || 1;

  const closeRate = funnelInbox > 0 ? (funnelOrders / funnelInbox * 100).toFixed(1) : '0';
  const deliveryRate = today && today.fl_shipped > 0 ? (today.fl_delivered / today.fl_shipped * 100).toFixed(1) : '0';

  // Warnings
  const warnings: { text: string; type: string; icon: string }[] = [];
  if (!hasData) warnings.push({ text: 'Chưa nhập số liệu hôm nay', type: 'yellow', icon: '⚠️' });
  if (cpa > 40) warnings.push({ text: `CPA ${cpa}K — vượt ngưỡng nguy hiểm (>40K)`, type: 'red', icon: '🔴' });
  if (today && today.fl_shipped > 0 && today.fl_boom / today.fl_shipped > 0.2) warnings.push({ text: `Boom COD ${Math.round(today.fl_boom / today.fl_shipped * 100)}% — quá cao`, type: 'red', icon: '🔴' });
  if (contentCount < 3) warnings.push({ text: `Chỉ ${contentCount} content tuần này — cần ≥ 3`, type: 'orange', icon: '⚠️' });
  skuWarnings.forEach(w => warnings.push({ text: `Tồn kho sắp hết: ${w}`, type: 'orange', icon: '⚠️' }));

  // Reminders
  const reminders = [
    { time: '08:30', text: 'Họp team buổi sáng', status: 'done' },
    { time: '21:00', text: 'Nhập số liệu ngày', status: hasData ? 'done' : 'active' },
    { time: '22:00', text: 'Review ads', status: 'upcoming' },
  ];

  const moduleMap: Record<string, { label: string; cls: string }> = {
    morning: { label: 'Vận hành', cls: 'pill-operation' },
    afternoon: { label: 'Content', cls: 'pill-content' },
    evening: { label: 'Dữ liệu', cls: 'pill-data' },
  };

  const roleMap: Record<string, { label: string; cls: string }> = {
    leader: { label: 'Leader', cls: 'leader' },
    ads: { label: 'Ads', cls: 'ads' },
    media: { label: 'Media', cls: 'media' },
    san: { label: 'Sàn', cls: 'san' },
    fulfillment: { label: 'Fulfillment', cls: 'fulfillment' },
  };

  // Data entry progress
  const dataFields = today ? [today.fb_spend, today.sp_revenue, today.tt_revenue, today.fl_shipped] : [0,0,0,0];
  const filledChannels = dataFields.filter(v => v > 0).length;
  const dataPct = Math.round(filledChannels / 4 * 100);

  // Status
  let statusTitle = 'Chưa có số liệu hôm nay';
  let statusClass = 'warn';
  let statusDesc = 'Nhập số liệu để hệ thống đánh giá hiệu quả vận hành.';
  if (hasData && cpa <= targetCpa && roas >= targetRoas) {
    statusTitle = 'Vận hành ổn định ✨';
    statusClass = 'ok';
    statusDesc = 'Tất cả chỉ số đang trong ngưỡng tốt. Tiếp tục giữ nhịp!';
  } else if (hasData) {
    statusTitle = 'Cần chú ý ⚡';
    statusClass = 'warn';
    statusDesc = 'Một số chỉ số chưa đạt mục tiêu. Kiểm tra CPA và ROAS.';
  }

  return (
    <div id="dashboard-export">
      {/* Greeting */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-greeting">Chào Công 👋</div>
          <div className="page-sub">Mục tiêu hôm nay: {targetOrders} đơn · CPA &lt; {targetCpa}K · ROAS &gt; {targetRoas}</div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="status-banner">
        <div className="status-icon">📋</div>
        <div className="status-info" style={{ flex: 1 }}>
          <div className={`status-title ${statusClass}`}>{statusTitle}</div>
          <div className="status-desc">{statusDesc}</div>
          <div className="status-progress">
            <div className="status-progress-fill" style={{ width: `${dataPct}%` }}></div>
          </div>
          <div className="text-muted" style={{ fontSize: 11, marginTop: 4 }}>{dataPct}% dữ liệu</div>
        </div>
        <div className="status-actions">
          <Link href="/data-entry" className="btn btn-primary">📊 Nhập số liệu ngay</Link>
          <button className="btn btn-secondary">🎯 Thiết lập mục tiêu</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon purple">📦</div>
            {totalOrders > 0 && <div className={`kpi-check ${kpiCheck(totalOrders, targetOrders, false)}`}>{kpiCheck(totalOrders, targetOrders, false) === 'ok' ? '✓' : '!'}</div>}
          </div>
          <div className="kpi-label">Tổng đơn hôm nay</div>
          <div className="kpi-value">{totalOrders || '—'}</div>
          <div className={`kpi-trend ${ordersDiff >= 0 ? 'up' : 'down'}`}>
            {ordersDiff !== 0 ? `${ordersDiff > 0 ? '↑' : '↓'}${Math.abs(ordersDiff)} so với hôm qua` : ''}
          </div>
          <div className="kpi-target">Mục tiêu: {targetOrders} đơn</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon green">💰</div>
            {totalRevenue > 0 && <div className={`kpi-check ${kpiCheck(totalRevenue, targetRevenue, false)}`}>{kpiCheck(totalRevenue, targetRevenue, false) === 'ok' ? '✓' : '!'}</div>}
          </div>
          <div className="kpi-label">Doanh thu</div>
          <div className="kpi-value">{totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(1)}M` : '—'}</div>
          <div className={`kpi-trend ${revenuePct >= 0 ? 'up' : 'down'}`}>
            {revenuePct !== 0 ? `${revenuePct > 0 ? '↑' : '↓'}${Math.abs(revenuePct)}%` : ''}
          </div>
          <div className="kpi-target">Mục tiêu: {(targetRevenue / 1000).toFixed(0)}M</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon blue">📊</div>
            {cpa > 0 && <div className={`kpi-check ${kpiCheck(cpa, targetCpa, true)}`}>{kpiCheck(cpa, targetCpa, true) === 'ok' ? '✓' : '!'}</div>}
          </div>
          <div className="kpi-label">CPA</div>
          <div className="kpi-value">{cpa > 0 ? `${cpa}K` : '—'}</div>
          <div className={`kpi-trend ${cpa > 0 && cpa <= targetCpa ? 'up' : cpa > 0 ? 'down' : 'neutral'}`}>
            {cpa > 0 && cpa <= targetCpa ? '✅ Đạt mục tiêu' : cpa > 0 ? '⚠️ Chưa đạt' : ''}
          </div>
          <div className="kpi-target">Mục tiêu &lt; {targetCpa}K</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon orange">📈</div>
            {roas > 0 && <div className={`kpi-check ${kpiCheck(roas, targetRoas, false)}`}>{kpiCheck(roas, targetRoas, false) === 'ok' ? '✓' : '!'}</div>}
          </div>
          <div className="kpi-label">ROAS</div>
          <div className="kpi-value">{roas > 0 ? `${roas}` : '—'}</div>
          <div className={`kpi-trend ${roas >= targetRoas ? 'up' : roas > 0 ? 'down' : 'neutral'}`}>
            {roas > 0 ? `${roas >= targetRoas ? '↑' : '↓'}+${(roas - targetRoas).toFixed(1)}` : ''}
          </div>
          <div className="kpi-target">Mục tiêu &gt; {targetRoas}</div>
        </div>
      </div>

      {/* Row: Tasks + Funnel */}
      <div className="dashboard-grid-3-1">
        {/* Tasks */}
        <div className="card">
          <div className="card-title">
            <span>🗓 Hôm nay cần làm gì?</span>
            <Link href="/tasks" className="card-title-link">Xem tất cả →</Link>
          </div>
          <table className="task-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}></th>
                <th>Công việc</th>
                <th>Module</th>
                <th>Owner</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Chưa có task. <Link href="/tasks" style={{ color: 'var(--accent)' }}>Tạo task →</Link></td></tr>
              )}
              {tasks.map(t => {
                const mod = moduleMap[t.time_slot] || { label: t.time_slot, cls: 'pill-data' };
                const role = roleMap[t.role] || { label: t.role, cls: 'leader' };
                const timeMap: Record<string, string> = { morning: '10:00', afternoon: '14:00', evening: '21:00' };
                return (
                  <tr key={t.id}>
                    <td>
                      <div className={`task-check ${t.done ? 'checked' : ''}`} onClick={() => toggleTask(t.id, t.done)}>
                        {t.done && '✓'}
                      </div>
                    </td>
                    <td className={t.done ? 'task-text done' : ''}>{t.text}</td>
                    <td><span className={`pill ${mod.cls}`}>{mod.label}</span></td>
                    <td>
                      <div className="owner-avatar">
                        <div className={`owner-avatar-circle ${role.cls}`}>{role.label[0]}</div>
                        <span style={{ fontSize: 12 }}>{role.label}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{timeMap[t.time_slot] || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Funnel */}
        <div className="card">
          <div className="card-title">📊 Phễu bán hàng</div>
          {!hasData ? (
            <div className="text-muted" style={{ textAlign: 'center', padding: 30 }}>Nhập số liệu để xem phễu</div>
          ) : (
            <>
              {[
                { label: 'Impression', value: funnelImpressions, pct: 100, color: 'purple' },
                { label: 'Click', value: funnelClicks, pct: funnelImpressions > 0 ? (funnelClicks / funnelImpressions * 100) : 0, color: 'blue' },
                { label: 'Inbox', value: funnelInbox, pct: funnelClicks > 0 ? (funnelInbox / funnelClicks * 100) : 0, color: 'orange' },
                { label: 'Đơn', value: funnelOrders, pct: funnelInbox > 0 ? (funnelOrders / funnelInbox * 100) : 0, color: 'pink' },
                { label: 'Hoàn tất', value: funnelDelivered, pct: funnelOrders > 0 ? (funnelDelivered / funnelOrders * 100) : 0, color: 'green' },
              ].map((row, i) => (
                <div className="funnel-row" key={i}>
                  <span className="funnel-label">{row.label}</span>
                  <span className="funnel-value">{row.value > 999 ? `${(row.value / 1000).toFixed(1)}K` : row.value}</span>
                  <div className="funnel-bar-wrap">
                    <div className={`funnel-bar ${row.color}`} style={{ width: `${Math.max(3, i === 0 ? 100 : Math.min(100, row.value / maxFunnel * 100))}%` }}></div>
                  </div>
                  <span className="funnel-pct">{row.pct.toFixed(row.pct < 1 ? 2 : row.pct >= 100 ? 0 : 2)}%</span>
                </div>
              ))}
              <div className="funnel-note">
                ✅ Tỷ lệ chốt {closeRate}% {parseFloat(closeRate) >= 15 ? '— đang ổn định.' : '— cần cải thiện.'}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row: Warnings + Reminders */}
      <div className="dashboard-grid-2">
        {/* Warnings */}
        <div className="card">
          <div className="card-title">⚠️ Cảnh báo vận hành</div>
          {warnings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--green)', fontSize: 13 }}>✅ Không có cảnh báo — mọi thứ ổn!</div>
          ) : (
            warnings.map((w, i) => (
              <div className="warning-item" key={i}>
                <div className={`warning-icon ${w.type}`}>{w.icon}</div>
                <div className="warning-text">{w.text}</div>
                <div className="warning-arrow">›</div>
              </div>
            ))
          )}
        </div>

        {/* Reminders */}
        <div className="card">
          <div className="card-title">🔔 Nhắc việc</div>
          {reminders.map((r, i) => (
            <div className="reminder-item" key={i}>
              <span className="reminder-time">{r.time}</span>
              <span className={`reminder-dot ${r.status}`}></span>
              <span className="reminder-text">{r.text}</span>
              <span className="warning-arrow">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
