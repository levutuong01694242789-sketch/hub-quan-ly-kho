/* ==========================================================================
   IT Asset QR Manager - Application Logic (Vanilla JS) - Phase 4
   ========================================================================== */

// --- DỮ LIỆU MẪU BAN ĐẦU ---
const INITIAL_EMPLOYEES = [
    { id: "EMP-0001", name: "Nguyễn Văn An", department: "Phòng Kinh Doanh", email: "an.nv@techglobal.com" },
    { id: "EMP-0002", name: "Trần Thị Bình", department: "Phòng Kỹ Thuật (R&D)", email: "binh.tt@techglobal.com" },
    { id: "EMP-0003", name: "Lê Văn Cường", department: "Phòng IT", email: "cuong.lv@techglobal.com" },
    { id: "EMP-0004", name: "Phạm Thanh Hà", department: "Phòng Marketing", email: "ha.pt@techglobal.com" },
    { id: "EMP-0005", name: "Hoàng Đức Minh", department: "Ban Giám Đốc", email: "minh.hd@techglobal.com" },
    { id: "EMP-0006", name: "Tổ Bảo Vệ", department: "Tổ Bảo Vệ", email: "baove@techglobal.com" }
];

const INITIAL_ASSETS = [
    {
        id: "AST-0001",
        name: "Laptop Dell Latitude 5420 Core i5",
        type: "Laptop",
        status: "Đang cấp phát",
        serial: "SNDELL5420XYZ",
        location: "Phòng Kinh Doanh",
        purchaseDate: "2024-03-12",
        assignedEmployeeId: "EMP-0001",
        assignedDate: "2024-03-15",
        assignedNotes: "Cấp kèm sạc zin 65W và chuột không dây Dell",
        maintenanceHistory: []
    },
    {
        id: "AST-0002",
        name: "MacBook Pro 14 M3 Pro 18GB/512GB",
        type: "Laptop",
        status: "Đang cấp phát",
        serial: "C02L9123QW4",
        location: "Phòng Kỹ Thuật (R&D)",
        purchaseDate: "2025-01-10",
        assignedEmployeeId: "EMP-0002",
        assignedDate: "2025-01-12",
        assignedNotes: "Cấp máy mới nguyên seal cho Lập trình viên IOS",
        maintenanceHistory: []
    },
    {
        id: "AST-0003",
        name: "Camera Hikvision DS-2CD2143G0-I",
        type: "Camera",
        status: "Sẵn có",
        serial: "SNK7890123",
        location: "Kho IT",
        purchaseDate: "2023-08-20",
        assignedEmployeeId: "",
        assignedDate: "",
        assignedNotes: "",
        maintenanceHistory: [
            {
                startDate: "2024-06-10",
                endDate: "2024-06-12",
                reason: "Chập nguồn do ngấm nước mưa",
                provider: "Bảo hành Hikvision",
                cost: 450000,
                status: "Đã xong"
            }
        ]
    },
    {
        id: "AST-0004",
        name: "Máy in đa năng HP LaserJet Pro MFP M227fdw",
        type: "Printer",
        status: "Sẵn có",
        serial: "SNHPPRINTER99",
        location: "Hành chính Nhân sự (Tầng 2)",
        purchaseDate: "2022-11-05",
        assignedEmployeeId: "",
        assignedDate: "",
        assignedNotes: "",
        maintenanceHistory: []
    },
    {
        id: "AST-0005",
        name: "Laptop ThinkPad L14 Gen 3",
        type: "Laptop",
        status: "Đang sửa chữa",
        serial: "SNTPL14G3ABC",
        location: "Phòng Bảo Hành",
        purchaseDate: "2023-05-18",
        assignedEmployeeId: "EMP-0003",
        assignedDate: "2023-05-20",
        assignedNotes: "Phím space bị kẹt cơ",
        maintenanceHistory: [
            {
                startDate: "2026-07-10",
                endDate: "",
                reason: "Kẹt cơ phím Space và liệt phím chữ A",
                provider: "Trung tâm sửa chữa laptop 24h",
                cost: 800000,
                status: "Đang sửa"
            }
        ]
    },
    {
        id: "AST-0006",
        name: "Switch Cisco Catalyst 2960-L 24 Port",
        type: "Network",
        status: "Sẵn có",
        serial: "SNCSCO2960L",
        location: "Phòng Máy Chủ",
        purchaseDate: "2021-06-30",
        assignedEmployeeId: "",
        assignedDate: "",
        assignedNotes: "",
        maintenanceHistory: []
    },
    {
        id: "AST-0007",
        name: "Bàn làm việc văn phòng gỗ MDF 1m2",
        type: "Other",
        status: "Đang cấp phát",
        serial: "N/A",
        location: "Phòng Marketing",
        purchaseDate: "2022-02-15",
        assignedEmployeeId: "EMP-0004",
        assignedDate: "2022-02-16",
        assignedNotes: "Bàn làm việc cá nhân",
        maintenanceHistory: []
    },
    {
        id: "AST-0008",
        name: "Camera Dahua Dome IPC-HDW2230T-AS",
        type: "Camera",
        status: "Đang cấp phát",
        serial: "SNDHUA56789",
        location: "Cổng ra vào bảo vệ",
        purchaseDate: "2024-05-02",
        assignedEmployeeId: "EMP-0006",
        assignedDate: "2024-05-05",
        assignedNotes: "Lắp đặt ngoài trời giám sát xe cộ",
        maintenanceHistory: []
    }
];

const INITIAL_LOGS = [
    { time: "2026-07-15T09:30:00+07:00", type: "system", msg: "Hệ thống Quản lý Tài sản được khởi tạo thành công." },
    { time: "2026-07-15T10:15:23+07:00", type: "assign", msg: "Tài sản <strong>AST-0002</strong> đã được bàn giao cho <strong>Trần Thị Bình (EMP-0002)</strong>." },
    { time: "2026-07-15T11:02:11+07:00", type: "repair", msg: "Tài sản <strong>AST-0005</strong> chuyển trạng thái sang <strong>Đang sửa chữa</strong>." }
];

// --- KHỞI TẠO BIẾN TOÀN CỤC ---
let assets = [];
let employees = [];
let logs = [];
let companyLogo = ""; 
let html5QrScanner = null;
let statusChartInstance = null;
let typeChartInstance = null;

// --- KHI TRANG ĐƯỢC TẢI XONG ---
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    initNavigation();
    initTheme();

    const dateBadge = document.getElementById("current-date");
    if (dateBadge) {
        const today = new Date();
        dateBadge.innerText = today.toLocaleDateString("vi-VN");
    }

    populateEmployeeDropdowns();
    initCompanyLogoDisplay();
    renderDashboard();
    registerEventListeners();
    lucide.createIcons();
});

// --- QUẢN LÝ DỮ LIỆU LOCALSTORAGE ---
function loadData() {
    const savedAssets = localStorage.getItem("it_assets");
    if (savedAssets) {
        assets = JSON.parse(savedAssets);
        assets.forEach(a => {
            if (!a.maintenanceHistory) a.maintenanceHistory = [];
        });
    } else {
        assets = [...INITIAL_ASSETS];
        localStorage.setItem("it_assets", JSON.stringify(assets));
    }

    const savedEmployees = localStorage.getItem("it_employees");
    if (savedEmployees) {
        employees = JSON.parse(savedEmployees);
    } else {
        employees = [...INITIAL_EMPLOYEES];
        localStorage.setItem("it_employees", JSON.stringify(employees));
    }

    const savedLogs = localStorage.getItem("it_asset_logs");
    if (savedLogs) {
        logs = JSON.parse(savedLogs);
    } else {
        logs = [...INITIAL_LOGS];
        localStorage.setItem("it_asset_logs", JSON.stringify(logs));
    }

    companyLogo = localStorage.getItem("it_company_logo") || "";
}

function saveData() {
    localStorage.setItem("it_assets", JSON.stringify(assets));
    localStorage.setItem("it_employees", JSON.stringify(employees));
    localStorage.setItem("it_asset_logs", JSON.stringify(logs));
    if (companyLogo) {
        localStorage.setItem("it_company_logo", companyLogo);
    } else {
        localStorage.removeItem("it_company_logo");
    }
}

function logActivity(type, msg) {
    const newLog = {
        time: new Date().toISOString(),
        type: type,
        msg: msg
    };
    logs.unshift(newLog); 
    if (logs.length > 50) logs.pop(); 
    saveData();
}

