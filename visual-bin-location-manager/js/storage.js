/**
 * Visual Photo Bin Finder & Warehouse Location Manager - Data Safety & Excel Engine
 * Multi-layer storage protection, Excel Import with Embedded Images & Excel Template Export.
 */

window.VisualBinStorage = (function () {
  const STORAGE_KEY = 'visual_bin_locations_v2_safe';

  const samplePhotoBaoBi = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="40" y="60" width="520" height="280" fill="%231e293b" rx="16" stroke="%2338bdf8" stroke-width="4"/><text x="300" y="140" font-family="sans-serif" font-size="24" font-weight="900" fill="%2338bdf8" text-anchor="middle">KHO BAO BÌ LC01 - KỆ A1-03</text><text x="300" y="185" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">MÀNG CO PE 50CM & CUỘN NILON</text><rect x="120" y="220" width="360" height="65" fill="%231d4ed8" rx="12"/><text x="300" y="260" font-family="sans-serif" font-size="18" font-weight="900" fill="%23ffffff" text-anchor="middle">TẦNG 2 - VỊ TRÍ Ô 04</text></svg>';
  const samplePhotoNguyenLieu = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23022c22"/><rect x="40" y="60" width="520" height="280" fill="%23064e3b" rx="16" stroke="%234ade80" stroke-width="4"/><text x="300" y="140" font-family="sans-serif" font-size="24" font-weight="900" fill="%234ade80" text-anchor="middle">KHO NGUYÊN LIỆU KHÔ - DÃY B</text><text x="300" y="185" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">BAO BỘT MÌ TÁO ĐỎ 25KG (85 BAO)</text><rect x="120" y="220" width="360" height="65" fill="%2315803d" rx="12"/><text x="300" y="260" font-family="sans-serif" font-size="18" font-weight="900" fill="%23ffffff" text-anchor="middle">KỆ K05 - TẦNG SÀN VỊ TRÍ 02</text></svg>';
  const samplePhotoPhuGia = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%233b0764"/><rect x="40" y="60" width="520" height="280" fill="%23581c87" rx="16" stroke="%23c084fc" stroke-width="4"/><text x="300" y="140" font-family="sans-serif" font-size="24" font-weight="900" fill="%23c084fc" text-anchor="middle">KHO PHỤ GIA - KỆ C02</text><text x="300" y="185" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">THÙNG HƯƠNG LIỆU BÒ NƯỚNG 20KG</text><rect x="120" y="220" width="360" height="65" fill="%237e22ce" rx="12"/><text x="300" y="260" font-family="sans-serif" font-size="18" font-weight="900" fill="%23ffffff" text-anchor="middle">TẦNG 3 - VỊ TRÍ 01</text></svg>';

  const initialDefaults = [
    { id: 'LOC-2026-001', warehouse: 'Kho Bao Bì LC01', rack: 'Dãy A - Kệ 01', tier: 'Tầng 2 - Ô 04', skuName: 'Cuộn Màng Co PE 50cm (Bao Bì Khai Thư)', qtyNote: 'Tồn 120 cuộn nguyên đai', staffName: 'Lê Vũ Tường', updatedAt: '2026-01-20 14:30', photoBase64: samplePhotoBaoBi, note: 'Hàng mới nhập kho chưa dán mã QR.' },
    { id: 'LOC-2026-002', warehouse: 'Kho Nguyên Liệu Khô', rack: 'Dãy B - Kệ K05', tier: 'Tầng Sàn - Vị Trí 02', skuName: 'Bao Bột Mì Táo Đỏ 25kg', qtyNote: 'Tồn 85 bao (2.125 kg)', staffName: 'Nguyễn Văn Hùng', updatedAt: '2026-01-22 09:15', photoBase64: samplePhotoNguyenLieu, note: 'Xếp ngay đầu kệ K05 cạnh lối đi chính.' },
    { id: 'LOC-2026-003', warehouse: 'Kho Phụ Gia & Hương Liệu', rack: 'Dãy C - Kệ C02', tier: 'Tầng 3 - Vị Trí 01', skuName: 'Thùng Hương Liệu Bò Nướng (20Kg/Thùng)', qtyNote: 'Tồn 15 thùng', staffName: 'Phạm Minh Đức', updatedAt: '2026-01-24 16:45', photoBase64: samplePhotoPhuGia, note: 'Dán băng dính niêm phong vàng.' }
  ];

  function initStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaults));
    }
  }

  function getLocations() {
    initStorage();
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : initialDefaults;
    } catch {
      return initialDefaults;
    }
  }

  function saveLocation(locItem) {
    const list = getLocations();
    const idx = list.findIndex(item => item.id === locItem.id);
    if (idx >= 0) {
      list[idx] = locItem;
    } else {
      list.unshift(locItem);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function deleteLocation(id) {
    const list = getLocations().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function clearAllData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  function compressImage(imageSource, maxWidth = 800, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width, height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
      if (typeof imageSource === 'string') img.src = imageSource;
      else if (imageSource instanceof File || imageSource instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => { img.src = e.target.result; };
        reader.readAsDataURL(imageSource);
      } else reject('Invalid image input');
    });
  }

  // Backup Export to JSON File
  function exportBackupJSON() {
    const locations = getLocations();
    const dataStr = JSON.stringify(locations, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const today = new Date().toISOString().split('T')[0];
    link.download = `Sao_Luu_Vinh_Vien_Vi_Tri_Kho_${today}_${locations.length}_Mon.json`;
    link.click();
  }

  // Backup Import from JSON File
  function importBackupJSON(jsonData) {
    if (!Array.isArray(jsonData)) throw new Error('File sao lưu không đúng định dạng!');
    const currentList = getLocations();
    const existingMap = new Map(currentList.map(item => [item.id, item]));

    let importedCount = 0;
    jsonData.forEach(item => {
      if (item && item.id && item.skuName) {
        existingMap.set(item.id, item);
        importedCount++;
      }
    });

    const mergedList = Array.from(existingMap.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
    return importedCount;
  }

  // Export Sample Excel Template File
  function downloadExcelTemplate() {
    if (typeof XLSX === 'undefined') {
      alert('Đang tải thư viện Excel... Vui lòng thử lại sau 3 giây!');
      return;
    }

    const templateData = [
      {
        'Mã Vị Trí (*)': 'LOC-2026-0001',
        'Tên Bao Bì / Hàng Hóa (*)': 'Cuộn Màng Co PE 50cm',
        'Kho / Khu Vực (*)': 'Kho Bao Bì LC01',
        'Dãy / Kệ (*)': 'Dãy A - Kệ 01',
        'Tầng / Ô Vị Trí (*)': 'Tầng 2 - Ô 04',
        'Số Lượng / Tồn Kho': 'Tồn 120 cuộn',
        'Nhân Viên Chụp Ảnh': 'Lê Vũ Tường',
        'Ghi Chú Vị Trí': 'Nằm ở đầu kệ A1 dán niêm phong',
        'Link Ảnh Hoặc Base64': ''
      },
      {
        'Mã Vị Trí (*)': 'LOC-2026-0002',
        'Tên Bao Bì / Hàng Hóa (*)': 'Bao Bột Mì Táo Đỏ 25kg',
        'Kho / Khu Vực (*)': 'Kho Nguyên Liệu Khô',
        'Dãy / Kệ (*)': 'Dãy B - Kệ K05',
        'Tầng / Ô Vị Trí (*)': 'Tầng Sàn - Vị Trí 02',
        'Số Lượng / Tồn Kho': 'Tồn 85 bao',
        'Nhân Viên Chụp Ảnh': 'Nguyễn Văn Hùng',
        'Ghi Chú Vị Trí': 'Góc lối đi chính',
        'Link Ảnh Hoặc Base64': ''
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ViTriKho');
    XLSX.writeFile(workbook, 'Mau_Nhap_Vi_Tri_Kho_Hinh_Anh.xlsx');
  }

  // Process Excel File with Embedded Images (JSZip + SheetJS)
  async function parseAndImportExcelFile(file) {
    if (typeof XLSX === 'undefined' || typeof JSZip === 'undefined') {
      throw new Error('Thư viện Excel / JSZip chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng!');
    }

    const arrayBuffer = await file.arrayBuffer();

    // 1. Read SheetJS Workbook
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (rawRows.length === 0) {
      throw new Error('File Excel rỗng hoặc không có dữ liệu hàng!');
    }

    // 2. Extract Embedded Images from XLSX Zip Package via JSZip
    const extractedPhotos = [];
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      const mediaFiles = Object.keys(zip.files).filter(fileName => fileName.startsWith('xl/media/'));

      // Sort media files numerically image1.png, image2.jpeg...
      mediaFiles.sort((a, b) => {
        const numA = parseInt(a.replace(/[^0-9]/g, '')) || 0;
        const numB = parseInt(b.replace(/[^0-9]/g, '')) || 0;
        return numA - numB;
      });

      for (const fileName of mediaFiles) {
        const zipFile = zip.files[fileName];
        const base64Data = await zipFile.async('base64');
        const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
        const fullDataUrl = `data:${mimeType};base64,${base64Data}`;
        
        // Auto compress image
        const compressed = await compressImage(fullDataUrl, 800, 0.75);
        extractedPhotos.push(compressed);
      }
    } catch (zipErr) {
      console.warn('[ExcelZip] No embedded images found or zip extraction warning:', zipErr);
    }

    // 3. Map Rows to Location Items
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    const defaultPhotos = [samplePhotoBaoBi, samplePhotoNguyenLieu, samplePhotoPhuGia];
    const newItems = [];

    rawRows.forEach((row, index) => {
      // Find matching keys flexible
      const skuName = row['Tên Bao Bì / Hàng Hóa (*)'] || row['Tên Hàng Hóa'] || row['Tên Bao Bì'] || row['SKU'] || row['Item'] || `Hàng Hóa #${index + 1}`;
      const warehouse = row['Kho / Khu Vực (*)'] || row['Kho'] || row['Warehouse'] || 'Kho Tổng';
      const rack = row['Dãy / Kệ (*)'] || row['Dãy Kệ'] || row['Kệ'] || row['Rack'] || 'Dãy A';
      const tier = row['Tầng / Ô Vị Trí (*)'] || row['Tầng Ô'] || row['Tầng'] || row['Tier'] || 'Tầng 1';
      const qtyNote = row['Số Lượng / Tồn Kho'] || row['Tồn Kho'] || row['Số Lượng'] || '';
      const staffName = row['Nhân Viên Chụp Ảnh'] || row['Nhân Viên'] || row['Staff'] || 'Cán Bộ Kho';
      const note = row['Ghi Chú Vị Trí'] || row['Ghi Chú'] || row['Note'] || '';
      let photoBase64 = row['Link Ảnh Hoặc Base64'] || row['Image'] || row['Photo'] || '';

      // If no photo URL in cell, fallback to extracted embedded zip photo or sample photo
      if (!photoBase64 || !photoBase64.startsWith('data:image')) {
        if (extractedPhotos[index]) {
          photoBase64 = extractedPhotos[index];
        } else {
          photoBase64 = defaultPhotos[index % defaultPhotos.length];
        }
      }

      const id = row['Mã Vị Trí (*)'] || row['Mã Vị Trí'] || `LOC-XL-${Date.now().toString().slice(-4)}-${index + 1}`;

      newItems.push({
        id: String(id).trim(),
        warehouse: String(warehouse).trim(),
        rack: String(rack).trim(),
        tier: String(tier).trim(),
        skuName: String(skuName).trim(),
        qtyNote: String(qtyNote).trim(),
        staffName: String(staffName).trim(),
        updatedAt: dateStr,
        photoBase64,
        note: String(note).trim()
      });
    });

    // Merge and save safely
    const currentList = getLocations();
    const existingMap = new Map(currentList.map(item => [item.id, item]));
    newItems.forEach(item => existingMap.set(item.id, item));

    const mergedList = Array.from(existingMap.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));

    return {
      totalRows: newItems.length,
      extractedPhotosCount: extractedPhotos.length
    };
  }

  function getUniqueWarehouses() {
    return Array.from(new Set(getLocations().map(l => l.warehouse).filter(Boolean))).sort();
  }

  function getUniqueRacks(warehouseFilter = 'ALL') {
    let list = getLocations();
    if (warehouseFilter !== 'ALL') list = list.filter(l => l.warehouse === warehouseFilter);
    return Array.from(new Set(list.map(l => l.rack).filter(Boolean))).sort();
  }

  function getUniqueTiers(warehouseFilter = 'ALL', rackFilter = 'ALL') {
    let list = getLocations();
    if (warehouseFilter !== 'ALL') list = list.filter(l => l.warehouse === warehouseFilter);
    if (rackFilter !== 'ALL') list = list.filter(l => l.rack === rackFilter);
    return Array.from(new Set(list.map(l => l.tier).filter(Boolean))).sort();
  }

  function getUniqueStaff() {
    return Array.from(new Set(getLocations().map(l => l.staffName).filter(Boolean))).sort();
  }

  function searchLocationsAdvanced(filters = {}) {
    const { query = '', warehouse = 'ALL', rack = 'ALL', tier = 'ALL', staff = 'ALL' } = filters;
    let list = getLocations();

    if (warehouse !== 'ALL') list = list.filter(l => l.warehouse === warehouse);
    if (rack !== 'ALL') list = list.filter(l => l.rack === rack);
    if (tier !== 'ALL') list = list.filter(l => l.tier === tier);
    if (staff !== 'ALL') list = list.filter(l => l.staffName === staff);

    if (!query) return list;
    const q = query.toLowerCase().trim();

    return list.filter(item => (
      (item.skuName && item.skuName.toLowerCase().includes(q)) ||
      (item.warehouse && item.warehouse.toLowerCase().includes(q)) ||
      (item.rack && item.rack.toLowerCase().includes(q)) ||
      (item.tier && item.tier.toLowerCase().includes(q)) ||
      (item.qtyNote && item.qtyNote.toLowerCase().includes(q)) ||
      (item.note && item.note.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q))
    ));
  }

  function generate1000SampleRecords() {
    const currentList = getLocations();
    const warehouses = ['Kho Bao Bì LC01', 'Kho Nguyên Liệu Khô', 'Kho Phụ Gia & Hương Liệu', 'Kho Vật Tư Tổng A'];
    const racks = ['Dãy A - Kệ 01', 'Dãy A - Kệ 02', 'Dãy B - Kệ K05', 'Dãy C - Kệ C02'];
    const tiers = ['Tầng Sàn - Vị Trí 01', 'Tầng 1 - Ô 02', 'Tầng 2 - Ô 04', 'Tầng 3 - Vị Trí 01'];
    const items = ['Cuộn Màng Co PE 50cm', 'Bao Bột Mì Táo Đỏ 25kg', 'Thùng Hương Liệu Bò Nướng 20kg', 'Cuộn Nilon Lót Thùng'];
    const staffList = ['Lê Vũ Tường', 'Nguyễn Văn Hùng', 'Phạm Minh Đức'];
    const photos = [samplePhotoBaoBi, samplePhotoNguyenLieu, samplePhotoPhuGia];

    const sampleList = [];
    for (let i = 1; i <= 1000; i++) {
      sampleList.push({
        id: `SAMPLE-${Date.now().toString().slice(-4)}-${i}`,
        warehouse: warehouses[i % warehouses.length],
        rack: racks[i % racks.length],
        tier: tiers[i % tiers.length],
        skuName: `${items[i % items.length]} Mẫu #${i}`,
        qtyNote: `Tồn kho ${10 + (i % 90)} đơn vị`,
        staffName: staffList[i % staffList.length],
        updatedAt: `2026-01-${String((i % 28) + 1).padStart(2, '0')} 10:30`,
        photoBase64: photos[i % photos.length],
        note: `Vị trí mẫu thử nghiệm thứ ${i}`
      });
    }

    const merged = [...currentList, ...sampleList];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return sampleList.length;
  }

  return {
    getLocations,
    saveLocation,
    deleteLocation,
    clearAllData,
    compressImage,
    exportBackupJSON,
    importBackupJSON,
    downloadExcelTemplate,
    parseAndImportExcelFile,
    getUniqueWarehouses,
    getUniqueRacks,
    getUniqueTiers,
    getUniqueStaff,
    searchLocationsAdvanced,
    generate1000SampleRecords,
    getLocationById: (id) => getLocations().find(item => item.id === id)
  };
})();
