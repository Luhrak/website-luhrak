// https://www.youtube.com/watch?v=X8FujOUb1TE

const version = "v6";
const cacheName = "offline-pages-" + version;
const urlsToCacheOnInstall = [
  "/css/master.css",
  "/favicon.ico",
  "/offline",
  "/js/offline-list.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(saveToCache(cacheName, urlsToCacheOnInstall));
});

self.addEventListener("activate", (event) => {
  // Deletes all caches not matching cacheName
  event.waitUntil(async () => {
    await caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (!cacheName.includes(name)) return caches.delete(name);
        }),
      ),
    );
  });
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  event.respondWith(
    fetch(request)
      // When fetch => cache successful GETs
      .then((netResponse) => {
        if (request.method === "GET" && netResponse && netResponse.ok) {
          return caches.open(cacheName).then((cache) => {
            cache.put(request, netResponse.clone());
            return netResponse;
          });
        }
        return netResponse;
      })
      // No net => Take cache
      .catch(async () => {
        console.log("Offline fetch");
        const cached = await caches.match(request);
        return cached || caches.match("/offline");
      }),
  );
});

async function fetchFromNetwork(request) {
  const response = await fetch(request);
  console.log("Fetched from network: ", request.url);
  const { data, error } = await safeFetchText(request);

  if (error) {
    console.error("sw safe fetch error:", error);
    return new Response("<h1>Oops!</h1> <p>Something went wrong.</p>", {
      headers: { "Content-type": "text/html; charset=utf-8" },
    });
  }

  if (data) {
    console.log("sw safe fetch data: ", data);
    return data.response;
  }
}

async function saveToCache(cacheName, urlsToCache) {
  const staticCache = await caches.open(cacheName);
  return staticCache.addAll(urlsToCache);
}

async function safeFetchText(url, options) {
  let response;
  try {
    response = await fetch(url, options);
    if (!response.ok) {
      return { error: response.status, response };
    }
  } catch (error) {
    return { error: { status: 559, message: error.message } };
  }
  try {
    return { data: { data: await response.text(), response } };
  } catch (error) {
    return { error: { status: 599, message: error.message } };
  }
}
