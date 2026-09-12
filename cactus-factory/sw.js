const CACHE_NAME = "cactus-factory-2026-09-12-2";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css?v=89",
  "./game.js?v=90",
  "./manifest.webmanifest",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/original-sand-factory-v2.png",
  "./assets/sand-factory-controlled.png",
  "./assets/sand-factory-automatic.png",
  "./assets/simple-bold-sprout.png",
  "./assets/cactus-normal.png",
  "./assets/cactus-rare-flower.png",
  "./assets/cactus-super-bunny.png",
  "./assets/cactus-legend-star.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(APP_FILES);
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== CACHE_NAME; }).map(function (key) {
      return caches.delete(key);
    }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then(function (response) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put("./index.html", copy); });
      return response;
    }).catch(function () { return caches.match("./index.html"); }));
    return;
  }
  event.respondWith(caches.match(event.request).then(function (cached) {
    const fresh = fetch(event.request).then(function (response) {
      if (response.ok) caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, response.clone()); });
      return response;
    }).catch(function () { return cached; });
    return cached || fresh;
  }));
});
