/**
 * Enterprise Fixed Asset & Label Printer QR Manager - Main App Controller
 * Light Minimalist Theme, Bulk Excel Upload (11,000+ items), System Reset & Label Printer Studio.
 */

let currentPage = 1;
const pageSize = 50;
let currentFilteredAssets = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] Initializing Enterprise Fixed Asset & Label Printer QR Manager...');

  // 1. Populate Department Filter Options
  populateDepartmentOptions();

  // 2. Render Initial Asset Directory
  renderAssetsDirectory();
  updateKPIs();

  // 3. Setup Navigation Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      e.currentTarget.classList.add('active');
      const targetId = e.currentTarget.getAttribute('data-target');
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');

      if (targetId === 'pane-scan') {
        EnterpriseQRScanner.startScanner('camera-viewport', handleScanResult);
      } else {
        EnterpriseQRScanner.stopScanner();
      }

      if (targetId === 'pane-printer') {
        renderPrinterStudio();
      }
    });
  });

  // Filter & Search Listeners
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', () => { currentPage = 1; renderAssetsDirectory(); });

  const deptSelect = document.getElementById('filter-dept');
  if (deptSelect) deptSelect.addEventListener('change', () => { currentPage = 1; renderAssetsDirectory(); });

  const statusSelect = document.getElementById('filter-status');
  if (statusSelect) statusSelect.addEventListener('change', () => { currentPage = 1; renderAssetsDirectory(); });

  const labelSizeSelect = document.getElementById('printer-size-select');
  if (labelSizeSelect) labelSizeSelect.addEventListener('change', () => renderPrinterStudio());

  // Action Buttons
  const btnAddAsset = document.getElementById('btn-add-asset');
  if (btnAddAsset) btnAddAsset.addEventListener('click', openAddAssetModal);

  const btnExportCSV = document.getElementById('btn-export-csv');
  if (btnExportCSV) btnExportCSV.addEventListener('click', () => EnterpriseStorage.exportCSV());

  const btnDownloadTemplate = document.getElementById('btn-download-template');
  if (btnDownloadTemplate) btnDownloadTemplate.addEventListener('click', () => EnterpriseStorage.downloadExcelTemplate());

  const btnLoad1000 = document.getElementById('btn-load-1000');
  if (btnLoad1000) btnLoad1000.addEventListener('click', handleLoad1000Sample);

  const btnWipeData = document.getElementById('btn-wipe-data');
  if (btnWipeData) btnWipeData.addEventListener('click', handleWipeData);

  const btnTriggerImport = document.getElementById('btn-trigger-import');
  if (btnTriggerImport) btnTriggerImport.addEventListener('click', () => document.getElementById('file-excel-input').click());

  const excelInput = document.getElementById('file-excel-input');
  if (excelInput) excelInput.addEventListener('change', handleExcelUpload);

  const btnPrintNow = document.getElementById('btn-trigger-print');
  if (btnPrintNow) btnPrintNow.addEventListener('click', () => window.print());

  // Pagination buttons
  document.getElementById('btn-prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderAssetsDirectory(); }
  });
  document.getElementById('btn-next-page')?.addEventListener('click', () => {
    const totalPages = Math.ceil(currentFilteredAssets.length / pageSize) || 1;
    if (currentPage < totalPages) { currentPage++; renderAssetsDirectory(); }
  });
});

function populateDepartmentOptions() {
  const depts = EnterpriseStorage.getDepts();
  const selects = [document.getElementById('filter-dept'), document.getElementById('new-asset-dept')];

  selects.forEach(sel => {
    if (!sel) return;
    const isFilter = sel.id === 'filter-dept';
    sel.innerHTML = isFilter ? '<option value="ALL">Tất cả phòng ban / Nhà máy</option>' : '';
    depts.forEach(d => {
      sel.innerHTML += `<option value="${d.id}">${d.name}</option>`;
    });
  });
}