function populateEmployeeDropdowns() {
    const dropdowns = [
        document.getElementById("editor-assigned-user"),
        document.getElementById("quick-assigned-user")
    ];

    dropdowns.forEach(dropdown => {
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">-- Chọn nhân viên bàn giao --</option>';
        employees.forEach(emp => {
            const option = document.createElement("option");
            option.value = emp.id;
            option.innerText = `${emp.id} - ${emp.name} (${emp.department})`;
            dropdown.appendChild(option);
        });
    });
}

function initCompanyLogoDisplay() {
    const uploadTrigger = document.getElementById("btn-upload-logo-trigger");
    const removeBtn = document.getElementById("btn-remove-logo");
    const previewDiv = document.getElementById("print-logo-preview");
    const previewImg = document.getElementById("logo-preview-img");

    if (companyLogo) {
        if (previewImg) previewImg.src = companyLogo;
        if (previewDiv) previewDiv.classList.remove("hidden");
        if (removeBtn) removeBtn.classList.remove("hidden");
        if (uploadTrigger) uploadTrigger.innerText = "Thay đổi Logo";
    } else {
        if (previewDiv) previewDiv.classList.add("hidden");
        if (removeBtn) removeBtn.classList.add("hidden");
        if (uploadTrigger) uploadTrigger.innerHTML = '<i data-lucide="upload"></i> Chọn Logo';
        lucide.createIcons();
    }
}

// --- HỆ THỐNG CHUYỂN TAB ĐỒNG BỘ CẢ TRÊN PC VÀ DI ĐỘNG ---
function initNavigation() {
    const menuItems = document.querySelectorAll(".menu-item");
    const mobileItems = document.querySelectorAll(".mobile-nav-item");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");

    const tabSubtitles = {
        dashboard: "Thống kê hiện trạng tài sản IT của công ty",
        assets: "Danh mục quản lý và cập nhật thông tin thiết bị",
        employees: "Danh mục quản lý nhân sự và thiết bị họ đang nắm giữ",
        scanner: "Quét mã QR bằng Camera hoặc file ảnh để xem nhanh thông tin",
        "print-shop": "Tạo nhãn QR và in tem dán lên tài sản",
        "data-exchange": "Nhập danh sách từ Excel/CSV hoặc xuất sao lưu"
    };

    function switchTab(targetTab) {
        menuItems.forEach(item => {
            if (item.getAttribute("data-tab") === targetTab) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        mobileItems.forEach(item => {
            if (item.getAttribute("data-tab") === targetTab) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        document.querySelectorAll(".tab-view").forEach(tab => {
            tab.classList.remove("active");
        });
        
        const activeTabEl = document.getElementById(`tab-${targetTab}`);
        if (activeTabEl) activeTabEl.classList.add("active");

        const matchingMenu = Array.from(menuItems).find(i => i.getAttribute("data-tab") === targetTab);
        if (matchingMenu && pageTitle) {
            pageTitle.innerText = matchingMenu.querySelector("span").innerText;
        } else if (targetTab === "scanner" && pageTitle) {
            pageTitle.innerText = "Quét mã QR";
        }
        
        if (pageSubtitle) {
            pageSubtitle.innerText = tabSubtitles[targetTab] || "";
        }

        if (targetTab === "dashboard") {
            renderDashboard();
        } else if (targetTab === "assets") {
            renderAssetsTable();
        } else if (targetTab === "employees") {
            renderEmployeesTable();
        } else if (targetTab === "scanner") {
            stopScanner(); 
        } else if (targetTab === "print-shop") {
            renderPrintSelection();
        }
    }

    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab(item.getAttribute("data-tab"));
        });
    });

    mobileItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            switchTab(item.getAttribute("data-tab"));
        });
    });

    window.switchAppTab = switchTab;
}

// --- QUẢN LÝ GIAO DIỆN SÁNG / TỐI (LIGHT/DARK MODE) ---
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeText = document.getElementById("theme-text");
    const savedTheme = localStorage.getItem("app_theme") || "dark";

    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        themeText.innerText = "Giao diện Tối";
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        themeText.innerText = "Giao diện Sáng";
    }

    themeToggle.addEventListener("click", () => {
        if (document.body.classList.contains("dark-theme")) {
            document.body.classList.remove("dark-theme");
            document.body.classList.add("light-theme");
            themeText.innerText = "Giao diện Tối";
            localStorage.setItem("app_theme", "light");
        } else {
            document.body.classList.remove("light-theme");
            document.body.classList.add("dark-theme");
            themeText.innerText = "Giao diện Sáng";
            localStorage.setItem("app_theme", "dark");
        }
        if (document.getElementById(`tab-dashboard`).classList.contains("active")) {
            renderDashboardCharts();
        }
    });
}

// --- VIEW 1: RENDER DASHBOARD ---
function renderDashboard() {
    const total = assets.length;
    const assigned = assets.filter(a => a.status === "Đang cấp phát").length;
    const available = assets.filter(a => a.status === "Sẵn có").length;
    const repair = assets.filter(a => a.status === "Đang sửa chữa").length;

    document.getElementById("stat-total").innerText = total;
    document.getElementById("stat-assigned").innerText = assigned;
    document.getElementById("stat-available").innerText = available;
    document.getElementById("stat-repair").innerText = repair;

    const activitiesContainer = document.getElementById("recent-activities");
    activitiesContainer.innerHTML = "";

    if (logs.length === 0) {
        activitiesContainer.innerHTML = `<div class="empty-state" style="padding: 20px;"><p>Không có hoạt động nào được ghi lại.</p></div>`;
    } else {
        logs.forEach(log => {
            const timeStr = formatRelativeTime(log.time);
            let icon = "info";
            if (log.type === "add") icon = "plus-circle";
            else if (log.type === "assign") icon = "user-check";
            else if (log.type === "return") icon = "corner-down-left";
            else if (log.type === "repair") icon = "wrench";
            else if (log.type === "delete") icon = "trash-2";

            const itemHTML = `
                <div class="activity-item">
                    <div class="activity-badge ${log.type}">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="activity-details">
                        <span class="activity-msg">${log.msg}</span>
                        <span class="activity-time">${timeStr}</span>
                    </div>
                </div>
            `;
            activitiesContainer.insertAdjacentHTML("beforeend", itemHTML);
        });
        lucide.createIcons();
    }

    renderDashboardCharts();
}

function renderDashboardCharts() {
    const isDark = document.body.classList.contains("dark-theme");
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.05)";

    if (statusChartInstance) statusChartInstance.destroy();
    if (typeChartInstance) typeChartInstance.destroy();

    const statusData = {
        "Sẵn có": assets.filter(a => a.status === "Sẵn có").length,
        "Đang cấp phát": assets.filter(a => a.status === "Đang cấp phát").length,
        "Đang sửa chữa": assets.filter(a => a.status === "Đang sửa chữa").length,
        "Thanh lý": assets.filter(a => a.status === "Thanh lý").length
    };

    const ctxStatus = document.getElementById("statusChart").getContext("2d");
    statusChartInstance = new Chart(ctxStatus, {
        type: "doughnut",
        data: {
            labels: Object.keys(statusData),
            datasets: [{
                data: Object.values(statusData),
                backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
                borderWidth: isDark ? 2 : 1,
                borderColor: isDark ? "#131a2c" : "#ffffff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { color: textColor, font: { family: "Outfit", size: 12 } }
                }
            }
        }
    });

    const typeCounts = {};
    assets.forEach(a => {
        typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
    });

    const ctxType = document.getElementById("typeChart").getContext("2d");
    typeChartInstance = new Chart(ctxType, {
        type: "bar",
        data: {
            labels: Object.keys(typeCounts),
            datasets: [{
                label: "Số lượng thiết bị",
                data: Object.values(typeCounts),
                backgroundColor: "#3b82f6",
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: "Outfit" }, stepSize: 1 },
                    beginAtZero: true
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { family: "Outfit" } }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function formatRelativeTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay < 7) return `${diffDay} ngày trước`;
    
    return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'});
}

