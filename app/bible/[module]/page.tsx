'use client';
import { use, useState } from 'react';
import { BIBLE_MODULES } from '@/lib/bible-data';
import { mdToHtml } from '@/components/MdRenderer';

export default function BiblePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = use(params);
  const mod = BIBLE_MODULES[moduleId];
  const fileKeys = mod ? Object.keys(mod.files) : [];
  const [activeFile, setActiveFile] = useState(fileKeys[0] || '');

  if (!mod) return <div className="container"><h1>Module không tồn tại</h1></div>;

  const file = mod.files[activeFile];

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{mod.icon} {mod.name}</h1>
        <p className="text-secondary">{mod.desc}</p>
      </div>

      <div className="tab-bar">
        {fileKeys.map(key => (
          <div
            key={key}
            className={`sub-tab ${key === activeFile ? 'active' : ''}`}
            onClick={() => setActiveFile(key)}
          >
            {mod.files[key].title}
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: 28 }}>
        {file && (
          <div className="md-rich-content" dangerouslySetInnerHTML={{ __html: mdToHtml(file.content) }} />
        )}
      </div>
    </div>
  );
}