function updateKPIs() {
  const assets = EnterpriseStorage.getAssets();

  const totalAssetsEl = document.getElementById('kpi-total-assets');
  if (totalAssetsEl) totalAssetsEl.textContent = assets.length.toLocaleString();

  const totalValuationEl = document.getElementById('kpi-total-valuation');
  if (totalValuationEl) {
    const totalVnd = assets.reduce((sum, a) => sum + (a.costVnd || 0), 0);
    totalValuationEl.textContent = `${(totalVnd / 1000000000).toFixed(2)} Tỷ đ`;
  }

  const spareCountEl = document.getElementById('kpi-spare-count');
  if (spareCountEl) {
    spareCountEl.textContent = assets.filter(a => a.status === 'SPARE').length;
  }

  const repairCountEl = document.getElementById('kpi-repair-count');
  if (repairCountEl) {
    repairCountEl.textContent = assets.filter(a => a.status === 'REPAIR').length;
  }
}

function renderAssetsDirectory() {
  const container = document.getElementById('assets-table-body');
  if (!container) return;

  const query = document.getElementById('search-input')?.value || '';
  const deptFilter = document.getElementById('filter-dept')?.value || 'ALL';
  const statusFilter = document.getElementById('filter-status')?.value || 'ALL';

  currentFilteredAssets = EnterpriseStorage.searchAssets(query, deptFilter, statusFilter);
  const totalItems = currentFilteredAssets.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * pageSize;
  const pageAssets = currentFilteredAssets.slice(startIdx, startIdx + pageSize);

  const depts = EnterpriseStorage.getDepts();

  // Update Pagination Info
  document.getElementById('page-info').textContent = `Trang ${currentPage} / ${totalPages} (Tổng ${totalItems.toLocaleString()} tài sản)`;

  if (pageAssets.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2.5rem; color: #64748b;">Chưa có tài sản nào trong hệ thống. Bấm "+ Nạp Excel Hàng Loạt" hoặc "⚡ Nạp Mẫu 1.000 Mã" để bắt đầu!</td></tr>`;
    return;
  }

  container.innerHTML = pageAssets.map((a, idx) => {
    const dept = depts.find(d => d.id === a.deptId);
    const deptName = dept ? dept.name : 'N/A';

    let statusBadge = '<span class="badge badge-active">🟢 Đang Sử Dụng</span>';
    if (a.status === 'SPARE') statusBadge = '<span class="badge badge-spare">🔵 Dự Phòng</span>';
    if (a.status === 'LOANED') statusBadge = `<span class="badge badge-loaned">🟡 Cho Mượn (${a.loanedTo || 'Luân chuyển'})</span>`;
    if (a.status === 'REPAIR') statusBadge = '<span class="badge badge-repair">🔴 Bảo Trì / Sửa</span>';
    if (a.status === 'DISPOSED') statusBadge = '<span class="badge badge-disposed">⚪ Đã Thanh Lý</span>';

    return `
      <tr style="border-bottom: 1px solid #f1f5f9; cursor: pointer;" onclick="openAssetDetailModal('${a.id}')">
        <td style="padding: 0.85rem 1rem; font-weight: 800; color: #2563eb;">${a.id}</td>
        <td style="padding: 0.85rem 1rem;">
          <div style="font-weight: 700; color: #0f172a;">${a.name}</div>
          <div style="font-size: 0.75rem; color: #64748b;">Model/Size: ${a.brandModel || 'N/A'} | S/N: ${a.serialNo || 'N/A'}</div>
        </td>
        <td style="padding: 0.85rem 1rem; font-size: 0.85rem; color: #334155;">${deptName}<br><small style="color: #64748b;">${a.location}</small></td>
        <td style="padding: 0.85rem 1rem; font-size: 0.85rem; font-weight: 600;">${a.custodian || 'Chưa gán'}</td>
        <td style="padding: 0.85rem 1rem;">${statusBadge}</td>
        <td style="padding: 0.85rem 1rem; font-weight: 700; color: #0f172a; text-align: right;">${a.costVnd ? a.costVnd.toLocaleString() + ' đ' : '0 đ'}</td>
        <td style="padding: 0.85rem 1rem; text-align: center;">
          <button class="btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="event.stopPropagation(); printSingleAssetLabel('${a.id}')">🖨️ Tem QR</button>
        </td>
      </tr>
    `;
  }).join('');

  updateKPIs();
}

