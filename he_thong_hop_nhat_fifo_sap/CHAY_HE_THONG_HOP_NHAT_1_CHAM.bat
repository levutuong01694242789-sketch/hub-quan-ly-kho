@echo off
chcp 65001 > nul
title HE THONG HOP NHAT FIFO & SAP S/4HANA WMS VDT
cls

echo =======================================================================
echo     HE THONG HOP NHAT: PHAN BO FIFO & MAP VI TRI KHO DONG SAP S/4HANA
echo =======================================================================
echo [1/3] Dang tinh toan xuat kho FIFO va chuan hoa 4,032 vi tri SAP...

cd /d "%~dp0"
python unified_engine.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [LOI] Khong the chay python unified_engine.py. Vui long kiem tra lai Python!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Dang khoi tao Giao dien Web Ma tran Kho Dong 2D...
echo.
echo [3/3] Dang mo giao dien tren Trinh duyet...

start index.html

echo.
echo =======================================================================
echo  CHUC MUNG! HE THONG HOP NHAT DA HOAT DONG THANH CONG 100%%!
echo  Bao cao Excel: KET_QUA_HOP_NHAT_FIFO_SAP.xlsx
echo =======================================================================
echo.
pause
