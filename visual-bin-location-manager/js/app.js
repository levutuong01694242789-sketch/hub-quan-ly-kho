/**
 * Visual Photo Bin Finder & Warehouse Location Manager - Main Application Controller
 * Permanent Data Safety, JSON Backup Export/Import & 3,000+ Photos Pagination.
 */

let currentCompressedPhoto = null;
let currentPage = 1;
const pageSize = 24;
let currentFilteredLocations = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('[VisualBinApp] Initializing Permanent Data Safe Location Manager...');

  // 1. Populate Cascading Dynamic Filters
  populateDynamicFilters();

  // 2. Initial Render Grid & KPIs
  renderLocationGrid();

  // 3. Tab Navigation Setup
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      e.currentTarget.classList.add('active');
      const targetId = e.currentTarget.getAttribute('data-target');
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');
    });
  });

  // Dynamic Filter Listeners
  document.getElementById('search-input')?.addEventListener('input', () => { currentPage = 1; renderLocationGrid(); });

  document.getElementById('filter-warehouse')?.addEventListener('change', () => {
    populateRackFilter();
    populateTierFilter();
    currentPage = 1;
    renderLocationGrid();
  });

  document.getElementById('filter-rack')?.addEventListener('change', () => {
    populateTierFilter();
    currentPage = 1;
    renderLocationGrid();
  });

  document.getElementById('filter-tier')?.addEventListener('change', () => { currentPage = 1; renderLocationGrid(); });
  document.getElementById('filter-staff')?.addEventListener('change', () => { currentPage = 1; renderLocationGrid(); });

  // Reset Filters Button
  document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-warehouse').value = 'ALL';
    populateRackFilter();
    populateTierFilter();
    document.getElementById('filter-staff').value = 'ALL';
    currentPage = 1;
    renderLocationGrid();
  });

  // Photo Input & Automatic Canvas Compression
  const photoInput = document.getElementById('new-photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const previewBox = document.getElementById('photo-preview-container');
      const previewImg = document.getElementById('photo-preview-img');
      const sizeTag = document.getElementById('photo-size-tag');

      try {
        if (previewBox) previewBox.classList.remove('hidden');
        if (sizeTag) sizeTag.textContent = `Đang nén ảnh (Gốc ${(file.size / (1024 * 1024)).toFixed(2)} MB)...`;

        const compressedBase64 = await VisualBinStorage.compressImage(file, 800, 0.75);
        currentCompressedPhoto = compressedBase64;

        if (previewImg) previewImg.src = compressedBase64;
        const compressedKb = (compressedBase64.length * 0.75 / 1024).toFixed(1);
        if (sizeTag) sizeTag.textContent = `✓ Nén ảnh thành công: ${compressedKb} KB (Lưu trữ an toàn vĩnh viễn!)`;
      } catch (err) {
        console.error('[ImageCompression] Error:', err);
        alert('Không thể nén ảnh. Vui lòng chọn ảnh khác!');
      }
    });
  }

  // Save Form Submit
  const formAdd = document.getElementById('form-add-location');
  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      saveNewLocation();
    });
  }

  // Action Buttons
  document.getElementById('btn-reset-form')?.addEventListener('click', resetAddForm);
  document.getElementById('btn-load-samples')?.addEventListener('click', handleLoad1000Samples);
  document.getElementById('btn-wipe-data')?.addEventListener('click', handleWipeData);

  // Backup Export & Import Action Listeners
  document.getElementById('btn-export-backup')?.addEventListener('click', () => {
    VisualBinStorage.exportBackupJSON();
    alert('✓ Đã xuất file Sao Lưu Vĩnh Viễn (.json) thành công! Hãy cất giữ file này trên Google Drive, USB hoặc Zalo để bảo vệ dữ liệu vĩnh viễn.');
  });

  document.getElementById('btn-trigger-import-backup')?.addEventListener('click', () => {
    document.getElementById('file-backup-input').click();
  });

  document.getElementById('file-backup-input')?.addEventListener('change', handleImportBackup);

  // Pagination Toolbar
  document.getElementById('btn-prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderLocationGrid(); }
  });

  document.getElementById('btn-next-page')?.addEventListener('click', () => {
    const totalPages = Math.ceil(currentFilteredLocations.length / pageSize) || 1;
    if (currentPage < totalPages) { currentPage++; renderLocationGrid(); }
  });
});

