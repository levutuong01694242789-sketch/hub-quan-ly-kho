import os
import sys
import json
import openpyxl
from datetime import datetime

# Set UTF-8 encoding for standard output
sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_JSON_PATH = os.path.join(OUTPUT_DIR, 'financial_data.json')
OUTPUT_JS_PATH = os.path.join(OUTPUT_DIR, 'financial_data.js')
OUTPUT_EXCEL_PATH = os.path.join(OUTPUT_DIR, 'BAO_CAO_TAI_CHINH_CHI_PHI_KHO.xlsx')

# Default Reference Dynamic Parameters (Can be dynamically adjusted via Web App Sliders)
DEFAULT_PARAMS = {
    'warehouse_rent_monthly': 180000000.0, # Tiền thuê mặt bằng kho / tháng (VND)
    'total_labor_monthly': 220000000.0,     # Quỹ lương nhân sự kho hàng tháng (VND)
    'utilities_monthly': 35000000.0,        # Điện nước & viễn thông kho / tháng (VND)
    'forklift_operating_monthly': 25000000.0,# Nhiên liệu sạc điện & bảo trì xe nâng / tháng (VND)
    'consumables_monthly': 18000000.0,       # Màng PE, băng keo, đai niềng, tem nhãn / tháng (VND)
    'inventory_carrying_rate_annual': 0.15, # Lãi suất cơ hội giam vốn tồn kho (%/năm)
    
    # Capacity Parameters
    'highbay_rack_capacity': 4032,           # 4,032 Ô kệ cao tầng (Dãy A-H)
    'buffer_zones_count': 6,                # 6 Vùng Đệm Sàn (TW, VW, VL)
    'monthly_handling_volume_kg': 450000.0, # Sản lượng luân chuyển xuất nhập kho (Kg/tháng)
    'monthly_pick_lines_count': 12500,      # Số dòng hàng nhặt (Pick Lines/tháng)
    'inventory_total_value': 35000000000.0  # Tổng giá trị hàng tồn kho trữ trong kho (VND)
}

