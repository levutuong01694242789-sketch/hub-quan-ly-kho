// Procurement Supplier Intelligence & Price Comparison Logic
// Supports Web Drag & Drop Excel Upload & Browser Parsing via SheetJS

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

    // DOM Elements - Supplier Modal
    const modalOverlay = document.getElementById('supplier-detail-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    // DOM Elements - Upload Modal
    const btnOpenUploadModal = document.getElementById('btn-open-upload-modal');
    const uploadModalOverlay = document.getElementById('excel-upload-modal');
    const btnCloseUploadModal = document.getElementById('btn-close-upload-modal');
    const dragDropArea = document.getElementById('drag-drop-area');
    const fileExcelInput = document.getElementById('file-excel-input');

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
        const timeBadge = currentSupplierData && currentSupplierData.timestamp ? ` (Cập nhật Live: ${currentSupplierData.timestamp})` : '';
        displayFilterCount.textContent = `Đang hiển thị ${filtered.length.toLocaleString()} mặt hàng thuộc ${domainTitle}${timeBadge}`;

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
                const userBadge = s.is_user_added ? '<span style="background: rgba(168,85,247,0.2); color: #c084fc; border: 1px solid #c084fc; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 800; margin-left: 4px;">Mới Nạp</span>' : '';
                
                supsRows += `
                    <tr>
                        <td style="font-weight: 700; color: var(--accent-blue);">${s.company_name} ${bestBadge} ${userBadge}</td>
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

            // Trend Badge Styling
            let trendColor = '#64748b';
            if (item.trend_code === 'DOWN') trendColor = '#22c55e';
            else if (item.trend_code === 'UP') trendColor = '#ef4444';

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

                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.15); padding: 10px 14px; border-radius: 8px; font-size: 12px;">
                    <div>
                        <i class="fa-solid fa-trophy text-amber"></i> NCC Giá Tốt Nhất: <strong>${item.best_supplier_name}</strong>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-weight: 800; color: var(--accent-green); font-size: 14px;">${item.best_price.toLocaleString()} VND/${item.unit}</span>
                        <div style="font-size: 10px; font-weight: 700; color: ${trendColor};">${item.trend_label}</div>
                    </div>
                </div>

                <div style="overflow-x: auto;">
                    <table class="suppliers-comp-table">
                        <thead>
                            <tr>
                                <th>Nhà Cung Cấp VN (${item.suppliers_count})</th>
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

    // --------------------------------------------------------------------------
    // 6. WEB DRAG & DROP EXCEL UPLOAD PARSING (SHEETJS)
    // --------------------------------------------------------------------------
    btnOpenUploadModal.addEventListener('click', () => uploadModalOverlay.classList.add('active'));
    btnCloseUploadModal.addEventListener('click', () => uploadModalOverlay.classList.remove('active'));
    uploadModalOverlay.addEventListener('click', (e) => {
        if (e.target === uploadModalOverlay) uploadModalOverlay.classList.remove('active');
    });

    dragDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropArea.style.borderColor = '#22c55e';
    });

    dragDropArea.addEventListener('dragleave', () => {
        dragDropArea.style.borderColor = '#0284c7';
    });

    dragDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropArea.style.borderColor = '#0284c7';
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUploadedExcelFile(e.dataTransfer.files[0]);
        }
    });

    fileExcelInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUploadedExcelFile(e.target.files[0]);
        }
    });

    function handleUploadedExcelFile(file) {
        if (!typeof XLSX !== 'undefined') {
            alert('Đang tải thư viện xử lý Excel SheetJS, vui lòng thử lại sau 2 giây...');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonRows = XLSX.utils.sheet_to_json(worksheet);

                if (!jsonRows || jsonRows.length === 0) {
                    alert('❌ File Excel không chứa dữ liệu!');
                    return;
                }

                let updatedCount = 0;
                jsonRows.forEach((row, idx) => {
                    const mCode = String(row['Mã Hàng'] || row['MÃ HÀNG'] || row['Mã Vật Tư'] || '').trim();
                    const cName = String(row['Tên Công Ty NCC Mới'] || row['Tên NCC'] || row['Nhà Cung Cấp'] || '').trim();
                    const priceVal = parseFloat(row['Báo Giá Mới (VND)'] || row['Báo Giá'] || row['Đơn Giá'] || 0);

                    if (mCode && cName && priceVal > 0) {
                        const targetItem = allItemsList.find(x => x.item_code === mCode);
                        if (targetItem) {
                            updatedCount++;
                            const newSupRec = {
                                supplier_id: `SUP-WEB-${Date.now()}-${idx}`,
                                company_name: cName,
                                mst: String(row['Mã Số Thuế'] || 'N/A'),
                                address: 'Cập nhật từ Web Upload',
                                city: 'TP. Hồ Chí Minh',
                                region: 'Miền Nam',
                                phone: String(row['SĐT Hotline'] || row['SĐT'] || 'N/A'),
                                sales_exec: 'Kinh Doanh Báo Giá',
                                email: String(row['Email Lien He'] || row['Email'] || 'N/A'),
                                website: 'https://supplier.vn',
                                certs: ['ISO 22000', 'HACCP'],
                                payment_terms: String(row['Điều Khoản Công Nợ'] || row['Điều Khoản'] || 'Công nợ 30 ngày'),
                                packing: String(row['Quy Cách Đóng Gói'] || row['Quy Cách'] || 'Bao 25kg'),
                                moq: parseInt(row['Số Lượng Tối Thiểu MOQ'] || row['MOQ'] || 100),
                                rank: 'Hạng A (Web Upload Báo Giá Mới)',
                                unit_price: priceVal,
                                is_best_price: false,
                                is_user_added: true
                            };

                            targetItem.suppliers.push(newSupRec);

                            // Recalculate best price
                            let minP = floatMax();
                            let minSupName = '';
                            targetItem.suppliers.forEach(s => {
                                s.is_best_price = false;
                                if (s.unit_price < minP) {
                                    minP = s.unit_price;
                                    minSupName = s.company_name;
                                }
                            });
                            targetItem.best_price = minP;
                            targetItem.best_supplier_name = minSupName;
                            targetItem.suppliers_count = targetItem.suppliers.length;
                            targetItem.suppliers.forEach(s => {
                                if (s.unit_price === minP) s.is_best_price = true;
                            });
                        }
                    }
                });

                function floatMax() { return 9999999999; }

                uploadModalOverlay.classList.remove('active');
                if (currentSupplierData) {
                    currentSupplierData.timestamp = new Date().toLocaleString('vi-VN');
                }
                applyProcurementFilters();

                alert(`🎉 ĐÃ NẠP THÀNH CÔNG ${updatedCount} BÁO GIÁ MỚI VÀO WEB APP! Bảng so sánh giá đã được tự động cập nhật.`);

            } catch (err) {
                alert('❌ Lỗi đọc file Excel: ' + err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    txtSearch.addEventListener('input', applyProcurementFilters);
    selCert.addEventListener('change', applyProcurementFilters);
    selCredit.addEventListener('change', applyProcurementFilters);
});
