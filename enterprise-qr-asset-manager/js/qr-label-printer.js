/**
 * Enterprise Fixed Asset & Label Printer QR Manager - Label Printer Studio Engine
 * Tailored for Thermal Sticker Printers (50x30mm, 70x40mm, 100x50mm, A4 Sheet).
 * Solves all text truncation (...), line wrapping and font clipping issues.
 */

window.EnterpriseQRPrinter = (function () {

  function generateQRCode(containerId, text, size = 52) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (window.QRCode) {
      new QRCode(container, {
        text: text,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}" alt="QR Code" style="width:${size}px; height:${size}px;" />`;
    }
  }

  function renderLabelSheet(containerId, assets, labelSize = '50x30') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!assets || assets.length === 0) {
      container.innerHTML = `<p style="color: #64748b; text-align: center; padding: 2rem;">Chưa chọn tài sản nào để tạo tem nhãn in.</p>`;
      return;
    }

    const depts = EnterpriseStorage.getDepts();

    let cssClass = 'label-sticker-50x30';
    let qrPx = 54;
    let headerText = 'TÀI SẢN CÔNG TY';
    let headerFontSize = '7.5px';
    let titleFontSize = '9px';
    let codeFontSize = '8px';
    let subFontSize = '7px';

    if (labelSize === '70x40') {
      cssClass = 'label-sticker-70x40';
      qrPx = 76;
      headerText = 'TÀI SẢN DOANH NGHIỆP';
      headerFontSize = '9px';
      titleFontSize = '11px';
      codeFontSize = '10px';
      subFontSize = '8.5px';
    } else if (labelSize === '100x50') {
      cssClass = 'label-sticker-100x50';
      qrPx = 98;
      headerText = 'TÀI SẢN DOANH NGHIỆP - ENTERPRISE ASSET';
      headerFontSize = '10.5px';
      titleFontSize = '13px';
      codeFontSize = '11.5px';
      subFontSize = '9.5px';
    }

    let cardsHTML = assets.map((asset) => {
      const dept = depts.find(d => d.id === asset.deptId);
      const deptName = dept ? dept.name.replace('Khối ', '').replace(' & Ban Giám Đốc', '') : 'Văn Phòng';

      return `
        <div class="${cssClass}">
          <div id="label-qr-${asset.id}" style="width:${qrPx}px; height:${qrPx}px; flex-shrink:0; display:flex; align-items:center; justify-content:center;"></div>
          
          <div style="flex:1; height:100%; min-width:0; display:flex; flex-direction:column; justify-content:space-between; overflow:hidden;">
            <div>
              <div style="font-size:${headerFontSize}; font-weight:800; text-transform:uppercase; letter-spacing:-0.2px; border-bottom:1px solid #000; padding-bottom:1px; margin-bottom:2px; white-space:nowrap; overflow:hidden; line-height:1;">
                ${headerText}
              </div>
              <div style="font-size:${titleFontSize}; font-weight:800; color:#000; line-height:1.15; max-height:22px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
                ${asset.name}
              </div>
            </div>

            <div>
              <div style="font-size:${codeFontSize}; font-weight:800; color:#000; line-height:1.1; white-space:nowrap; overflow:hidden;">
                MÃ TS: <span style="font-family: monospace, monospace;">${asset.id}</span>
              </div>
              <div style="font-size:${subFontSize}; font-weight:600; color:#222; white-space:nowrap; overflow:hidden; line-height:1.1;">
                S/N: ${asset.serialNo || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="label-preview-container">${cardsHTML}</div>`;

    // Render vector QR codes with exact pixels
    setTimeout(() => {
      assets.forEach(asset => {
        generateQRCode(`label-qr-${asset.id}`, asset.id, qrPx);
      });
    }, 60);
  }

  return {
    generateQRCode,
    renderLabelSheet
  };
})();
