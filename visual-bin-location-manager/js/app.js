/**
 * Visual Photo Bin Finder & Warehouse Location Manager - Main Application Controller
 */

let currentCompressedPhoto = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('[VisualBinApp] Initializing Visual Photo Location Manager...');

  // 1. Populate Filter Options
  populateWarehouseOptions();

  // 2. Render Initial Grid
  renderLocationGrid();
  updateKPIs();

  // 3. Tab Navigation setup
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

  // Search & Filter listeners
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', renderLocationGrid);

  const warehouseSelect = document.getElementById('filter-warehouse');
  if (warehouseSelect) warehouseSelect.addEventListener('change', renderLocationGrid);

  // File Input / Camera Photo Selection with Automatic Compression
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

        // Compress image using Client-side HTML5 Canvas
        const compressedBase64 = await VisualBinStorage.compressImage(file, 800, 0.75);
        currentCompressedPhoto = compressedBase64;

        if (previewImg) previewImg.src = compressedBase64;

        // Calculate compressed KB size
        const compressedKb = (compressedBase64.length * 0.75 / 1024).toFixed(1);
        if (sizeTag) sizeTag.textContent = `✓ Nén ảnh thành công: ${compressedKb} KB (Siêu nhẹ & Nét!)`;
      } catch (err) {
        console.error('[ImageCompression] Error:', err);
        alert('Không thể đọc ảnh. Vui lòng chọn ảnh khác!');
      }
    });
  }

  // Save New Location Tag Form Submit
  const formAdd = document.getElementById('form-add-location');
  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      saveNewLocation();
    });
  }

  // Action Buttons
  document.getElementById('btn-reset-form')?.addEventListener('click', resetAddForm);
  document.getElementById('btn-load-samples')?.addEventListener('click', handleLoadSamples);
  document.getElementById('btn-wipe-data')?.addEventListener('click', handleWipeData);
});

