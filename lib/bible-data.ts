// ==================== BIBLE DATA ====================
// Full content from 11 modules, ported from Lite app.js

export interface BibleFile {
  title: string;
  content: string;
}

export interface BibleModule {
  name: string;
  desc: string;
  icon: string;
  files: Record<string, BibleFile>;
}

export const BIBLE_MODULES: Record<string, BibleModule> = {
  '01-RESEARCH': {
    name: 'Research', desc: 'Scan đối thủ, trend, khách hàng', icon: '🔍',
    files: {
      'bible': { title: 'Bible — 3 trụ Research', content: `# 01-RESEARCH — Nghiên Cứu Thị Trường\n\n> **AI Impact**: ⭐⭐⭐⭐⭐ — Gom data, phân tích trend, đối thủ — AI làm nhanh gấp 10x\n\n## 3 TRỤ RESEARCH\n\n### Trụ 1: Nghiên cứu đối thủ\n- Top 5-10 đối thủ bán jean nam trên Shopee/TikTok/FB\n- Giá bán, offer, lượt bán, review\n- Content: quay video kiểu gì, hook gì, tần suất\n\n### Trụ 2: Nghiên cứu trend\n- Google Trends: "quần jean nam", "đồ thể thao nam"\n- TikTok trending: hashtag, video viral\n- Seasonal: mùa nào bán gì\n\n### Trụ 3: Nghiên cứu khách hàng\n- Đọc review đối thủ → khách khen gì, chê gì\n- FB Group: "Thời trang nam" → hỏi gì, than gì\n- Persona: Nam 22-35, thu nhập 8-20tr, quan tâm giá + chất vải` },
      'ai-daily-scan': { title: 'AI Daily Scan', content: `# AI DAILY SCAN — Prompt chạy mỗi sáng\n\n\`\`\`\nBạn là market intelligence analyst cho shop thời trang nam VN.\n\nHãy phân tích thị trường hôm nay:\n\n1. SHOPEE: Search "quần jean nam" → top 5 kết quả:\n   - Giá bán, lượt bán, rating, offer\n   - Có gì MỚI so với hôm qua?\n\n2. TIKTOK: Search "jean nam" → top 5 video:\n   - Views, hook đầu tiên, style quay\n   - Video nào viral? Tại sao?\n\n3. FACEBOOK: Search "quần jean nam" trong Marketplace:\n   - Giá range, ai đang chạy ads\n   - Ad copy đang dùng\n\nOUTPUT:\n📊 Trend: [lên/xuống/ổn]\n🔥 Cơ hội: [gì có thể khai thác]\n⚠️ Đối thủ: [ai đang mạnh, làm gì mới]\n📌 Action: [1-2 việc nên làm hôm nay]\n\`\`\`` },
      'ai-competitor-deep': { title: 'AI Competitor Deep Dive', content: `# AI COMPETITOR DEEP DIVE\n\n\`\`\`\nPhân tích sâu đối thủ [TÊN SHOP] bán jean nam:\n\nURL: [link shop]\n\n1. SẢN PHẨM: Bao nhiêu mẫu? Giá range? Best seller?\n2. CONTENT: Quay video kiểu gì? Hook gì? Tần suất?\n3. OFFER: Giảm giá? Combo? Quà tặng? Freeship?\n4. REVIEW: Rating TB? Khen gì nhiều? Chê gì nhiều?\n5. ADS: Đang chạy ads FB/TikTok không? Creative nào?\n6. ĐIỂM YẾU: Đâu là chỗ mình có thể đánh?\n7. ĐIỂM MẠNH: Đâu là chỗ cần tránh/học?\n\nKết luận: Gợi ý 3 action cụ thể.\n\`\`\`` }
    }
  },
  '02-SOURCING': {
    name: 'Sourcing', desc: 'Chọn NCC, kiểm hàng, tính biên', icon: '📦',
    files: {
      'bible': { title: 'Bible — Chọn Nguồn Hàng', content: `# 02-SOURCING — Nguồn Hàng\n\n> **AI Impact**: ⭐⭐ — Vẫn cần quan hệ, test tay, đàm phán\n\n## NGUỒN HIỆN TẠI\n- **Giá nhập**: 70-90K/cái\n- **Loại**: Jean nam (suông, regular) + Short thể thao + Áo thun\n\n## 5 TIÊU CHÍ CHỌN NCC\n\n| # | Tiêu chí | Ngưỡng | Check |\n|---|---------|--------|-------|\n| 1 | Chất vải | Không xù, không phai sau 3 lần giặt | Test 5 cái |\n| 2 | Đường may | Chắc, không bung chỉ | Kiểm 100% lô đầu |\n| 3 | Size chart | Đúng số đo công bố | Đo thực tế |\n| 4 | MOQ | ≤ 50 cái/mẫu/lần | Đàm phán |\n| 5 | Lead time | ≤ 7 ngày | Theo dõi |\n\n## CÔNG THỨC TÍNH BIÊN\n\n\`\`\`\nBiên ròng = Giá bán - Giá nhập - Phí sàn - Ship - Ads/đơn - Bao bì\n\nVí dụ FB Ads (giá bán 199K):\n199K - 80K - 0 - 20K - 25K - 5K = 69K (biên 35%)\n\nVí dụ Shopee (giá bán 219K, phí 39.5%):\n219K - 80K - 86.5K - 0 - 0 - 5K = 47.5K (biên 22%)\n\`\`\`` }
    }
  },
  '03-OFFER': {
    name: 'Offer', desc: 'Công thức offer, giá theo kênh, combo', icon: '💰',
    files: {
      'bible': { title: 'Bible — 7 Thành Phần Offer', content: `# 03-OFFER — Công Thức Offer\n\n> **AI Impact**: ⭐⭐⭐⭐ — AI test A/B nhanh, viết variant, phân tích data\n\n## 7 THÀNH PHẦN OFFER\n\n| # | Thành phần | Ví dụ cụ thể |\n|---|-----------|-------------|\n| 1 | Sản phẩm chính | Jean suông đen |\n| 2 | Giá | 199K (FB) / 219K (Shopee) / 229K (TikTok) |\n| 3 | Cam kết | Đổi size FREE, hoàn tiền nếu không vừa |\n| 4 | Quà tặng | Tặng thắt lưng da (50 đơn đầu) |\n| 5 | Combo | 2 cái 359K (tiết kiệm 39K) |\n| 6 | Urgency | "Chỉ 50 đơn đầu" / "Sale hết hôm nay" |\n| 7 | Social proof | "2,000+ anh đã mua tháng này" |\n\n## GIÁ THEO KÊNH (Quan trọng!)\n\n| Kênh | Giá bán | Phí sàn | Biên |\n|------|---------|---------|------|\n| FB Ads | 199-249K | 0% | 32-46% |\n| Shopee | 219-269K | 39.5% | 15-26% |\n| TikTok | 229-279K | 45.6% | 10-22% |\n\n> ⚠️ FB Ads = kênh LỜI nhất. Sàn = kênh hỗ trợ.` },
      'ai-offer-generator': { title: 'AI Offer Generator', content: `# AI OFFER GENERATOR\n\n\`\`\`\nBạn là chuyên gia e-commerce tối ưu offer cho thời trang nam VN.\n\nSẢN PHẨM: [tên SP]\nGIÁ NHẬP: [X]K\nGIÁ BÁN HIỆN TẠI: [X]K\nKÊNH: [FB Ads / Shopee / TikTok]\nTỶ LỆ CHỐT HIỆN TẠI: [X]%\n\nHãy đề xuất 5 offer khác nhau:\n\nOffer 1: Giảm giá trực tiếp\nOffer 2: Combo (mua 2)\nOffer 3: Quà tặng\nOffer 4: Flash sale giới hạn\nOffer 5: Bundle (jean + áo)\n\nMỗi offer gồm:\n- Headline (1 dòng)\n- Chi tiết offer\n- Biên ước tính\n- Khi nào dùng (mới launch / scale / clear hàng)\n\`\`\`` }
    }
  },
  '04-CONTENT': {
    name: 'Content', desc: 'Script video, hook, angle, lịch content', icon: '🎬',
    files: {
      'bible': { title: 'Bible — 5 Trụ Content', content: `# 04-CONTENT — Máy Nội Dung\n\n> **AI Impact**: ⭐⭐⭐⭐ — AI viết script, hook, caption — quay vẫn cần người\n\n## 5 TRỤ CONTENT\n\n| Trụ | Tỷ lệ (mới) | Tỷ lệ (scale) | Ví dụ |\n|-----|------------|---------------|-------|\n| Educate | 50% | 15% | "Cách chọn jean đúng form" |\n| Prove | 20% | 30% | Review thật, try-on |\n| Sell | 15% | 35% | "Flash sale 50 đơn đầu" |\n| Connect | 10% | 10% | Behind the scenes, đóng gói |\n| Trend | 5% | 10% | Bắt trend TikTok |` },
      'angle-library': { title: '21 Angle Quay Video', content: `# ANGLE LIBRARY — 21 Góc Quay\n\n## TRY-ON (5 angles)\n1. Mặc thử + xoay 360° (selfie cam)\n2. Trước/sau (quần cũ vs quần mới)\n3. Mix & match (jean + 3 kiểu áo)\n4. Size comparison (2 người khác form)\n5. Outfit of the day\n\n## REVIEW CHẤT LIỆU (5 angles)\n6. Cận cảnh vải + kéo giãn\n7. So sánh vải jean 199K vs 500K\n8. Test giặt: trước/sau 5 lần giặt\n9. Test co giãn khi ngồi/đứng\n10. Khóa kéo, đường may cận\n\n## BÁN HÀNG (5 angles)\n11. Unboxing (mở hộp, cảm xúc)\n12. Flash sale countdown\n13. Khách hàng review (UGC)\n14. KOC try-on + đánh giá\n15. Livestream try-on\n\n## STORYTELLING (3 angles)\n16. "Tại sao tôi bán jean 199K"\n17. Tour kho hàng\n18. Một ngày đóng gói 100 đơn\n\n## TREND (3 angles)\n19. Bắt trend TikTok + jean\n20. Phối đồ theo trend\n21. Challenge/Transition` },
      'ai-script-engine': { title: 'AI Script Engine', content: `# AI SCRIPT ENGINE\n\n## PROMPT 1: VIẾT 10 HOOK\n\`\`\`\nViết 10 hook video 3 giây đầu cho sản phẩm: [jean nam suông 199K]\nTarget: Nam 22-35 tuổi\nPlatform: [TikTok / Facebook Reels]\nYêu cầu: Gây tò mò, dừng scroll, có số/fact cụ thể\n\`\`\`\n\n## PROMPT 2: VIẾT SCRIPT VIDEO 30s\n\`\`\`\nViết kịch bản video 30 giây:\n\nSản phẩm: [jean nam suông đen 199K]\nAngle: [try-on / review vải / so sánh]\nHook: [hook đã chọn]\nOffer: [199K, đổi size free, 50 đơn đầu tặng thắt lưng]\n\nFormat:\n[0-3s] HOOK: ...\n[3-10s] VẤN ĐỀ: ...\n[10-20s] GIẢI PHÁP: ...\n[20-27s] BẰNG CHỨNG: ...\n[27-30s] CTA: ...\n\`\`\`` }
    }
  },
  '05-DISTRIBUTION': {
    name: 'Distribution', desc: 'FB Ads main, Shopee, TikTok, KOC', icon: '📢',
    files: {
      'bible': { title: 'Bible — Chiến Lược Kênh', content: `# 05-DISTRIBUTION — Phân Phối\n\n> **Nguyên tắc**: FB Ads = Kênh CHÍNH (lời nhiều). Sàn = Kênh hỗ trợ.\n\n## TẠI SAO FB ADS LÀ KÊNH CHÍNH?\n\n| Kênh | Phí sàn | Biên ròng | Vai trò |\n|------|---------|----------|--------|\n| FB Ads | 0% | 32-46% | 💰 LỜI CHÍNH |\n| Shopee | 39.5% + 4.6K | 15-26% | 🏪 Bổ trợ |\n| TikTok | 45.6% + 7.6K | 10-22% | 📢 Awareness |\n\n## PHÂN BỔ BUDGET THÁNG 1 (134tr)\n\n| Hạng mục | Số tiền | % |\n|----------|--------|----|\\n| Nhập hàng | 80tr | 60% |\n| FB Ads | 25tr | 19% |\n| Shopee Ads | 5tr | 4% |\n| TikTok/KOC | 5tr | 4% |\n| Vận hành | 19tr | 14% |` },
      'fb-ads': { title: 'FB Ads Playbook', content: `# FB ADS — PLAYBOOK\n\n## CẤU TRÚC CAMPAIGN\n\n\`\`\`\nCampaign 1: COLD (người chưa biết shop)\n├── Ad set 1: Broad (Nam 22-40, VN)\n├── Ad set 2: Interest (thời trang nam)\n└── Ad set 3: LAL 1% (từ data mua hàng)\n    └── Mỗi ad set: 3-5 creative (video)\n\nCampaign 2: RETARGET (người đã tương tác)\n├── Ad set: Xem video >50%\n└── Ad set: Inbox chưa mua\n\`\`\`\n\n## QUY TẮC SCALE/CẮT\n\n| Sau 3 ngày | CPA < 25K | CPA 25-40K | CPA > 40K |\n|-----------|-----------|-----------|----------|\n| Đơn > 3 | ✅ Scale +20%/ngày | ⚠️ Giữ, test creative | 🔴 Cắt |\n| Đơn 1-2 | ⚠️ Giữ thêm 2 ngày | ⚠️ Đổi creative | 🔴 Cắt |\n| Đơn 0 | ⚠️ Check targeting | 🔴 Đổi toàn bộ | 🔴 Cắt ngay |` },
      'shopee': { title: 'Shopee Playbook', content: `# SHOPEE — PLAYBOOK\n\n## GIÁ BÁN SHOPEE (Đã tính phí)\n\n\`\`\`\nPhí Shopee: 39.5% doanh thu + 4.6K/đơn\n\nJean 199K (giá FB) → Shopee bán 269K\n  Phí: 269K × 39.5% + 4.6K = 110.9K\n  Biên: 269K - 80K - 110.9K - 5K = 73.1K (27%)\n\`\`\`\n\n## SEO LISTING\n- Tiêu đề: [Từ khóa chính] + [Đặc điểm] + [Size]\n- Mô tả: 500+ chữ, chèn từ khóa tự nhiên\n- Ảnh: 9 ảnh (3 lookbook + 3 detail + 2 size chart + 1 social proof)` }
    }
  },
  '06-SALES': {
    name: 'Sales', desc: 'Chốt đơn, xử lý từ chối, upsell', icon: '💬',
    files: {
      'bible': { title: 'Bible — Flow Chốt Đơn', content: `# 06-SALES — Chốt Đơn\n\n> **AI Impact**: ⭐⭐⭐⭐ — Chatbot, auto-reply, gợi ý SP\n\n## FLOW CHỐT 7 BƯỚC\n\n\`\`\`\n1. CHÀO (< 5 phút)\n   "Dạ chào anh! Anh đang xem mẫu [X] đúng không ạ?"\n\n2. TƯ VẤN SIZE\n   "Anh cao [X]cm, nặng [X]kg → em gợi ý size [X] ạ!"\n\n3. ĐỀ XUẤT OFFER\n   "Mẫu này 199K, đổi size FREE. 50 đơn đầu tặng thắt lưng!"\n\n4. XỬ LÝ TỪ CHỐI\n   → Dùng ai-objection-handler.md\n\n5. UPSELL\n   "Anh mua thêm 1 cái nữa chỉ 359K/2 cái, tiết kiệm 39K!"\n\n6. CHỐT\n   "Anh cho em: Tên, SĐT, Địa chỉ, Size ạ!"\n\n7. CONFIRM (chống boom)\n   Gọi/Zalo confirm trong 2 giờ\n\`\`\`\n\n## SIZE CHART JEAN NAM\n\n| Chiều cao | Cân nặng | Size | Eo |\n|-----------|---------|------|-----|\n| 160-165 | 50-57 | 28-29 | 72-76 |\n| 165-170 | 55-63 | 29-30 | 76-80 |\n| 170-175 | 60-70 | 30-31 | 80-84 |\n| 175-180 | 65-78 | 31-32 | 84-88 |\n| 180-185 | 75-85 | 33-34 | 88-92 |` },
      'ai-objection': { title: 'AI Objection Handler', content: `# 8 OBJECTION PHỔ BIẾN + SCRIPT\n\n## 1. "Đắt quá"\n\`\`\`\n"Dạ em hiểu anh! Nếu tính ra mặc 1 năm thì chưa tới 1K/ngày.\nVải [X] bền hơn jean rẻ 2-3 lần, anh không cần mua lại sau 2 tháng.\nHơn nữa đổi size FREE — không sợ mua về không vừa!"\n\`\`\`\n\n## 2. "Để suy nghĩ"\n\`\`\`\n"Dạ anh cứ suy nghĩ! Nhưng offer 50 đơn đầu tặng thắt lưng\nsắp hết rồi ạ. Em giữ cho anh 2 tiếng nhé?"\n\`\`\`\n\n## 3. "Sợ không vừa size"\n\`\`\`\n"Anh yên tâm! Anh cao [X], nặng [X] → size [X] chắc chắn.\nMà nếu không vừa, đổi size FREE, ship em chịu luôn ạ!"\n\`\`\`\n\n## 4. "Có freeship không?"\n\`\`\`\n"Dạ freeship toàn quốc luôn ạ! Anh chốt em giao 1-3 ngày nhé!"\n\`\`\`` }
    }
  },
  '07-OPERATION': {
    name: 'Operation', desc: 'SOP kho, CSKH, giao vận, tài chính', icon: '⚙️',
    files: {
      'bible': { title: 'Bible — Vận Hành', content: `# 07-OPERATION — Vận Hành\n\n## SƠ ĐỒ VẬN HÀNH\n\n\`\`\`\nĐƠN VÀO → XÁC NHẬN → ĐÓNG GÓI → GIAO → SAU GIAO\n│                                              │\n├ FB: Gọi confirm                    ├ Thành → Xin review\n├ Shopee: Auto                       ├ Boom → Ghi nhận\n└ TikTok: Auto                       └ Hoàn → Kiểm + nhập kho\n\`\`\`\n\n## SO SÁNH GIAO VẬN\n\n| Đơn vị | Phí nội thành | Phí liên tỉnh | Thời gian |\n|--------|-------------|-------------|----------|\n| GHN | 18-22K | 25-35K | 1-3 ngày |\n| GHTK | 15-20K | 22-30K | 2-4 ngày |\n| SPX | 15-20K | 20-30K | 2-4 ngày |\n\n> Gợi ý: GHN cho FB. SPX cho Shopee. J&T cho TikTok.` },
      'sop-fulfillment': { title: 'SOP Đóng Gói', content: `# SOP ĐÓNG GÓI\n\n## Checklist mỗi đơn:\n\n\`\`\`\n1. PICK HÀNG\n   [ ] Đọc đơn: SP gì? Size? Màu?\n   [ ] Lấy đúng hàng từ kho\n   [ ] KIỂM: đúng SP, đúng size, đúng màu\n\n2. ĐÓNG GÓI\n   [ ] Gấp gọn đẹp\n   [ ] Bỏ vào túi zip trong suốt\n   [ ] Đặt thẻ cảm ơn (QR review + Zalo)\n   [ ] Dán phiếu giao vận\n   [ ] Seal túi\n\n3. CHECK CUỐI\n   [ ] Phiếu giao = đúng tên + địa chỉ?\n   [ ] SP bên trong = đúng đơn?\n\`\`\`` }
    }
  },
  '08-DATA': {
    name: 'Data', desc: 'KPI, diagnostic tree, báo cáo AI', icon: '📊',
    files: {
      'bible': { title: 'Bible — KPI & Benchmark', content: `# 08-DATA — Đọc Số\n\n> **AI Impact**: ⭐⭐⭐⭐⭐ — Đọc số, tìm pattern, gợi ý tối ưu\n\n## BENCHMARK KPI\n\n| Chỉ số | 🔴 Yếu | 🟡 TB | 🟢 Tốt |\n|--------|-------|------|-------|\n| CPA (FB) | > 40K | 25-40K | < 25K |\n| ROAS | < 2.0 | 2.0-3.5 | > 3.5 |\n| Tỷ lệ chốt | < 15% | 15-25% | > 25% |\n| Boom COD | > 20% | 12-20% | < 12% |\n| Hoàn hàng | > 15% | 8-15% | < 8% |\n| Giao thành | < 80% | 80-90% | > 90% |\n\n## PHÍ SÀN THẬT (5/2026)\n\n| Sàn | Phí tổng | Công thức |\n|-----|---------|----------|\n| Shopee | 39.5% + 4.6K | Hoa hồng + Phí GD + Phí DV + Ship |\n| TikTok | 45.6% + 7.6K | Hoa hồng + Phí GD + Phí DV |\n| FB Ads | 0% (chỉ ads) | CPA phụ thuộc ads |` },
      'diagnostic-tree': { title: 'Diagnostic Tree', content: `# DIAGNOSTIC TREE — CHẨN ĐOÁN NGHẼN\n\n\`\`\`\nVẤN ĐỀ: Không có đơn\n│\n├── Không có traffic?\n│   ├── Ads spend = 0? → CHƯA CHẠY ADS\n│   ├── Ads spend > 0, click ít? → CREATIVE YẾU → Đổi video\n│   └── Click nhiều, inbox ít? → TARGETING SAI → Đổi audience\n│\n├── Có traffic, không chốt?\n│   ├── Inbox nhiều, chốt ít? → SCRIPT YẾU → Sửa script\n│   ├── Giá đắt so ĐT? → OFFER YẾU → Đổi offer\n│   └── Khách hỏi size rồi biến? → SIZE CHART CHƯA RÕ\n│\n└── Có đơn nhưng lỗ?\n    ├── CPA quá cao? → Tối ưu ads\n    ├── Boom COD cao? → Thêm confirm\n    ├── Hoàn hàng cao? → Check chất lượng\n    └── Phí sàn ăn hết? → Tăng tỷ trọng FB Ads\n\`\`\`` }
    }
  },
  '09-TIMELINE': {
    name: 'Timeline', desc: 'Lộ trình 3 tháng, decision gates', icon: '📅',
    files: {
      'bible': { title: 'Tuần 1-2 Setup', content: `# TUẦN 1-2: SETUP + ĐƠN ĐẦU TIÊN\n\n## Budget: 57tr (Nhập 40tr + Ads 10tr + VH 7tr)\n\n## NGÀY 1-3: SETUP\n- [ ] Chụp ảnh sản phẩm (lookbook + detail)\n- [ ] Quay 10 video đầu tiên\n- [ ] Setup Fanpage + Shopee + TikTok\n- [ ] Viết listing Shopee (SEO)\n- [ ] Setup Facebook Ads Manager\n\n## NGÀY 4-7: CHẠY ĐƠN ĐẦU\n- [ ] Chạy 3 ad sets (100K/ngày/set)\n- [ ] Đăng 3-5 video/ngày TikTok\n- [ ] Chốt inbox FB (script từ 06-SALES)\n- [ ] Đóng gói + giao đơn đầu tiên\n\n## NGÀY 8-14: TỐI ƯU\n- [ ] Check CPA → cắt ad set thua\n- [ ] Video nào views cao → remake\n- [ ] Xin review khách đầu tiên` },
      'decision-gates': { title: 'Decision Gates', content: `# DECISION GATES\n\n## GATE 1 — Cuối tuần 2 (Ngày 14)\n| Chỉ số | 🟢 Đi tiếp | 🟡 Sửa | 🔴 Dừng |\n|--------|-----------|--------|--------|\n| Đơn/ngày | ≥ 5 | 1-4 | 0 |\n| CPA | < 35K | 35-50K | > 50K |\n| Video > 5K views | 3+ | 1-2 | 0 |\n\n## GATE 2 — Cuối tháng 1 (Ngày 30)\n| Chỉ số | 🟢 Scale | 🟡 Tối ưu | 🔴 Review |\n|--------|---------|---------|----------|\n| Đơn/ngày | ≥ 15 | 8-14 | < 8 |\n| CPA | < 30K | 30-40K | > 40K |\n| Biên ròng | > 25% | 15-25% | < 15% |` }
    }
  },
  '10-WAR-STORIES': {
    name: 'War Stories', desc: 'Kho bài học thực chiến', icon: '📝',
    files: {
      'bible': { title: 'Hướng dẫn ghi War Story', content: `# WAR STORIES — Kho Bài Học\n\n> Bible sống = ghi lại mọi thứ học được từ thực tế.\n> Mỗi tuần ít nhất 1 entry.\n\n## CÁCH GHI\n1. Chuyện gì xảy ra?\n2. Số liệu cụ thể (trước vs sau)\n3. Bài học rút ra (1-2 câu)\n4. Đã cập nhật Bible module nào?\n\n## VÍ DỤ\n**Tiêu đề**: Combo > Giảm giá\n**Số liệu**: CPA 35K → 22K, chốt 15% → 28%\n**Bài học**: Khách nam thích tiết kiệm thấy rõ hơn quà tặng.` }
    }
  },
  '11-TEAM': {
    name: 'Team', desc: 'Phân vai 5 người, standup, review', icon: '👥',
    files: {
      'bible': { title: 'Phân vai 5 người', content: `# TEAM — 5 NGƯỜI\n\n| Vai | Phụ trách | KPI chính |\n|-----|----------|----------|\n| 👑 Leader | Chiến lược, offer, data, gate | P&L dương |\n| 📢 Ads | FB Ads, Shopee Ads | CPA < 25K, ROAS > 3 |\n| 🎬 Media | Quay video, edit, TikTok | 5-7 video/ngày |\n| 💬 Sàn | Chốt inbox, CSKH, review | Chốt > 20% |\n| 📦 Fulfillment | Kho, đóng gói, giao | Giao thành > 85% |` },
      'daily-standup': { title: 'Daily Standup', content: `# DAILY STANDUP — 15 phút mỗi sáng\n\n## Thời gian: 8:30, mỗi ngày\n\n## Format: Mỗi người 2-3 phút:\n\n1. HÔM QUA làm được gì?\n2. HÔM NAY sẽ làm gì?\n3. ĐANG KẸT ở đâu?\n\n## Leader bổ sung:\n- Số tổng hôm qua (đơn, CPA, DT)\n- Có cảnh báo gì không?\n- Action hôm nay ưu tiên gì?` },
      'weekly-review': { title: 'Weekly Review', content: `# WEEKLY REVIEW — Thứ 7, 9:00-10:00\n\n## Agenda 60 phút:\n\n### 00-15 phút: SỐ LIỆU TUẦN\n- Tổng đơn, DT, chi phí, P&L\n- So với tuần trước\n\n### 15-30 phút: CONTENT THẮNG/THUA\n- Top 3 video thắng → TẠI SAO?\n- Top 3 video thua → TẠI SAO?\n\n### 30-40 phút: KHÁCH CHÊ GÌ, KHEN GÌ\n- Cập nhật script\n\n### 40-50 phút: GHI WAR STORY\n\n### 50-60 phút: CẬP NHẬT BIBLE\n- Module nào cần sửa?\n- Kế hoạch tuần sau` }
    }
  }
};

