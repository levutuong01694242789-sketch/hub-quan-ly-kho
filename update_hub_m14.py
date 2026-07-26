import io, os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Navbar in Hub index
nav_target = '<a href="knowledge-graph/index.html"'
nav_replacement = '<a href="mobile-meeting-notetaker/index.html" style="color:#34d399;background:rgba(16,185,129,.15);border-color:rgba(16,185,129,.3);font-weight:800;"><i class="fa-solid fa-mobile-screen-button" style="font-size:10px"></i> 14.📱 Notetaker Mobile</a>\n          <a href="knowledge-graph/index.html"'

if 'mobile-meeting-notetaker/index.html' not in content:
    content = content.replace(nav_target, nav_replacement, 1)

content = content.replace('13/13 Phân Hệ', '14/14 Phân Hệ')
content = content.replace('13 Phân Hệ', '14 Phân Hệ')
content = content.replace('DANH SÁCH 13 PHÂN HỆ', 'DANH SÁCH 14 PHÂN HỆ')
content = content.replace('Hợp nhất 13 phân hệ', 'Hợp nhất 14 phân hệ')

card_code = '''
            <!-- Module 14: Mobile Meeting Notetaker -->
            <div class="glass-card p-6 rounded-3xl shadow-xl hover:border-emerald-500/60 transition group flex flex-col justify-between border-l-4 border-emerald-500 glow-teal">
                <div class="space-y-4">
                    <div class="flex justify-between items-start">
                        <span class="bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">📱 Mobile Notetaker</span>
                        <i class="fa-solid fa-mobile-screen-button text-slate-500 group-hover:text-emerald-400 transition text-2xl"></i>
                    </div>
                    <h4 class="text-lg font-bold text-white group-hover:text-emerald-300 transition font-heading">14. Sổ Tay Ghi Chú & Ảnh Cuộc Họp / Quy Trình</h4>
                    <p class="text-xs text-slate-300 leading-relaxed">Tối ưu 100% cho Điện thoại: Chụp ảnh slide trực tiếp, ghi chú T-Code SAP, gắn nhãn phân loại & lưu trữ offline 1-Click.</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span class="text-[10px] bg-slate-800 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded-full font-bold">📷 Chụp Ảnh Trực Tiếp</span>
                        <span class="text-[10px] bg-slate-800 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-full font-bold">🏷️ Smart Tags & T-Code</span>
                        <span class="text-[10px] bg-slate-800 text-sky-300 border border-sky-800/40 px-2 py-0.5 rounded-full font-bold">💾 Offline 100% + JSON Backup</span>
                    </div>
                </div>
                <div class="pt-6 border-t border-slate-800/80 mt-6 flex justify-between items-center">
                    <span class="text-[11px] text-emerald-400 font-bold"><i class="fa-solid fa-star text-emerald-400 mr-1"></i> Mới Ra Mắt</span>
                    <a href="mobile-meeting-notetaker/index.html" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20">
                        Mở App Notetaker <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </a>
                </div>
            </div>
'''

if '14. Sổ Tay Ghi Chú' not in content:
    target_str = '<!-- PIN SECURITY LOCK MODAL -->'
    content = content.replace(target_str, card_code + '\n    ' + target_str)

with open('index.html', 'w', encoding='utf-8-sig') as f:
    f.write(content)

print("Updated Hub index.html for Module 14!")
