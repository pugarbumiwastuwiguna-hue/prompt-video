# Affiliate Video Studio (PWA, siap dibungkus jadi aplikasi Android)

## 1. Deploy web ke Vercel (wajib dulu, harus HTTPS)
- Upload folder ini ke GitHub, import di vercel.com.
- Tambahkan Environment Variable `ANTHROPIC_API_KEY`, lalu deploy ulang.
- Cek di Chrome: DevTools > Application > Manifest tidak ada error.

## 2. Bungkus jadi AAB (Trusted Web Activity)
Cara termudah tanpa coding: pwabuilder.com > masukkan URL Vercel > Package for stores > Android.
Atau lewat terminal:
    npm i -g @bubblewrap/cli
    bubblewrap init --manifest https://DOMAIN-KAMU/manifest.webmanifest
    bubblewrap build
Hasilnya file .aab. Simpan keystore dan passwordnya baik-baik.

## 3. Hubungkan domain dengan aplikasi (hilangkan address bar)
Isi `.well-known/assetlinks.json` dengan package name aplikasi dan SHA-256 fingerprint
(pakai fingerprint dari Play App Signing di Play Console), lalu deploy ulang.
Cek di https://DOMAIN-KAMU/.well-known/assetlinks.json.

## 4. Play Console
- Daftar akun developer (biaya satu kali), buat aplikasi, upload .aab.
- Isi URL kebijakan privasi: https://DOMAIN-KAMU/privacy.html (isi dulu tanggal dan email di file itu).
- Isi Data safety, rating konten, screenshot HP, ikon 512 px, dan feature graphic 1024x500.