function populateDynamicFilters() {
  populateWarehouseFilter();
  populateRackFilter();
  populateTierFilter();
  populateStaffFilter();
}

function populateWarehouseFilter() {
  const select = document.getElementById('filter-warehouse');
  if (!select) return;
  const warehouses = VisualBinStorage.getUniqueWarehouses();
  select.innerHTML = '<option value="ALL">🏢 Tất cả Kho (Toàn Bộ)</option>';
  warehouses.forEach(wh => { select.innerHTML += `<option value="${wh}">${wh}</option>`; });
}

function populateRackFilter() {
  const select = document.getElementById('filter-rack');
  if (!select) return;
  const wh = document.getElementById('filter-warehouse')?.value || 'ALL';
  const racks = VisualBinStorage.getUniqueRacks(wh);
  select.innerHTML = '<option value="ALL">📦 Tất cả Dãy / Kệ</option>';
  racks.forEach(rk => { select.innerHTML += `<option value="${rk}">${rk}</option>`; });
}

function populateTierFilter() {
  const select = document.getElementById('filter-tier');
  if (!select) return;
  const wh = document.getElementById('filter-warehouse')?.value || 'ALL';
  const rk = document.getElementById('filter-rack')?.value || 'ALL';
  const tiers = VisualBinStorage.getUniqueTiers(wh, rk);
  select.innerHTML = '<option value="ALL">📍 Tất cả Tầng / Ô Vị Trí</option>';
  tiers.forEach(tr => { select.innerHTML += `<option value="${tr}">${tr}</option>`; });
}

function populateStaffFilter() {
  const select = document.getElementById('filter-staff');
  if (!select) return;
  const staffList = VisualBinStorage.getUniqueStaff();
  select.innerHTML = '<option value="ALL">👤 Tất cả Nhân Viên</option>';
  staffList.forEach(st => { select.innerHTML += `<option value="${st}">${st}</option>`; });
}

function updateKPIs() {
  const locations = VisualBinStorage.getLocations();
  
  const totalEl = document.getElementById('kpi-total-locations');
  if (totalEl) totalEl.textContent = locations.length.toLocaleString();

  const whSet = new Set(locations.map(l => l.warehouse));
  const totalWhEl = document.getElementById('kpi-total-warehouses');
  if (totalWhEl) totalWhEl.textContent = whSet.size.toLocaleString();

  const photosCount = locations.filter(l => l.photoBase64).length;
  const photosEl = document.getElementById('kpi-photos-count');
  if (photosEl) photosEl.textContent = photosCount.toLocaleString();
}