// --- VIEW 2: DANH MỤC TÀI SẢN (ASSETS TABLE) ---
function renderAssetsTable() {
    const searchVal = document.getElementById("asset-search").value.toLowerCase().trim();
    const filterType = document.getElementById("filter-type").value;
    const filterStatus = document.getElementById("filter-status").value;
    const tbody = document.getElementById("assets-list");
    const emptyState = document.getElementById("assets-empty");

    tbody.innerHTML = "";

    const filtered = assets.filter(asset => {
        let empName = "";
        if (asset.assignedEmployeeId) {
            const emp = employees.find(e => e.id === asset.assignedEmployeeId);
            if (emp) empName = emp.name.toLowerCase();
        }

        const matchSearch = (
            asset.id.toLowerCase().includes(searchVal) ||
            asset.name.toLowerCase().includes(searchVal) ||
            (asset.serial && asset.serial.toLowerCase().includes(searchVal)) ||
            empName.includes(searchVal) ||
            (asset.assignedEmployeeId && asset.assignedEmployeeId.toLowerCase().includes(searchVal))
        );

        const matchType = filterType === "" || asset.type === filterType;
        const matchStatus = filterStatus === "" || asset.status === filterStatus;

        return matchSearch && matchType && matchStatus;
    });

    if (filtered.length === 0) {
        emptyState.style.display = "flex";
        document.getElementById("assets-table").style.display = "none";
    } else {
        emptyState.style.display = "none";
        document.getElementById("assets-table").style.display = "table";

        filtered.forEach(asset => {
            let statusBadgeClass = "badge-blue";
            if (asset.status === "Sẵn có") statusBadgeClass = "badge-green";
            else if (asset.status === "Đang sửa chữa") statusBadgeClass = "badge-yellow";
            else if (asset.status === "Thanh lý") statusBadgeClass = "badge-red";

            let employeeInfoHtml = '<span style="color: var(--text-muted); font-style: italic;">Chưa gán</span>';
            if (asset.assignedEmployeeId) {
                const emp = employees.find(e => e.id === asset.assignedEmployeeId);
                if (emp) {
                    employeeInfoHtml = `<strong>${emp.name}</strong> <span style="font-size: 0.75rem; color: var(--text-secondary);">(${emp.id})</span>`;
                } else {
                    employeeInfoHtml = `<strong>${asset.assignedEmployeeId}</strong>`;
                }
            }

            const trHTML = `
                <tr>
                    <td class="asset-code">${asset.id}</td>
                    <td style="font-weight: 500;">${asset.name}</td>
                    <td>${asset.type}</td>
                    <td><span class="badge ${statusBadgeClass}">${asset.status}</span></td>
                    <td>${employeeInfoHtml}</td>
                    <td>${asset.assignedDate ? formatDate(asset.assignedDate) : '--'}</td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn edit" onclick="openEditAssetModal('${asset.id}')" title="Sửa thông tin">
                                <i data-lucide="edit-3"></i>
                            </button>
                            <button class="action-btn qr" onclick="quickViewQR('${asset.id}')" title="Xem & In nhãn QR">
                                <i data-lucide="qr-code"></i>
                            </button>
                            <button class="action-btn delete" onclick="deleteAsset('${asset.id}')" title="Xóa tài sản">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", trHTML);
        });
        lucide.createIcons();
    }
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

window.deleteAsset = function(assetId) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    if (confirm(`Bạn có chắc chắn muốn xóa tài sản ${asset.id} (${asset.name}) không?`)) {
        assets = assets.filter(a => a.id !== assetId);
        logActivity("delete", `Đã xóa tài sản <strong>${asset.id}</strong> (${asset.name}) khỏi hệ thống.`);
        saveData();
        renderAssetsTable();
    }
};

window.quickViewQR = function(assetId) {
    if (window.switchAppTab) {
        window.switchAppTab("print-shop");
        setTimeout(() => {
            document.querySelectorAll(".print-select-card").forEach(card => {
                card.classList.remove("selected");
                const checkbox = card.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.checked = false;
            });

            const targetCard = document.querySelector(`.print-select-card[data-id="${assetId}"]`);
            if (targetCard) {
                targetCard.classList.add("selected");
                const checkbox = targetCard.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.checked = true;
            }
            updatePrintPreview();
        }, 100);
    }
};

// --- VIEW 6: QUẢN LÝ NHÂN SỰ (EMPLOYEES TABLE) ---
function renderEmployeesTable() {
    const searchVal = document.getElementById("employee-search").value.toLowerCase().trim();
    const tbody = document.getElementById("employees-list");
    const emptyState = document.getElementById("employees-empty");

    tbody.innerHTML = "";

    const filtered = employees.filter(emp => {
        return (
            emp.id.toLowerCase().includes(searchVal) ||
            emp.name.toLowerCase().includes(searchVal) ||
            emp.department.toLowerCase().includes(searchVal) ||
            (emp.email && emp.email.toLowerCase().includes(searchVal))
        );
    });

    if (filtered.length === 0) {
        emptyState.style.display = "flex";
        document.getElementById("employees-table").style.display = "none";
    } else {
        emptyState.style.display = "none";
        document.getElementById("employees-table").style.display = "table";

        filtered.forEach(emp => {
            const heldAssets = assets.filter(a => a.assignedEmployeeId === emp.id && a.status === "Đang cấp phát");
            let assetsListHtml = '<span style="color: var(--text-muted); font-style: italic;">Không giữ thiết bị nào</span>';
            
            if (heldAssets.length > 0) {
                assetsListHtml = heldAssets.map(a => {
                    return `<span class="badge badge-blue" style="margin-right: 4px; margin-bottom: 4px; cursor: pointer;" onclick="openEditAssetModal('${a.id}')" title="Xem thiết bị">${a.id}</span>`;
                }).join("");
            }

            const trHTML = `
                <tr>
                    <td class="asset-code" style="font-weight: 700;">${emp.id}</td>
                    <td style="font-weight: 600;">${emp.name}</td>
                    <td>${emp.department}</td>
                    <td>${emp.email || '--'}</td>
                    <td><div style="display: flex; flex-wrap: wrap;">${assetsListHtml}</div></td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn edit" onclick="openEditEmployeeModal('${emp.id}')" title="Sửa thông tin nhân viên">
                                <i data-lucide="edit-3"></i>
                            </button>
                            <button class="action-btn delete" onclick="deleteEmployee('${emp.id}')" title="Xóa nhân viên">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", trHTML);
        });
        lucide.createIcons();
    }
}

// --- CRUD NHÂN VIÊN ---
function openAddEmployeeModal() {
    const form = document.getElementById("form-employee");
    form.reset();
    document.getElementById("editor-employee-id-hidden").value = "";
    document.getElementById("editor-employee-id").readOnly = false;
    document.getElementById("employee-modal-title").innerText = "Thêm nhân sự mới";
    
    document.getElementById("editor-employee-id").value = generateNextEmployeeId();

    const modal = document.getElementById("modal-employee-editor");
    modal.classList.add("show");
}

function openEditEmployeeModal(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    document.getElementById("editor-employee-id-hidden").value = emp.id;
    document.getElementById("editor-employee-id").value = emp.id;
    document.getElementById("editor-employee-id").readOnly = true; 
    document.getElementById("editor-employee-name").value = emp.name;
    document.getElementById("editor-employee-dept").value = emp.department;
    document.getElementById("editor-employee-email").value = emp.email || "";

    document.getElementById("employee-modal-title").innerText = `Chỉnh sửa nhân viên ${emp.id}`;

    const modal = document.getElementById("modal-employee-editor");
    modal.classList.add("show");
}

function closeEmployeeEditorModal() {
    const modal = document.getElementById("modal-employee-editor");
    modal.classList.remove("show");
}

