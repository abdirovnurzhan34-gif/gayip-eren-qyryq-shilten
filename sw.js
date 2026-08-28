/* ҒЕҚШ — Service Worker v6 — CSS/JS бөлек файлдар, ескі кэшті тазалайды */
const CACHE = 'geqsh-v9';

self.addEventListener('install', e => {
  /* ЕСКІ КЭШТЕРДІ БАРЛЫҒЫН ЖОЮ (geqsh-v9...v4 және басқалар) */
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  /* Network-first: әрқашан жаңасын аламыз, офлайн болса ғана кэштен */
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