function renderLocationGrid() {
  const container = document.getElementById('location-grid-container');
  if (!container) return;

  const query = document.getElementById('search-input')?.value || '';
  const warehouse = document.getElementById('filter-warehouse')?.value || 'ALL';
  const rack = document.getElementById('filter-rack')?.value || 'ALL';
  const tier = document.getElementById('filter-tier')?.value || 'ALL';
  const staff = document.getElementById('filter-staff')?.value || 'ALL';

  currentFilteredLocations = VisualBinStorage.searchLocationsAdvanced({ query, warehouse, rack, tier, staff });
  updateKPIs();

  const totalItems = currentFilteredLocations.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * pageSize;
  const pageLocations = currentFilteredLocations.slice(startIdx, startIdx + pageSize);

  const pageInfoEl = document.getElementById('page-info');
  if (pageInfoEl) {
    pageInfoEl.textContent = `Trang ${currentPage} / ${totalPages} (Tổng ${totalItems.toLocaleString()} vị trí ảnh đã lưu vĩnh viễn)`;
  }

  if (pageLocations.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-500 glass-card">
        <div class="text-4xl mb-2">📷</div>
        <p class="font-extrabold text-slate-800 text-base">Chưa tìm thấy vị trí ảnh nào phù hợp với bộ lọc.</p>
        <p class="text-xs text-slate-500 mt-1">Bấm sang tab "📷 Chụp & Thêm Vị Trí" để ghi nhận hoặc bấm "Xóa Bộ Lọc"!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pageLocations.map(item => `
    <div class="photo-card flex flex-col justify-between">
      <div>
        <div class="relative cursor-pointer overflow-hidden group" onclick="openZoomPhotoModal('${item.id}')">
          <img src="${item.photoBase64}" alt="${item.skuName}" class="photo-container group-hover:scale-105 transition duration-300" />
          <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-black gap-1.5">
            <i class="fa-solid fa-magnifying-glass-plus text-base"></i> BẤM PHÓNG TO ÁNH KỆ
          </div>
          <span class="absolute top-3 right-3 bg-slate-950 text-amber-400 text-[11px] font-black px-3 py-1 rounded-full border border-amber-500 shadow-md">
            ${item.id}
          </span>
        </div>

        <div class="p-4 space-y-2.5">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="tag-badge tag-warehouse"><i class="fa-solid fa-warehouse text-[10px]"></i> ${item.warehouse}</span>
            <span class="tag-badge tag-rack"><i class="fa-solid fa-layer-group text-[10px]"></i> ${item.rack}</span>
          </div>

          <h3 class="font-black text-slate-900 text-sm leading-snug hover:text-blue-700 transition cursor-pointer" onclick="openZoomPhotoModal('${item.id}')">
            ${item.skuName}
          </h3>

          <div class="text-xs text-slate-800 space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div class="flex items-center gap-1.5 font-bold"><i class="fa-solid fa-location-dot text-rose-600"></i> <span>Vị Trí:</span> <span class="text-blue-700">${item.tier}</span></div>
            <div class="flex items-center gap-1.5 font-bold"><i class="fa-solid fa-boxes-stacked text-amber-600"></i> <span>Tồn Kho:</span> <span class="text-slate-900">${item.qtyNote || 'Chưa ghi chú'}</span></div>
            ${item.note ? `<div class="text-[11px] text-slate-700 font-semibold border-t border-slate-200 pt-1.5 mt-1">📝 ${item.note}</div>` : ''}
          </div>
        </div>
      </div>

      <div class="p-3 border-t border-slate-200 bg-slate-100 flex items-center justify-between text-[11px] text-slate-700 font-bold">
        <span>👤 ${item.staffName || 'Kho'} • ${item.updatedAt || ''}</span>
        <button onclick="deleteLocationHandler('${item.id}')" class="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-black px-2.5 py-1 rounded-lg transition">
          🗑️ Xóa
        </button>
      </div>
    </div>
  `).join('');
}

function saveNewLocation() {
  const warehouse = document.getElementById('new-warehouse')?.value || 'Kho Tổng';
  const rack = document.getElementById('new-rack')?.value || 'Dãy A';
  const tier = document.getElementById('new-tier')?.value || 'Tầng 1';
  const skuName = document.getElementById('new-sku-name')?.value || 'Mặt hàng bao bì mới';
  const qtyNote = document.getElementById('new-qty-note')?.value || '';
  const staffName = document.getElementById('new-staff-name')?.value || 'Cán bộ kho';
  const note = document.getElementById('new-note')?.value || '';

  if (!currentCompressedPhoto) {
    alert('Vui lòng chụp ảnh hoặc tải ảnh vị trí kho trước khi lưu!');
    return;
  }

  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const newItem = {
    id: `LOC-${Date.now().toString().slice(-4)}`,
    warehouse,
    rack,
    tier,
    skuName,
    qtyNote,
    staffName,
    updatedAt: dateStr,
    photoBase64: currentCompressedPhoto,
    note
  };

  VisualBinStorage.saveLocation(newItem);
  resetAddForm();
  populateDynamicFilters();
  currentPage = 1;
  renderLocationGrid();

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-target="pane-grid"]').classList.add('active');
  document.getElementById('pane-grid').classList.add('active');

  alert(`✓ Đã lưu vị trí ảnh cho "${skuName}" (${newItem.id}) an toàn vĩnh viễn!`);
}

function handleImportBackup(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const jsonData = JSON.parse(evt.target.result);
      const count = VisualBinStorage.importBackupJSON(jsonData);
      populateDynamicFilters();
      currentPage = 1;
      renderLocationGrid();
      alert(`✓ Đã phục hồi và hợp nhất thành công ${count.toLocaleString()} vị trí ảnh từ file Sao Lưu!`);
    } catch (err) {
      console.error('[ImportBackup] Error parsing JSON file:', err);
      alert('File sao lưu JSON không đúng định dạng!');
    }
  };
  reader.readAsText(file);
}

