@echo off
chcp 65001 > nul
title HỆ THỐNG QUẢN TRỊ TÀI CHÍNH & CHI PHÍ VẬN HÀNH KHO (DYNAMIC FINANCIAL COMMAND CENTER)

echo ===============================================================================
echo   HỆ THỐNG QUẢN TRỊ TÀI CHÍNH & CHI PHÍ VẬN HÀNH KHO ĐỘNG 100%
echo   Tự động tính 5 Nhóm Chi Phí: Mặt Bằng, Nhân Công, Vật Tư PE, Xe Nâng, Giam Vốn
echo ===============================================================================
echo.

cd /d "%~dp0"

echo [1/3] Đang kích hoạt Engine tính toán Tài chính & P&L Chi phí kho...
python financial_engine.py

echo.
echo [2/3] Đang mở Giao diện Web App Tài Chính Kho Động trên trình duyệt...
start "" "index.html"

echo.
echo [3/3] Đã khởi chạy thành công! Anh nhập Mã PIN: 2026 để mở khóa báo cáo.
echo ===============================================================================
pause
