@echo off
title HE THONG QUAN LY KHO FIFO AUTOMATION
setlocal enabledelayedexpansion

rem Determine working directory dynamically
set "TARGET_DIR=%~dp0"
if exist "%~dp0scripts\process_fifo_qr.py" (
    set "TARGET_DIR=%~dp0"
) else if exist "%~dp0QUAN_LY_KHO_FIFO\scripts\process_fifo_qr.py" (
    set "TARGET_DIR=%~dp0QUAN_LY_KHO_FIFO"
)

cd /d "%TARGET_DIR%"

echo =======================================================================
echo               HE THONG QUAN LY KHO FIFO AUTOMATION
echo =======================================================================
echo.
echo  [1/2] Dang doc du lieu tu CHUAN_BI_DU_LIEU.xlsx...
echo  [2/2] Dang tinh toan phan bo FIFO & Xuat bao cao...
echo.

rem Run using standard Python on Windows PC
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    python "%TARGET_DIR%\scripts\process_fifo_qr.py"
) else (
    uv run --with openpyxl --with pandas python "%TARGET_DIR%\scripts\process_fifo_qr.py"
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =======================================================================
    echo  [THANH CONG] Da phan bo FIFO va tao bao cao Excel thanh cong!
    echo  File ket qua moi nhat (KET_QUA_MOI_NHAT.xlsx) da tu dong mo len.
    echo =======================================================================
) else (
    echo.
    echo =======================================================================
    echo  [NHAN BIET LOI] Nep may bao loi, vui long kiem tra 2 buoc:
    echo  1. Da TICH CHON "Add python.exe to PATH" khi cai Python chưa?
    echo  2. Da mo CMD va chay: pip install pandas openpyxl chưa?
    echo =======================================================================
)

echo.
echo Bam phim bat ky de dong cua so nay...
pause
