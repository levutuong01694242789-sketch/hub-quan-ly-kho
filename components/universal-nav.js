/**
 * UNIVERSAL NAVBAR WEB COMPONENT - HUB QUẢN LÝ KHO (14 REPOS)
 * Scoped Shadow DOM to prevent any CSS collision from child repos!
 */
class UniversalNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const parts = location.pathname.split('/').filter(Boolean);
        const isRoot = parts.length <= 1 || (parts.length === 2 && parts[1].endsWith('.html'));
        const rel = isRoot ? '' : '../';

        const style = `
            <style>
                :host {
                    display: block !important;
                    position: sticky !important;
                    top: 0 !important;
                    z-index: 999999 !important;
                    width: 100% !important;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
                }
                .nav-root {
                    background: #020617 !important;
                    border-bottom: 1px solid #1e293b !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.6) !important;
                    height: 42px !important;
                    display: flex !important;
                    align-items: center !important;
                    position: relative !important;
                    box-sizing: border-box !important;
                }
                .nav-inner {
                    display: flex !important;
                    align-items: center !important;
                    width: 100% !important;
                    height: 100% !important;
                    position: relative !important;
                }
                .nav-track {
                    flex: 1 !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                    padding: 0 10px !important;
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                    scroll-behavior: smooth !important;
                    height: 100% !important;
                }
                .nav-track::-webkit-scrollbar { display: none !important; }
                .nav-fade-l, .nav-fade-r {
                    position: absolute !important;
                    top: 0 !important; bottom: 0 !important;
                    width: 36px !important;
                    pointer-events: none !important;
                    z-index: 2 !important;
                    transition: opacity .2s !important;
                }
                .nav-fade-l { left: 32px !important; background: linear-gradient(to right, #020617 0%, transparent 100%) !important; }
                .nav-fade-r { right: 32px !important; background: linear-gradient(to left, #020617 0%, transparent 100%) !important; }
                .nav-arr {
                    flex-shrink: 0 !important;
                    width: 32px !important;
                    height: 42px !important;
                    background: #020617 !important;
                    border: none !important;
                    color: #64748b !important;
                    font-size: 18px !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: color .15s !important;
                    z-index: 3 !important;
                    padding: 0 !important;
                }
                .nav-arr:hover { color: #f8fafc !important; }
                .nav-arr:disabled { opacity: .2 !important; cursor: default !important; }
                .nav-div {
                    width: 1px !important;
                    height: 18px !important;
                    background: #334155 !important;
                    flex-shrink: 0 !important;
                    margin: 0 2px !important;
                }
                .nav-label {
                    flex-shrink: 0 !important;
                    font-size: 10px !important;
                    font-weight: 800 !important;
                    text-transform: uppercase !important;
                    letter-spacing: .08em !important;
                    color: #475569 !important;
                    white-space: nowrap !important;
                    padding-right: 4px !important;
                }
                .nav-pill {
                    flex-shrink: 0 !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 5px !important;
                    padding: 4px 10px !important;
                    border-radius: 8px !important;
                    border: 1px solid transparent !important;
                    font-size: 11px !important;
                    font-weight: 600 !important;
                    text-decoration: none !important;
                    white-space: nowrap !important;
                    height: 26px !important;
                    box-sizing: border-box !important;
                    transition: all .15s ease !important;
                    line-height: 1 !important;
                }
                .nav-pill:hover {
                    transform: translateY(-1px) !important;
                    filter: brightness(1.2) !important;
                }
                .nav-pill.active {
                    outline: 2px solid currentColor !important;
                    outline-offset: -1px !important;
                    font-weight: 900 !important;
                    box-shadow: 0 0 12px currentColor !important;
                }
            </style>
        `;

        const template = `
            ${style}
            <nav class="nav-root">
              <div class="nav-inner">
                <button class="nav-arr" id="nav-l" title="Trước">&#8249;</button>
                <div class="nav-fade-l" id="nav-fl"></div>
                <div class="nav-track" id="nav-track">
                  <span class="nav-label">Chuyển:</span>
                  <a href="${rel}index.html" class="nav-pill" style="color:#38bdf8;background:rgba(56,189,248,.15);border-color:rgba(56,189,248,.3);">🏠 Hub</a>
                  <a href="https://github.com/levutuong01694242789-sketch/hub-quan-ly-kho#readme" target="_blank" class="nav-pill" style="color:#34d399;background:rgba(52,211,153,.12);border-color:rgba(52,211,153,.25);">📖 Master</a>
                  <div class="nav-div"></div>
                  <a href="${rel}enterprise-qr-asset-manager/index.html" class="nav-pill" style="color:#93c5fd;background:rgba(59,130,246,.15);">1.🏢 Tài Sản QR</a>
                  <a href="${rel}he_thong_hop_nhat_fifo_sap/index.html" class="nav-pill" style="color:#c4b5fd;background:rgba(139,92,246,.12);">2.🌟 Hợp Nhất</a>
                  <a href="${rel}procurement_supplier_system/index.html" class="nav-pill" style="color:#5eead4;background:rgba(20,184,166,.12);">3.🛒 Thu Mua</a>
                  <a href="${rel}wms_vdt_sap4hana/index.html" class="nav-pill" style="color:#7dd3fc;background:rgba(14,165,233,.12);">4.🏢 Kho 2D SAP</a>
                  <a href="${rel}mo_app_tru_kho.html" class="nav-pill" style="color:#a5b4fc;background:rgba(99,102,241,.12);">5.📊 Trữ Kho PO</a>
                  <a href="${rel}it_asset.html" class="nav-pill" style="color:#d8b4fe;background:rgba(168,85,247,.12);">6.💻 IT Asset</a>
                  <a href="${rel}quan_ly_kho_fifo/index.html" class="nav-pill" style="color:#fcd34d;background:rgba(245,158,11,.12);">7.📦 Engine FIFO</a>
                  <a href="${rel}warehouse_financial_system/index.html" class="nav-pill" style="color:#6ee7b7;background:rgba(16,185,129,.12);">8.💰 Tài Chính</a>
                  <a href="${rel}kiem_ke_kho.html" class="nav-pill" style="color:#fca5a5;background:rgba(239,68,68,.12);">9.📋 Kiểm Kê Kho</a>
                  <a href="${rel}visual-bin-location-manager/index.html" class="nav-pill" style="color:#67e8f9;background:rgba(6,182,212,.15);">10.📷 Vị Trí Ảnh</a>
                  <a href="${rel}factory-photo-guide/index.html" class="nav-pill" style="color:#fdba74;background:rgba(234,88,12,.12);">11.🏭 Factory Guide</a>
                  <a href="${rel}sap_s4hana_ebook/index.html" class="nav-pill" style="color:#fde68a;background:rgba(234,179,8,.15);">12.📘 SAP E-Book</a>
                  <a href="${rel}knowledge-graph/index.html" class="nav-pill" style="color:#e879f9;background:rgba(217,70,239,.15);">13.🕸️ Knowledge Graph</a>
                  <a href="${rel}mobile-meeting-notetaker/index.html" class="nav-pill" style="color:#34d399;background:rgba(16,185,129,.15);">14.📱 Mobile Notetaker</a>
                  <a href="${rel}so_do_kho_4_tang.html" class="nav-pill" style="color:#22d3ee;background:rgba(6,182,212,.2);border-color:rgba(6,182,212,.4);">15.📐 Sơ Đồ Kho 2D AutoCAD</a>
                </div>
                <div class="nav-fade-r" id="nav-fr"></div>
                <button class="nav-arr" id="nav-r" title="Sau">&#8250;</button>
              </div>
            </nav>
        `;

        this.shadowRoot.innerHTML = template;

        // Add Scroll & Highlight Logic
        const track = this.shadowRoot.getElementById('nav-track');
        const btnL = this.shadowRoot.getElementById('nav-l');
        const btnR = this.shadowRoot.getElementById('nav-r');
        const fadeL = this.shadowRoot.getElementById('nav-fl');
        const fadeR = this.shadowRoot.getElementById('nav-fr');

        const updateFade = () => {
            if (!track) return;
            const atStart = track.scrollLeft < 8;
            const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
            fadeL.style.opacity = atStart ? '0' : '1';
            fadeR.style.opacity = atEnd ? '0' : '1';
            btnL.disabled = atStart;
            btnR.disabled = atEnd;
        };

        btnL.addEventListener('click', () => { track.scrollBy({ left: -200, behavior: 'smooth' }); });
        btnR.addEventListener('click', () => { track.scrollBy({ left: 200, behavior: 'smooth' }); });
        track.addEventListener('scroll', updateFade);

        // Highlight Active Link
        const curPath = location.pathname.split('/').pop() || 'index.html';
        this.shadowRoot.querySelectorAll('.nav-pill').forEach(a => {
            const href = a.getAttribute('href').split('/').pop();
            if (href === curPath || (curPath === '' && href === 'index.html')) {
                a.classList.add('active');
            }
        });

        setTimeout(updateFade, 100);
    }
}

customElements.define('universal-nav', UniversalNav);
