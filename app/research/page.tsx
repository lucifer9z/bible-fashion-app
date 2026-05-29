'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useStore } from '@/lib/store-context';

type Tab = 'overview' | 'competitors' | 'reviews' | 'ads' | 'trends';

interface Competitor { id: string; name: string; platform: string; url: string; notes: string; created_at: string; }
interface CompProduct { id: string; competitor_id: string; name: string; price: number; original_price: number; sold_count: number; rating: number; review_count: number; offer: string; product_url: string; scraped_at: string; }
interface CompReview { id: string; competitor_id: string; stars: number; content: string; category: string; product_name: string; scraped_at: string; }
interface CompAd { id: string; competitor_id: string; platform: string; ad_text: string; format: string; offer: string; hook: string; url: string; first_seen: string; last_seen: string; is_active: boolean; notes: string; }
interface TrendVideo { id: string; platform: string; title: string; views: number; likes: number; hook: string; video_type: string; audio: string; url: string; creator: string; scraped_at: string; }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Tổng quan', icon: '📊' },
  { key: 'competitors', label: 'Đối thủ', icon: '🏪' },
  { key: 'reviews', label: 'Reviews', icon: '⭐' },
  { key: 'ads', label: 'Ads Library', icon: '📢' },
  { key: 'trends', label: 'Trends', icon: '🔥' },
];

const PLATFORMS = ['shopee', 'tiktok', 'facebook', 'lazada'];
const VIDEO_TYPES = ['unbox', 'try-on', 'compare', 'tutorial', 'review', 'outfit', 'other'];
const AD_FORMATS = ['video', 'image', 'carousel', 'reel'];
const REVIEW_CATEGORIES = ['size', 'quality', 'shipping', 'color', 'packaging', 'price', 'service', 'other'];

