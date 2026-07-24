@echo off
chcp 65001 > nul
title HE THONG TIM KIEM NHA CUNG CAP & BÁO GIÁ THU MUA NGUYÊN LIỆU TOÀN VIỆT NAM
cls

echo =======================================================================
echo     HE THONG THU MUA NGUYÊN LIỆU: BÁO GIÁ & NHÀ CUNG CẤP VIỆT NAM
echo =======================================================================
echo [1/3] Dang nap 366 mat hang tu Book1.xlsx va tim kiem Nha cung cap...

cd /d "%~dp0"
python supplier_engine.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [LOI] Khong the chay python supplier_engine.py. Vui long kiem tra lai Python!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Dang khoi tao Giao dien Thu Mua Nguyen Lieu...
echo [3/3] Dang mo giao dien tren Trinh duyet...

start index.html

echo.
echo =======================================================================
echo  CHUC MUNG! HE THONG THU MUA NGUYEN LIEU DA HOAT DONG THANH CONG!
echo  Bao cao Excel: BAO_CAO_SO_SANH_GIA_NHA_CUNG_CAP.xlsx
echo =======================================================================
echo.
pause