function populateWarehouseOptions() {
  const locations = VisualBinStorage.getLocations();
  const warehouses = Array.from(new Set(locations.map(l => l.warehouse).filter(Boolean)));

  const select = document.getElementById('filter-warehouse');
  if (!select) return;

  select.innerHTML = '<option value="ALL">Tất cả Kho Vị Trí</option>';
  warehouses.forEach(wh => {
    select.innerHTML += `<option value="${wh}">${wh}</option>`;
  });
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
  const warehouseFilter = document.getElementById('filter-warehouse')?.value || 'ALL';

  const filtered = VisualBinStorage.searchLocations(query, warehouseFilter);
  updateKPIs();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-slate-400 glass-card">
        <div class="text-4xl mb-2">📷</div>
        <p class="font-bold text-slate-700">Chưa có vị trí ảnh nào được ghi nhận.</p>
        <p class="text-xs text-slate-500 mt-1">Bấm sang tab "📷 Chụp & Thêm Vị Trí Mới" hoặc bấm "⚡ Nạp Mẫu" để thử nghiệm!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="photo-card flex flex-col justify-between">
      <div>
        <div class="relative cursor-pointer overflow-hidden group" onclick="openZoomPhotoModal('${item.id}')">
          <img src="${item.photoBase64}" alt="${item.skuName}" class="photo-container group-hover:scale-105 transition duration-300" />
          <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5">
            <i class="fa-solid fa-magnifying-glass-plus"></i> Bấm Phóng To Ảnh
          </div>
          <span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-slate-700">
            ${item.id}
          </span>
        </div>

        <div class="p-4 space-y-2">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="tag-badge tag-warehouse"><i class="fa-solid fa-warehouse text-[10px]"></i> ${item.warehouse}</span>
            <span class="tag-badge tag-rack"><i class="fa-solid fa-layer-group text-[10px]"></i> ${item.rack}</span>
          </div>

          <h3 class="font-extrabold text-slate-900 text-sm leading-snug hover:text-blue-600 transition cursor-pointer" onclick="openZoomPhotoModal('${item.id}')">
            ${item.skuName}
          </h3>

          <div class="text-xs text-slate-600 space-y-1">
            <div class="flex items-center gap-1"><i class="fa-solid fa-location-dot text-rose-500"></i> <strong>Vị Trí Cụ Thể:</strong> ${item.tier}</div>
            <div class="flex items-center gap-1"><i class="fa-solid fa-boxes-stacked text-amber-500"></i> <strong>Số Lượng / Tồn:</strong> ${item.qtyNote || 'Chưa ghi chú'}</div>
            ${item.note ? `<div class="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1">📝 ${item.note}</div>` : ''}
          </div>
        </div>
      </div>

      <div class="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
        <span>👤 ${item.staffName || 'Kho'} • ${item.updatedAt || ''}</span>
        <button onclick="deleteLocationHandler('${item.id}')" class="text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded hover:bg-rose-50 transition">
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
  populateWarehouseOptions();
  renderLocationGrid();

  // Switch back to search tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelector('[data-target="pane-grid"]').classList.add('active');
  document.getElementById('pane-grid').classList.add('active');

  alert(`✓ Đã lưu vị trí ảnh cho "${skuName}" (${newItem.id}) thành công!`);
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
      <span class="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-300">MÃ VỊ TRÍ: ${item.id}</span>
      <h3 class="text-lg font-bold text-slate-900 mt-1">${item.skuName}</h3>
      <p class="text-xs text-slate-500">${item.warehouse} • ${item.rack} • ${item.tier}</p>
    </div>

    <div class="bg-slate-900 rounded-2xl overflow-hidden mb-4 border border-slate-700 flex items-center justify-center min-h-[300px]">
      <img src="${item.photoBase64}" alt="${item.skuName}" class="w-full max-h-[60vh] object-contain" />
    </div>

    <div class="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
      <div><span class="text-slate-500">Số Lượng / Tồn Kho:</span> <strong class="text-slate-900 block">${item.qtyNote || 'Chưa ghi chú'}</strong></div>
      <div><span class="text-slate-500">Cán Bộ Chụp Ảnh:</span> <strong class="text-slate-900 block">${item.staffName || 'N/A'} (${item.updatedAt})</strong></div>
      <div class="col-span-2"><span class="text-slate-500">Ghi Chú Vị Trí:</span> <p class="text-slate-800 font-medium mt-0.5">${item.note || 'Không có ghi chú thêm.'}</p></div>
    </div>

    <div class="flex justify-end gap-2">
      <button onclick="closeModal('zoom-photo-modal')" class="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl transition">Đóng</button>
      <button onclick="deleteLocationHandler('${item.id}'); closeModal('zoom-photo-modal');" class="bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-300 transition">🗑️ Xóa Ô Vị Trí Này</button>
    </div>
  `;

  modal.classList.add('active');
}

function deleteLocationHandler(id) {
  if (confirm(`Bạn có chắc chắn muốn xóa vị trí ảnh "${id}" khỏi hệ thống?`)) {
    VisualBinStorage.deleteLocation(id);
    populateWarehouseOptions();
    renderLocationGrid();
  }
}

function handleLoadSamples() {
  VisualBinStorage.generateSampleRecords();
  populateWarehouseOptions();
  renderLocationGrid();
  alert('✓ Đã nạp thành công 3 vị trí kho mẫu thử nghiệm!');
}

function handleWipeData() {
  const confirmPin = prompt('⚠️ BẢO MẬT: Nhập chữ "CONFIRM" hoặc PIN 8888 để xóa trắng dữ liệu ảnh vị trí kho:');
  if (confirmPin === 'CONFIRM' || confirmPin === '8888') {
    VisualBinStorage.clearAllData();
    populateWarehouseOptions();
    renderLocationGrid();
    alert('✓ Đã XÓA TRẮNG toàn bộ vị trí ảnh kho!');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
