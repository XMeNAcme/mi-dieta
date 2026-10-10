const CACHE="mi-plan-v37-tools-2026-10-10";
const ASSETS=["./","./index.html","./app.js?v=3.7","./enhancements.js?v=3.7","./manifest.webmanifest","./icon-192.svg","./icon-512.svg",
"./assets/homegym.svg",
  "./assets/fitness-press_pecho.webp",
  "./assets/fitness-butterfly.webp",
  "./assets/fitness-cruce_bajo.webp",
  "./assets/fitness-jalon_ancho.webp",
  "./assets/fitness-jalon_supino.webp",
  "./assets/fitness-remo_sentado.webp",
  "./assets/fitness-curl_barra.webp",
  "./assets/fitness-curl_unilateral.webp",
  "./assets/fitness-curl_cruzado.webp",
  "./assets/fitness-pushdown.webp",
  "./assets/fitness-pushdown_uni.webp",
  "./assets/fitness-triceps_overhead.webp",
  "./assets/fitness-elev_frontal.webp",
  "./assets/fitness-remo_vertical.webp",
  "./assets/fitness-facepull_uni.webp",
  "./assets/fitness-legext.webp",
  "./assets/fitness-split.webp",
  "./assets/fitness-hamcurl.webp",
  "./assets/fitness-pullthrough.webp",
  "./assets/fitness-aductor.webp",
  "./assets/fitness-abductor.webp",
  "./assets/fitness-kickback.webp",
  "./assets/fitness-crunch.webp","./assets/meal-default.svg","./assets/meal-rice.svg","./assets/meal-pasta.svg","./assets/meal-chicken.svg","./assets/meal-meat.svg","./assets/meal-burger.svg","./assets/meal-wrap.svg","./assets/meal-eggs.svg","./assets/meal-sandwich.svg","./assets/meal-pizza.svg","./assets/meal-custom.svg",
"./assets/ex-chestpress.svg","./assets/ex-fly.svg","./assets/ex-cable.svg","./assets/ex-latpulldown.svg","./assets/ex-row.svg","./assets/ex-biceps.svg","./assets/ex-triceps.svg","./assets/ex-shoulder.svg","./assets/ex-legext.svg","./assets/ex-legs.svg","./assets/ex-ham.svg","./assets/ex-hips.svg","./assets/ex-abs.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("mi-plan-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.origin!==location.origin)return;
 const core=event.request.mode==="navigate"||url.pathname.endsWith("/index.html")||url.pathname.endsWith("/app.js")||url.pathname.endsWith("/enhancements.js");
 event.respondWith(core
  ? fetch(event.request,{cache:"no-store"}).then(resp=>{if(resp.ok){const cp=resp.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,cp)))}return resp}).catch(()=>caches.match(event.request).then(r=>r||(event.request.mode==="navigate"?caches.match("./index.html"):Promise.reject(new Error("Offline")))))
  : caches.match(event.request).then(r=>r||fetch(event.request)));
});
