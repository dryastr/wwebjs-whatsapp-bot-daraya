const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Simpan waktu terakhir kali pesan "Selamat Datang" dikirim ke setiap klien
const lastWelcomeTime = new Map();
const imageUrl = 'https://daraya.id/storage/images/UKWoWnxKg26JHHQ4HSpm82jTKfgo7X0n1yQh8XrC.png';
const WELCOME_INTERVAL = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

// Inisialisasi client tanpa LocalAuth
const client = new Client();

const app = express();

// Endpoint untuk menyajikan gambar QR code
app.get('/qrcode', (req, res) => {
    client.on('qr', async (qr) => {
        try {
            const qrCodeDataUrl = await qrcode.toDataURL(qr);
            res.send(`<img src="${qrCodeDataUrl}" alt="QR Code"/>`);
        } catch (err) {
            res.status(500).send('Error generating QR code');
        }
    });
});

// Start WhatsApp client
client.on('qr', (qr) => {
    // QR code akan dikirim ke browser melalui endpoint '/qrcode'
});

client.on('ready', () => {
    console.log('WhatsApp Web siap digunakan!');
});

client.on('message', async (message) => {
    console.log(`Pesan dari ${message.from}: ${message.body}`);

    // Cek apakah sudah lebih dari 24 jam sejak pesan "Selamat Datang" terakhir dikirim
    const lastTime = lastWelcomeTime.get(message.from);
    const currentTime = Date.now();

    if (!lastTime || currentTime - lastTime >= WELCOME_INTERVAL) {
        const welcomeMessage = `
Selamat datang di Daraya Software Solutions! 🎉

▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱
            🅟🅔🅐🅝 🅒🅔🅟🅐🅣
▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱▰▱
ketik : *formattugas*
menjabarkan detail tugas
ketik : *caraorder*
S&K metode pembayaran
ketik : *testimoni*
untuk lihat testimoni secara lengkap

*Informasi lebih lanjut hanya tersedia di situs resmi kami*
www.daraya.id

#Daraya #SukseskanBisnismuMelaluiWebsite
        `;

        try {
            await message.reply(welcomeMessage);
            lastWelcomeTime.set(message.from, currentTime); // Simpan waktu pengiriman pesan selamat datang
        } catch (error) {
            console.error('Error saat mengirim pesan selamat datang:', error);
        }
    }

    if (message.body.toLowerCase() === 'qris') {
        try {
            await message.reply('Berikut adalah QRIS untuk pembayaran Anda:');
            const media = await MessageMedia.fromUrl(imageUrl);
            await client.sendMessage(message.from, media, { caption: 'Silakan scan QRIS ini untuk melakukan pembayaran. Jika ada pertanyaan lebih lanjut, jangan ragu untuk bertanya!' });
        } catch (error) {
            console.error('Error saat mengirim gambar:', error);
        }
    }

    if (message.body.toLowerCase() === 'caraorder') {
        try {
            const caraOrderMessage = `
*S&K Order:*
_Cari kualitas? Kasih harga!_

1. *Pembayaran Jaminan :* Lakukan pembayaran jaminan sebesar 50% dari total biaya
_⚠ Harap dicatat bahwa tanpa jaminan, tugas tidak akan diproses_

2. *Pemantauan status tugas :* Anda dapat memeriksa status tugas Anda secara berkala untuk memastikan apakah tugas telah selesai atau masih dalam proses

3. *Pelunasan Pembayaran :* Setelah tugas dinyatakan selesai, silakan lakukan pelunasan pembayaran untuk sisa biaya keseluruhan
_⚠ Tugas akan dikirimkan ketika status pembayaran telah lunas sepenuhnya_

4. *Pengiriman Tugas :* Tugas Anda akan segera dikirim sesuai dengan kebutuhan dan permintaan Anda

Metode Pembayaran :
 ◦ Shopeepay
   ↬ 085161206235
 ◦ BCA
   ↬ 1290960327
 ◦ QRIS
   ↬ scan all payment
°Semua nomor diatas, *A.n David*

Pembayaran via Pulsa :
* Tidak tersedia.

Terima kasih.
        `;
            await message.reply(caraOrderMessage);
        } catch (error) {
            console.error('Error saat mengirim pesan cara order:', error);
        }
    }

    if (message.body.toLowerCase() === 'clear') {
        try {
            await message.reply('Terima kasih telah melakukan transaksi di Daraya! Kami sangat menghargai kepercayaan Anda. Kami menantikan order Anda selanjutnya. 😊');
            await message.reply('Catatan: Revisi berbayar akan berlaku setelah tugas dinyatakan "Clear". Untuk informasi lebih lanjut, kunjungi situs resmi kami di www.daraya.id.');
        } catch (error) {
            console.error('Error saat mengirim pesan clear:', error);
        }
    }

    if (message.body.toLowerCase() === 'testimoni') {
        try {
            const testimoniMessage = `
*Catatan*

Daraya Software Solutions didirikan pertama kali dari base Telegram sehingga semua informasi lengkap hanya tertera di Website dan Telegram.

Ragu dengan kami? Rekber ke:
t.me/eomidman

Link channel Testimoni Daraya Store:
https://t.me/darayasoftwaresolutions/70

Situs resmi:
https://daraya.id

Legalitas Resmi dari PSE KOMINFO:
Kemenkumham:
AHU-0094055-AH.01.15 TAHUN 2019
NIB (Nomor Induk Berusaha):
2607240083474
        `;
            await message.reply(testimoniMessage);
        } catch (error) {
            console.error('Error saat mengirim pesan testimoni:', error);
        }
    }

    if (message.body.toLowerCase() === 'formattugas') {
        try {
            const formatTugasMessage = `
Format Tugas Daraya

Deadline: 
Budget: 
Tugas: 
Ketentuan: 

Harap dicatat bahwa tugas akan dikerjakan sesuai dengan data di atas. Apabila terdapat kesalahan yang tidak sesuai dengan format yang telah ditentukan, hal tersebut di luar tanggung jawab kami.

Terima kasih atas perhatian dan kerja sama Anda.
        `;
            await message.reply(formatTugasMessage);
        } catch (error) {
            console.error('Error saat mengirim pesan format tugas:', error);
        }
    }
});

// Jalankan server Express
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});

client.initialize();
