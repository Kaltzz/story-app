// File: src/sw.js

// Nama cache untuk versi aplikasi saat ini.
const CACHE_NAME = 'story-app-v1';

// Daftar aset (App Shell) yang akan di-cache saat instalasi.
// Pastikan path ini sesuai dengan struktur folder `dist` setelah build.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  // Jika Vite mengubah nama file dengan hash, Workbox lebih disarankan.
  // Namun untuk caching manual, pastikan path ini benar.
  // '/styles/styles.css', 
  // '/main.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

/**
 * Event 'install': Dipicu saat Service Worker pertama kali diinstal.
 * Menyimpan semua aset dari App Shell ke dalam cache.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache dibuka dan aset App Shell disimpan');
      return cache.addAll(urlsToCache);
    })
  );
});

/**
 * Event 'activate': Dipicu setelah Service Worker diinstal dan siap mengambil alih.
 * Membersihkan cache lama agar aplikasi selalu menggunakan versi aset terbaru.
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Hapus cache apa pun yang tidak sama dengan CACHE_NAME saat ini.
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log(`Cache lama '${cacheName}' dihapus`);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/**
 * Event 'fetch': Dipicu setiap kali aplikasi membuat permintaan jaringan.
 * Menerapkan strategi Stale-While-Revalidate yang dimodifikasi.
 * 1. Coba ambil dari cache.
 * 2. Jika ada, kembalikan dari cache.
 * 3. Jika tidak ada, ambil dari jaringan.
 * 4. Simpan respons dari jaringan ke cache untuk masa depan.
 * 5. Jika jaringan gagal, coba lagi ambil dari cache sebagai fallback.
 */
self.addEventListener('fetch', (event) => {
  // Abaikan permintaan yang bukan HTTP/HTTPS atau dari ekstensi browser.
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Jika ada di cache, kembalikan dari cache.
      if (cachedResponse) {
        return cachedResponse;
      }

      // Jika tidak ada di cache, ambil dari jaringan.
      return fetch(event.request.clone())
        .then((networkResponse) => {
          // Periksa apakah respons dari jaringan valid.
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Kloning respons karena respons hanya bisa dibaca sekali.
          const responseToCache = networkResponse.clone();

          // Buka cache dan simpan respons dari jaringan.
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return networkResponse;
        })
        .catch((error) => {
          // Jika jaringan gagal, ini adalah fallback terakhir.
          console.error('Fetch gagal; mencoba mencari fallback dari cache.', error);
          // Anda bisa menyediakan halaman offline fallback di sini jika mau.
          // Contoh: return caches.match('/offline.html');
        });
    })
  );
});


/**
 * Event 'push': Dipicu saat server mengirim push notification.
 * Menampilkan notifikasi kepada pengguna.
 */
self.addEventListener('push', (event) => {
  console.log('--- PUSH EVENT DITERIMA ---'); // Log 1: Apakah event-nya masuk?

  try {
    const eventData = event.data ? event.data.text() : 'Tidak ada payload';
    console.log('Data dari push event:', eventData); // Log 2: Apa isi datanya?

    const notificationData = {
      title: 'Story App',
      options: {
        body: eventData,
        icon: '/favicon.png',
        badge: '/favicon.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      }
    };
    console.log('Opsi notifikasi sudah disiapkan:', notificationData.options); // Log 3: Apakah opsi notifikasi berhasil dibuat?

    event.waitUntil(
      self.registration.showNotification(notificationData.title, notificationData.options)
    );
    console.log('Perintah self.registration.showNotification() sudah selesai dipanggil.'); // Log 4: Apakah perintah untuk menampilkan notifikasi sudah dijalankan?

  } catch (e) {
    console.error('--- TERJADI ERROR DI DALAM PUSH EVENT ---:', e); // Log 5: Apakah ada error yang tidak terduga?
  }
});