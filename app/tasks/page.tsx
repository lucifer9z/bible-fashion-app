'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { DEFAULT_TASKS, ROLES } from '@/lib/bible-data';

interface Task { id: string; date: string; text: string; role: string; time_slot: string; done: boolean; }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('all');
  const [newText, setNewText] = useState('');
  const [newRole, setNewRole] = useState('leader');
  const [newTime, setNewTime] = useState('morning');
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => { loadTasks(); }, []);

  async function loadTasks() {
    const { data } = await supabase.from('tasks').select('*').eq('date', today).order('time_slot');
    if (data && data.length > 0) { setTasks(data); }
    else { await generateDefaultTasks(); }
  }

  async function generateDefaultTasks() {
    const newTasks: Omit<Task, 'id'>[] = [];
    Object.entries(DEFAULT_TASKS).forEach(([role, items]) => {
      items.forEach(t => newTasks.push({ date: today, text: t.text, role, time_slot: t.time, done: false }));
    });
    const { data } = await supabase.from('tasks').insert(newTasks).select();
    if (data) setTasks(data);
  }

  async function toggleTask(id: string, done: boolean) {
    await supabase.from('tasks').update({ done: !done }).eq('id', id);
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  async function addTask() {
    if (!newText.trim()) return;
    const { data } = await supabase.from('tasks').insert({ date: today, text: newText, role: newRole, time_slot: newTime, done: false }).select();
    if (data) { setTasks([...tasks, ...data]); setNewText(''); }
  }

  async function deleteTask(id: string) {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(tasks.filter(t => t.id !== id));
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.role === filter);
  const groups = { morning: filtered.filter(t => t.time_slot === 'morning'), afternoon: filtered.filter(t => t.time_slot === 'afternoon'), evening: filtered.filter(t => t.time_slot === 'evening') };
  const doneCount = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round(doneCount / tasks.length * 100) : 0;

  const groupMeta: Record<string, { label: string; color: string }> = {
    morning: { label: '☀️ Sáng (08:00 - 12:00)', color: '#f6e58d' },
    afternoon: { label: '🌤 Chiều (13:30 - 17:30)', color: '#ffbe76' },
    evening: { label: '🌙 Tối (19:00 - 22:00)', color: '#786fa6' },
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">📋 Task Manager</h1>
        <p className="text-secondary">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
      </div>

      {/* Progress */}
      <div className="glass panel" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>{doneCount}/{tasks.length} hoàn thành ({pct}%)</span>
        </div>
        <div className="progress-wrapper"><div className="progress-fill" style={{ width: `${pct}%` }}></div></div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        <span className={`pill pill-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tất cả</span>
        {Object.entries(ROLES).map(([key, role]) => (
          <span key={key} className={`pill pill-filter ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
            {role.icon} {role.name}
          </span>
        ))}
      </div>

      {/* Add Task */}
      <div className="glass panel" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input className="form-control" style={{ flex: 1, minWidth: 200 }} placeholder="Thêm task mới..." value={newText} onChange={e => setNewText(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
          <select className="form-control" style={{ width: 'auto' }} value={newRole} onChange={e => setNewRole(e.target.value)}>
            {Object.entries(ROLES).map(([k, r]) => <option key={k} value={k}>{r.icon} {r.name}</option>)}
          </select>
          <select className="form-control" style={{ width: 'auto' }} value={newTime} onChange={e => setNewTime(e.target.value)}>
            <option value="morning">☀️ Sáng</option><option value="afternoon">🌤 Chiều</option><option value="evening">🌙 Tối</option>
          </select>
          <button className="btn btn-primary" onClick={addTask}>+ Thêm</button>
        </div>
      </div>

      {/* Task Groups */}
      {Object.entries(groups).map(([time, items]) => items.length > 0 && (
        <div className="task-group" key={time}>
          <div className="task-group-header glass" style={{ color: groupMeta[time].color }}>{groupMeta[time].label}</div>
          <div className="glass task-group-body" style={{ borderTop: 'none', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
            {items.map(t => (
              <div className={`task-item ${t.done ? 'done' : ''}`} key={t.id}>
                <div className={`custom-checkbox ${t.done ? 'checked' : ''}`} onClick={() => toggleTask(t.id, t.done)}></div>
                <div className="task-text">{t.text}</div>
                <span className="pill" style={{ background: `${ROLES[t.role]?.color}20`, color: ROLES[t.role]?.color, border: `1px solid ${ROLES[t.role]?.color}30`, fontSize: 11 }}>
                  {ROLES[t.role]?.name || t.role}
                </span>
                <span className="task-delete" onClick={() => deleteTask(t.id)} style={{ cursor: 'pointer', opacity: 0.4, fontSize: 14 }}>✕</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
