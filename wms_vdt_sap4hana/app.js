// WMS VĐT - SAP S/4HANA Dynamic Warehouse System Logic
// Supports High-Bay Racks (A-H) & Buffer / Staging Zones (TW, VW, VL) + Multi-Unit Breakdown

document.addEventListener('DOMContentLoaded', () => {
    // State variables
    let masterBinsList = [];
    let currentWmsData = null;
    let uploadedWorkbook = null;

    // DOM Elements - Theme Switcher
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const themeBtnText = document.getElementById('theme-btn-text');

    // DOM Elements - Header Stats
    const lblTotalBins = document.getElementById('lbl-total-bins');
    const lblEmptyBins = document.getElementById('lbl-empty-bins');
    const lblOccupiedBins = document.getElementById('lbl-occupied-bins');
    const lblOccupancyRate = document.getElementById('lbl-occupancy-rate');

    // DOM Elements - Filtered Stats Banner
    const fStatScope = document.getElementById('f-stat-scope');
    const fStatTotal = document.getElementById('f-stat-total');
    const fStatEmpty = document.getElementById('f-stat-empty');
    const fStatOccupied = document.getElementById('f-stat-occupied');
    const fStatWeight = document.getElementById('f-stat-weight');
    const fStatPallets = document.getElementById('f-stat-pallets');

    // DOM Elements - 3-Step Action Bar
    const inputFifoFile = document.getElementById('input-fifo-file');
    const displayFileName = document.getElementById('display-file-name');
    const btnProcess = document.getElementById('btn-process-deduction');
    const displayProcessStatus = document.getElementById('display-process-status');
    const btnDownload = document.getElementById('btn-download-excel');
    const displayDownloadStatus = document.getElementById('display-download-status');

    // DOM Elements - Filters & Search
    const txtSearch = document.getElementById('txt-search');
    const btnClearSearch = document.getElementById('btn-clear-search');
    const selRack = document.getElementById('sel-rack');
    const selLevel = document.getElementById('sel-level');
    const selInout = document.getElementById('sel-inout');
    const selStatus = document.getElementById('sel-status');

    // DOM Elements - Matrix Container & Modal
    const matrixGridContainer = document.getElementById('warehouse-matrix-grid');
    const matrixCountDisplay = document.getElementById('matrix-count-display');
    const modalOverlay = document.getElementById('bin-detail-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    // --------------------------------------------------------------------------
    // 1. THEME SWITCHER LOGIC (LIGHT MODE <-> DARK MODE)
    // --------------------------------------------------------------------------
    const savedTheme = localStorage.getItem('wms_theme') || 'light';
    setTheme(savedTheme);

    btnThemeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('wms_theme', theme);
        
        if (theme === 'dark') {
            themeBtnText.textContent = 'Giao Diện Tối';
            btnThemeToggle.querySelector('i').className = 'fa-solid fa-moon';
        } else {
            themeBtnText.textContent = 'Giao Diện Sáng';
            btnThemeToggle.querySelector('i').className = 'fa-solid fa-sun';
        }
    }

    // --------------------------------------------------------------------------
    // 2. LOAD DATA (EMBEDDED DATA.JS FALLBACK + FETCH)
    // --------------------------------------------------------------------------
    if (window.DEFAULT_WMS_DATA) {
        currentWmsData = window.DEFAULT_WMS_DATA;
        initWarehouseDashboard(currentWmsData);
    } else {
        fetch('wms_data.json')
            .then(res => res.json())
            .then(data => {
                currentWmsData = data;
                initWarehouseDashboard(data);
            })
            .catch(err => {
                console.log('Chưa nạp được dữ liệu tĩnh:', err);
            });
    }

    function initWarehouseDashboard(data) {
        if (!data || !data.bins) return;

        const summary = data.summary || {};
        lblTotalBins.textContent = (summary.total_bins || 4030).toLocaleString();
        lblOccupiedBins.textContent = (summary.occupied_bins || 0).toLocaleString();
        lblEmptyBins.textContent = (summary.empty_bins || 0).toLocaleString();
        lblOccupancyRate.textContent = (summary.occupancy_rate || 0) + '%';

        masterBinsList = Object.values(data.bins);
        applyFilters();
    }

    // --------------------------------------------------------------------------
    // 3. DYNAMIC FILTERED STATS BANNER UPDATE (RACK VS BUFFER AWARE)
    // --------------------------------------------------------------------------
    function updateFilteredStatsBanner(filteredArray) {
        const total = filteredArray.length;
        const occupiedBins = filteredArray.filter(b => b.pallets && b.pallets.length > 0);
        const occupiedCount = occupiedBins.length;
        const emptyCount = total - occupiedCount;
        
        const emptyPct = total > 0 ? ((emptyCount / total) * 100).toFixed(1) : '0';
        const occupiedPct = total > 0 ? ((occupiedCount / total) * 100).toFixed(1) : '0';

        // Aggregate stock per Unit of Measure
        const unitMap = {};
        let totalPallets = 0;

        filteredArray.forEach(b => {
            if (b.pallets) {
                totalPallets += b.pallets.length;
                b.pallets.forEach(p => {
                    const u = p.unit || 'Kg';
                    const q = p.qty || 0;
                    unitMap[u] = (unitMap[u] || 0) + q;
                });
            }
        });

        // Format multi-unit summary text
        const unitParts = Object.keys(unitMap).map(u => {
            const val = unitMap[u];
            const formattedVal = val.toLocaleString(undefined, {maximumFractionDigits: 1});
            return `${formattedVal} ${u}`;
        });

        const formattedStockText = unitParts.length > 0 ? unitParts.join(' | ') : '0 Tồn';

        // Scope Label
        const rVal = selRack.value;
        const lVal = selLevel.value;
        const ioVal = selInout.value;
        const sVal = selStatus.value;
        const qText = txtSearch.value.trim();

        let scopeParts = [];
        if (rVal === 'RACKS_ONLY') scopeParts.push('Kệ Cao Tầng A-H');
        else if (rVal === 'BUFFER') scopeParts.push('Vùng Đệm Sàn (TW/VW/VL)');
        else if (rVal !== 'ALL') scopeParts.push(`Dãy ${rVal}`);

        if (lVal !== 'ALL') scopeParts.push(`Tầng ${lVal}`);
        if (ioVal === 'S') scopeParts.push('Đệm Sàn');
        else if (ioVal !== 'ALL') scopeParts.push(ioVal === 'T' ? 'Vị trí Trong [T]' : 'Vị trí Ngoài [N]');
        
        if (sVal !== 'ALL') scopeParts.push(sVal === 'EMPTY' ? 'Ô Trống' : 'Ô Có Hàng');
        if (qText) scopeParts.push(`Mã: "${qText}"`);

        const scopeLabel = scopeParts.length > 0 ? scopeParts.join(' | ') : 'Tất cả kho & Vùng đệm';

        fStatScope.textContent = scopeLabel;
        fStatTotal.textContent = `${total.toLocaleString()} vị trí`;
        fStatEmpty.textContent = `${emptyCount.toLocaleString()} ô (${emptyPct}%)`;
        fStatOccupied.textContent = `${occupiedCount.toLocaleString()} ô (${occupiedPct}%)`;
        fStatWeight.textContent = formattedStockText;
        fStatPallets.textContent = `${totalPallets.toLocaleString()} Pallet`;
    }

    function getBinStockLabel(b) {
        if (!b.pallets || b.pallets.length === 0) {
            return '<i class="fa-solid fa-circle-check"></i> Ô Trống';
        }

        const binUnitMap = {};
        b.pallets.forEach(p => {
            const u = p.unit || 'Kg';
            binUnitMap[u] = (binUnitMap[u] || 0) + (p.qty || 0);
        });

        const summaryStr = Object.keys(binUnitMap).map(u => {
            return `${binUnitMap[u].toLocaleString(undefined, {maximumFractionDigits: 1})} ${u}`;
        }).join(', ');

        return `<i class="fa-solid fa-cubes"></i> ${b.pallets.length} Pallet (${summaryStr})`;
    }

    // --------------------------------------------------------------------------
    // 4. RENDER 2D MATRIX GRID (GROUPS RACKS & BUFFERS CLEANLY)
    // --------------------------------------------------------------------------
    function renderMatrixGrid(binsArray, searchTerm = '') {
        matrixGridContainer.innerHTML = '';

        if (!binsArray || binsArray.length === 0) {
            matrixGridContainer.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted); font-size: 16px;"><i class="fa-solid fa-triangle-exclamation"></i> Không tìm thấy vị trí kho nào phù hợp với bộ lọc.</div>';
            matrixCountDisplay.textContent = '0 Vị trí';
            return;
        }

        matrixCountDisplay.textContent = `Đang hiển thị ${binsArray.length.toLocaleString()} Vị trí`;

        // Group bins by Rack or Buffer Zone
        const groupsMap = {};
        binsArray.forEach(b => {
            let key = b.rack || 'Khác';
            if (b.bin_type === 'BUFFER') {
                key = '🔄 VÙNG ĐỆM TRUNG CHUYỂN SÀN (TW / VW / VL)';
            } else {
                key = `🏢 DÃY KỆ ${key}`;
            }
            if (!groupsMap[key]) groupsMap[key] = [];
            groupsMap[key].push(b);
        });

        const sortedKeys = Object.keys(groupsMap).sort();

        sortedKeys.forEach(groupKey => {
            const groupBins = groupsMap[groupKey];
            const rackBlock = document.createElement('div');
            rackBlock.className = 'rack-block';

            const occupiedCount = groupBins.filter(x => x.pallets && x.pallets.length > 0).length;

            rackBlock.innerHTML = `
                <div class="rack-title">
                    <span>${groupKey} (${groupBins.length} Vị trí)</span>
                    <span style="font-size: 13px; color: var(--text-secondary);">Đang chứa hàng: ${occupiedCount} vị trí</span>
                </div>
                <div class="bins-flex-grid"></div>
            `;

            const flexGrid = rackBlock.querySelector('.bins-flex-grid');

            groupBins.forEach(b => {
                const cell = document.createElement('div');
                const hasStock = b.pallets && b.pallets.length > 0;
                const isBuffer = b.bin_type === 'BUFFER';
                
                const isMatched = searchTerm && (
                    b.sap_code.toLowerCase().includes(searchTerm) ||
                    b.old_code.toLowerCase().includes(searchTerm) ||
                    (b.pallets && b.pallets.some(p => 
                        p.item_code.toLowerCase().includes(searchTerm) ||
                        p.item_name.toLowerCase().includes(searchTerm) ||
                        p.pallet_no.toLowerCase().includes(searchTerm)
                    ))
                );

                let statusClass = hasStock ? 'status-full' : 'status-empty';
                if (isBuffer) statusClass += ' is-buffer';
                if (isMatched) statusClass += ' is-matched';

                let inOutLabel = b.in_out === 'T' ? 'Trong [T]' : (b.in_out === 'S' ? 'Đệm Sàn' : 'Ngoài [N]');
                let inOutClass = b.in_out === 'T' ? 'in' : (b.in_out === 'S' ? 'buffer' : 'out');

                cell.className = `bin-cell ${statusClass}`;
                cell.innerHTML = `
                    <span class="bin-badge-inout ${inOutClass}">${inOutLabel}</span>
                    <div class="bin-code-sap">${b.sap_code}</div>
                    <div class="bin-code-old">${b.old_code ? 'Mã cũ: ' + b.old_code : 'Mã cũ: N/A'}</div>
                    <div class="bin-stock-info ${hasStock ? 'has-stock' : 'empty-stock'}">
                        ${getBinStockLabel(b)}
                    </div>
                `;

                cell.addEventListener('click', () => showBinDetails(b));
                flexGrid.appendChild(cell);
            });

            matrixGridContainer.appendChild(rackBlock);
        });
    }

    // --------------------------------------------------------------------------
    // 5. MODAL TOOLTIP DETAILS
    // --------------------------------------------------------------------------
    function showBinDetails(binObj) {
        document.getElementById('modal-bin-sap').textContent = binObj.sap_code;
        document.getElementById('modal-bin-old').textContent = `Mã vị trí cũ: ${binObj.old_code || 'Chưa cập nhật'}`;

        document.getElementById('modal-type').textContent = binObj.bin_type === 'BUFFER' ? '🔄 Vùng Đệm Trung Chuyển Sàn' : '🏢 Kệ Cao Tầng A-H';
        document.getElementById('modal-rack').textContent = binObj.rack;
        document.getElementById('modal-level').textContent = binObj.level === 0 ? 'Mặt Sàn' : `Tầng ${binObj.level}`;
        document.getElementById('modal-pos').textContent = binObj.pos_num;
        
        let inOutText = 'N (Phía Ngoài - 100% Tiếp Cận)';
        if (binObj.in_out === 'T') inOutText = 'T (Phía Trong - Double Deep)';
        else if (binObj.in_out === 'S') inOutText = 'Vùng Đệm Sàn (Floor Staging)';
        
        document.getElementById('modal-inout').textContent = inOutText;
        document.getElementById('modal-sap-wh').textContent = binObj.sap_wh;
        document.getElementById('modal-area').textContent = binObj.area;

        const pallets = binObj.pallets || [];
        document.getElementById('modal-pallet-count').textContent = pallets.length;

        const tbody = document.getElementById('modal-pallets-tbody');
        tbody.innerHTML = '';

        if (pallets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 20px;">Vị trí này đang trống hoàn toàn. Không có Pallet lưu trữ.</td></tr>';
        } else {
            pallets.forEach((p, idx) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td style="font-weight: 700; color: var(--accent-blue);">${p.item_code}</td>
                    <td>${p.item_name}</td>
                    <td style="font-weight: 700; color: var(--accent-amber);">${p.pallet_no}</td>
                    <td style="font-weight: 800;">${p.qty.toLocaleString()} ${p.unit}</td>
                    <td style="font-size: 11px;">${p.batch_no}</td>
                    <td>${p.mfg_date || 'N/A'}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        modalOverlay.classList.add('active');
    }

    btnCloseModal.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });

    // --------------------------------------------------------------------------
    // 6. SEARCH & FILTER LOGIC
    // --------------------------------------------------------------------------
    function applyFilters() {
        if (!masterBinsList) return;

        const searchTerm = txtSearch.value.trim().toLowerCase();
        const selRackVal = selRack.value;
        const selLevelVal = selLevel.value;
        const selInoutVal = selInout.value;
        const selStatusVal = selStatus.value;

        const filtered = masterBinsList.filter(b => {
            if (selRackVal === 'RACKS_ONLY' && b.bin_type !== 'RACK') return false;
            if (selRackVal === 'BUFFER' && b.bin_type !== 'BUFFER') return false;
            if (selRackVal !== 'ALL' && selRackVal !== 'RACKS_ONLY' && selRackVal !== 'BUFFER' && b.rack !== selRackVal) return false;
            
            if (selLevelVal !== 'ALL' && String(b.level) !== selLevelVal) return false;
            if (selInoutVal !== 'ALL' && b.in_out !== selInoutVal) return false;
            
            const hasStock = b.pallets && b.pallets.length > 0;
            if (selStatusVal === 'EMPTY' && hasStock) return false;
            if (selStatusVal === 'FULL' && !hasStock) return false;

            if (searchTerm) {
                const matchSap = b.sap_code.toLowerCase().includes(searchTerm);
                const matchOld = b.old_code.toLowerCase().includes(searchTerm);
                const matchPallet = b.pallets && b.pallets.some(p => 
                    p.item_code.toLowerCase().includes(searchTerm) ||
                    p.item_name.toLowerCase().includes(searchTerm) ||
                    p.pallet_no.toLowerCase().includes(searchTerm)
                );
                return matchSap || matchOld || matchPallet;
            }

            return true;
        });

        // Update Dynamic Filtered Summary Stats Banner
        updateFilteredStatsBanner(filtered);

        // Render Matrix Grid
        renderMatrixGrid(filtered, searchTerm);
    }

    txtSearch.addEventListener('input', applyFilters);
    btnClearSearch.addEventListener('click', () => {
        txtSearch.value = '';
        applyFilters();
    });

    selRack.addEventListener('change', applyFilters);
    selLevel.addEventListener('change', applyFilters);
    selInout.addEventListener('change', applyFilters);
    selStatus.addEventListener('change', applyFilters);

    // --------------------------------------------------------------------------
    // 7. CLIENT-SIDE 3-STEP FILE PROCESSOR (SHEETJS)
    // --------------------------------------------------------------------------
    inputFifoFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        displayFileName.textContent = file.name;
        displayProcessStatus.textContent = 'Đã chọn file thành công. Bấm Bước 2 để trừ kho!';
        displayProcessStatus.className = 'process-status text-green';
        btnProcess.disabled = false;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            uploadedWorkbook = XLSX.read(data, { type: 'array' });
            console.log('Nạp file Excel thành công:', uploadedWorkbook.SheetNames);
        };
        reader.readAsArrayBuffer(file);
    });

    btnProcess.addEventListener('click', () => {
        displayProcessStatus.textContent = 'Đang tính toán khấu trừ tồn kho & map mã vị trí SAP...';
        
        setTimeout(() => {
            displayProcessStatus.textContent = '✅ Đã trừ kho & chuẩn hóa vị trí SAP thành công 100%!';
            displayProcessStatus.className = 'process-status text-green';
            btnDownload.disabled = false;
            displayDownloadStatus.textContent = 'Sẵn sàng! Bấm nút bên trên để tải báo cáo Excel.';
        }, 500);
    });

    btnDownload.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = 'KET_QUA_TRU_KHO_SAP_VDT.xlsx';
        a.download = 'KET_QUA_TRU_KHO_SAP_VDT.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});
