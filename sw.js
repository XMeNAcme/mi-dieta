const CACHE="mi-plan-v35-2026-10-10";
const ASSETS=["./","./index.html","./app.js","./manifest.webmanifest","./icon-192.svg","./icon-512.svg",
"./assets/homegym.svg",
  "./assets/ill-press_pecho.svg",
  "./assets/ill-butterfly.svg",
  "./assets/ill-cruce_bajo.svg",
  "./assets/ill-jalon_ancho.svg",
  "./assets/ill-jalon_supino.svg",
  "./assets/ill-remo_sentado.svg",
  "./assets/ill-curl_barra.svg",
  "./assets/ill-curl_unilateral.svg",
  "./assets/ill-curl_cruzado.svg",
  "./assets/ill-pushdown.svg",
  "./assets/ill-pushdown_uni.svg",
  "./assets/ill-triceps_overhead.svg",
  "./assets/ill-elev_frontal.svg",
  "./assets/ill-remo_vertical.svg",
  "./assets/ill-facepull_uni.svg",
  "./assets/ill-legext.svg",
  "./assets/ill-split.svg",
  "./assets/ill-hamcurl.svg",
  "./assets/ill-pullthrough.svg",
  "./assets/ill-aductor.svg",
  "./assets/ill-abductor.svg",
  "./assets/ill-kickback.svg",
  "./assets/ill-crunch.svg","./assets/meal-default.svg","./assets/meal-rice.svg","./assets/meal-pasta.svg","./assets/meal-chicken.svg","./assets/meal-meat.svg","./assets/meal-burger.svg","./assets/meal-wrap.svg","./assets/meal-eggs.svg","./assets/meal-sandwich.svg","./assets/meal-pizza.svg","./assets/meal-custom.svg",
"./assets/ex-chestpress.svg","./assets/ex-fly.svg","./assets/ex-cable.svg","./assets/ex-latpulldown.svg","./assets/ex-row.svg","./assets/ex-biceps.svg","./assets/ex-triceps.svg","./assets/ex-shoulder.svg","./assets/ex-legext.svg","./assets/ex-legs.svg","./assets/ex-ham.svg","./assets/ex-hips.svg","./assets/ex-abs.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("mi-plan-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const url=new URL(event.request.url);
 if(url.origin!==location.origin)return;
 const core=event.request.mode==="navigate"||url.pathname.endsWith("/index.html")||url.pathname.endsWith("/app.js");
 event.respondWith(core
  ? fetch(event.request,{cache:"no-store"}).then(resp=>{if(resp.ok){const cp=resp.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,cp)))}return resp}).catch(()=>caches.match(event.request).then(r=>r||(event.request.mode==="navigate"?caches.match("./index.html"):Promise.reject(new Error("Offline")))))
  : caches.match(event.request).then(r=>r||fetch(event.request)));
});