// AI Prompts
export const AI_PROMPTS = [
  { module: '01-RESEARCH', name: 'Daily Scan — Quét thị trường mỗi sáng', prompt: 'Bạn là market intelligence analyst cho shop thời trang nam VN.\n\nHãy phân tích thị trường hôm nay:\n\n1. SHOPEE: Search "quần jean nam" → top 5 kết quả\n2. TIKTOK: Search "jean nam" → top 5 video\n3. FACEBOOK: Search "quần jean nam" trong Marketplace\n\nOUTPUT:\n📊 Trend: [lên/xuống/ổn]\n🔥 Cơ hội: [gì có thể khai thác]\n⚠️ Đối thủ: [ai đang mạnh]\n📌 Action: [1-2 việc nên làm]' },
  { module: '01-RESEARCH', name: 'Deep Dive — Phân tích sâu đối thủ', prompt: 'Phân tích sâu đối thủ [TÊN SHOP]:\n\n1. SẢN PHẨM: Bao nhiêu mẫu? Best seller?\n2. CONTENT: Hook gì? Tần suất?\n3. OFFER: Giảm giá? Combo?\n4. REVIEW: Khen/chê gì?\n5. ĐIỂM YẾU: Mình đánh đâu?\n\nKết luận: 3 action cụ thể.' },
  { module: '03-OFFER', name: 'Offer Generator — Viết 5 offer', prompt: 'SẢN PHẨM: [tên]\nGIÁ NHẬP: [X]K\nGIÁ BÁN: [X]K\nKÊNH: [FB/Shopee/TikTok]\n\nĐề xuất 5 offer:\n1. Giảm giá\n2. Combo\n3. Quà tặng\n4. Flash sale\n5. Bundle\n\nMỗi offer: Headline + Chi tiết + Biên + Khi nào dùng' },
  { module: '04-CONTENT', name: 'Viết 10 Hook 3 giây', prompt: 'Viết 10 hook video 3 giây:\nSP: [jean nam suông 199K]\nTarget: Nam 22-35\nPlatform: [TikTok/FB Reels]\nYêu cầu: Gây tò mò, dừng scroll' },
  { module: '04-CONTENT', name: 'Script Video 30s', prompt: 'Kịch bản video 30s:\nSP: [jean nam suông đen 199K]\nAngle: [try-on/review/so sánh]\nHook: [hook đã chọn]\n\n[0-3s] HOOK\n[3-10s] VẤN ĐỀ\n[10-20s] GIẢI PHÁP\n[20-27s] BẰNG CHỨNG\n[27-30s] CTA' },
  { module: '04-CONTENT', name: 'Viết Caption FB + TikTok', prompt: 'Viết 3 caption cho video bán [jean nam 199K]:\n- Caption 1: Ngắn (2 dòng) cho TikTok\n- Caption 2: Trung (5 dòng) cho Facebook\n- Caption 3: Dài (storytelling)\nCó hashtag, tone thân thiện, CTA rõ.' },
  { module: '06-SALES', name: 'Xử lý 8 Objection', prompt: 'Script xử lý 8 objection:\n1. "Đắt quá"\n2. "Để suy nghĩ"\n3. "Sợ không vừa"\n4. "Freeship không?"\n5. "Hàng TQ à?"\n6. "Shop mới, sợ lừa"\n7. "Bên kia rẻ hơn"\n8. "Giao lâu không?"' },
  { module: '06-SALES', name: 'Script Upsell/Cross-sell', prompt: 'Script upsell/cross-sell:\n1. Upsell: 1→2 cái (combo)\n2. Cross-sell: Jean→Áo\n3. Cross-sell: Jean→Thắt lưng\n4. Repeat: Khách cũ mua lại' },
  { module: '08-DATA', name: 'Báo cáo ngày', prompt: 'Data hôm nay:\nFB: Spend [X]K, Inbox [X], Đơn [X], CPA [X]K\nShopee: Đơn [X], DT [X]K\nTikTok: Views [X], Đơn [X]\nFulfillment: Giao [X], Thành [X], Boom [X]\n\nYêu cầu:\n1. Tốt/xấu?\n2. Chỉ số XANH/ĐỎ?\n3. Top 3 việc ngày mai\n4. Cảnh báo?' },
  { module: '08-DATA', name: 'Phân tích SKU', prompt: 'Phân tích SKU:\n| SKU | Mẫu | Giá | Đơn tuần | DT | Hoàn |\n\nYêu cầu:\n1. Xếp hạng theo LỢI NHUẬN\n2. SCALE/GIỮ/TEST/BỎ\n3. Size chạy nhất?\n4. Nhập thêm gì, bỏ gì?' },
];

