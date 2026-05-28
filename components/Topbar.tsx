'use client';

export default function Topbar() {
  const now = new Date();
  const dayNames = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
  const dateStr = `${dayNames[now.getDay()]}, ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;

  function toggleSidebar() {
    document.querySelector('.sidebar')?.classList.toggle('mobile-open');
    document.querySelector('.sidebar-overlay')?.classList.toggle('open');
  }

  return (
    <div className="topbar">
      <button className="mobile-topbar-btn" onClick={toggleSidebar}>
        ☰
      </button>
      
      <input className="topbar-search" placeholder="Tìm nhanh... (⌘K)" />

      <div className="topbar-right">
        <div className="topbar-date">
          <span>📅</span> {dateStr}
        </div>

        <div className="topbar-filter">
          🏪 Tất cả cửa hàng <span style={{ fontSize: 10 }}>▾</span>
        </div>

        <div className="topbar-bell" onClick={() => {}}>
          🔔
          <div className="topbar-bell-dot"></div>
        </div>

        <div className="topbar-user">
          <div className="topbar-avatar">C</div>
          <div className="topbar-user-info">
            <div className="topbar-user-name">Công</div>
            <div className="topbar-user-role">Leader</div>
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>▾</span>
        </div>
      </div>
    </div>
  );
}
