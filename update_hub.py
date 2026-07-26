"""
Script update index.html safely
"""
import io, sys

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Navbar
nav_old = '<a href="sap_s4hana_ebook/index.html"'
nav_new = '<a href="knowledge-graph/index.html" style="color:#e879f9;background:rgba(217,70,239,.15);border-color:rgba(217,70,239,.3);font-weight:800;"><i class="fa-solid fa-diagram-project" style="font-size:10px"></i> 13.🕸️ Knowledge Graph</a>\n          <a href="sap_s4hana_ebook/index.html"'

if 'knowledge-graph/index.html' not in content:
    content = content.replace(nav_old, nav_new, 1)

# Replace counters
content = content.replace('12/12 Phân Hệ', '13/13 Phân Hệ')
content = content.replace('12 Phân Hệ', '13 Phân Hệ')
content = content.replace('DANH SÁCH 12 PHÂN HỆ', 'DANH SÁCH 13 PHÂN HỆ')
content = content.replace('Hợp nhất 12 phân hệ', 'Hợp nhất 13 phân hệ')

# Add Module 13 card before </div></div> <!-- PIN SECURITY LOCK MODAL -->
card_code = '''
            <!-- Module 13: Knowledge Base Graph -->
            <div class="glass-card p-6 rounded-3xl shadow-xl hover:border-fuchsia-500/60 transition group flex flex-col justify-between border-l-4 border-fuchsia-500 glow-indigo">
                <div class="space-y-4">
                    <div class="flex justify-between items-start">
                        <span class="bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">🕸️ Interactive Graph View</span>
                        <i class="fa-solid fa-diagram-project text-slate-500 group-hover:text-fuchsia-400 transition text-2xl"></i>
                    </div>
                    <h4 class="text-lg font-bold text-white group-hover:text-fuchsia-300 transition font-heading">13. Knowledge Graph – Mạng Lưới Tri Thức Logistics</h4>
                    <p class="text-xs text-slate-300 leading-relaxed">Trực quan hóa mạng lưới liên kết giữa 13 Phân hệ, SAP T-Codes & Luồng Chuỗi cung ứng theo phong cách Obsidian Graph View 2D/3D tương tác.</p>
                    <div class="flex flex-wrap gap-1.5">
                        <span class="text-[10px] bg-slate-800 text-fuchsia-300 border border-fuchsia-800/40 px-2 py-0.5 rounded-full font-bold">🕸️ Node-Link Graph</span>
                        <span class="text-[10px] bg-slate-800 text-sky-300 border border-sky-800/40 px-2 py-0.5 rounded-full font-bold">🔍 Lọc T-Code & Flow</span>
                        <span class="text-[10px] bg-slate-800 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-full font-bold">⚡ Tương Tác 2D</span>
                    </div>
                </div>
                <div class="pt-6 border-t border-slate-800/80 mt-6 flex justify-between items-center">
                    <span class="text-[11px] text-fuchsia-400 font-bold"><i class="fa-solid fa-star text-fuchsia-400 mr-1"></i> Mới Ra Mắt</span>
                    <a href="knowledge-graph/index.html" class="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-fuchsia-600/20">
                        Mở Graph View <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </a>
                </div>
            </div>
'''

if '13. Knowledge Graph' not in content:
    target_str = '<!-- PIN SECURITY LOCK MODAL -->'
    content = content.replace(target_str, card_code + '\n    ' + target_str)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html successfully!")