function handleLoad1000Sample() {
  const count = EnterpriseStorage.generate1000SampleAssets();
  currentPage = 1;
  renderAssetsDirectory();
  updateKPIs();
  alert(`✓ Đã nạp thành công 1.000 tài sản mẫu vào hệ thống! Bạn có thể thử tìm kiếm, lọc phòng ban, phân trang hoặc in tem nhãn.`);
}

function handleExcelUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

      if (!jsonData || jsonData.length === 0) {
        alert('File Excel rỗng hoặc không đúng định dạng!');
        return;
      }

      const importedCount = EnterpriseStorage.bulkImportAssets(jsonData);
      currentPage = 1;
      renderAssetsDirectory();
      updateKPIs();
      alert(`✓ Đã nạp thành công ${importedCount.toLocaleString()} tài sản từ file Excel vào hệ thống!`);
    } catch (err) {
      console.error('[ExcelImport] Error parsing file:', err);
      alert('Không thể đọc file Excel. Vui lòng tải File Excel Mẫu để kiểm tra cấu hình cột!');
    }
  };
  reader.readAsArrayBuffer(file);
}

function handleWipeData() {
  const confirmPin = prompt('⚠️ BẢO MẬT HỆ THỐNG: Bạn đang thực hiện XÓA TRẮNG TOÀN BỘ DỮ LIỆU TÀI SẢN để giao cho công ty/người dùng mới.\n\nNhập chữ "CONFIRM" hoặc nhập PIN 8888 để xác nhận xóa trắng:');
  if (confirmPin === 'CONFIRM' || confirmPin === '8888' || confirmPin === '1234') {
    EnterpriseStorage.clearAllData();
    currentPage = 1;
    renderAssetsDirectory();
    updateKPIs();
    alert('✓ Đã XÓA TRẮNG toàn bộ dữ liệu thành công! Hệ thống sẵn sàng nạp dữ liệu cho công ty mới.');
  } else {
    alert('Hủy thao tác xóa trắng dữ liệu.');
  }
}

function renderPrinterStudio() {
  const sizeSelect = document.getElementById('printer-size-select');
  const labelSize = sizeSelect ? sizeSelect.value : '50x30';
  
  // Render current page assets for optimal printing performance
  const assetsToPrint = currentFilteredAssets.slice(0, 100); 

  EnterpriseQRPrinter.renderLabelSheet('print-area-preview', assetsToPrint, labelSize);
}

function printSingleAssetLabel(assetId) {
  const asset = EnterpriseStorage.getAssetById(assetId);
  if (!asset) return;

  const sizeSelect = document.getElementById('printer-size-select');
  const labelSize = sizeSelect ? sizeSelect.value : '50x30';

  EnterpriseQRPrinter.renderLabelSheet('print-area-preview', [asset], labelSize);
  
  // Switch to print tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  
  const printTabBtn = document.querySelector('[data-target="pane-printer"]');
  if (printTabBtn) printTabBtn.classList.add('active');
  const printPane = document.getElementById('pane-printer');
  if (printPane) printPane.classList.add('active');
}

function handleScanResult(scannedText) {
  const asset = EnterpriseStorage.getAssetById(scannedText);
  if (asset) {
    openAssetDetailModal(asset.id);
  } else {
    alert(`[Xác minh QR] Không tìm thấy mã tài sản "${scannedText}" trong hệ thống.`);
  }
}

