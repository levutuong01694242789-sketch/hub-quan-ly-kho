@echo off
chcp 65001 > nul
title HỆ THỐNG KHO ĐỘNG SAP S/4HANA - KHO VĐT

echo =======================================================================
echo     HỆ THỐNG QUẢN LÝ KHO ĐỘNG & TỰ ĐỘNG TRỪ KHO FIFO (WMS VĐT)
echo     Đang khởi động ứng dụng... Vui lòng chờ trong giây lát!
echo =======================================================================

:: Running Python engine to refresh stock data and JS data
python wms_engine.py

python -c "import os; f1=open('wms_data.json','r',encoding='utf-8'); content=f1.read(); f1.close(); f2=open('data.js','w',encoding='utf-8'); f2.write('window.DEFAULT_WMS_DATA = ' + content + ';'); f2.close()"

:: Opening Web Application in Default Browser
start "" "%~dp0index.html"

echo.
echo [ĐÃ HOÀN TẤT] Ứng dụng Kho Động VĐT đã được mở thành công trên trình duyệt!
echo Hãy thao tác 3-Bước đơn giản trên trang web.
echo.
pause
