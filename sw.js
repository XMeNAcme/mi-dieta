const CACHE="mi-plan-v3-4-3-2026-10-06";
const ASSETS=["./manifest.webmanifest","./icon-192.svg","./icon-512.svg",
"./assets/homegym.svg","./assets/meal-default.svg","./assets/meal-rice.svg","./assets/meal-pasta.svg","./assets/meal-chicken.svg","./assets/meal-meat.svg","./assets/meal-burger.svg","./assets/meal-wrap.svg","./assets/meal-eggs.svg","./assets/meal-sandwich.svg","./assets/meal-pizza.svg","./assets/meal-custom.svg",
"./assets/ex-chestpress.svg","./assets/ex-fly.svg","./assets/ex-cable.svg","./assets/ex-latpulldown.svg","./assets/ex-row.svg","./assets/ex-biceps.svg","./assets/ex-triceps.svg","./assets/ex-shoulder.svg","./assets/ex-legext.svg","./assets/ex-legs.svg","./assets/ex-ham.svg","./assets/ex-hips.svg","./assets/ex-abs.svg","./assets/guide-chestpress.svg","./assets/guide-butterfly.svg","./assets/guide-latpulldown.svg","./assets/guide-row.svg","./assets/guide-biceps.svg","./assets/guide-triceps.svg","./assets/guide-legext.svg","./assets/guide-hamcurl.svg","./assets/ex-chestpress-male.svg","./assets/ex-butterfly-male.svg","./assets/ex-latpulldown-male.svg","./assets/ex-row-male.svg","./assets/ex-biceps-male.svg","./assets/ex-triceps-male.svg","./assets/ex-legext-male.svg","./assets/ex-hamcurl-male.svg"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  const isCore = url.origin===location.origin &&
    (event.request.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/app.js"));
  if(isCore){
    event.respondWith(
      fetch(event.request,{cache:"no-store"})
        .then(resp=>{
          const cp=resp.clone();
          caches.open(CACHE).then(c=>c.put(event.request,cp));
          return resp;
        })
        .catch(()=>caches.match(event.request).then(r=>r||caches.match("./")))
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request)));
});