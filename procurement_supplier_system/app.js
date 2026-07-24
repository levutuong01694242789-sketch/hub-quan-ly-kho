// Procurement Supplier Intelligence & Price Comparison Logic
// Focuses strictly on 2 Domains: Agri/Flours (254 items) & Additives/Chemicals (114 items)

document.addEventListener('DOMContentLoaded', () => {
    // State variables
    let currentDomain = 'AGRI'; // 'AGRI' vs 'CHEM'
    let allItemsList = [];
    let currentSupplierData = null;

    // DOM Elements - Theme & Tabs
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const themeBtnText = document.getElementById('theme-btn-text');
    const tabBtnAgri = document.getElementById('tab-btn-agri');
    const tabBtnChem = document.getElementById('tab-btn-chem');

    // DOM Elements - Search & Filters
    const txtSearch = document.getElementById('txt-search-procurement');
    const selCert = document.getElementById('sel-cert');
    const selCredit = document.getElementById('sel-credit');
    const displayFilterCount = document.getElementById('display-filter-count');
    const procurementGrid = document.getElementById('procurement-grid');

    // DOM Elements - Modal
    const modalOverlay = document.getElementById('supplier-detail-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    // --------------------------------------------------------------------------
    // 1. THEME SWITCHER
    // --------------------------------------------------------------------------
    const savedTheme = localStorage.getItem('procurement_theme') || 'dark';
    setTheme(savedTheme);

    btnThemeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('procurement_theme', theme);
        
        if (theme === 'dark') {
            themeBtnText.textContent = 'Giao Diện Tối';
            btnThemeToggle.querySelector('i').className = 'fa-solid fa-moon';
        } else {
            themeBtnText.textContent = 'Giao Diện Sáng';
            btnThemeToggle.querySelector('i').className = 'fa-solid fa-sun';
        }
    }

    // --------------------------------------------------------------------------
    // 2. LOAD DATA
    // --------------------------------------------------------------------------
    if (window.DEFAULT_SUPPLIER_DATA) {
        currentSupplierData = window.DEFAULT_SUPPLIER_DATA;
        initProcurementDashboard(currentSupplierData);
    } else {
        fetch('supplier_data.json')
            .then(res => res.json())
            .then(data => {
                currentSupplierData = data;
                initProcurementDashboard(data);
            })
            .catch(err => console.log('Chưa nạp được supplier_data.json:', err));
    }

    function initProcurementDashboard(data) {
        if (!data || !data.items) return;
        allItemsList = Object.values(data.items);

        // Update counts
        const agriItems = allItemsList.filter(x => x.domain_code === 'AGRI');
        const chemItems = allItemsList.filter(x => x.domain_code === 'CHEM');
        
        document.getElementById('count-agri').textContent = agriItems.length;
        document.getElementById('count-chem').textContent = chemItems.length;

        applyProcurementFilters();
    }

    // --------------------------------------------------------------------------
    // 3. DOMAIN TAB SWITCHER (AGRI VS CHEM)
    // --------------------------------------------------------------------------
    tabBtnAgri.addEventListener('click', () => {
        currentDomain = 'AGRI';
        tabBtnAgri.classList.add('active');
        tabBtnChem.classList.remove('active');
        applyProcurementFilters();
    });

    tabBtnChem.addEventListener('click', () => {
        currentDomain = 'CHEM';
        tabBtnChem.classList.add('active');
        tabBtnAgri.classList.remove('active');
        applyProcurementFilters();
    });

    // --------------------------------------------------------------------------
    // 4. RENDER PROCUREMENT COMPARISON GRID
    // --------------------------------------------------------------------------
    function applyProcurementFilters() {
        if (!allItemsList || allItemsList.length === 0) return;

        const searchTerm = txtSearch.value.trim().toLowerCase();
        const certVal = selCert.value;
        const creditVal = selCredit.value;

        const filtered = allItemsList.filter(item => {
            if (item.domain_code !== currentDomain) return false;

            if (certVal !== 'ALL') {
                const hasCert = item.suppliers.some(s => s.certs && s.certs.some(c => c.includes(certVal)));
                if (!hasCert) return false;
            }

            if (creditVal === 'CREDIT') {
                const hasCredit = item.suppliers.some(s => s.payment_terms.includes('Công nợ'));
                if (!hasCredit) return false;
            } else if (creditVal === 'CASH') {
                const hasCash = item.suppliers.some(s => s.payment_terms.includes('Thanh toán ngay'));
                if (!hasCash) return false;
            }

            if (searchTerm) {
                const matchCode = item.item_code.toLowerCase().includes(searchTerm);
                const matchName = item.item_name.toLowerCase().includes(searchTerm);
                const matchSup = item.suppliers.some(s => 
                    s.company_name.toLowerCase().includes(searchTerm) ||
                    s.city.toLowerCase().includes(searchTerm) ||
                    s.mst.includes(searchTerm)
                );
                return matchCode || matchName || matchSup;
            }

            return true;
        });

        const domainTitle = currentDomain === 'AGRI' ? '🌾 Mảng Nguyên Liệu Nông Sản & Bột' : '🧪 Mảng Phụ Gia & Hóa Chất Thực Phẩm';
        displayFilterCount.textContent = `Đang hiển thị ${filtered.length.toLocaleString()} mặt hàng thuộc ${domainTitle}`;

        renderItemsGrid(filtered);
    }

    function renderItemsGrid(itemsArray) {
        procurementGrid.innerHTML = '';

        if (!itemsArray || itemsArray.length === 0) {
            procurementGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted); font-size: 15px;"><i class="fa-solid fa-triangle-exclamation"></i> Không tìm thấy mặt hàng hoặc Nhà cung cấp nào phù hợp với tìm kiếm.</div>';
            return;
        }

        itemsArray.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-procurement-card';

            let supsRows = '';
            item.suppliers.forEach(s => {
                const isBestClass = s.is_best_price ? 'best' : '';
                const bestBadge = s.is_best_price ? '<span class="badge-best-price"><i class="fa-solid fa-tag"></i> Giá Rẻ Nhất</span>' : '';
                
                supsRows += `
                    <tr>
                        <td style="font-weight: 700; color: var(--accent-blue);">${s.company_name} ${bestBadge}</td>
                        <td class="price-val ${isBestClass}">${s.unit_price.toLocaleString()} VND/${item.unit}</td>
                        <td style="font-size: 11px; color: var(--text-secondary);">${s.payment_terms}</td>
                        <td>
                            <button class="btn-view-sup" data-sup-id="${s.supplier_id}">
                                <i class="fa-solid fa-eye"></i> Liên Hệ
                            </button>
                        </td>
                    </tr>
                `;
            });

            card.innerHTML = `
                <div class="item-header">
                    <div>
                        <span class="item-code-badge">${item.item_code}</span>
                        <div class="item-title">${item.item_name}</div>
                    </div>
                    <div style="text-align: right;">
                        <span class="domain-tag">${item.domain_name}</span>
                        <div style="font-size: 11px; color: var(--text-muted); font-weight: 600;">ĐVT: ${item.unit}</div>
                    </div>
                </div>

                <div style="background: rgba(0,0,0,0.15); padding: 10px 14px; border-radius: 8px; font-size: 12px; display: flex; justify-content: space-between;">
                    <span><i class="fa-solid fa-trophy text-amber"></i> NCC Giá Tốt Nhất: <strong>${item.best_supplier_name}</strong></span>
                    <span style="font-weight: 800; color: var(--accent-green);">${item.best_price.toLocaleString()} VND/${item.unit}</span>
                </div>

                <div style="overflow-x: auto;">
                    <table class="suppliers-comp-table">
                        <thead>
                            <tr>
                                <th>Nhà Cung Cấp VN</th>
                                <th>Báo Giá (${item.unit})</th>
                                <th>Điều Khoản</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${supsRows}
                        </tbody>
                    </table>
                </div>
            `;

            // Attach modal click listeners
            card.querySelectorAll('.btn-view-sup').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const supId = e.currentTarget.getAttribute('data-sup-id');
                    const supObj = item.suppliers.find(x => x.supplier_id === supId);
                    if (supObj) showSupplierDetailsModal(supObj, item);
                });
            });

            procurementGrid.appendChild(card);
        });
    }

    // --------------------------------------------------------------------------
    // 5. SUPPLIER DETAILS MODAL TOOLTIP
    // --------------------------------------------------------------------------
    function showSupplierDetailsModal(sup, item) {
        document.getElementById('modal-sup-name').textContent = sup.company_name;
        document.getElementById('modal-sup-mst').textContent = `Mã số thuế: ${sup.mst} | Xếp Hạng: ${sup.rank}`;
        document.getElementById('modal-sup-address').textContent = `${sup.address} (${sup.city})`;
        document.getElementById('modal-sup-phone').textContent = sup.phone;
        document.getElementById('modal-sup-sales').textContent = sup.sales_exec;
        document.getElementById('modal-sup-email').textContent = sup.email;
        document.getElementById('modal-sup-payment').textContent = sup.payment_terms;
        document.getElementById('modal-sup-packing').textContent = `${sup.packing} (Số lượng tối thiểu MOQ: ${sup.moq.toLocaleString()} ${item.unit})`;

        const certsContainer = document.getElementById('modal-sup-certs-container');
        certsContainer.innerHTML = '';
        sup.certs.forEach(c => {
            const span = document.createElement('span');
            span.style.cssText = 'background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid #22c55e; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;';
            span.innerHTML = `<i class="fa-solid fa-certificate"></i> ${c}`;
            certsContainer.appendChild(span);
        });

        document.getElementById('btn-call-sup').href = `tel:${sup.phone.split('-')[0].trim()}`;
        document.getElementById('btn-email-sup').href = `mailto:${sup.email}?subject=Yeu cau bao gia nguyen lieu ${item.item_name} (${item.item_code})`;

        modalOverlay.classList.add('active');
    }

    btnCloseModal.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    txtSearch.addEventListener('input', applyProcurementFilters);
    selCert.addEventListener('change', applyProcurementFilters);
    selCredit.addEventListener('change', applyProcurementFilters);
});