function openAssetDetailModal(assetId) {
  const asset = EnterpriseStorage.getAssetById(assetId);
  if (!asset) return;

  const modal = document.getElementById('asset-detail-modal');
  const content = document.getElementById('asset-detail-content');
  if (!modal || !content) return;

  const dept = EnterpriseStorage.getDeptById(asset.deptId);

  content.innerHTML = `
    <div style="text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
      <div style="font-size: 0.75rem; font-weight: 800; color: #2563eb; text-transform: uppercase;">MÃ TÀI SẢN: ${asset.id}</div>
      <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-top: 0.25rem;">${asset.name}</h3>
      <p style="font-size: 0.85rem; color: #64748b;">${asset.category} • Model: ${asset.brandModel || 'N/A'}</p>
      
      <div id="modal-qr-canvas" style="margin: 1rem auto; width: 140px; height: 140px; background: #fff; padding: 10px; border: 1px solid #cbd5e1; border-radius: 12px; display: flex; align-items: center; justify-content: center;"></div>
      <p style="font-size: 0.75rem; color: #64748b;">Quét mã này để kiểm kê & cập nhật lịch sử bảo trì</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem; margin-bottom: 1.25rem;">
      <div><span style="color: #64748b;">Phòng Ban/Kho:</span> <strong>${dept ? dept.name : 'N/A'}</strong></div>
      <div><span style="color: #64748b;">Vị Trí Cụ Thể:</span> <strong>${asset.location}</strong></div>
      <div><span style="color: #64748b;">Người Quản Lý:</span> <strong>${asset.custodian || 'Chưa gán'}</strong></div>
      <div><span style="color: #64748b;">Số Serial/Mã Lô:</span> <strong>${asset.serialNo || 'N/A'}</strong></div>
      <div><span style="color: #64748b;">Nguyên Giá:</span> <strong style="color: #059669;">${asset.costVnd ? asset.costVnd.toLocaleString() + ' đ' : '0 đ'}</strong></div>
      <div><span style="color: #64748b;">Ngày Mua:</span> <strong>${asset.purchaseDate || 'N/A'}</strong></div>
    </div>

    <div style="background: #f8fafc; padding: 1rem; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 1.25rem;">
      <h4 style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">📝 Ghi Chú & Nhật Ký Bảo Trì:</h4>
      <p style="font-size: 0.8rem; color: #334155;">${asset.note || 'Chưa có nhật ký bảo trì nào.'}</p>
    </div>

    <div style="display: flex; gap: 0.75rem;">
      <button class="btn-primary" style="flex: 1;" onclick="printSingleAssetLabel('${asset.id}'); closeModal('asset-detail-modal');">🖨️ In Tem QR Nhãn Nhiệt</button>
      <button class="btn-secondary" style="background: #fee2e2; color: #b91c1c; border-color: #fca5a5;" onclick="deleteAssetHandler('${asset.id}')">🗑️ Xóa Tài Sản</button>
    </div>
  `;

  modal.classList.add('active');

  setTimeout(() => {
    EnterpriseQRPrinter.generateQRCode('modal-qr-canvas', asset.id, 120);
  }, 50);
}

function openAddAssetModal() {
  const name = prompt('Nhập Tên Tài Sản / Pallet / Thiết Bị (Ví dụ: Pallet Nhựa Đen 1200x1000mm):');
  if (!name) return;

  const serial = prompt('Nhập Số Serial / Mã Lô (Ví dụ: BATCH-2026-01):') || '';
  const cost = parseInt(prompt('Nhập Nguyên Giá (VNĐ):') || '0');

  const newAsset = {
    id: `AST-${Math.floor(10000 + Math.random() * 90000)}`,
    deptId: 'DEPT-WAREHOUSE',
    name: name,
    category: 'Vật Tư / Thiết Bị',
    brandModel: 'Mới tạo',
    serialNo: serial,
    location: 'Kho Tổng',
    custodian: 'Cán bộ kho',
    status: 'ACTIVE',
    costVnd: cost,
    purchaseDate: new Date().toISOString().split('T')[0],
    note: 'Tài sản tạo thủ công'
  };

  EnterpriseStorage.saveAsset(newAsset);
  renderAssetsDirectory();
  alert(`✓ Đã thêm Tài sản mới (${newAsset.id}) thành công!`);
}

function deleteAssetHandler(assetId) {
  if (confirm(`Bạn có chắc chắn muốn xóa tài sản "${assetId}" khỏi hệ thống?`)) {
    EnterpriseStorage.deleteAsset(assetId);
    closeModal('asset-detail-modal');
    renderAssetsDirectory();
    alert('✓ Đã xóa tài sản thành công!');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