export default function ResearchPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [products, setProducts] = useState<CompProduct[]>([]);
  const [reviews, setReviews] = useState<CompReview[]>([]);
  const [ads, setAds] = useState<CompAd[]>([]);
  const [trends, setTrends] = useState<TrendVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();
  const { activeStoreId, storeFilter } = useStore();

  useEffect(() => { loadAll(); }, [activeStoreId]);

  async function loadAll() {
    setLoading(true);
    try {
      const [cRes, pRes, rRes, aRes, tRes] = await Promise.all([
        storeFilter(supabase.from('competitors').select('*')).order('created_at', { ascending: false }),
        storeFilter(supabase.from('competitor_products').select('*')).order('scraped_at', { ascending: false }),
        storeFilter(supabase.from('competitor_reviews').select('*')).order('scraped_at', { ascending: false }),
        storeFilter(supabase.from('competitor_ads').select('*')).order('scraped_at', { ascending: false }),
        storeFilter(supabase.from('trend_videos').select('*')).order('views', { ascending: false }),
      ]);
      if (cRes.data) setCompetitors(cRes.data);
      if (pRes.data) setProducts(pRes.data);
      if (rRes.data) setReviews(rRes.data);
      if (aRes.data) setAds(aRes.data);
      if (tRes.data) setTrends(tRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  // ========== OVERVIEW TAB ==========
  function OverviewTab() {
    const avgPrice = products.length > 0 ? Math.round(products.reduce((s, p) => s + (p.price || 0), 0) / products.length) : 0;
    const minPrice = products.length > 0 ? Math.min(...products.map(p => p.price || 999999)) : 0;
    const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price || 0)) : 0;
    const activeAds = ads.filter(a => a.is_active).length;

    // Review category breakdown
    const catCounts: Record<string, number> = {};
    reviews.forEach(r => { const c = r.category || 'other'; catCounts[c] = (catCounts[c] || 0) + 1; });
    const topCategories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
      <>
        <div className="kpi-grid">
          <div className="kpi-card"><div className="kpi-icon purple">🏪</div><div className="kpi-label">Đối thủ tracking</div><div className="kpi-value">{competitors.length}/20</div></div>
          <div className="kpi-card"><div className="kpi-icon blue">📦</div><div className="kpi-label">Sản phẩm</div><div className="kpi-value">{products.length}</div></div>
          <div className="kpi-card"><div className="kpi-icon orange">⭐</div><div className="kpi-label">Reviews</div><div className="kpi-value">{reviews.length}</div></div>
          <div className="kpi-card"><div className="kpi-icon green">📢</div><div className="kpi-label">Ads active</div><div className="kpi-value">{activeAds}</div></div>
        </div>

        {products.length > 0 && (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title">💰 Range giá thị trường</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Min</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>{(minPrice/1000).toFixed(0)}K</div>
              </div>
              <div style={{ flex: 1, height: 8, background: 'var(--bg-card-border)', borderRadius: 4, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, background: 'linear-gradient(90deg, var(--green), var(--accent), var(--red))' }}></div>
                {avgPrice > 0 && <div style={{ position: 'absolute', top: -6, left: `${Math.min(95, Math.max(5, ((avgPrice - minPrice) / (maxPrice - minPrice || 1)) * 100))}%`, width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', border: '2px solid #fff', transform: 'translateX(-50%)' }} title={`Avg: ${(avgPrice/1000).toFixed(0)}K`}></div>}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Max</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--red)' }}>{(maxPrice/1000).toFixed(0)}K</div>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>Trung bình: <strong style={{ color: 'var(--accent)' }}>{(avgPrice/1000).toFixed(0)}K</strong></div>
          </div>
        )}

        {topCategories.length > 0 && (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title">⚠️ Top vấn đề từ reviews đối thủ</div>
            {topCategories.map(([cat, count]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ width: 80, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{cat}</span>
                <div style={{ flex: 1, height: 6, background: 'var(--bg-card-border)', borderRadius: 3 }}>
                  <div style={{ height: '100%', borderRadius: 3, background: 'var(--accent)', width: `${(count / (topCategories[0]?.[1] || 1)) * 100}%` }}></div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 30 }}>{count}</span>
              </div>
            ))}
          </div>
        )}

        {competitors.length === 0 && (
          <div className="card" style={{ marginTop: 16, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Chưa có dữ liệu Research</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>Bắt đầu bằng cách thêm đối thủ ở tab "Đối thủ"</div>
            <button className="btn btn-primary" onClick={() => setTab('competitors')}>🏪 Thêm đối thủ đầu tiên</button>
          </div>
        )}
      </>
    );
  }

  // ========== COMPETITORS TAB ==========
  function CompetitorsTab() {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', platform: 'shopee', url: '', notes: '' });
    const [editId, setEditId] = useState<string | null>(null);
    const [showProductForm, setShowProductForm] = useState<string | null>(null);
    const [pForm, setPForm] = useState({ name: '', price: '', original_price: '', sold_count: '', rating: '', review_count: '', offer: '', product_url: '' });

    async function saveCompetitor() {
      if (!form.name.trim()) return;
      const payload: any = { ...form, store_id: activeStoreId };
      if (editId) {
        await supabase.from('competitors').update(payload).eq('id', editId);
      } else {
        if (competitors.length >= 20) { alert('Tối đa 20 đối thủ!'); return; }
        await supabase.from('competitors').insert(payload);
      }
      setForm({ name: '', platform: 'shopee', url: '', notes: '' });
      setShowForm(false); setEditId(null);
      loadAll();
    }

    async function deleteComp(id: string) {
      if (!confirm('Xóa đối thủ này? (sẽ xóa luôn SP + reviews)')) return;
      await supabase.from('competitors').delete().eq('id', id);
      loadAll();
    }

    async function saveProduct(compId: string) {
      if (!pForm.name.trim()) return;
      await supabase.from('competitor_products').insert({
        competitor_id: compId, store_id: activeStoreId, name: pForm.name,
        price: parseInt(pForm.price) || 0, original_price: parseInt(pForm.original_price) || 0,
        sold_count: parseInt(pForm.sold_count) || 0, rating: parseFloat(pForm.rating) || 0,
        review_count: parseInt(pForm.review_count) || 0, offer: pForm.offer, product_url: pForm.product_url,
      });
      setPForm({ name: '', price: '', original_price: '', sold_count: '', rating: '', review_count: '', offer: '', product_url: '' });
      setShowProductForm(null);
      loadAll();
    }

    async function deleteProduct(id: string) {
      await supabase.from('competitor_products').delete().eq('id', id);
      loadAll();
    }

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{competitors.length}/20 đối thủ</div>
          <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', platform: 'shopee', url: '', notes: '' }); }}>+ Thêm đối thủ</button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 16, padding: 20 }}>
            <div className="card-title">{editId ? '✏️ Sửa đối thủ' : '🏪 Thêm đối thủ mới'}</div>
            <div className="form-grid-2">
              <div><label className="form-label">Tên shop *</label><input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="VD: Shop ABC" /></div>
              <div><label className="form-label">Nền tảng</label><select className="form-control" value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>{PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
              <div><label className="form-label">Link shop</label><input className="form-control" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://..." /></div>
              <div><label className="form-label">Ghi chú</label><input className="form-control" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={saveCompetitor}>{editId ? 'Cập nhật' : 'Thêm'}</button>
              <button className="btn btn-ghost" onClick={() => { setShowForm(false); setEditId(null); }}>Hủy</button>
            </div>
          </div>
        )}

        {competitors.map(c => {
          const cProducts = products.filter(p => p.competitor_id === c.id);
          return (
            <div className="card" key={c.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span className="pill pill-data">{c.platform}</span>
                    {c.url && <a href={c.url} target="_blank" rel="noopener" style={{ fontSize: 12, color: 'var(--accent)' }}>🔗 Link</a>}
                    {c.notes && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.notes}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowProductForm(showProductForm === c.id ? null : c.id)}>+ SP</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditId(c.id); setForm({ name: c.name, platform: c.platform, url: c.url || '', notes: c.notes || '' }); setShowForm(true); }}>✏️</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => deleteComp(c.id)}>🗑</button>
                </div>
              </div>

              {showProductForm === c.id && (
                <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="form-grid-2" style={{ gap: 8 }}>
                    <input className="form-control" placeholder="Tên SP *" value={pForm.name} onChange={e => setPForm({...pForm, name: e.target.value})} />
                    <input className="form-control" placeholder="Giá (VD: 199000)" type="number" value={pForm.price} onChange={e => setPForm({...pForm, price: e.target.value})} />
                    <input className="form-control" placeholder="Giá gốc" type="number" value={pForm.original_price} onChange={e => setPForm({...pForm, original_price: e.target.value})} />
                    <input className="form-control" placeholder="Lượt bán" type="number" value={pForm.sold_count} onChange={e => setPForm({...pForm, sold_count: e.target.value})} />
                    <input className="form-control" placeholder="Rating (VD: 4.7)" value={pForm.rating} onChange={e => setPForm({...pForm, rating: e.target.value})} />
                    <input className="form-control" placeholder="Offer (VD: mua 2 giảm 20K)" value={pForm.offer} onChange={e => setPForm({...pForm, offer: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => saveProduct(c.id)}>Thêm SP</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowProductForm(null)}>Hủy</button>
                  </div>
                </div>
              )}

              {cProducts.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <table className="styled-table" style={{ fontSize: 12 }}>
                    <thead><tr><th>Sản phẩm</th><th>Giá</th><th>Bán</th><th>⭐</th><th>Offer</th><th></th></tr></thead>
                    <tbody>
                      {cProducts.map(p => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 500 }}>{p.name}</td>
                          <td>{p.original_price > p.price ? <><s style={{color:'var(--text-muted)'}}>{(p.original_price/1000).toFixed(0)}K</s> <strong style={{color:'var(--red)'}}>{(p.price/1000).toFixed(0)}K</strong></> : `${(p.price/1000).toFixed(0)}K`}</td>
                          <td>{p.sold_count > 999 ? `${(p.sold_count/1000).toFixed(1)}K` : p.sold_count}</td>
                          <td>{p.rating || '—'}</td>
                          <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.offer || '—'}</td>
                          <td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', padding: 2 }} onClick={() => deleteProduct(p.id)}>×</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  }

  // ========== REVIEWS TAB ==========
  function ReviewsTab() {
    const [showForm, setShowForm] = useState(false);
    const [filterCat, setFilterCat] = useState('all');
    const [filterStars, setFilterStars] = useState(0);
    const [form, setForm] = useState({ competitor_id: '', stars: '3', content: '', category: 'other', product_name: '' });
    const [copied, setCopied] = useState(false);

    async function saveReview() {
      if (!form.content.trim() || !form.competitor_id) return;
      await supabase.from('competitor_reviews').insert({
        ...form, stars: parseInt(form.stars), store_id: activeStoreId,
      });
      setForm({ competitor_id: '', stars: '3', content: '', category: 'other', product_name: '' });
      setShowForm(false);
      loadAll();
    }

    async function deleteReview(id: string) {
      await supabase.from('competitor_reviews').delete().eq('id', id);
      loadAll();
    }

    const filtered = reviews.filter(r => {
      if (filterCat !== 'all' && r.category !== filterCat) return false;
      if (filterStars > 0 && r.stars !== filterStars) return false;
      return true;
    });

    // Generate AI prompt from collected reviews
    function generatePrompt() {
      const lines = reviews.slice(0, 20).map(r => `⭐ ${r.stars} - "${r.content}"${r.product_name ? ` (${r.product_name})` : ''}`).join('\n');
      const prompt = `Bạn là product analyst cho shop thời trang nam.\n\nDưới đây là ${reviews.length} review 1-5 sao từ khách mua hàng của đối thủ:\n\n${lines}\n\nPhân tích:\n1. TOP 3 VẤN ĐỀ khách chê nhiều nhất?\n2. Mỗi vấn đề: SHOP TÔI có thể TRÁNH bằng cách nào?\n3. Đâu là CƠ HỘI để tôi làm TỐT HƠN đối thủ?\n4. Viết lại 3 USP cho shop tôi dựa trên điểm yếu đối thủ.\n5. Gợi ý 2-3 câu có thể dùng trong VIDEO/AD để đánh vào nỗi đau khách.`;
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select className="form-control" style={{ width: 'auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="all">Tất cả</option>
              {REVIEW_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="form-control" style={{ width: 'auto' }} value={filterStars} onChange={e => setFilterStars(parseInt(e.target.value))}>
              <option value="0">Mọi sao</option>
              {[1,2,3,4,5].map(s => <option key={s} value={s}>{s} ⭐</option>)}
            </select>
            {reviews.length > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={generatePrompt}>
                {copied ? '✅ Copied!' : '🤖 Tạo prompt AI'}
              </button>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Thêm review</button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 16, padding: 20 }}>
            <div className="card-title">⭐ Thêm review đối thủ</div>
            <div className="form-grid-2">
              <div>
                <label className="form-label">Đối thủ *</label>
                <select className="form-control" value={form.competitor_id} onChange={e => setForm({...form, competitor_id: e.target.value})}>
                  <option value="">Chọn...</option>
                  {competitors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Số sao</label>
                <select className="form-control" value={form.stars} onChange={e => setForm({...form, stars: e.target.value})}>
                  {[1,2,3,4,5].map(s => <option key={s} value={s}>{s} ⭐</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Phân loại</label>
                <select className="form-control" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {REVIEW_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="form-label">Sản phẩm</label><input className="form-control" value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} placeholder="Jean suông đen" /></div>
            </div>
            <div style={{ marginTop: 8 }}>
              <label className="form-label">Nội dung review *</label>
              <textarea className="form-control" rows={2} value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="VD: Vải mỏng, mặc 2 tuần đã xù" />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={saveReview}>Lưu</button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>Chưa có review. Thêm review đối thủ để bắt đầu phân tích!</div>
        ) : (
          <div className="card">
            <table className="styled-table" style={{ fontSize: 12 }}>
              <thead><tr><th>⭐</th><th>Review</th><th>Loại</th><th>SP</th><th>Đối thủ</th><th></th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>{'⭐'.repeat(r.stars)}</td>
                    <td style={{ maxWidth: 300 }}>{r.content}</td>
                    <td><span className="pill pill-data">{r.category || 'other'}</span></td>
                    <td style={{ fontSize: 11 }}>{r.product_name || '—'}</td>
                    <td style={{ fontSize: 11 }}>{competitors.find(c => c.id === r.competitor_id)?.name || '—'}</td>
                    <td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', padding: 2 }} onClick={() => deleteReview(r.id)}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }

  // ========== ADS TAB ==========
  function AdsTab() {
    const [showForm, setShowForm] = useState(false);
    const [filterFormat, setFilterFormat] = useState('all');
    const [form, setForm] = useState({ competitor_id: '', platform: 'facebook', ad_text: '', format: 'video', offer: '', hook: '', url: '', notes: '' });
    const [copied, setCopied] = useState(false);

    async function saveAd() {
      if (!form.ad_text.trim()) return;
      await supabase.from('competitor_ads').insert({
        ...form, store_id: activeStoreId, first_seen: new Date().toISOString().slice(0,10), last_seen: new Date().toISOString().slice(0,10),
      });
      setForm({ competitor_id: '', platform: 'facebook', ad_text: '', format: 'video', offer: '', hook: '', url: '', notes: '' });
      setShowForm(false);
      loadAll();
    }

    async function deleteAd(id: string) {
      await supabase.from('competitor_ads').delete().eq('id', id);
      loadAll();
    }

    const filtered = filterFormat === 'all' ? ads : ads.filter(a => a.format === filterFormat);

    function generateAdsPrompt() {
      const lines = ads.slice(0, 10).map((a, i) => `AD ${i+1} (${competitors.find(c => c.id === a.competitor_id)?.name || '?'}): "${a.ad_text}" — ${a.format}${a.offer ? `, offer: ${a.offer}` : ''}`).join('\n');
      const prompt = `Bạn là Facebook Ads strategist cho shop jean nam VN.\n\nTôi đã thu thập ${ads.length} ads đang chạy của đối thủ:\n\n${lines}\n\nPhân tích:\n1. AD nào ĐANG CHẠY LÂU NHẤT (= hiệu quả nhất)?\n2. HOOK nào hấp dẫn nhất? Tại sao?\n3. OFFER nào mạnh nhất?\n4. FORMAT nào đang trend?\n5. Viết cho tôi 5 AD COPY mới, tốt hơn các ads trên.`;
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="form-control" style={{ width: 'auto' }} value={filterFormat} onChange={e => setFilterFormat(e.target.value)}>
              <option value="all">Mọi format</option>
              {AD_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {ads.length > 0 && <button className="btn btn-secondary btn-sm" onClick={generateAdsPrompt}>{copied ? '✅ Copied!' : '🤖 Tạo prompt AI'}</button>}
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Thêm ad</button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 16, padding: 20 }}>
            <div className="card-title">📢 Thêm ad đối thủ</div>
            <div className="form-grid-2">
              <div>
                <label className="form-label">Đối thủ</label>
                <select className="form-control" value={form.competitor_id} onChange={e => setForm({...form, competitor_id: e.target.value})}>
                  <option value="">Chọn...</option>
                  {competitors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="form-label">Platform</label><select className="form-control" value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}><option value="facebook">Facebook</option><option value="tiktok">TikTok</option></select></div>
              <div><label className="form-label">Format</label><select className="form-control" value={form.format} onChange={e => setForm({...form, format: e.target.value})}>{AD_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
              <div><label className="form-label">Offer</label><input className="form-control" value={form.offer} onChange={e => setForm({...form, offer: e.target.value})} placeholder="VD: Freeship + đổi size free" /></div>
              <div><label className="form-label">Hook (câu đầu)</label><input className="form-control" value={form.hook} onChange={e => setForm({...form, hook: e.target.value})} placeholder="VD: Anh em mặc jean 500K..." /></div>
              <div><label className="form-label">Link ad</label><input className="form-control" value={form.url} onChange={e => setForm({...form, url: e.target.value})} /></div>
            </div>
            <div style={{ marginTop: 8 }}>
              <label className="form-label">Nội dung ad *</label>
              <textarea className="form-control" rows={3} value={form.ad_text} onChange={e => setForm({...form, ad_text: e.target.value})} placeholder="Copy text quảng cáo đầy đủ..." />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={saveAd}>Lưu</button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>Chưa có ads. Thu thập ads đối thủ từ FB Ads Library!</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {filtered.map(a => (
              <div className="card" key={a.id} style={{ position: 'relative' }}>
                <button className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: 8, right: 8, color: 'var(--red)', padding: 2 }} onClick={() => deleteAd(a.id)}>×</button>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className="pill pill-operation">{a.platform}</span>
                  <span className="pill pill-content">{a.format}</span>
                  {a.is_active && <span className="pill pill-data" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}>Active</span>}
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{competitors.find(c => c.id === a.competitor_id)?.name}</span>
                </div>
                {a.hook && <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>🎣 {a.hook}</div>}
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{a.ad_text}</div>
                {a.offer && <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, marginTop: 6 }}>🎁 {a.offer}</div>}
                {a.url && <a href={a.url} target="_blank" rel="noopener" style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4, display: 'block' }}>🔗 Xem ad</a>}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  // ========== TRENDS TAB ==========
  function TrendsTab() {
    const [showForm, setShowForm] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [form, setForm] = useState({ title: '', views: '', likes: '', hook: '', video_type: 'other', audio: '', url: '', creator: '' });
    const [copied, setCopied] = useState(false);

    async function saveTrend() {
      if (!form.title.trim()) return;
      await supabase.from('trend_videos').insert({
        ...form, views: parseInt(form.views) || 0, likes: parseInt(form.likes) || 0, store_id: activeStoreId,
      });
      setForm({ title: '', views: '', likes: '', hook: '', video_type: 'other', audio: '', url: '', creator: '' });
      setShowForm(false);
      loadAll();
    }

    async function deleteTrend(id: string) {
      await supabase.from('trend_videos').delete().eq('id', id);
      loadAll();
    }

    const filtered = filterType === 'all' ? trends : trends.filter(t => t.video_type === filterType);

    function generateTrendPrompt() {
      const lines = trends.slice(0, 10).map((t, i) => `${i+1}. ${t.views > 999999 ? `${(t.views/1000000).toFixed(1)}M` : t.views > 999 ? `${(t.views/1000).toFixed(0)}K` : t.views} views - "${t.title}" - ${t.video_type}${t.audio ? `, audio: ${t.audio}` : ''}`).join('\n');
      const prompt = `Bạn là trend analyst cho shop thời trang nam VN.\n\nTôi đã note ${trends.length} video TikTok hot nhất về jean nam:\n\n${lines}\n\nPhân tích:\n1. TOP 3 KIỂU VIDEO đang viral?\n2. HOOK phổ biến nhất?\n3. AUDIO/NHẠC trending?\n4. Video nào SHOP TÔI có thể LÀM NGAY?\n5. Viết 5 ý tưởng video cho shop jean nam 199K, bắt chước style đang viral.`;
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="form-control" style={{ width: 'auto' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">Mọi loại</option>
              {VIDEO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {trends.length > 0 && <button className="btn btn-secondary btn-sm" onClick={generateTrendPrompt}>{copied ? '✅ Copied!' : '🤖 Tạo prompt AI'}</button>}
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Thêm video</button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 16, padding: 20 }}>
            <div className="card-title">🔥 Thêm video trending</div>
            <div className="form-grid-2">
              <div><label className="form-label">Tiêu đề *</label><input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="VD: Mặc jean 100K vs 500K" /></div>
              <div><label className="form-label">Views</label><input className="form-control" type="number" value={form.views} onChange={e => setForm({...form, views: e.target.value})} placeholder="VD: 2100000" /></div>
              <div><label className="form-label">Likes</label><input className="form-control" type="number" value={form.likes} onChange={e => setForm({...form, likes: e.target.value})} /></div>
              <div><label className="form-label">Loại video</label><select className="form-control" value={form.video_type} onChange={e => setForm({...form, video_type: e.target.value})}>{VIDEO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <div><label className="form-label">Hook (câu đầu)</label><input className="form-control" value={form.hook} onChange={e => setForm({...form, hook: e.target.value})} /></div>
              <div><label className="form-label">Audio trending</label><input className="form-control" value={form.audio} onChange={e => setForm({...form, audio: e.target.value})} /></div>
              <div><label className="form-label">Creator</label><input className="form-control" value={form.creator} onChange={e => setForm({...form, creator: e.target.value})} /></div>
              <div><label className="form-label">Link video</label><input className="form-control" value={form.url} onChange={e => setForm({...form, url: e.target.value})} /></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={saveTrend}>Lưu</button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>Chưa có video. Lướt TikTok rồi note video hot ở đây!</div>
        ) : (
          <div className="card">
            <table className="styled-table" style={{ fontSize: 12 }}>
              <thead><tr><th>Video</th><th>Views</th><th>Loại</th><th>Hook</th><th>Audio</th><th></th></tr></thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500, maxWidth: 200 }}>
                      {t.url ? <a href={t.url} target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>{t.title}</a> : t.title}
                      {t.creator && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>@{t.creator}</div>}
                    </td>
                    <td style={{ fontWeight: 700 }}>{t.views > 999999 ? `${(t.views/1000000).toFixed(1)}M` : t.views > 999 ? `${(t.views/1000).toFixed(0)}K` : t.views}</td>
                    <td><span className="pill pill-content">{t.video_type}</span></td>
                    <td style={{ fontSize: 11, maxWidth: 150 }}>{t.hook || '—'}</td>
                    <td style={{ fontSize: 11 }}>{t.audio || '—'}</td>
                    <td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', padding: 2 }} onClick={() => deleteTrend(t.id)}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }

  // ========== MAIN RENDER ==========
  if (loading) {
    return (
      <div style={{ padding: 20, opacity: 0.5 }}>
        <div className="page-header"><div className="page-greeting">Đang tải Research... 🔍</div></div>
        <div className="kpi-grid">{[1,2,3,4].map(i => <div className="kpi-card" key={i} style={{ minHeight: 80 }}><div style={{ background: 'var(--bg-card-border)', height: 14, width: '60%', borderRadius: 4, animation: 'pulse 1.5s infinite' }}></div></div>)}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🔍 Research Center</h1>
        <p className="text-secondary">Thu thập & phân tích đối thủ, review, ads, trends — {competitors.length} đối thủ đang tracking</p>
      </div>

      <div className="tab-bar" style={{ marginBottom: 20 }}>
        {TABS.map(t => (
          <div key={t.key} className={`sub-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.icon} {t.label}
          </div>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'competitors' && <CompetitorsTab />}
      {tab === 'reviews' && <ReviewsTab />}
      {tab === 'ads' && <AdsTab />}
      {tab === 'trends' && <TrendsTab />}
    </div>
  );
}
