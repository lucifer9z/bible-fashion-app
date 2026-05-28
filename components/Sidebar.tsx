'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BIBLE_MODULES, ROLES } from '@/lib/bible-data';
import {
  House, ListChecks, BookOpen, ChartBar, Robot,
  Notebook, CalendarDots, Package, SignOut, MagnifyingGlass, Bell
} from '@phosphor-icons/react';

const mainNav = [
  { href: '/', label: 'Dashboard', icon: House },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/data-entry', label: 'Nhập số liệu', icon: ChartBar },
  { href: '/content-calendar', label: 'Lịch Content', icon: CalendarDots },
  { href: '/sku', label: 'SKU', icon: Package },
  { href: '/ai-prompts', label: 'AI Prompts', icon: Robot },
  { href: '/war-stories', label: 'War Stories', icon: Notebook },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span>📖</span>
        <span>BibleFashion</span>
      </div>

      <nav className="nav-section" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="nav-label">CHÍNH</div>
        {mainNav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <item.icon size={17} style={{ marginRight: 11, flexShrink: 0 }} />
            <span>{item.label}</span>
          </Link>
        ))}

        <div className="nav-label" style={{ marginTop: 20 }}>BIBLE</div>
        {Object.entries(BIBLE_MODULES).map(([key, mod]) => (
          <Link
            key={key}
            href={`/bible/${key}`}
            className={`nav-item ${pathname === `/bible/${key}` ? 'active' : ''}`}
          >
            <span style={{ marginRight: 11, fontSize: 15 }}>{mod.icon}</span>
            <span>{mod.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link href="/login" className="nav-item" style={{ color: 'var(--text-muted)' }}>
          <SignOut size={17} style={{ marginRight: 11 }} />
          <span>Đăng xuất</span>
        </Link>
      </div>
    </aside>
  );
}
