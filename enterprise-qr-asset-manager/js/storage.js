/**
 * Enterprise Fixed Asset & Label Printer QR Manager - Data Storage Engine
 * High-performance storage with Bulk Excel Upload (11,000+ assets) and Data Wipe Reset.
 */

window.EnterpriseStorage = (function () {
  const STORAGE_KEY_ASSETS = 'enterprise_assets_v2';
  const STORAGE_KEY_DEPTS = 'enterprise_depts_v2';

  const defaultDepts = [
    { id: 'DEPT-OFFICE', name: 'Khối Văn Phòng & Ban Giám Đốc', manager: 'Trần Văn Nam', location: 'Tầng 5 - Tòa Nhà Văn Phòng' },
    { id: 'DEPT-IT', name: 'Khối Công Nghệ Thông Tin & Telecom', manager: 'Lê Vũ Tường', location: 'Tầng 4 - Phòng Server Central' },
    { id: 'DEPT-FACTORY', name: 'Nhà Máy Sản Xuất & Xưởng Cơ Khí', manager: 'Nguyễn Văn Hùng', location: 'Khu Công Nghiệp - Xưởng A1' },
    { id: 'DEPT-WAREHOUSE', name: 'Kho Thiết Bị & Vật Tư Tổng', manager: 'Phạm Minh Đức', location: 'Khu C - Kho Vật Tư Tổng' }
  ];

  const defaultAssets = [
    {
      id: 'AST-2026-0101',
      deptId: 'DEPT-IT',
      name: 'Máy Chủ Server Dell PowerEdge R750',
      category: 'Thiết Bị IT / Server',
      brandModel: 'Dell PowerEdge R750 Xeon 6330',
      serialNo: 'SN-DELL-8891234',
      location: 'Phòng Server Central - Tủ Rack #02',
      custodian: 'Lê Vũ Tường',
      status: 'ACTIVE',
      costVnd: 185000000,
      purchaseDate: '2025-06-15',
      note: 'Máy chủ chạy hệ thống ERP & WMS.'
    },
    {
      id: 'AST-2026-0102',
      deptId: 'DEPT-IT',
      name: 'Laptop Dell XPS 15 9530 i9 32GB',
      category: 'Thiết Bị IT / Laptop',
      brandModel: 'Dell XPS 15 9530',
      serialNo: 'SN-XPS-9921827',
      location: 'Khối Kế Hoạch - Bàn 12',
      custodian: 'Nguyễn Thị Hoa',
      status: 'ACTIVE',
      costVnd: 52000000,
      purchaseDate: '2026-01-10',
      note: 'Cấp phát cho Trưởng phòng Kế hoạch.'
    },
    {
      id: 'AST-PLT-00001',
      deptId: 'DEPT-WAREHOUSE',
      name: 'Pallet Nhựa Đen Chân Cốc 1200x1000mm',
      category: 'Pallet & Khay Chứa',
      brandModel: 'Kích thước 1200x1000x150mm',
      serialNo: 'PLT-BATCH-2026-01',
      location: 'Kho Vật Tư Tổng - Dãy A',
      custodian: 'Phạm Minh Đức',
      status: 'ACTIVE',
      costVnd: 450000,
      purchaseDate: '2026-01-05',
      note: 'Tải trọng tĩnh 3000kg, động 1000kg. Lô 11.000 pallet.'
    }
  ];

  function initStorage() {
    if (!localStorage.getItem(STORAGE_KEY_DEPTS)) {
      localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(defaultDepts));
    }
    if (!localStorage.getItem(STORAGE_KEY_ASSETS)) {
      localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(defaultAssets));
    }
  }

  function getDepts() {
    initStorage();
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_DEPTS)) || []; }
    catch { return defaultDepts; }
  }

  function getAssets() {
    initStorage();
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_ASSETS)) || []; }
    catch { return defaultAssets; }
  }

  function saveAsset(asset) {
    const assets = getAssets();
    const idx = assets.findIndex(a => a.id === asset.id);
    if (idx >= 0) assets[idx] = asset;
    else assets.push(asset);
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
  }

  function bulkImportAssets(importedArray, overwriteExisting = false) {
    if (!importedArray || importedArray.length === 0) return 0;
    
    let currentAssets = overwriteExisting ? [] : getAssets();
    const existingMap = new Map(currentAssets.map(a => [a.id, a]));
    let addedCount = 0;

    importedArray.forEach((row, idx) => {
      const id = row.id || row['Mã Tài Sản'] || row['MaTaiSan'] || `AST-${Date.now().toString().slice(-4)}-${idx+1}`;
      const name = row.name || row['Tên Thiết Bị'] || row['TenThietBi'] || row['Tên Tài Sản'] || 'Tài sản mới';
      const category = row.category || row['Danh Mục'] || row['DanhMuc'] || 'Vật Tư';
      const brandModel = row.brandModel || row['Model/Kích Thước'] || row['Model'] || row['Nhãn Hiệu'] || '';
      const serialNo = row.serialNo || row['Số Serial/Mã Lô'] || row['Số Serial'] || row['Serial'] || '';
      const location = row.location || row['Vị Trí'] || row['ViTri'] || 'Trong kho';
      const custodian = row.custodian || row['Người Quản Lý'] || row['NguoiQuanLy'] || '';
      const status = row.status || row['Trạng Thái'] || 'ACTIVE';
      const costVnd = parseFloat(row.costVnd || row['Nguyên Giá (VNĐ)'] || row['Nguyên Giá'] || row['GiaTri'] || 0) || 0;
      const purchaseDate = row.purchaseDate || row['Ngày Mua'] || new Date().toISOString().split('T')[0];
      const note = row.note || row['Ghi Chú'] || '';
      const deptId = row.deptId || row['Mã Phòng Ban'] || row['Phòng Ban'] || 'DEPT-WAREHOUSE';

      const assetObj = { id, deptId, name, category, brandModel, serialNo, location, custodian, status, costVnd, purchaseDate, note };

      existingMap.set(id, assetObj);
      addedCount++;
    });

    const finalAssets = Array.from(existingMap.values());
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(finalAssets));
    return addedCount;
  }

  function generate1000SampleAssets() {
    const list = [];
    const depts = ['DEPT-OFFICE', 'DEPT-IT', 'DEPT-FACTORY', 'DEPT-WAREHOUSE'];
    const names = [
      'Pallet Nhựa Đen 1200x1000mm', 'Pallet Nhựa Xanh Lót Sàn', 'Pallet Nhựa 2 Mặt Tải Nặng',
      'Laptop Dell Latitude i7', 'Màn Hình Dell 27 inch 4K', 'Máy In Tem Nhãn QR Xprinter',
      'Xe Nâng Điện Toyota 2.5T', 'Máy Điều Hòa Daikin 36000BTU', 'Máy Hàn TIG Jasic 250A'
    ];
    const statuses = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'SPARE', 'LOANED', 'REPAIR'];
    const custodians = ['Lê Vũ Tường', 'Trần Văn Nam', 'Nguyễn Văn Hùng', 'Phạm Minh Đức', 'Nguyễn Thị Hoa'];

    for (let i = 1; i <= 1000; i++) {
      const id = `AST-PLT-${String(i).padStart(5, '0')}`;
      const name = names[i % names.length];
      const deptId = depts[i % depts.length];
      const status = statuses[i % statuses.length];
      const custodian = custodians[i % custodians.length];

      list.push({
        id: id,
        deptId: deptId,
        name: `${name} #${i}`,
        category: 'Pallet & Thiết Bị',
        brandModel: 'Model 2026',
        serialNo: `PLT-BATCH-${2026}-${Math.floor(i / 100) + 1}`,
        location: `Kho A - Dãy ${(i % 20) + 1} - Ô ${i}`,
        custodian: custodian,
        status: status,
        costVnd: 450000 + (i * 1000),
        purchaseDate: '2026-01-10',
        note: `Tài sản mẫu kiểm thử thứ ${i}`
      });
    }

    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(list));
    return list.length;
  }

  function clearAllData() {
    localStorage.removeItem(STORAGE_KEY_ASSETS);
    localStorage.removeItem(STORAGE_KEY_DEPTS);
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(defaultDepts));
  }

  function resetToDefaultData() {
    localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(defaultDepts));
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(defaultAssets));
  }

  function deleteAsset(assetId) {
    const assets = getAssets().filter(a => a.id !== assetId);
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
  }

  function searchAssets(query, deptFilter = 'ALL', statusFilter = 'ALL') {
    let list = getAssets();

    if (deptFilter && deptFilter !== 'ALL') {
      list = list.filter(a => a.deptId === deptFilter);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter(a => a.status === statusFilter);
    }

    if (!query) return list;
    const q = query.toLowerCase().trim();
    const depts = getDepts();

    return list.filter(a => {
      const dept = depts.find(d => d.id === a.deptId);
      const deptName = dept ? dept.name.toLowerCase() : '';

      return (
        a.id.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.brandModel && a.brandModel.toLowerCase().includes(q)) ||
        (a.serialNo && a.serialNo.toLowerCase().includes(q)) ||
        (a.custodian && a.custodian.toLowerCase().includes(q)) ||
        deptName.includes(q)
      );
    });
  }

  function downloadExcelTemplate() {
    const templateData = [
      {
        "Mã Tài Sản": "AST-PLT-00001",
        "Tên Thiết Bị": "Pallet Nhựa Đen 1200x1000mm",
        "Danh Mục": "Pallet Nhựa",
        "Model/Kích Thước": "1200x1000x150mm",
        "Số Serial/Mã Lô": "BATCH-2026-01",
        "Vị Trí": "Kho A - Hàng 12",
        "Người Quản Lý": "Nguyễn Văn A",
        "Trạng Thái": "ACTIVE",
        "Nguyên Giá (VNĐ)": 450000,
        "Ngày Mua": "2026-01-05",
        "Ghi Chú": "Tải trọng 3000kg"
      }
    ];

    if (window.XLSX) {
      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Mau_Nhap_Tai_San");
      XLSX.writeFile(wb, "Mau_File_Nhap_Tai_San_11000_Item.xlsx");
    } else {
      exportCSV();
    }
  }

  function exportCSV() {
    const assets = getAssets();
    const depts = getDepts();
    
    let csvStr = "Mã Tài Sản,Tên Thiết Bị,Danh Mục,Model/Nhãn Hiệu,Số Serial,Phòng Ban,Người Quản Lý,Trạng Thái,Giá Trị (VNĐ),Ngày Mua,Ghi Chú\n";
    
    assets.forEach(a => {
      const dept = depts.find(d => d.id === a.deptId);
      const deptName = dept ? dept.name : 'N/A';
      csvStr += `"${a.id}","${a.name}","${a.category}","${a.brandModel || ''}","${a.serialNo || ''}","${deptName}","${a.custodian || ''}","${a.status}","${a.costVnd || 0}","${a.purchaseDate || ''}","${a.note || ''}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csvStr], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Danh_Sach_Tai_San_Doanh_Nghiep_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  return {
    getDepts,
    getAssets,
    saveAsset,
    bulkImportAssets,
    generate1000SampleAssets,
    clearAllData,
    resetToDefaultData,
    downloadExcelTemplate,
    deleteAsset,
    searchAssets,
    exportCSV,
    getAssetById: (id) => getAssets().find(a => a.id === id),
    getDeptById: (id) => getDepts().find(d => d.id === id)
  };
})();
