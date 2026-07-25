/**
 * Enterprise Fixed Asset & Label Printer QR Manager - Camera Scanner
 * Connects camera to scan asset QR labels on-site.
 */

window.EnterpriseQRScanner = (function () {
  let html5QrCode = null;
  let isScanning = false;

  function startScanner(containerId, onScanSuccess) {
    if (isScanning) return;

    if (!window.Html5Qrcode) {
      alert('Thư viện camera đang khởi tạo, vui lòng thử lại sau giây lát!');
      return;
    }

    html5QrCode = new Html5Qrcode(containerId);
    const config = { fps: 10, qrbox: { width: 220, height: 220 } };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText, decodedResult) => {
        playBeepSound();
        stopScanner();
        if (onScanSuccess) onScanSuccess(decodedText);
      },
      (errorMessage) => {}
    ).then(() => {
      isScanning = true;
    }).catch(err => {
      console.warn('[QRScanner] Camera start error:', err);
      alert('Không thể truy cập Camera. Vui lòng kiểm tra quyền truy cập trên trình duyệt!');
    });
  }

  function stopScanner() {
    if (html5QrCode && isScanning) {
      html5QrCode.stop().then(() => {
        isScanning = false;
        html5QrCode.clear();
      }).catch(err => console.error(err));
    }
  }

  function playBeepSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.value = 1000;
      gain.gain.value = 0.15;
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  return {
    startScanner,
    stopScanner,
    isScanning: () => isScanning
  };
})();
