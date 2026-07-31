/* Service worker da Gringo Pizzaria.
 * - Núcleo do app (HTML, JS, fontes, manifest): pré-cache na instalação.
 * - Imagens e vídeo: cache-first sob demanda.
 * Suba CACHE_VERSION a cada deploy para invalidar o cache antigo.
 */
const CACHE_VERSION = "v1";
const CORE_CACHE = "gringo-core-" + CACHE_VERSION;
const MEDIA_CACHE = "gringo-media-" + CACHE_VERSION;

const CORE = [
  "./",
  "index.html",
  "config.js",
  "manifest.webmanifest",
  "vendor/react.production.min.js",
  "vendor/react-dom.production.min.js",
  "vendor/dc-runtime.js",
  "fonts/bebas-neue-latin.woff2",
  "fonts/bebas-neue-latin-ext.woff2",
  "fonts/sora-latin.woff2",
  "fonts/sora-latin-ext.woff2",
  "assets/logo.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CORE_CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CORE_CACHE && k !== MEDIA_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // wa.me, webhooks etc. sempre na rede

  const isMedia = /\.(jpe?g|png|webp|mp4)$/.test(url.pathname);
  if (isMedia) {
    // cache-first para mídia
    e.respondWith(
      caches.open(MEDIA_CACHE).then((c) =>
        c.match(req).then(
          (hit) =>
            hit ||
            fetch(req).then((res) => {
              if (res.ok) c.put(req, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  // network-first para o núcleo (pega atualizações), cache como fallback offline
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CORE_CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => hit || caches.match("index.html"))
      )
  );
});