function resetAddForm() {
  document.getElementById('form-add-location')?.reset();
  currentCompressedPhoto = null;
  const previewBox = document.getElementById('photo-preview-container');
  if (previewBox) previewBox.classList.add('hidden');
}

function openZoomPhotoModal(id) {
  const item = VisualBinStorage.getLocationById(id);
  if (!item) return;

  const modal = document.getElementById('zoom-photo-modal');
  const content = document.getElementById('zoom-modal-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="text-center pb-3 border-b border-slate-200 mb-4">
      <span class="bg-blue-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-xs">MÃ Ô VỊ TRÍ: ${item.id}</span>
      <h3 class="text-xl font-black text-slate-900 mt-2">${item.skuName}</h3>
      <p class="text-xs font-bold text-blue-700 mt-0.5">${item.warehouse} • ${item.rack} • ${item.tier}</p>
    </div>

    <div class="bg-slate-950 rounded-2xl overflow-hidden mb-4 border-2 border-slate-800 flex items-center justify-center min-h-[300px]">
      <img src="${item.photoBase64}" alt="${item.skuName}" class="w-full max-h-[65vh] object-contain" />
    </div>

    <div class="grid grid-cols-2 gap-3 text-xs bg-slate-100 p-4 rounded-xl border border-slate-300 font-bold mb-4">
      <div><span class="text-slate-600">Số Lượng Tồn Kho:</span> <strong class="text-slate-900 text-sm block">${item.qtyNote || 'Chưa ghi chú'}</strong></div>
      <div><span class="text-slate-600">Cán Bộ Chụp Ảnh:</span> <strong class="text-slate-900 text-sm block">${item.staffName || 'N/A'} (${item.updatedAt})</strong></div>
      <div class="col-span-2 border-t border-slate-200 pt-2"><span class="text-slate-600">Ghi Chú Vị Trí:</span> <p class="text-slate-900 font-bold mt-0.5">${item.note || 'Không có ghi chú thêm.'}</p></div>
    </div>

    <div class="flex justify-end gap-2">
      <button onclick="closeModal('zoom-photo-modal')" class="bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs px-6 py-3 rounded-xl transition">Đóng</button>
      <button onclick="deleteLocationHandler('${item.id}'); closeModal('zoom-photo-modal');" class="bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-xs px-4 py-3 rounded-xl border border-rose-300 transition">🗑️ Xóa Vị Trí Này</button>
    </div>
  `;

  modal.classList.add('active');
}

function deleteLocationHandler(id) {
  if (confirm(`⚠️ BẢO VỆ DỮ LIỆU: Bạn có chắc chắn muốn xóa vị trí ảnh "${id}" khỏi hệ thống?`)) {
    VisualBinStorage.deleteLocation(id);
    populateDynamicFilters();
    renderLocationGrid();
  }
}

function handleLoad1000Samples() {
  const count = VisualBinStorage.generate1000SampleRecords();
  populateDynamicFilters();
  currentPage = 1;
  renderLocationGrid();
  alert(`✓ Đã nạp nối tiếp thành công 1.000 vị trí ảnh mẫu! Dữ liệu thật của anh được bảo vệ an toàn 100%.`);
}

function handleWipeData() {
  const confirmPin = prompt('⚠️ BẢO MẬT CAO CẤP CHỐNG XÓA NHẦM:\n\nBạn đang thực hiện XÓA TRẮNG toàn bộ vị trí ảnh kho.\nVui lòng nhập chính xác chuỗi từ "CONFIRM" hoặc PIN 8888 để xác nhận xóa:');
  if (confirmPin === 'CONFIRM' || confirmPin === '8888') {
    VisualBinStorage.clearAllData();
    populateDynamicFilters();
    currentPage = 1;
    renderLocationGrid();
    alert('✓ Đã XÓA TRẮNG toàn bộ vị trí ảnh kho!');
  } else {
    alert('Hủy thao tác xóa trắng.');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
