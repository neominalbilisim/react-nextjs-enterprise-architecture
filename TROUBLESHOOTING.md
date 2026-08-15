# 🔧 Troubleshooting Guide - Port ve Process Yönetimi

Bu dosya, sık karşılaşılan port ve process sorunlarını çözmek için pratik komutlar içerir.

---

## ⚠️ Port Already in Use Hatası

### Hata Mesajı:
```
Error: listen EADDRINUSE: address already in use :::3000
Error: listen EADDRINUSE: address already in use :::3001
Error: listen EADDRINUSE: address already in use :::3002
```

Bu hata, portun zaten başka bir process tarafından kullanıldığı anlamına gelir.

---

## 🪟 Windows Çözümleri

### Yöntem 1: Port'u Kullanan Process'i Bul ve Öldür

#### Adım 1: Port'u kullanan process'in PID'sini bul

```powershell
# Port 3000 için
netstat -ano | findstr :3000

# Port 3001 için
netstat -ano | findstr :3001

# Port 3002 için
netstat -ano | findstr :3002
```

**Çıktı örneği:**
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       10056
TCP    [::]:3000              [::]:0                 LISTENING       10056
```

En sondaki sayı (10056) **PID** (Process ID)'dir.

#### Adım 2: Process'i sonlandır

```powershell
# Tek bir process
taskkill /F /PID 10056

# Örnek: Port 3000, 3001, 3002 için
taskkill /F /PID 10056
taskkill /F /PID 10057
taskkill /F /PID 10058
```

### Yöntem 2: Tek Komutla (PowerShell)

```powershell
# Port 3000'i temizle
$port = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port) { Stop-Process -Id $port.OwningProcess -Force }

# Port 3001'i temizle
$port = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($port) { Stop-Process -Id $port.OwningProcess -Force }

# Port 3002'yi temizle
$port = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue
if ($port) { Stop-Process -Id $port.OwningProcess -Force }
```

### Yöntem 3: Tüm Node Process'lerini Sonlandır

⚠️ **DİKKAT:** Bu, tüm Node.js uygulamalarınızı kapatır!

```powershell
taskkill /F /IM node.exe
```

### Yöntem 4: Hazır Script

Bir batch dosyası oluşturun: `kill-ports.bat`

```batch
@echo off
echo Port 3000, 3001, 3002 temizleniyor...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    taskkill /F /PID %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    taskkill /F /PID %%a 2>nul
)

echo Port'lar temizlendi!
pause
```

Kullanım:
```powershell
.\kill-ports.bat
```

---

## 🐧 macOS / Linux Çözümleri

### Yöntem 1: lsof ile Bul ve Öldür

```bash
# Port 3000 için PID bul
lsof -i :3000

# Process'i öldür
kill -9 $(lsof -t -i:3000)
```

### Yöntem 2: Tek Komutla Tüm Portları Temizle

```bash
# Port 3000
lsof -ti:3000 | xargs kill -9

# Port 3001
lsof -ti:3001 | xargs kill -9

# Port 3002
lsof -ti:3002 | xargs kill -9
```

### Yöntem 3: fuser Kullanarak

```bash
# Port 3000
fuser -k 3000/tcp

# Port 3001
fuser -k 3001/tcp

# Port 3002
fuser -k 3002/tcp
```

### Yöntem 4: Tüm Node Process'lerini Kapat

```bash
pkill -f node
```

### Yöntem 5: Hazır Script

`kill-ports.sh` dosyası oluşturun:

```bash
#!/bin/bash

echo "Port 3000, 3001, 3002 temizleniyor..."

# Port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 3000 temizleniyor..."
    kill -9 $(lsof -t -i:3000)
fi

# Port 3001
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 3001 temizleniyor..."
    kill -9 $(lsof -t -i:3001)
fi

# Port 3002
if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 3002 temizleniyor..."
    kill -9 $(lsof -t -i:3002)
fi

echo "Tüm portlar temizlendi!"
```

Çalıştırılabilir yap ve kullan:
```bash
chmod +x kill-ports.sh
./kill-ports.sh
```

---

## 📋 Hızlı Referans

### Port Kontrolü

**Windows:**
```powershell
netstat -ano | findstr :3000
```

**macOS/Linux:**
```bash
lsof -i :3000
```

### Process Sonlandırma

**Windows:**
```powershell
taskkill /F /PID <PID>
```

**macOS/Linux:**
```bash
kill -9 <PID>
```

### Tüm Node'ları Kapat

**Windows:**
```powershell
taskkill /F /IM node.exe
```

**macOS/Linux:**
```bash
pkill -f node
```

---

## 🔄 Alternatif Çözümler

### Çözüm 1: Farklı Port Kullan

`package.json`'da port değiştir:

```json
{
  "scripts": {
    "dev:shell": "npm run dev --workspace=shell -- -p 4000",
    "dev:checkout": "npm run dev --workspace=checkout-app -- -p 4001",
    "dev:profile": "npm run dev --workspace=profile-app -- -p 4002"
  }
}
```

### Çözüm 2: PM2 Kullan (Production-like)

```bash
# PM2 kur
npm install -g pm2