// KPI Benchmarks
export const KPI_BENCHMARKS = {
  cpa: { good: 25, ok: 40, unit: 'K', lowerBetter: true },
  roas: { good: 3.5, ok: 2.0, unit: 'x', lowerBetter: false },
  close_rate: { good: 25, ok: 15, unit: '%', lowerBetter: false },
  boom_rate: { good: 12, ok: 20, unit: '%', lowerBetter: true },
  return_rate: { good: 8, ok: 15, unit: '%', lowerBetter: true },
  delivery_rate: { good: 90, ok: 80, unit: '%', lowerBetter: false },
};

// Decision Gates
export const DECISION_GATES = [
  { id: 1, name: 'Gate 1 — Cuối tuần 2', day: 14, checks: '≥5 đơn/ngày, CPA < 35K' },
  { id: 2, name: 'Gate 2 — Cuối tháng 1', day: 30, checks: '≥15 đơn/ngày, CPA < 30K, Biên > 25%' },
  { id: 3, name: 'Gate 3 — Cuối tháng 2', day: 60, checks: '≥30 đơn/ngày, P&L gần hòa' },
  { id: 4, name: 'Gate 4 — Cuối tháng 3', day: 90, checks: 'P&L dương, trend tăng' },
];

// Default daily tasks by role
export const DEFAULT_TASKS: Record<string, { text: string; time: string }[]> = {
  leader: [
    { text: 'Chạy AI daily scan (01-RESEARCH)', time: 'morning' },
    { text: 'Họp standup 8:30', time: 'morning' },
    { text: 'Review data hôm qua', time: 'morning' },
    { text: 'Nhập số liệu cuối ngày', time: 'evening' },
  ],
  ads: [
    { text: 'Check CPA + ROAS các campaign', time: 'morning' },
    { text: 'Cắt ad set CPA > 40K', time: 'morning' },
    { text: 'Test 1-2 creative mới', time: 'afternoon' },
    { text: 'Báo cáo ads cho Leader', time: 'evening' },
  ],
  media: [
    { text: 'Quay 5-7 video mới', time: 'morning' },
    { text: 'Edit + đăng 3-5 video TikTok', time: 'afternoon' },
    { text: 'Đăng video FB Reels (19h, 21h)', time: 'evening' },
  ],
  san: [
    { text: 'Trả lời inbox FB + Shopee', time: 'morning' },
    { text: 'Chốt đơn + confirm COD', time: 'afternoon' },
    { text: 'Xin review khách đã nhận hàng', time: 'afternoon' },
    { text: 'Báo cáo số chốt cho Leader', time: 'evening' },
  ],
  fulfillment: [
    { text: 'Đóng gói đơn hàng', time: 'morning' },
    { text: 'Bàn giao shipper', time: 'morning' },
    { text: 'Check tracking đơn giao thất bại', time: 'afternoon' },
    { text: 'Cập nhật tồn kho', time: 'evening' },
  ],
};

// Role metadata
export const ROLES: Record<string, { name: string; color: string; icon: string }> = {
  leader: { name: 'Leader', color: '#a78bfa', icon: '👑' },
  ads: { name: 'Ads', color: '#60a5fa', icon: '📢' },
  media: { name: 'Media', color: '#f472b6', icon: '🎬' },
  san: { name: 'Sàn', color: '#34d399', icon: '💬' },
  fulfillment: { name: 'Fulfillment', color: '#fb923c', icon: '📦' },
};

// Content status pipeline
export const CONTENT_STATUSES = [
  { key: 'idea', label: '💡 Ý tưởng', color: '#a78bfa' },
  { key: 'scripted', label: '📝 Script', color: '#60a5fa' },
  { key: 'filmed', label: '🎬 Quay', color: '#fbbf24' },
  { key: 'edited', label: '✂️ Edit', color: '#fb923c' },
  { key: 'posted', label: '✅ Đã đăng', color: '#34d399' },
];
