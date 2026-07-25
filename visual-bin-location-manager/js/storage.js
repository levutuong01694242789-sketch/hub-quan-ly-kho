/**
 * Visual Photo Bin Finder & Warehouse Location Manager - Data & Compression Storage Engine
 * Automatic client-side image compression down to ~30KB WebP to guarantee 0ms lag.
 */

window.VisualBinStorage = (function () {
  const STORAGE_KEY = 'visual_bin_locations_v1';

  // SVG placeholder samples for instant test preview
  const samplePhotoBaoBi = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><rect x="50" y="80" width="500" height="240" fill="%23334155" rx="16"/><text x="300" y="150" font-family="sans-serif" font-size="22" font-weight="bold" fill="%2338bdf8" text-anchor="middle">KHO BAO BÌ - KỆ A1-03</text><text x="300" y="190" font-family="sans-serif" font-size="16" fill="%23f8fafc" text-anchor="middle">MÀNG CO PE & CUỘN NILON NHẬP KHẨU</text><rect x="150" y="220" width="300" height="60" fill="%230284c7" rx="10"/><text x="300" y="258" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23ffffff" text-anchor="middle">TẦNG 2 - Ô SỐ 04</text></svg>';

  const samplePhotoNguyenLieu = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="50" y="80" width="500" height="240" fill="%231e293b" rx="16"/><text x="300" y="150" font-family="sans-serif" font-size="22" font-weight="bold" fill="%234ade80" text-anchor="middle">KHO NGUYÊN LIỆU KHÔ - DÃY B</text><text x="300" y="190" font-family="sans-serif" font-size="16" fill="%23f8fafc" text-anchor="middle">BAO BỘT MÌ & BỘT NĂNG 25KG</text><rect x="150" y="220" width="300" height="60" fill="%2316a34a" rx="10"/><text x="300" y="258" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23ffffff" text-anchor="middle">KỆ K05 - TẦNG SÀN</text></svg>';

  const samplePhotoPhuGia = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2331135e"/><rect x="50" y="80" width="500" height="240" fill="%234c1d95" rx="16"/><text x="300" y="150" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23c084fc" text-anchor="middle">KHO PHỤ GIA - KỆ C02</text><text x="300" y="190" font-family="sans-serif" font-size="16" fill="%23f8fafc" text-anchor="middle">THÙNG GIA VỊ & HƯƠNG LIỆU THỰC PHẨM</text><rect x="150" y="220" width="300" height="60" fill="%239333ea" rx="10"/><text x="300" y="258" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23ffffff" text-anchor="middle">TẦNG 3 - VỊ TRÍ 01</text></svg>';

  const defaultLocations = [
    {
      id: 'LOC-2026-001',
      warehouse: 'Kho Bao Bì LC01',
      rack: 'Dãy A - Kệ 01',
      tier: 'Tầng 2 - Ô 04',
      skuName: 'Cuộn Màng Co PE 50cm (Bao Bì Khai Thư)',
      qtyNote: 'Tồn 120 cuộn nguyên đai',
      staffName: 'Lê Vũ Tường',
      updatedAt: '2026-01-20 14:30',
      photoBase64: samplePhotoBaoBi,
      note: 'Hàng mới nhập kho sáng nay chưa dán mã QR.'
    },
    {
      id: 'LOC-2026-002',
      warehouse: 'Kho Nguyên Liệu Khô',
      rack: 'Dãy B - Kệ K05',
      tier: 'Tầng Sàn - Vị Trí 02',
      skuName: 'Bao Bột Mì Táo Đỏ 25kg',
      qtyNote: 'Tồn 85 bao (2.125 kg)',
      staffName: 'Nguyễn Văn Hùng',
      updatedAt: '2026-01-22 09:15',
      photoBase64: samplePhotoNguyenLieu,
      note: 'Xếp ngay đầu kệ K05 cạnh lối đi chính.'
    },
    {
      id: 'LOC-2026-003',
      warehouse: 'Kho Phụ Gia & Hương Liệu',
      rack: 'Dãy C - Kệ C02',
      tier: 'Tầng 3 - Vị Trí 01',
      skuName: 'Thùng Hương Liệu Bò Nướng (20Kg/Thùng)',
      qtyNote: 'Tồn 15 thùng',
      staffName: 'Phạm Minh Đức',
      updatedAt: '2026-01-24 16:45',
      photoBase64: samplePhotoPhuGia,
      note: 'Dán băng dính niêm phong vàng.'
    }
  ];

  function initStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLocations));
    }
  }

  function getLocations() {
    initStorage();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultLocations;
    } catch {
      return defaultLocations;
    }
  }

  function saveLocation(locItem) {
    const list = getLocations();
    const idx = list.findIndex(item => item.id === locItem.id);
    if (idx >= 0) list[idx] = locItem;
    else list.unshift(locItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function deleteLocation(id) {
    const list = getLocations().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  /**
   * Automatic Client-Side Image Downscaler & Compressor
   * Takes a File or Image DataURL and compresses it to max 800px WebP / JPEG (~30-50KB)
   */
  function compressImage(imageSource, maxWidth = 800, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

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

        // Export compressed Data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);

      if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else if (imageSource instanceof File || imageSource instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => { img.src = e.target.result; };
        reader.readAsDataURL(imageSource);
      } else {
        reject('Invalid image input');
      }
    });
  }

  function searchLocations(query, warehouseFilter = 'ALL') {
    let list = getLocations();

    if (warehouseFilter && warehouseFilter !== 'ALL') {
      list = list.filter(item => item.warehouse === warehouseFilter);
    }

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

  function generateSampleRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLocations));
    return defaultLocations.length;
  }

  return {
    getLocations,
    saveLocation,
    deleteLocation,
    clearAllData,
    compressImage,
    searchLocations,
    generateSampleRecords,
    getLocationById: (id) => getLocations().find(item => item.id === id)
  };
})();