# Başlat
pm2 start npm --name "shell" -- run dev:shell
pm2 start npm --name "checkout" -- run dev:checkout
pm2 start npm --name "profile" -- run dev:profile

# Listele
pm2 list

# Durdur
pm2 stop all

# Sil
pm2 delete all

# Loglar
pm2 logs
```

---

## 🛠️ Önleyici Tedbirler

### 1. Ctrl+C ile Düzgün Kapat

Her zaman `Ctrl+C` ile uygulamayı durdurun (terminal'i direk kapatmayın).

### 2. Temizlik Script'i

`package.json`'a ekleyin:

```json
{
  "scripts": {
    "clean": "taskkill /F /IM node.exe || true",
    "restart": "npm run clean && npm run dev"
  }
}
```

Kullanım:
```bash
npm run clean    # Tüm Node process'lerini temizle
npm run restart  # Temizle ve yeniden başlat
```

### 3. VS Code Task

`.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Kill Ports",
      "type": "shell",
      "windows": {
        "command": "taskkill /F /IM node.exe"
      },
      "linux": {
        "command": "pkill -f node"
      },
      "osx": {
        "command": "pkill -f node"
      }
    }
  ]
}
```

---

## 🚨 Sık Sorunlar ve Çözümler

### Sorun 1: "Access Denied" Hatası

**Çözüm:** Terminal'i **yönetici olarak** çalıştırın.

**Windows:**
- PowerShell'e sağ tıklayın
- "Run as Administrator" seçin

### Sorun 2: Process Hala Çalışıyor

**Çözüm:** Force kill kullanın

**Windows:**
```powershell
taskkill /F /PID <PID>
```

**macOS/Linux:**
```bash
kill -9 <PID>
```

### Sorun 3: PID Bulunamıyor

**Çözüm:** Port gerçekten kullanılıyor mu kontrol edin

```bash
# Tüm dinleyen portları listele
netstat -ano | findstr LISTENING  # Windows
lsof -i -P | grep LISTEN          # macOS/Linux
```

### Sorun 4: Birden Fazla Process

**Çözüm:** Hepsini sırayla öldürün veya:

**Windows:**
```powershell
taskkill /F /IM node.exe
```

**macOS/Linux:**
```bash
pkill -f node
```

---

## 📊 Port Yönetimi Best Practices

### 1. ✅ Standart Portları Kullan
```
Shell (Host):      3000
Checkout (Remote): 3001
Profile (Remote):  3002
```

### 2. ✅ Environment Variables
```bash
# .env.local
PORT=3000
CHECKOUT_PORT=3001
PROFILE_PORT=3002
```

### 3. ✅ Port Çakışmalarını Önle

Development'ta:
- 3000-3999: Frontend apps
- 4000-4999: Backend APIs
- 5000-5999: Databases

### 4. ✅ Graceful Shutdown

Process termination signal'lerini handle edin:

```javascript
// next.config.js veya server
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});
```

---

## 🎯 Hızlı Komutlar (Kopyala-Yapıştır)

### Windows - Tüm Portları Temizle
```powershell
taskkill /F /IM node.exe
```

### macOS/Linux - Tüm Portları Temizle
```bash
pkill -f node
```

### Windows - Spesifik Port (3000)
```powershell
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %a
```

### macOS/Linux - Spesifik Port (3000)
```bash
kill -9 $(lsof -t -i:3000)
```

---

## 📞 Hala Çalışmıyor mu?

1. **Bilgisayarı yeniden başlat** (son çare)
2. **Antivirüs/Firewall kontrol et**
3. **VPN kapalı mı?**
4. **Başka bir port dene** (4000, 5000, vb.)

---

## ✅ Şu Anda Çözüm (Sizin Durumunuz)

Port 3000 kullanımda. Hemen şunu çalıştırın:

**Windows:**
```powershell
# Yönetici modda PowerShell açın
netstat -ano | findstr :3000
# PID'yi not edin (örn: 10056)
taskkill /F /PID 10056
```

**macOS/Linux:**
```bash
kill -9 $(lsof -t -i:3000)
```

Sonra tekrar başlatın:
```bash
npm run dev
```

---

**Son güncelleme:** 15 Ağustos 2026

**İlgili Dosyalar:**
- `package.json` — Port konfigürasyonu
- `README.md` — Ana kurulum
- `MODULE-6-ROUTING-GUIDE.md` — Routing rehberi