def calculate_warehouse_financials(params=None):
    """Calculate 100% Dynamic Warehouse Operational & Financial Metrics."""
    p = dict(DEFAULT_PARAMS)
    if params:
        p.update(params)

    # 1. Total Monthly OPEX (P&L Operating Expense)
    total_facility_cost = p['warehouse_rent_monthly'] + (p['utilities_monthly'] * 0.6)
    total_labor_cost = p['total_labor_monthly']
    total_consumables_cost = p['consumables_monthly']
    total_equipment_cost = p['forklift_operating_monthly'] + (p['utilities_monthly'] * 0.4)

    total_monthly_opex = total_facility_cost + total_labor_cost + total_consumables_cost + total_equipment_cost
    total_annual_opex = total_monthly_opex * 12

    # 2. Group 1: Storage & Bin Costs
    total_storage_locations = p['highbay_rack_capacity'] + p['buffer_zones_count']
    cost_per_bin_monthly = round(total_facility_cost / total_storage_locations, 0)
    cost_per_bin_daily = round(cost_per_bin_monthly / 30, 0)

    # 3. Group 2: Handling & Labor Unit Costs
    cost_per_kg_handled = round(total_monthly_opex / p['monthly_handling_volume_kg'], 2)
    cost_per_pick_line = round((total_labor_cost + total_consumables_cost) / p['monthly_pick_lines_count'], 0)

    # Multi-UoM Unit Cost Estimations
    uom_cost_breakdown = {
        'Kg': cost_per_kg_handled,
        'Thùng': round(cost_per_kg_handled * 15, 0),    # Quy đổi 1 Thùng ~ 15kg
        'Cái': round(cost_per_kg_handled * 0.5, 0),     # Quy đổi 1 Cái ~ 0.5kg
        'Cuộn': round(cost_per_kg_handled * 25, 0),    # Quy đổi 1 Cuộn ~ 25kg
        'Met': round(cost_per_kg_handled * 1.2, 0),     # Quy đổi 1 Mét ~ 1.2kg
        'Bộ': round(cost_per_kg_handled * 2.0, 0),      # Quy đổi 1 Bộ ~ 2.0kg
        'Đôi': round(cost_per_kg_handled * 0.8, 0),     # Quy đổi 1 Đôi ~ 0.8kg
        'Chai': round(cost_per_kg_handled * 1.0, 0),    # Quy đổi 1 Chai ~ 1.0kg
        'Vắt': round(cost_per_kg_handled * 0.05, 0)     # Quy đổi 1 Vắt ~ 0.05kg
    }

    # 4. Group 5: Inventory Carrying Costs
    annual_carrying_cost = round(p['inventory_total_value'] * p['inventory_carrying_rate_annual'], 0)
    monthly_carrying_cost = round(annual_carrying_cost / 12, 0)
    storage_cost_ratio_pct = round((total_facility_cost / p['inventory_total_value']) * 100, 2)

    now_str = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    financial_summary = {
        'timestamp': now_str,
        'parameters': p,
        'kpi_summary': {
            'total_monthly_opex': total_monthly_opex,
            'total_annual_opex': total_annual_opex,
            'cost_per_bin_monthly': cost_per_bin_monthly,
            'cost_per_bin_daily': cost_per_bin_daily,
            'cost_per_kg_handled': cost_per_kg_handled,
            'cost_per_pick_line': cost_per_pick_line,
            'annual_carrying_cost': annual_carrying_cost,
            'monthly_carrying_cost': monthly_carrying_cost,
            'storage_cost_ratio_pct': storage_cost_ratio_pct,
            'total_storage_locations': total_storage_locations
        },
        'cost_groups_breakdown': {
            'group_1_storage': {
                'title': '🏗️ 1. Chi Phí Lưu Kho & Hạ Tầng',
                'amount_monthly': total_facility_cost,
                'pct_of_total': round((total_facility_cost / total_monthly_opex) * 100, 1),
                'details': 'Bao gồm tiền thuê mặt bằng kho, khấu hao kệ cao tầng và điện nước hạ tầng.'
            },
            'group_2_labor': {
                'title': '⚡ 2. Chi Phí Nhân Công & Nhặt Hàng',
                'amount_monthly': total_labor_cost,
                'pct_of_total': round((total_labor_cost / total_monthly_opex) * 100, 1),
                'details': 'Bao gồm quỹ lương nhân sự kho, quản lý kho, phụ cấp bốc xếp và thưởng năng suất.'
            },
            'group_3_consumables': {
                'title': '📦 3. Chi Phí Vật Tư & PE Quấn Pallet',
                'amount_monthly': total_consumables_cost,
                'pct_of_total': round((total_consumables_cost / total_monthly_opex) * 100, 1),
                'details': 'Bao gồm màng PE quấn Pallet, băng keo, đai niềng, tem nhãn Barcode/QR.'
            },
            'group_4_equipment': {
                'title': '🚜 4. Chi Phí Thiết Bị & Xe Nâng',
                'amount_monthly': total_equipment_cost,
                'pct_of_total': round((total_equipment_cost / total_monthly_opex) * 100, 1),
                'details': 'Bao gồm chi phí sạc điện, nhiên liệu dầu xe nâng, bảo trì sửa chữa và khấu hao xe.'
            },
            'group_5_carrying': {
                'title': '📉 5. Chi Phí Giam Vốn Tồn Kho (Carrying Cost)',
                'amount_monthly': monthly_carrying_cost,
                'pct_of_total': round((monthly_carrying_cost / (total_monthly_opex + monthly_carrying_cost)) * 100, 1),
                'details': 'Chi phí cơ hội vốn vay giam trong hàng tồn kho (tính 15%/năm trên 35 tỷ tồn kho).'
            }
        },
        'uom_cost_breakdown': uom_cost_breakdown
    }

    # Save output files
    with open(OUTPUT_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(financial_summary, f, ensure_ascii=False, indent=2)

    with open(OUTPUT_JS_PATH, 'w', encoding='utf-8') as f_js:
        f_js.write('window.DEFAULT_FINANCIAL_DATA = ')
        json.dump(financial_summary, f_js, ensure_ascii=False)
        f_js.write(';')

    print(f"📊 TỔNG QUAN TÀI CHÍNH KHO VẬN HÀNH (LIVE CALCULATION):")
    print(f"  - Thời gian tính toán: {now_str}")
    print(f"  - Tổng Chi Phí Vận Hành Kho/Tháng (OPEX): {total_monthly_opex:,.0f} VND")
    print(f"  - Chi Phí 1 Ô Kệ / Tháng: {cost_per_bin_monthly:,.0f} VND/Ô Kệ (hằng ngày: {cost_per_bin_daily:,.0f} VND/ngày)")
    print(f"  - Chi Phí Lưu Kho & Xử Lý / Kg: {cost_per_kg_handled:,.2f} VND/Kg")
    print(f"  - Chi Phí Nhặt 1 Dòng Hàng (Pick Line): {cost_per_pick_line:,.0f} VND/Line")
    print(f"✅ Đã xuất dữ liệu financial_data.json & financial_data.js cho Web App.")

    # Export Excel Financial Report
    generate_excel_financial_report(financial_summary, OUTPUT_EXCEL_PATH)
    return financial_summary

def generate_excel_financial_report(data, output_path):
    """Generate Excel Financial Report for CFO & Executive Management."""
    wb = openpyxl.Workbook()
    
    # Sheet 1: Báo Cáo P&L Chi Phí Kho Vận
    ws_pl = wb.active
    ws_pl.title = "P&L Báo Cáo Chi Phí Kho"

    ws_pl.append(["BÁO CÁO TỔNG HỢP CHI PHÍ VẬN HÀNH KHO & P&L THÁNG"])
    ws_pl.append([f"Thời gian lập báo cáo: {data['timestamp']}"])
    ws_pl.append([])

    ws_pl.append(["HẠNG MỤC CHI PHÍ VẬN HÀNH KHO", "CHI PHÍ THÁNG (VND)", "% TRÊN TỔNG CHI PHÍ", "GHI CHÚ DIỄN GIẢI"])

    for k, grp in data['cost_groups_breakdown'].items():
        ws_pl.append([
            grp['title'],
            grp['amount_monthly'],
            f"{grp['pct_of_total']}%",
            grp['details']
        ])

    ws_pl.append([])
    kpi = data['kpi_summary']
    ws_pl.append(["TỔNG CHI PHÍ OPEX KHO HÀNG THÁNG", kpi['total_monthly_opex'], "100%", "Tổng chi phí vận hành kho tháng"])
    ws_pl.append(["TỔNG CHI PHÍ OPEX KHO NĂM (DỰ TOÁN)", kpi['total_annual_opex'], "-", "Dự toán chi phí kho cả năm"])
    ws_pl.append([])
    ws_pl.append(["CHI PHÍ TRÊN 1 Ô KỆ / THÁNG (4,032 RACK + 6 ĐỆM SÀN)", kpi['cost_per_bin_monthly'], "VND/Ô Kệ", f"Đơn giá ngày: {kpi['cost_per_bin_daily']:,.0f} VND/ngày"])
    ws_pl.append(["CHI PHÍ LƯU KHO & XỬ LÝ TRÊN 1 KG", kpi['cost_per_kg_handled'], "VND/Kg", "Đơn giá bóc tách theo Kg"])
    ws_pl.append(["CHI PHÍ NHẶT 1 DÒNG HÀNG (PICK LINE)", kpi['cost_per_pick_line'], "VND/Line", "Chi phí nhân công & bao bì / dòng xuất"])
    ws_pl.append(["CHI PHÍ CƠ HỘI GIAM VỐN TỒN KHO (CARRYING COST/THÁNG)", kpi['monthly_carrying_cost'], "VND/Tháng", "Chi phí cơ hội vốn (15%/năm trên 35 tỷ tồn kho)"])

    # Sheet 2: Đơn Giá Bóc Tách Theo 9 ĐVT
    ws_uom = wb.create_sheet(title="Đơn Giá Theo 9 ĐVT")
    ws_uom.append(["ĐƠN VỊ TÍNH (UoM)", "CHI PHÍ PHÂN BỔ KHO (VND/ĐVT)", "QUY ĐỔI THAM CHIẾU"])
    for uom, price in data['uom_cost_breakdown'].items():
        ws_uom.append([uom, price, f"Đơn giá lưu kho & xử lý cho 1 {uom}"])

    wb.save(output_path)
    print(f"✅ Đã xuất báo cáo Excel tài chính kho: {output_path}")

if __name__ == '__main__':
    try:
        calculate_warehouse_financials()
    except Exception as e:
        print(f"❌ Lỗi tính toán tài chính: {e}")