function generateNextEmployeeId() {
    let maxNum = 0;
    employees.forEach(e => {
        const parts = e.id.split("-");
        if (parts.length === 2) {
            const num = parseInt(parts[1], 10);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });
    const nextNum = maxNum + 1;
    return `EMP-${String(nextNum).padStart(4, "0")}`;
}

function saveEmployeeData() {
    const form = document.getElementById("form-employee");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById("editor-employee-id").value.trim().toUpperCase();
    const indexKey = document.getElementById("editor-employee-id-hidden").value;
    const name = document.getElementById("editor-employee-name").value.trim();
    const dept = document.getElementById("editor-employee-dept").value;
    const email = document.getElementById("editor-employee-email").value.trim();

    const empObj = { id, name, department: dept, email };

    if (indexKey === "") {
        if (employees.some(e => e.id === id)) {
            alert("Mã nhân viên này đã tồn tại! Vui lòng chọn mã khác.");
            return;
        }
        employees.push(empObj);
        logActivity("system", `Đã thêm nhân sự mới: <strong>${name} (${id})</strong>.`);
    } else {
        const idx = employees.findIndex(e => e.id === indexKey);
        if (idx !== -1) {
            employees[idx] = empObj;
            logActivity("system", `Cập nhật thông tin nhân sự: <strong>${name} (${id})</strong>.`);
        }
    }

    saveData();
    closeEmployeeEditorModal();
    populateEmployeeDropdowns(); 
    renderEmployeesTable();
}

function deleteEmployee(empId) {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    const holdingAssets = assets.filter(a => a.assignedEmployeeId === empId && a.status === "Đang cấp phát");
    if (holdingAssets.length > 0) {
        alert(`Không thể xóa nhân viên ${emp.name} (${emp.id})!\nNhân viên này đang nắm giữ ${holdingAssets.length} thiết bị (Mã: ${holdingAssets.map(a => a.id).join(", ")}).\nHãy thu hồi thiết bị trước khi xóa nhân sự này.`);
        return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa nhân viên ${emp.name} (${emp.id}) khỏi hệ thống?`)) {
        employees = employees.filter(e => e.id !== empId);
        logActivity("delete", `Đã xóa nhân viên <strong>${emp.name} (${emp.id})</strong> khỏi hệ thống.`);
        saveData();
        populateEmployeeDropdowns();
        renderEmployeesTable();
    }
}


// --- VIEW 3: TRÌNH QUÉT MÃ QR (QR CODE SCANNER) ---
function startScanner() {
    const errorDiv = document.getElementById("file-scan-error");
    if (errorDiv) errorDiv.style.display = "none";

    const btnStart = document.getElementById("btn-start-camera");
    const btnStop = document.getElementById("btn-stop-camera");

    if (!html5QrScanner) {
        html5QrScanner = new Html5Qrcode("qr-reader");
    }

    btnStart.disabled = true;
    btnStop.disabled = false;
    document.getElementById("qr-scanner-overlay").style.display = "flex";

    const config = {
        fps: 10,
        qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.65; 
            return { width: size, height: size };
        },
        aspectRatio: 1.333334
    };

    html5QrScanner.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
            playBeep();
            stopScanner();
            handleScannedResult(decodedText);
        },
        (errorMessage) => {}
    ).catch(err => {
        console.error("Không thể khởi động camera quét: ", err);
        alert("Không thể khởi động Camera. Hãy đảm bảo bạn đã cấp quyền sử dụng camera trong trình duyệt.");
        stopScanner();
    });
}

function stopScanner() {
    const btnStart = document.getElementById("btn-start-camera");
    const btnStop = document.getElementById("btn-stop-camera");

    if (btnStart) btnStart.disabled = false;
    if (btnStop) btnStop.disabled = true;
    
    const overlay = document.getElementById("qr-scanner-overlay");
    if (overlay) overlay.style.display = "none";

    if (html5QrScanner && html5QrScanner.isScanning) {
        html5QrScanner.stop().then(() => {
            console.log("Đã dừng quét QR bằng camera.");
        }).catch(err => {
            console.error("Lỗi khi dừng camera: ", err);
        });
    }
}

function playBeep() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
        console.log("AudioContext bị chặn hoặc không được hỗ trợ");
    }
}

function handleScannedResult(scannedText) {
    const assetId = extractAssetId(scannedText);
    const asset = assets.find(a => a.id.toUpperCase() === assetId.toUpperCase());
    const resultCard = document.getElementById("scan-result-card");
    const manualSearchError = document.getElementById("manual-search-error");

    if (manualSearchError) manualSearchError.style.display = "none";

    if (!asset) {
        alert(`Mã quét được: "${scannedText}"\nKhông tìm thấy tài sản tương ứng với mã "${assetId}" trong hệ thống.`);
        resultCard.classList.add("hidden");
        return;
    }

    resultCard.classList.remove("hidden");
    
    document.getElementById("scan-asset-id").innerText = asset.id;
    document.getElementById("scan-asset-name").innerText = asset.name;
    document.getElementById("scan-asset-type").innerText = asset.type;
    document.getElementById("scan-asset-serial").innerText = asset.serial || "--";
    document.getElementById("scan-asset-location").innerText = asset.location || "--";
    
    let employeeName = "Chưa gán";
    if (asset.assignedEmployeeId) {
        const emp = employees.find(e => e.id === asset.assignedEmployeeId);
        if (emp) employeeName = `${emp.name} (${emp.id})`;
        else employeeName = asset.assignedEmployeeId;
    }
    document.getElementById("scan-asset-user").innerText = employeeName;
    document.getElementById("scan-asset-assign-date").innerText = asset.assignedDate ? formatDate(asset.assignedDate) : "--";

    const badge = document.getElementById("scan-status-badge");
    badge.innerText = asset.status;
    badge.className = "badge";
    if (asset.status === "Sẵn có") badge.classList.add("badge-green");
    else if (asset.status === "Đang cấp phát") badge.classList.add("badge-blue");
    else if (asset.status === "Đang sửa chữa") badge.classList.add("badge-yellow");
    else if (asset.status === "Thanh lý") badge.classList.add("badge-red");

    const btnAssign = document.getElementById("btn-quick-assign");
    const btnReturn = document.getElementById("btn-quick-return");
    const btnRepair = document.getElementById("btn-quick-repair");

    if (asset.status === "Sẵn có") {
        btnAssign.classList.remove("hidden");
        btnReturn.classList.add("hidden");
        btnRepair.classList.remove("hidden");
    } else if (asset.status === "Đang cấp phát") {
        btnAssign.classList.add("hidden");
        btnReturn.classList.remove("hidden");
        btnRepair.classList.remove("hidden");
    } else if (asset.status === "Đang sửa chữa") {
        btnAssign.classList.add("hidden");
        btnReturn.classList.remove("hidden"); 
        btnRepair.classList.add("hidden");
    } else {
        btnAssign.classList.add("hidden");
        btnReturn.classList.add("hidden");
        btnRepair.classList.add("hidden");
    }

    btnAssign.onclick = () => openQuickAssignModal(asset.id);
    btnReturn.onclick = () => performQuickReturn(asset.id);
    btnRepair.onclick = () => performQuickRepair(asset.id);
    document.getElementById("btn-quick-edit").onclick = () => {
        openEditAssetModal(asset.id);
    };
}

// --- TRÍCH XUẤT MÃ TÀI SẢN THÔNG MINH BẰNG REGEX (PHASE 4) ---
function extractAssetId(text) {
    if (!text) return "";
    text = text.trim();
    
    // 1. Kiểm tra nếu là định dạng chứa văn bản: "Mã tài sản: AST-XXXX"
    if (text.includes("Mã tài sản:")) {
        const match = text.match(/Mã tài sản:\s*(AST-\d+)/i);
        if (match && match[1]) {
            return match[1].toUpperCase();
        }
    }
    
    // 2. Kiểm tra nếu là URL chứa tham số id
    try {
        if (text.startsWith("http://") || text.startsWith("https://")) {
            const url = new URL(text);
            const idParam = url.searchParams.get("id");
            if (idParam) return idParam.toUpperCase();
            
            const pathSegments = url.pathname.split("/");
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (lastSegment && lastSegment.toUpperCase().startsWith("AST-")) {
                return lastSegment.toUpperCase();
            }
        }
    } catch (e) {}
    
    // 3. Sử dụng Regex tìm mẫu khớp AST-xxxx ở bất kỳ vị trí nào trong chuỗi văn bản quét được
    const rawMatch = text.match(/(AST-\d+)/i);
    if (rawMatch && rawMatch[1]) {
        return rawMatch[1].toUpperCase();
    }
    
    return text.toUpperCase();
}

function performQuickReturn(assetId) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    if (confirm(`Xác nhận thu hồi tài sản ${asset.id} về kho (chuyển sang trạng thái Sẵn có)?`)) {
        let oldUserText = asset.assignedEmployeeId;
        const emp = employees.find(e => e.id === asset.assignedEmployeeId);
        if (emp) oldUserText = emp.name;

        asset.status = "Sẵn có";
        asset.assignedEmployeeId = "";
        asset.assignedDate = "";
        asset.assignedNotes = "";
        
        logActivity("return", `Thu hồi tài sản <strong>${asset.id}</strong> từ nhân viên <strong>${oldUserText}</strong> về kho.`);
        saveData();
        handleScannedResult(asset.id);
    }
}

function performQuickRepair(assetId) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const reason = prompt("Nhập lý do hỏng hoặc triệu chứng lỗi để chuyển sang bảo trì:", "Hỏng màn hình, không lên nguồn...");
    if (reason === null) return; 

    asset.status = "Đang sửa chữa";
    
    const newRecord = {
        startDate: new Date().toISOString().substring(0, 10),
        endDate: "",
        reason: reason || "Báo sửa nhanh từ quét mã QR",
        provider: "Chưa ghi nhận",
        cost: 0,
        status: "Đang sửa"
    };
    asset.maintenanceHistory.push(newRecord);

    logActivity("repair", `Đã chuyển tài sản <strong>${asset.id}</strong> sang bảo trì với lý do: "${newRecord.reason}".`);
    saveData();
    handleScannedResult(asset.id);
}

// --- VIEW 4: TẠO NHÃN IN QR ---
function renderPrintSelection() {
    const container = document.getElementById("print-selection-container");
    container.innerHTML = "";

    if (assets.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Không có tài sản nào để tạo nhãn in. Hãy thêm tài sản trước.</div>`;
        return;
    }

    assets.forEach(asset => {
        const cardHTML = `
            <div class="print-select-card selected" data-id="${asset.id}">
                <input type="checkbox" checked style="pointer-events: none;" class="hidden-checkbox">
                <i data-lucide="check-square" class="check-icon" style="color: var(--accent-blue);"></i>
                <div class="asset-info">
                    <span class="asset-code">${asset.id}</span>
                    <span class="asset-name" title="${asset.name}">${asset.name}</span>
                </div>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", cardHTML);
    });

    lucide.createIcons();

    document.querySelectorAll(".print-select-card").forEach(card => {
        card.addEventListener("click", () => {
            const checkbox = card.querySelector(".hidden-checkbox");
            const icon = card.querySelector(".check-icon");
            
            if (card.classList.contains("selected")) {
                card.classList.remove("selected");
                if (checkbox) checkbox.checked = false;
                if (icon) icon.setAttribute("data-lucide", "square");
            } else {
                card.classList.add("selected");
                if (checkbox) checkbox.checked = true;
                if (icon) icon.setAttribute("data-lucide", "check-square");
            }
            lucide.createIcons();
            updatePrintPreview();
        });
    });

    updatePrintPreview();
}

function updatePrintPreview() {
    const canvasPreview = document.getElementById("print-layout-canvas");
    canvasPreview.innerHTML = "";

    const size = document.getElementById("print-label-size").value;
    canvasPreview.className = "print-layout-canvas"; 
    canvasPreview.classList.add(`size-${size}`);

    const companyName = document.getElementById("print-company-name").value || "TÀI SẢN CÔNG TY";
    const showName = document.getElementById("print-show-name").checked;
    const showSerial = document.getElementById("print-show-serial").checked;
    const showLogo = document.getElementById("print-show-logo").checked;
    const encodeUser = document.getElementById("print-encode-user-in-qr").checked; // Đọc thiết lập mã hóa thông tin nhân viên

    const selectedIds = [];
    document.querySelectorAll(".print-select-card.selected").forEach(card => {
        selectedIds.push(card.getAttribute("data-id"));
    });

    if (selectedIds.length === 0) {
        canvasPreview.innerHTML = `<div style="text-align: center; padding: 40px; color: #555555; font-style: italic; width: 100%; grid-column: 1/-1;">Vui lòng chọn ít nhất một tài sản ở danh sách trên để xem trước nhãn dán.</div>`;
        return;
    }

    selectedIds.forEach(id => {
        const asset = assets.find(a => a.id === id);
        if (!asset) return;

        const sticker = document.createElement("div");
        sticker.className = "qr-label-sticker";

        const logoHtml = (showLogo && companyLogo) ? `<img src="${companyLogo}" class="label-logo">` : "";

        sticker.innerHTML = `
            <div class="label-left">
                <canvas class="qr-canvas-element"></canvas>
            </div>
            <div class="label-right">
                <div class="company-header" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                    ${logoHtml}
                    <span>${companyName}</span>
                </div>
                <div class="label-code">${asset.id}</div>
                ${showName ? `<div class="label-name">${asset.name}</div>` : ''}
                ${showSerial && asset.serial && asset.serial !== "N/A" ? `<div class="label-serial">S/N: ${asset.serial}</div>` : ''}
            </div>
        `;

        canvasPreview.appendChild(sticker);

        const qrCanvas = sticker.querySelector(".qr-canvas-element");
        
        let qrSize = 100;
        if (size === "small") qrSize = 65;
        else if (size === "medium") qrSize = 90;
        else if (size === "large") qrSize = 120;

        // Xử lý nội dung của mã QR
        let qrValue = asset.id;
        if (encodeUser) {
            let userInfoText = "Chưa gán";
            if (asset.assignedEmployeeId) {
                const emp = employees.find(e => e.id === asset.assignedEmployeeId);
                if (emp) userInfoText = `${emp.name} (${emp.id})`;
                else userInfoText = asset.assignedEmployeeId;
            }
            
            if (asset.status === "Đang cấp phát") {
                qrValue = `Mã tài sản: ${asset.id} | Sử dụng: ${userInfoText} | Ngày cấp: ${formatDate(asset.assignedDate)}`;
            } else {
                qrValue = `Mã tài sản: ${asset.id} | Trạng thái: ${asset.status}`;
            }
        }

        new QRious({
            element: qrCanvas,
            value: qrValue,
            size: qrSize,
            level: 'H'
        });
    });
}

// --- VIEW 5: IMPORT / EXPORT DATA ---
function downloadCSVTemplate() {
    const csvContent = "\ufeffMã tài sản,Tên tài sản,Loại,Trạng thái,Số Serial,Vị trí,Ngày mua,Người sử dụng,Ngày cấp,Ghi chú\n" +
                       "AST-0009,Màn hình Dell UltraSharp U2422H,Other,Sẵn có,SNDELLUS24,Kho IT,2024-05-10,,,\n" +
                       "AST-0010,Laptop Asus Zenbook 14,Laptop,Đang cấp phát,SNASUSZB14,Phòng Marketing,2025-02-18,EMP-0004,2025-02-20,Cấp kèm sạc type-C";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "IT_Asset_Template_Phase2.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToCSV() {
    const onlyAssigned = document.getElementById("export-only-assigned").checked;
    const onlyActive = document.getElementById("export-only-active").checked;

    let listToExport = [...assets];

    if (onlyAssigned) {
        listToExport = listToExport.filter(a => a.status === "Đang cấp phát");
    }

    if (onlyActive) {
        listToExport = listToExport.filter(a => a.status !== "Thanh lý");
    }

    if (listToExport.length === 0) {
        alert("Không có tài sản nào phù hợp điều kiện lọc để xuất dữ liệu.");
        return;
    }

    let csvContent = "\ufeffMã tài sản,Tên tài sản,Loại,Trạng thái,Số Serial,Vị trí,Ngày mua,Người sử dụng,Ngày cấp,Ghi chú\n";

    listToExport.forEach(a => {
        const row = [
            escapeCSVField(a.id),
            escapeCSVField(a.name),
            escapeCSVField(a.type),
            escapeCSVField(a.status),
            escapeCSVField(a.serial),
            escapeCSVField(a.location),
            escapeCSVField(a.purchaseDate),
            escapeCSVField(a.assignedEmployeeId), 
            escapeCSVField(a.assignedDate),
            escapeCSVField(a.assignedNotes)
        ];
        csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const filename = `IT_Assets_Export_${new Date().toISOString().slice(0,10)}.csv`;
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function escapeCSVField(val) {
    if (val === undefined || val === null) return "";
    let str = String(val);
    if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
        str = str.replace(/"/g, '""');
        return `"${str}"`;
    }
    return str;
}

function handleCSVImport(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const lines = parseCSVText(text);

            if (lines.length <= 1) {
                showImportStatus("error", "File CSV không chứa dữ liệu hoặc không đúng cấu trúc.");
                return;
            }

            const headers = lines[0].map(h => h.trim().replace(/^\ufeff/, ""));
            const requiredHeaders = ["Mã tài sản", "Tên tài sản", "Loại", "Trạng thái"];
            const missing = requiredHeaders.filter(h => !headers.includes(h));
            if (missing.length > 0) {
                showImportStatus("error", `File CSV thiếu các cột bắt buộc: ${missing.join(", ")}`);
                return;
            }

            const colIndex = {};
            headers.forEach((h, idx) => {
                colIndex[h] = idx;
            });

            let importCount = 0;
            let updateCount = 0;

            for (let i = 1; i < lines.length; i++) {
                const row = lines[i];
                if (row.length < requiredHeaders.length || (row.length === 1 && row[0] === "")) continue;

                const rawId = row[colIndex["Mã tài sản"]] || "";
                const name = row[colIndex["Tên tài sản"]] || "";
                const type = row[colIndex["Loại"]] || "Other";
                const status = row[colIndex["Trạng thái"]] || "Sẵn có";
                const serial = row[colIndex["Số Serial"]] || "N/A";
                const location = row[colIndex["Vị trí"]] || "Kho IT";
                const purchaseDate = row[colIndex["Ngày mua"]] || "";
                const assignedEmployeeId = row[colIndex["Người sử dụng"]] || ""; 
                const assignedDate = row[colIndex["Ngày cấp"]] || "";
                const assignedNotes = row[colIndex["Ghi chú"]] || "";

                if (!rawId || !name) continue;

                const formattedId = rawId.trim().toUpperCase();

                const assetData = {
                    id: formattedId,
                    name: name.trim(),
                    type: type.trim(),
                    status: status.trim(),
                    serial: serial.trim(),
                    location: location.trim(),
                    purchaseDate: purchaseDate.trim(),
                    assignedEmployeeId: assignedEmployeeId.trim().toUpperCase(),
                    assignedDate: assignedDate.trim(),
                    assignedNotes: assignedNotes.trim(),
                    maintenanceHistory: [] 
                };

                const existingIndex = assets.findIndex(a => a.id === formattedId);
                if (existingIndex !== -1) {
                    assetData.maintenanceHistory = assets[existingIndex].maintenanceHistory || [];
                    assets[existingIndex] = assetData;
                    updateCount++;
                } else {
                    assets.push(assetData);
                    importCount++;
                }
            }

            saveData();
            logActivity("add", `Đã nhập tệp CSV: Thêm mới <strong>${importCount}</strong>, Cập nhật <strong>${updateCount}</strong> tài sản.`);
            showImportStatus("success", `Nhập dữ liệu thành công! Đã thêm mới ${importCount} và cập nhật ${updateCount} tài sản.`);
            
        } catch (err) {
            console.error(err);
            showImportStatus("error", "Đã xảy ra lỗi khi phân tích cú pháp tệp CSV. Đảm bảo mã hóa UTF-8.");
        }
    };

    reader.onerror = function() {
        showImportStatus("error", "Không thể đọc tệp tin.");
    };

    reader.readAsText(file, "UTF-8");
}

function parseCSVText(text) {
    const lines = [];
    let row = [""];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i+1];

        if (c === '"') {
            if (inQuotes && next === '"') {
                row[row.length - 1] += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (c === ',') {
            if (inQuotes) {
                row[row.length - 1] += c;
            } else {
                row.push("");
            }
        } else if (c === '\r' || c === '\n') {
            if (inQuotes) {
                row[row.length - 1] += c;
            } else {
                if (c === '\r' && next === '\n') {
                    i++;
                }
                lines.push(row);
                row = [""];
            }
        } else {
            row[row.length - 1] += c;
        }
    }
    if (row.length > 1 || row[0] !== "") {
        lines.push(row);
    }
    return lines;
}

function showImportStatus(type, msg) {
    const statusDiv = document.getElementById("csv-import-status");
    statusDiv.style.display = "block";
    statusDiv.className = `import-status-message ${type}`;
    statusDiv.innerText = msg;
}

// --- LOGIC SAO LƯU & KHÔI PHỤC JSON HỆ THỐNG ---
function backupSystemData() {
    const backup = {
        backupVersion: "3.0",
        createdAt: new Date().toISOString(),
        assets: assets,
        employees: employees,
        logs: logs,
        companyLogo: companyLogo
    };
    
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const filename = `IT_Asset_Backup_${new Date().toISOString().slice(0,10)}.json`;
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    logActivity("system", "Đã xuất và tải về tệp tin sao lưu hệ thống dạng JSON.");
    renderDashboard(); 
}

function restoreSystemData(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const backup = JSON.parse(text);

            if (!backup.assets || !Array.isArray(backup.assets) || !backup.employees || !Array.isArray(backup.employees)) {
                showRestoreStatus("error", "Tệp tin sao lưu không đúng cấu trúc định dạng. Thiếu dữ liệu tài sản hoặc nhân viên.");
                return;
            }

            if (confirm("CẢNH BÁO: Hành động này sẽ ghi đè toàn bộ dữ liệu tài sản, nhân sự, lịch sử bảo trì, logo và nhật ký hiện có bằng dữ liệu từ file sao lưu. Bạn có muốn tiếp tục?")) {
                assets = backup.assets;
                employees = backup.employees;
                logs = backup.logs || [];
                companyLogo = backup.companyLogo || "";

                const restoreMsg = "Đã khôi phục toàn bộ cơ sở dữ liệu hệ thống từ tệp tin sao lưu JSON.";
                const newLog = {
                    time: new Date().toISOString(),
                    type: "system",
                    msg: restoreMsg
                };
                logs.unshift(newLog);

                saveData();
                
                populateEmployeeDropdowns();
                initCompanyLogoDisplay();
                renderDashboard();
                
                showRestoreStatus("success", "Khôi phục dữ liệu hệ thống thành công!");
                alert("Dữ liệu hệ thống đã được phục hồi hoàn tất!");
            }
        } catch (err) {
            console.error(err);
            showRestoreStatus("error", "Lỗi phân tích cú pháp tệp JSON. File có thể bị hỏng hoặc cấu trúc sai.");
        }
    };

    reader.onerror = function() {
        showRestoreStatus("error", "Lỗi không đọc được tệp tin tải lên.");
    };

    reader.readAsText(file, "UTF-8");
}

function showRestoreStatus(type, msg) {
    const statusDiv = document.getElementById("restore-status");
    if (!statusDiv) return;
    statusDiv.style.display = "block";
    statusDiv.className = `import-status-message ${type}`;
    statusDiv.innerText = msg;
}

// --- MODALS VÀ FORM SOẠN THẢO (ADD/EDIT ASSET) ---
function openAddAssetModal() {
    const form = document.getElementById("form-asset");
    form.reset();
    
    const nextId = generateNextAssetId();
    document.getElementById("editor-asset-id").value = nextId;
    document.getElementById("editor-asset-index").value = ""; 
    document.getElementById("modal-title").innerText = "Thêm tài sản IT mới";
    
    const todayStr = new Date().toISOString().substring(0, 10);
    document.getElementById("editor-purchase-date").value = todayStr;
    document.getElementById("editor-assigned-date").value = todayStr;

    toggleAssignmentFields();
    
    document.getElementById("editor-maintenance-history-section").style.display = "none";

    const modal = document.getElementById("modal-asset-editor");
    modal.classList.add("show");
}

function openEditAssetModal(assetId) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    document.getElementById("editor-asset-id").value = asset.id;
    document.getElementById("editor-asset-index").value = assetId; 
    document.getElementById("editor-asset-name").value = asset.name;
    document.getElementById("editor-asset-type").value = asset.type;
    document.getElementById("editor-asset-status").value = asset.status;
    document.getElementById("editor-asset-serial").value = asset.serial || "";
    document.getElementById("editor-asset-location").value = asset.location || "";
    document.getElementById("editor-purchase-date").value = asset.purchaseDate || "";
    
    document.getElementById("editor-assigned-user").value = asset.assignedEmployeeId || "";
    document.getElementById("editor-assigned-date").value = asset.assignedDate || "";
    document.getElementById("editor-assigned-notes").value = asset.assignedNotes || "";

    document.getElementById("modal-title").innerText = `Chỉnh sửa tài sản ${asset.id}`;
    
    toggleAssignmentFields();

    document.getElementById("editor-maintenance-history-section").style.display = "block";
    renderAssetMaintenanceList(asset);

    const modal = document.getElementById("modal-asset-editor");
    modal.classList.add("show");
}

function closeAssetEditorModal() {
    const modal = document.getElementById("modal-asset-editor");
    modal.classList.remove("show");
}

function generateNextAssetId() {
    let maxNum = 0;
    assets.forEach(a => {
        const parts = a.id.split("-");
        if (parts.length === 2) {
            const num = parseInt(parts[1], 10);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });
    const nextNum = maxNum + 1;
    return `AST-${String(nextNum).padStart(4, "0")}`;
}

function toggleAssignmentFields() {
    const statusSelect = document.getElementById("editor-asset-status");
    const assignSection = document.getElementById("editor-assignment-fields");
    const assignSelect = document.getElementById("editor-assigned-user");
    
    if (statusSelect.value === "Đang cấp phát") {
        assignSection.style.display = "block";
        assignSelect.required = true;
    } else {
        assignSection.style.display = "none";
        assignSelect.required = false;
    }
}

function saveAssetData() {
    const form = document.getElementById("form-asset");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById("editor-asset-id").value;
    const indexKey = document.getElementById("editor-asset-index").value; 

    const name = document.getElementById("editor-asset-name").value;
    const type = document.getElementById("editor-asset-type").value;
    const status = document.getElementById("editor-asset-status").value;
    const serial = document.getElementById("editor-asset-serial").value || "N/A";
    const location = document.getElementById("editor-asset-location").value || "Kho IT";
    const purchaseDate = document.getElementById("editor-purchase-date").value || "";

    let assignedEmployeeId = "";
    let assignedDate = "";
    let assignedNotes = "";

    if (status === "Đang cấp phát") {
        assignedEmployeeId = document.getElementById("editor-assigned-user").value;
        assignedDate = document.getElementById("editor-assigned-date").value || new Date().toISOString().substring(0, 10);
        assignedNotes = document.getElementById("editor-assigned-notes").value;
    }

    let empNameText = assignedEmployeeId;
    const emp = employees.find(e => e.id === assignedEmployeeId);
    if (emp) empNameText = emp.name;

    const assetObj = {
        id: id,
        name: name,
        type: type,
        status: status,
        serial: serial,
        location: location,
        purchaseDate: purchaseDate,
        assignedEmployeeId: assignedEmployeeId,
        assignedDate: assignedDate,
        assignedNotes: assignedNotes,
        maintenanceHistory: [] 
    };

    if (indexKey === "") {
        assets.push(assetObj);
        logActivity("add", `Đã thêm mới tài sản <strong>${id}</strong> (${name}) vào kho.`);
    } else {
        const idx = assets.findIndex(a => a.id === indexKey);
        if (idx !== -1) {
            const oldStatus = assets[idx].status;
            assetObj.maintenanceHistory = assets[idx].maintenanceHistory || [];
            assets[idx] = assetObj;
            
            if (oldStatus !== status) {
                if (status === "Đang cấp phát") {
                    logActivity("assign", `Bàn giao tài sản <strong>${id}</strong> cho <strong>${empNameText} (${assignedEmployeeId})</strong>.`);
                } else if (oldStatus === "Đang cấp phát") {
                    logActivity("return", `Thu hồi tài sản <strong>${id}</strong> về kho.`);
                } else {
                    logActivity("system", `Cập nhật trạng thái tài sản <strong>${id}</strong> thành <strong>${status}</strong>.`);
                }
            } else {
                logActivity("system", `Chỉnh sửa thông tin chi tiết tài sản <strong>${id}</strong>.`);
            }
        }
    }

    saveData();
    closeAssetEditorModal();

    if (document.getElementById("tab-assets").classList.contains("active")) {
        renderAssetsTable();
    } else {
        handleScannedResult(id);
    }
}

function openQuickAssignModal(assetId) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    document.getElementById("assign-target-id").value = asset.id;
    document.getElementById("assign-target-name").innerText = `${asset.id} - ${asset.name}`;
    document.getElementById("quick-assigned-user").value = "";
    document.getElementById("quick-assigned-date").value = new Date().toISOString().substring(0, 10);
    document.getElementById("quick-assigned-notes").value = "";

    const modal = document.getElementById("modal-quick-assign");
    modal.classList.add("show");
}

function closeQuickAssignModal() {
    document.getElementById("modal-quick-assign").classList.remove("show");
}

function submitQuickAssignment() {
    const form = document.getElementById("form-quick-assign");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const assetId = document.getElementById("assign-target-id").value;
    const employeeId = document.getElementById("quick-assigned-user").value;
    const date = document.getElementById("quick-assigned-date").value;
    const notes = document.getElementById("quick-assigned-notes").value;

    const asset = assets.find(a => a.id === assetId);
    const emp = employees.find(e => e.id === employeeId);
    if (asset && emp) {
        asset.status = "Đang cấp phát";
        asset.assignedEmployeeId = employeeId;
        asset.assignedDate = date;
        asset.assignedNotes = notes;

        logActivity("assign", `Bàn giao nhanh tài sản <strong>${asset.id}</strong> cho nhân viên <strong>${emp.name} (${employeeId})</strong>.`);
        saveData();
        closeQuickAssignModal();
        handleScannedResult(assetId);
    }
}

// --- QUẢN LÝ PHIẾU BẢO TRÌ SỬA CHỮA ---
function renderAssetMaintenanceList(asset) {
    const tbody = document.getElementById("editor-maintenance-list");
    tbody.innerHTML = "";

    const history = asset.maintenanceHistory || [];
    if (history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); font-style: italic;">Không có lịch sử bảo trì.</td></tr>`;
        return;
    }

    history.forEach((record, index) => {
        const costFormatted = record.cost ? parseInt(record.cost, 10).toLocaleString("vi-VN") + " đ" : "0 đ";
        const returnDateFormatted = record.endDate ? formatDate(record.endDate) : "--";
        const badgeClass = record.status === "Đã xong" ? "badge-green" : "badge-yellow";

        const trHTML = `
            <tr>
                <td>${formatDate(record.startDate)}</td>
                <td style="font-weight: 500;">${record.reason}</td>
                <td>${record.provider || "--"}</td>
                <td style="font-weight: 600;">${costFormatted}</td>
                <td>${returnDateFormatted}</td>
                <td><span class="badge ${badgeClass}">${record.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button type="button" class="action-btn edit" onclick="openEditMaintenanceModal('${asset.id}', ${index})" title="Sửa phiếu">
                            <i data-lucide="edit-2" style="width: 12px; height: 12px;"></i>
                        </button>
                        <button type="button" class="action-btn delete" onclick="deleteMaintenanceRecord('${asset.id}', ${index})" title="Xóa phiếu">
                            <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", trHTML);
    });
    lucide.createIcons();
}

function openAddMaintenanceModal() {
    const assetId = document.getElementById("editor-asset-id").value;
    document.getElementById("maintenance-asset-id").value = assetId;
    document.getElementById("maintenance-record-index").value = ""; 
    
    const form = document.getElementById("form-maintenance");
    form.reset();

    const todayStr = new Date().toISOString().substring(0, 10);
    document.getElementById("maint-start-date").value = todayStr;
    document.getElementById("maint-status").value = "Đang sửa";
    
    toggleMaintenanceEndDateField();

    document.getElementById("maintenance-modal-title").innerText = `Thêm phiếu bảo trì - Tài sản ${assetId}`;
    document.getElementById("modal-maintenance-editor").classList.add("show");
}

window.openEditMaintenanceModal = function(assetId, recordIndex) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset || !asset.maintenanceHistory || !asset.maintenanceHistory[recordIndex]) return;

    const record = asset.maintenanceHistory[recordIndex];

    document.getElementById("maintenance-asset-id").value = assetId;
    document.getElementById("maintenance-record-index").value = recordIndex;
    
    document.getElementById("maint-start-date").value = record.startDate || "";
    document.getElementById("maint-reason").value = record.reason || "";
    document.getElementById("maint-provider").value = record.provider || "";
    document.getElementById("maint-cost").value = record.cost || "0";
    document.getElementById("maint-status").value = record.status || "Đang sửa";
    document.getElementById("maint-end-date").value = record.endDate || "";

    toggleMaintenanceEndDateField();

    document.getElementById("maintenance-modal-title").innerText = `Chỉnh sửa phiếu bảo trì #${recordIndex + 1} - ${assetId}`;
    document.getElementById("modal-maintenance-editor").classList.add("show");
};

function closeMaintenanceModal() {
    document.getElementById("modal-maintenance-editor").classList.remove("show");
}

function toggleMaintenanceEndDateField() {
    const status = document.getElementById("maint-status").value;
    const endDateGroup = document.getElementById("maint-end-date-group");
    if (status === "Đã xong") {
        endDateGroup.style.display = "block";
        document.getElementById("maint-end-date").required = true;
        if (!document.getElementById("maint-end-date").value) {
            document.getElementById("maint-end-date").value = new Date().toISOString().substring(0, 10);
        }
    } else {
        endDateGroup.style.display = "none";
        document.getElementById("maint-end-date").required = false;
    }
}

function saveMaintenanceRecord() {
    const form = document.getElementById("form-maintenance");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const assetId = document.getElementById("maintenance-asset-id").value;
    const recordIndex = document.getElementById("maintenance-record-index").value;

    const startDate = document.getElementById("maint-start-date").value;
    const reason = document.getElementById("maint-reason").value.trim();
    const provider = document.getElementById("maint-provider").value.trim();
    const cost = parseFloat(document.getElementById("maint-cost").value) || 0;
    const status = document.getElementById("maint-status").value;
    const endDate = status === "Đã xong" ? document.getElementById("maint-end-date").value : "";

    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const recordObj = { startDate, reason, provider, cost, status, endDate };

    if (recordIndex === "") {
        if (!asset.maintenanceHistory) asset.maintenanceHistory = [];
        asset.maintenanceHistory.push(recordObj);
        
        if (status === "Đang sửa") {
            asset.status = "Đang sửa chữa";
            document.getElementById("editor-asset-status").value = "Đang sửa chữa";
        }
        
        logActivity("repair", `Tạo phiếu sửa chữa tài sản <strong>${asset.id}</strong>: "${reason}" (Đơn vị: ${provider || 'N/A'}).`);
    } else {
        const idx = parseInt(recordIndex, 10);
        asset.maintenanceHistory[idx] = recordObj;

        if (status === "Đang sửa") {
            asset.status = "Đang sửa chữa";
            document.getElementById("editor-asset-status").value = "Đang sửa chữa";
        }
        
        logActivity("system", `Cập nhật phiếu sửa chữa #${idx+1} của tài sản <strong>${asset.id}</strong>.`);
    }

    saveData();
    closeMaintenanceModal();
    renderAssetMaintenanceList(asset);
    toggleAssignmentFields(); 
}

window.deleteMaintenanceRecord = function(assetId, recordIndex) {
    const asset = assets.find(a => a.id === assetId);
    if (!asset || !asset.maintenanceHistory) return;

    if (confirm(`Bạn có chắc muốn xóa phiếu sửa chữa này không?`)) {
        asset.maintenanceHistory.splice(recordIndex, 1);
        logActivity("delete", `Đã xóa một phiếu sửa chữa khỏi tài sản <strong>${asset.id}</strong>.`);
        saveData();
        renderAssetMaintenanceList(asset);
    }
};

// --- ĐĂNG KÝ CÁC SỰ KIỆN TƯƠNG TÁC (EVENT LISTENERS) ---
function registerEventListeners() {
    const searchInput = document.getElementById("asset-search");
    if (searchInput) searchInput.addEventListener("input", renderAssetsTable);
    
    const filterType = document.getElementById("filter-type");
    if (filterType) filterType.addEventListener("change", renderAssetsTable);
    
    const filterStatus = document.getElementById("filter-status");
    if (filterStatus) filterStatus.addEventListener("change", renderAssetsTable);

    const empSearchInput = document.getElementById("employee-search");
    if (empSearchInput) empSearchInput.addEventListener("input", renderEmployeesTable);

    document.getElementById("btn-add-asset").addEventListener("click", openAddAssetModal);
    document.getElementById("btn-add-employee").addEventListener("click", openAddEmployeeModal);

    document.getElementById("btn-close-editor-modal").addEventListener("click", closeAssetEditorModal);
    document.getElementById("btn-cancel-editor").addEventListener("click", closeAssetEditorModal);
    document.getElementById("btn-save-asset").addEventListener("click", saveAssetData);
    document.getElementById("editor-asset-status").addEventListener("change", toggleAssignmentFields);

    document.getElementById("btn-close-assign-modal").addEventListener("click", closeQuickAssignModal);
    document.getElementById("btn-cancel-assign").addEventListener("click", closeQuickAssignModal);
    document.getElementById("btn-submit-assign").addEventListener("click", submitQuickAssignment);

    document.getElementById("btn-close-employee-modal").addEventListener("click", closeEmployeeEditorModal);
    document.getElementById("btn-cancel-employee").addEventListener("click", closeEmployeeEditorModal);
    document.getElementById("btn-save-employee").addEventListener("click", saveEmployeeData);

    document.getElementById("btn-close-maintenance-modal").addEventListener("click", closeMaintenanceModal);
    document.getElementById("btn-cancel-maint").addEventListener("click", closeMaintenanceModal);
    document.getElementById("btn-save-maint").addEventListener("click", saveMaintenanceRecord);
    document.getElementById("maint-status").addEventListener("change", toggleMaintenanceEndDateField);
    document.getElementById("btn-add-maintenance-record").addEventListener("click", openAddMaintenanceModal);

    document.getElementById("clear-logs").addEventListener("click", () => {
        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ nhật ký hoạt động không?")) {
            logs = [];
            saveData();
            renderDashboard();
        }
    });

    document.getElementById("btn-start-camera").addEventListener("click", startScanner);
    document.getElementById("btn-stop-camera").addEventListener("click", stopScanner);

    document.getElementById("btn-manual-search").addEventListener("click", () => {
        const inputId = document.getElementById("manual-asset-id").value.trim();
        const errorDiv = document.getElementById("manual-search-error");
        
        if (inputId === "") {
            alert("Vui lòng nhập mã tài sản.");
            return;
        }

        const asset = assets.find(a => a.id.toUpperCase() === inputId.toUpperCase());
        if (asset) {
            errorDiv.style.display = "none";
            handleScannedResult(asset.id);
        } else {
            errorDiv.style.display = "block";
            document.getElementById("scan-result-card").classList.add("hidden");
        }
    });

    const dropZone = document.getElementById("qr-drop-zone");
    const fileInput = document.getElementById("qr-file-input");
    const fileScanError = document.getElementById("file-scan-error");

    dropZone.addEventListener("click", () => fileInput.click());

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--accent-blue)";
        dropZone.style.backgroundColor = "rgba(59, 130, 246, 0.05)";
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.style.borderColor = "var(--border-color)";
        dropZone.style.backgroundColor = "var(--bg-tertiary)";
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--border-color)";
        dropZone.style.backgroundColor = "var(--bg-tertiary)";
        if (e.dataTransfer.files.length > 0) {
            processQRFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            processQRFile(e.target.files[0]);
        }
    });

    function processQRFile(file) {
        fileScanError.style.display = "none";
        const tempScanner = new Html5Qrcode("qr-reader");
        tempScanner.scanFile(file, true)
            .then(decodedText => {
                playBeep();
                handleScannedResult(decodedText);
            })
            .catch(err => {
                console.error(err);
                fileScanError.style.display = "block";
                fileScanError.innerText = "Không tìm thấy mã QR hợp lệ trong ảnh này. Hãy thử chụp ảnh rõ nét và thẳng hơn.";
            });
    }

    document.getElementById("print-label-size").addEventListener("change", updatePrintPreview);
    document.getElementById("print-company-name").addEventListener("input", updatePrintPreview);
    document.getElementById("print-show-name").addEventListener("change", updatePrintPreview);
    document.getElementById("print-show-serial").addEventListener("change", updatePrintPreview);
    document.getElementById("print-show-logo").addEventListener("change", updatePrintPreview);
    document.getElementById("print-encode-user-in-qr").addEventListener("change", updatePrintPreview);

    document.getElementById("btn-select-all-print").addEventListener("click", () => {
        document.querySelectorAll(".print-select-card").forEach(card => {
            card.classList.add("selected");
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = true;
        });
        updatePrintPreview();
    });

    document.getElementById("btn-deselect-all-print").addEventListener("click", () => {
        document.querySelectorAll(".print-select-card").forEach(card => {
            card.classList.remove("selected");
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (checkbox) checkbox.checked = false;
        });
        updatePrintPreview();
    });

    document.getElementById("btn-trigger-print").addEventListener("click", () => {
        window.print();
    });

    const logoFileInput = document.getElementById("print-logo-upload");
    const logoUploadTrigger = document.getElementById("btn-upload-logo-trigger");
    const logoRemoveBtn = document.getElementById("btn-remove-logo");

    logoUploadTrigger.addEventListener("click", () => logoFileInput.click());

    logoFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                companyLogo = event.target.result; 
                saveData(); 
                initCompanyLogoDisplay();
                updatePrintPreview();
            };
            
            reader.readAsDataURL(file);
        }
    });

    logoRemoveBtn.addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn xóa logo công ty hiện tại khỏi mẫu nhãn in không?")) {
            companyLogo = "";
            saveData();
            initCompanyLogoDisplay();
            updatePrintPreview();
        }
    });

    document.getElementById("btn-download-template").addEventListener("click", downloadCSVTemplate);
    document.getElementById("btn-export-csv").addEventListener("click", exportToCSV);

    const csvDropZone = document.getElementById("csv-drop-zone");
    const csvFileInput = document.getElementById("csv-file-input");

    csvDropZone.addEventListener("click", () => csvFileInput.click());

    csvDropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        csvDropZone.style.borderColor = "var(--accent-blue)";
        csvDropZone.style.backgroundColor = "rgba(59, 130, 246, 0.05)";
    });

    csvDropZone.addEventListener("dragleave", () => {
        csvDropZone.style.borderColor = "var(--border-color)";
        csvDropZone.style.backgroundColor = "var(--bg-tertiary)";
    });

    csvDropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        csvDropZone.style.borderColor = "var(--border-color)";
        csvDropZone.style.backgroundColor = "var(--bg-tertiary)";
        if (e.dataTransfer.files.length > 0) {
            handleCSVImport(e.dataTransfer.files[0]);
        }
    });

    csvFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleCSVImport(e.target.files[0]);
        }
    });

    document.getElementById("btn-backup-system").addEventListener("click", backupSystemData);
    
    const restoreTrigger = document.getElementById("btn-restore-trigger");
    const restoreFileInput = document.getElementById("restore-file-input");

    if (restoreTrigger && restoreFileInput) {
        restoreTrigger.addEventListener("click", () => restoreFileInput.click());
        restoreFileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                restoreSystemData(e.target.files[0]);
            }
        });
    }
}
