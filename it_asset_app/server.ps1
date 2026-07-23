# ==========================================================================
# IT Asset QR Manager - Local PowerShell Web Server
# This script starts a lightweight local HTTP server on port 8000 to enable
# secure browser features like camera access for QR scanning on localhost.
# ==========================================================================

$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $currentDir) {
    $currentDir = Get-Location
}

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  IT Asset QR Manager Server đang chạy!" -ForegroundColor Green
    Write-Host "  Địa chỉ truy cập: http://localhost:$port/" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "Dữ liệu được lưu trữ trực tiếp trong trình duyệt (localStorage)."
    Write-Host "Nhấn Ctrl + C trong cửa sổ này để tắt server."
    Write-Host ""

    # Mở trình duyệt mặc định tự động
    Start-Process "http://localhost:$port/"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/" -or $path -eq "") {
            $path = "/index.html"
        }
        
        # Loại bỏ ký tự đầu / và thay đổi phân tách thư mục
        $cleanPath = $path.Replace("/", "\").TrimStart("\")
        $filePath = Join-Path $currentDir $cleanPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            
            if ($filePath.EndsWith(".html")) {
                $response.ContentType = "text/html; charset=utf-8"
            } elseif ($filePath.EndsWith(".css")) {
                $response.ContentType = "text/css; charset=utf-8"
            } elseif ($filePath.EndsWith(".js")) {
                $response.ContentType = "text/javascript; charset=utf-8"
            } else {
                $response.ContentType = "application/octet-stream"
            }
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Error $_.Exception.Message
} finally {
    $listener.Close()
}
