async function getUrlList() {
  const cacheName = "offline-pages";
  const cacheKeys = await caches.keys();
  const matchingCacheName = cacheKeys.find((name) => name.includes(cacheName));
  if (!matchingCacheName) return;

  const cache = await caches.open(matchingCacheName);
  const excludeRe = /\.(ico)$|\/offline\/?|\/offline$|\/(img|css|js)\//;
  const urls = (await cache.keys()).map((req) => req.url);
  const pageUrls = urls.filter((u) => !excludeRe.test(u)) ?? [];
  return pageUrls;
}

const urls = await getUrlList();
const ul = document.querySelector("#offline-links");
if (urls.length > 0) {
  ul.innerHTML = "";
  for (const url of urls) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = url;
    a.textContent = url;
    li.appendChild(a);
    ul.appendChild(li);
  }
}
