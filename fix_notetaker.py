import os

with open('mobile-meeting-notetaker/index.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Add script tag in head if missing
if 'universal-nav.js' not in html:
    html = html.replace('</head>', '    <script src="../components/universal-nav.js"></script>\n</head>', 1)

# Add universal-nav after body if missing
if '<universal-nav></universal-nav>' not in html:
    html = html.replace('<body>', '<body>\n    <universal-nav></universal-nav>', 1)

# Ensure header has prominent Create Note button
if 'openNoteModal()' not in html.split('<header')[1].split('</header>')[0]:
    target = '<div class="flex items-center gap-2 w-full sm:w-auto">'
    replacement = '''<div class="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <button onclick="openNoteModal()" class="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30">
                    <i class="fa-solid fa-plus text-sm"></i> Tạo Ghi Chú Mới
                </button>'''
    html = html.replace(target, replacement)

with open('mobile-meeting-notetaker/index.html', 'w', encoding='utf-8-sig') as f:
    f.write(html)

print("Updated Mobile Notetaker cleanly!")
