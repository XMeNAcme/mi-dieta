const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const todayISO=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));

const baseMeals={
 "— Selecciona —":{k:0,p:0,d:"",img:"assets/meal-default.svg"},
 "Arroz Brillante XL + kebab + 2 salsas":{k:761,p:53,d:"200 g arroz Brillante XL + 200 g kebab Mercadona + 15 ml salsa kebab + 15 g ketchup Zero",img:"assets/meal-rice.svg"},
 "Arroz Brillante XL + pollo":{k:690,p:55,d:"200 g arroz Brillante XL + 200 g pollo + 60 g tomate Helios",img:"assets/meal-rice.svg"},
 "Arroz Brillante XL + carne picada":{k:760,p:45,d:"200 g arroz Brillante XL + 180 g carne picada + 60 g tomate Helios",img:"assets/meal-rice.svg"},
 "Macarrones boloñesa":{k:775,p:50,d:"100 g pasta seca + 180 g carne + 80 g tomate Helios + 20 g queso",img:"assets/meal-pasta.svg"},
 "Pasta + pollo":{k:725,p:65,d:"100 g pasta seca + 200 g pollo + 80 g tomate Helios + 25 g queso",img:"assets/meal-pasta.svg"},
 "Pollo + patatas Airfryer":{k:700,p:55,d:"220 g pollo + ración de patata + ketchup Zero",img:"assets/meal-chicken.svg"},
 "Lomo + patatas Airfryer":{k:700,p:50,d:"200 g lomo + ración de patata",img:"assets/meal-meat.svg"},
 "Hamburguesa + pan + patatas":{k:825,p:50,d:"hamburguesa + pan + queso + ración de patata",img:"assets/meal-burger.svg"},
 "Fajitas de pollo":{k:775,p:65,d:"3 tortillas + 200 g pollo + 50 g queso",img:"assets/meal-wrap.svg"},
 "Fajitas de ternera":{k:800,p:55,d:"3 tortillas + 180 g ternera + 50 g queso",img:"assets/meal-wrap.svg"},
 "Fajitas de kebab":{k:790,p:50,d:"3 tortillas + 150 g kebab + 40 g queso + 15 ml salsa kebab + 15 g ketchup Zero",img:"assets/meal-wrap.svg"},
 "Huevos + patatas":{k:700,p:35,d:"4 huevos + ración de patata",img:"assets/meal-eggs.svg"},
 "Bocadillo de lomo":{k:800,p:55,d:"120 g pan + 180 g lomo + 30 g queso + patata",img:"assets/meal-sandwich.svg"},
 "Pollo empanado":{k:725,p:55,d:"200 g pollo + 30 g pan rallado + patata",img:"assets/meal-chicken.svg"},
 "Pizza pollo con queso Lafuente":{k:760,p:55,d:"1 base 140 g + 60 g Helios + 50 g queso Lafuente + 150 g pollo",img:"assets/meal-pizza.svg"},
 "Pizza kebab con queso Lafuente":{k:773,p:43,d:"1 base 140 g + 60 g Helios + 50 g queso Lafuente + 100 g kebab",img:"assets/meal-pizza.svg"},
 "Kebab + patatas Airfryer + 2 salsas":{k:810,p:50,d:"200 g kebab + patata Airfryer + 15 ml salsa kebab + 15 g ketchup Zero",img:"assets/meal-meat.svg"}
};
const extras={
 "Whey con agua":{k:120,p:24},"Skyr / yogur proteico":{k:105,p:15},"Queso fresco batido 0% (250 g)":{k:135,p:20},
 "Almendras/anacardos 20 g":{k:120,p:4},"Helado (~200 kcal)":{k:200,p:3},"Whey + 250 ml leche":{k:245,p:32}
};
const days=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

const exercises=[
 {id:"press_pecho",m:"Pecho",n:"Press de pecho en máquina",equip:"Brazos de press",setup:"Asiento regulado para que las empuñaduras queden a la altura media del pecho.",how:"Escápulas apoyadas, pecho alto. Empuja sin bloquear los codos y vuelve controlando.",tip:"No despegues la espalda del respaldo.",img:"assets/fitness-press_pecho.webp"},
 {id:"butterfly",m:"Pecho",n:"Butterfly / aperturas",equip:"Brazos de mariposa",setup:"Antebrazos o manos apoyados según la configuración de la máquina.",how:"Cierra los brazos delante del pecho y vuelve lento hasta notar estiramiento cómodo.",tip:"No rebotes al abrir.",img:"assets/fitness-butterfly.webp"},
 {id:"cruce_bajo",m:"Pecho",n:"Apertura unilateral en polea baja",equip:"Polea baja + asa",setup:"De pie de lado a la máquina, un brazo cada vez.",how:"Lleva el asa desde abajo y lateral hacia delante del pecho con ligera flexión de codo.",tip:"Carga moderada y tronco estable.",img:"assets/fitness-cruce_bajo.webp"},
 {id:"jalon_ancho",m:"Espalda",n:"Jalón al pecho agarre ancho",equip:"Polea alta + barra latissimus",setup:"Sentado y estable, manos más anchas que hombros.",how:"Lleva la barra hacia la parte alta del pecho juntando escápulas.",tip:"No tires detrás de la nuca.",img:"assets/fitness-jalon_ancho.webp"},
 {id:"jalon_supino",m:"Espalda",n:"Jalón al pecho agarre supino/cerrado",equip:"Polea alta + barra/asa",setup:"Agarre más cerrado, palmas hacia ti si resulta cómodo.",how:"Baja hacia el esternón manteniendo el pecho alto.",tip:"Evita balancearte.",img:"assets/fitness-jalon_supino.webp"},
 {id:"remo_sentado",m:"Espalda",n:"Remo horizontal sentado",equip:"Polea baja + asa de tracción",setup:"Pies apoyados en reposapiés y espalda neutra.",how:"Tira del asa hacia el abdomen llevando codos atrás.",tip:"No conviertas el movimiento en un balanceo lumbar.",img:"assets/fitness-remo_sentado.webp"},
 {id:"curl_barra",m:"Bíceps",n:"Curl de bíceps en polea baja",equip:"Polea baja + barra",setup:"De pie, codos pegados al cuerpo.",how:"Flexiona los codos llevando la barra hacia arriba sin mover los hombros.",tip:"Baja lento y completa el recorrido cómodo.",img:"assets/fitness-curl_barra.webp"},
 {id:"curl_unilateral",m:"Bíceps",n:"Curl unilateral con asa",equip:"Polea baja + asa",setup:"Un brazo cada vez, cuerpo recto.",how:"Flexiona el codo manteniéndolo cerca del costado.",tip:"Iguala repeticiones y carga en ambos brazos.",img:"assets/fitness-curl_unilateral.webp"},
 {id:"curl_cruzado",m:"Bíceps",n:"Curl cruzado unilateral",equip:"Polea baja + asa",setup:"Colócate ligeramente de lado.",how:"Lleva el asa hacia el hombro contrario manteniendo el brazo controlado.",tip:"No gires todo el tronco.",img:"assets/fitness-curl_cruzado.webp"},
 {id:"pushdown",m:"Tríceps",n:"Extensión de tríceps en polea alta",equip:"Polea alta + barra",setup:"Codos pegados a los costados.",how:"Extiende los codos hacia abajo y vuelve sin mover los hombros.",tip:"Evita echar el cuerpo encima de la barra.",img:"assets/fitness-pushdown.webp"},
 {id:"pushdown_uni",m:"Tríceps",n:"Extensión unilateral de tríceps",equip:"Polea alta + asa",setup:"Un brazo cada vez, codo fijo.",how:"Extiende hasta abajo y vuelve de forma controlada.",tip:"Buena opción para comparar ambos lados.",img:"assets/fitness-pushdown_uni.webp"},
 {id:"triceps_overhead",m:"Tríceps",n:"Extensión de tríceps por encima de la cabeza",equip:"Polea alta + asa/cable extensión",setup:"De espaldas a la máquina, codos orientados al frente.",how:"Extiende los codos hacia delante/arriba manteniendo el tronco firme.",tip:"Usa menos carga si pierdes postura.",img:"assets/fitness-triceps_overhead.webp"},
 {id:"elev_frontal",m:"Hombros",n:"Elevación frontal en polea baja",equip:"Polea baja + barra/asa",setup:"De pie, rodillas suaves.",how:"Eleva hasta la altura que resulte cómoda y baja lento.",tip:"No uses impulso.",img:"assets/fitness-elev_frontal.webp"},
 {id:"remo_vertical",m:"Hombros",n:"Remo vertical en polea baja",equip:"Polea baja + barra",setup:"Agarre cómodo, barra cerca del cuerpo.",how:"Eleva guiando con los codos hasta un rango cómodo.",tip:"No fuerces una altura que moleste.",img:"assets/fitness-remo_vertical.webp"},
 {id:"facepull_uni",m:"Hombros",n:"Tirón alto unilateral",equip:"Polea alta + asa",setup:"Un brazo cada vez, cable aproximadamente a la altura de la cara.",how:"Tira llevando codo hacia atrás y mano hacia el lateral de la cara.",tip:"Carga ligera y control.",img:"assets/fitness-facepull_uni.webp"},
 {id:"legext",m:"Cuádriceps",n:"Extensión de piernas",equip:"Módulo de piernas",setup:"Rodillo sobre la parte baja de las espinillas.",how:"Extiende las rodillas y baja sin dejar caer la carga.",tip:"No golpees el tope.",img:"assets/fitness-legext.webp"},
 {id:"split",m:"Cuádriceps",n:"Tijeras / zancadas con peso corporal",equip:"Peso corporal",setup:"Paso largo y estable.",how:"Desciende con control y vuelve empujando el suelo.",tip:"Rodilla alineada con el pie.",img:"assets/fitness-split.webp"},
 {id:"hamcurl",m:"Isquios",n:"Curl de isquios en polea baja",equip:"Polea baja + correa de tobillo",setup:"De pie, sujeto a la máquina si hace falta.",how:"Flexiona la rodilla llevando el talón hacia atrás.",tip:"Cadera estable.",img:"assets/fitness-hamcurl.webp"},
 {id:"pullthrough",m:"Isquios",n:"Bisagra de cadera con polea baja",equip:"Polea baja + asa/cable",setup:"De espaldas a la polea, pies firmes.",how:"Lleva cadera atrás y extiéndela al volver.",tip:"Espalda neutra; carga moderada.",img:"assets/fitness-pullthrough.webp"},
 {id:"aductor",m:"Aductores",n:"Aducción de cadera en polea baja",equip:"Polea baja + correa tobillo",setup:"De lado, pierna de trabajo alejada de la máquina.",how:"Cruza suavemente la pierna hacia dentro.",tip:"Movimiento corto y controlado.",img:"assets/fitness-aductor.webp"},
 {id:"abductor",m:"Glúteos",n:"Abducción de cadera en polea baja",equip:"Polea baja + correa tobillo",setup:"De lado, pierna de trabajo más alejada.",how:"Separa la pierna lateralmente sin inclinarte.",tip:"Evita compensar con el tronco.",img:"assets/fitness-abductor.webp"},
 {id:"kickback",m:"Glúteos",n:"Patada de glúteo en polea baja",equip:"Polea baja + correa tobillo",setup:"De frente a la máquina, apoyo estable.",how:"Lleva la pierna hacia atrás sin arquear la zona lumbar.",tip:"Recorrido moderado.",img:"assets/fitness-kickback.webp"},
 {id:"crunch",m:"Abdominales",n:"Crunch en polea alta",equip:"Polea alta + asa/barra",setup:"Sentado o arrodillado si el espacio lo permite.",how:"Flexiona el tronco acercando costillas a pelvis.",tip:"No tires solo con los brazos.",img:"assets/fitness-crunch.webp"}
];

const routines=[
 {id:"pecho_espalda",name:"Pecho ↔ Espalda",a:"Pecho",b:"Espalda",ex:["press_pecho","butterfly","cruce_bajo","jalon_ancho","jalon_supino","remo_sentado"]},
 {id:"biceps_triceps",name:"Bíceps ↔ Tríceps",a:"Bíceps",b:"Tríceps",ex:["curl_barra","curl_unilateral","curl_cruzado","pushdown","pushdown_uni","triceps_overhead"]},
 {id:"cuad_isquios",name:"Cuádriceps ↔ Isquios",a:"Cuádriceps",b:"Isquios",ex:["legext","split","legext","hamcurl","pullthrough","hamcurl"]},
 {id:"hombro_core",name:"Hombros + Core",a:"Hombros",b:"Abdominales / Glúteos",ex:["elev_frontal","remo_vertical","facepull_uni","crunch","abductor","kickback"]}
];

const defaultSettings={kMin:1900,kMax:2000,pMin:130,pMax:150,bodyWeight:"",restSeconds:90,restAuto:true};
const state={
 settings:{...defaultSettings,...JSON.parse(localStorage.getItem("miPlanSettings")||"{}")},
 customMeals:JSON.parse(localStorage.getItem("miPlanCustomMeals")||"{}"),
 diet:JSON.parse(localStorage.getItem("miPlanDiet")||"{}"),
 workoutDraft:JSON.parse(localStorage.getItem("miPlanWorkoutDraft")||"{}"),
 workouts:JSON.parse(localStorage.getItem("miPlanWorkouts")||"[]"),
 weights:JSON.parse(localStorage.getItem("miPlanWeights")||"[]"),
 media:JSON.parse(localStorage.getItem("miPlanMedia")||"{}")
};
function meals(){return {...baseMeals,...state.customMeals}}
function saveState(){
 localStorage.setItem("miPlanSettings",JSON.stringify(state.settings));
 localStorage.setItem("miPlanCustomMeals",JSON.stringify(state.customMeals));
 localStorage.setItem("miPlanDiet",JSON.stringify(state.diet));
 localStorage.setItem("miPlanWorkoutDraft",JSON.stringify(state.workoutDraft));
 localStorage.setItem("miPlanWorkouts",JSON.stringify(state.workouts));
 localStorage.setItem("miPlanWeights",JSON.stringify(state.weights));
 noteDataSaved();
}
function migrateOld(){
 if(localStorage.getItem("miPlanMigrated")) return;
 try{
  const old=JSON.parse(localStorage.getItem("miDietaSemana")||"{}");
  if(Object.keys(old).length){
   days.forEach((d,i)=>{
    const key="week-"+i;
    state.diet[key]={meal:old["m"+i]||"— Selecciona —",dinner:old["d"+i]||"— Selecciona —",extras:{}};
    Object.keys(extras).forEach((_,j)=>state.diet[key].extras[j]=!!old[`e${i}_${j}`]);
   });
  }
  const ws=["w1","w2","w3"].map(k=>parseFloat(localStorage.getItem(k))).filter(Number.isFinite);
  if(ws.length && !state.settings.bodyWeight) state.settings.bodyWeight=(ws.reduce((a,b)=>a+b,0)/ws.length).toFixed(1);
 }catch(e){}
 localStorage.setItem("miPlanMigrated","1");saveState();
}
function setTab(id){
 $$(".page").forEach(x=>x.classList.toggle("active",x.id==="page-"+id));
 $$(".tabbtn").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));
 scrollTo({top:0,behavior:"smooth"});
 if(id==="progreso") renderProgress();
}
function optsMeals(sel=""){return Object.keys(meals()).map(n=>`<option ${n===sel?"selected":""}>${esc(n)}</option>`).join("")}
function weekDate(i){
 const now=new Date(), day=(now.getDay()+6)%7, monday=new Date(now); monday.setDate(now.getDate()-day+i);
 return monday.toISOString().slice(0,10);
}
function dietEntry(i){
 const k="week-"+i;
 if(!state.diet[k]) state.diet[k]={meal:"— Selecciona —",dinner:"— Selecciona —",extras:{}};
 return state.diet[k];
}
function calcDietEntry(i){
 const e=dietEntry(i), mm=meals(), a=mm[e.meal]||mm["— Selecciona —"], b=mm[e.dinner]||mm["— Selecciona —"];
 let k=a.k+b.k,p=a.p+b.p;
 Object.keys(extras).forEach((x,j)=>{if(e.extras[j]){k+=extras[x].k;p+=extras[x].p}});
 return {k,p,a,b};
}
function classify(k,p){
 const s=state.settings;
 if(!k)return["Sin marcar",""];
 if(k>s.kMax+100)return["Pasado","bad"];
 if(k>=s.kMin-50&&k<=s.kMax+50&&p>=s.pMin)return["Muy bien","ok"];
 if(p<s.pMin)return["Falta proteína","warn"];
 if(k<s.kMin-150)return["Faltan kcal","warn"];
 return["Bien","ok"];
}
function renderDiet(){
 $("#dietTargetText").textContent=`${state.settings.kMin.toLocaleString("es-ES")}–${state.settings.kMax.toLocaleString("es-ES")} kcal · ${state.settings.pMin}–${state.settings.pMax} g proteína`;
 const root=$("#dietDays"); root.innerHTML="";
 days.forEach((d,i)=>{
  const e=dietEntry(i), c=calcDietEntry(i), cl=classify(c.k,c.p);
  root.insertAdjacentHTML("beforeend",`<article class="card meal-day" data-day="${i}">
   <div class="meal-head"><div><h2>${d}</h2><div class="small">${weekDate(i)}</div></div><span class="badge ${cl[1]}">${cl[0]}</span></div>
   <div class="mealpick"><img class="thumb" id="mealImg${i}" src="${c.a.img}" alt=""><div><label>Comida</label><select data-kind="meal" data-i="${i}">${optsMeals(e.meal)}</select><div class="small" id="mealDet${i}">${esc(c.a.d)}</div></div></div>
   <div class="mealpick"><img class="thumb" id="dinImg${i}" src="${c.b.img}" alt=""><div><label>Cena</label><select data-kind="dinner" data-i="${i}">${optsMeals(e.dinner)}</select><div class="small" id="dinDet${i}">${esc(c.b.d)}</div></div></div>
   <label>Extras / comodines</label>
   <div class="extras">${Object.keys(extras).map((x,j)=>`<label class="extra"><input type="checkbox" data-extra="${j}" data-i="${i}" ${e.extras[j]?"checked":""}><span>${esc(x)} · ${extras[x].k} kcal / ${extras[x].p} g</span></label>`).join("")}</div>
   <div class="nums"><div class="metric"><b>${c.k}</b><span>kcal</span></div><div class="metric"><b>${c.p} g</b><span>proteína</span></div><div class="metric"><b>${Math.max(0,state.settings.kMax-c.k)}</b><span>kcal hasta máx.</span></div></div>
  </article>`);
 });
 $$("[data-kind]").forEach(el=>el.onchange=()=>{const i=+el.dataset.i;dietEntry(i)[el.dataset.kind]=el.value;saveState();renderDiet();renderHome()});
 $$("[data-extra]").forEach(el=>el.onchange=()=>{const i=+el.dataset.i;dietEntry(i).extras[el.dataset.extra]=el.checked;saveState();renderDiet();renderHome()});
}
function todayDiet(){
 const day=(new Date().getDay()+6)%7; return calcDietEntry(day);
}
function currentRoutine(){return routines.find(r=>r.id===$("#routineSelect").value)||routines[0]}
function draftKey(exid){return `${currentRoutine().id}:${exid}`}
function exById(id){return exercises.find(x=>x.id===id)}
function renderRoutine(){
 const r=currentRoutine(); const root=$("#routineRender"); root.innerHTML="";
 [r.a,r.b].forEach((group,gi)=>{
  const ids=r.ex.slice(gi*3,gi*3+3);
  root.insertAdjacentHTML("beforeend",`<section class="routine-block"><div class="routine-title"><h2>${esc(group)}</h2><span class="pill">3 ejercicios · 3×10</span></div><div class="grid3">${ids.map((id,idx)=>{
   const ex=exById(id), key=draftKey(id)+"#"+idx, d=exerciseDraft(id,key);
   return `<article class="card exercise-card">
    <button type="button" class="exercise-visual zoom-image" data-image-exercise="${ex.id}" aria-label="Ampliar imagen de ${esc(ex.n)}"><img src="${ex.img}" alt="${esc(ex.n)}"><span class="image-zoom-hint" aria-hidden="true">⤢ Ampliar</span></button>
    <div class="exercise-body">
     <div class="muscle">${esc(ex.m)}</div><div class="exercise-name">${esc(ex.n)}</div>
     <div class="small">${esc(ex.setup)}</div>
     <div class="tags"><span class="tag">${esc(ex.equip)}</span><span class="tag">3 series</span></div>
     ${lastExerciseLoad(id)?`<p class="small last-load">Última sesión: ${kgLabel(lastExerciseLoad(id).weight)} × ${lastExerciseLoad(id).reps} reps · ${esc(lastExerciseLoad(id).date)}</p>`:""}
     <div class="weight-row"><div><label>Peso (kg)</label><input type="number" min="0" step="5" data-wkey="${esc(key)}" value="${esc(d.w)}" placeholder="0"></div><div><label>Reps</label><input type="number" min="1" max="50" data-rkey="${esc(key)}" value="${d.reps||10}"></div></div>
     <div class="sets">${[0,1,2].map(s=>`<button class="setbtn ${d.sets?.[s]?"done":""}" data-skey="${esc(key)}" data-set="${s}">Serie ${s+1}${d.sets?.[s]?" ✓":""}</button>`).join("")}</div>
     <details style="margin-top:8px"><summary>Técnica</summary><p class="small"><b>Cómo:</b> ${esc(ex.how)}<br><b>Clave:</b> ${esc(ex.tip)}</p></details>
    </div></article>`;
  }).join("")}</div></section>`);
 });
 $$("[data-wkey]").forEach(el=>el.oninput=()=>{const k=el.dataset.wkey;draftForEdit(k);state.workoutDraft[k].w=el.value;saveState()});
 $$("[data-rkey]").forEach(el=>el.oninput=()=>{const k=el.dataset.rkey;draftForEdit(k);state.workoutDraft[k].reps=+el.value||10;saveState()});
 $$("[data-skey]").forEach(el=>el.onclick=()=>{const k=el.dataset.skey,s=+el.dataset.set;draftForEdit(k);state.workoutDraft[k].sets[s]=!state.workoutDraft[k].sets[s];saveState();if(state.workoutDraft[k].sets[s]&&state.settings.restAuto!==false)startRest();renderRoutine();updateSessionSummary()});
 updateSessionSummary();
}
function workoutBurn(){
 const kg=parseFloat(state.settings.bodyWeight),min=parseFloat($("#workoutMinutes").value),met=parseFloat($("#workoutIntensity").value);
 if(!kg||!min||!met)return null;
 return Math.round(met*3.5*kg/200*min);
}
function updateSessionSummary(){
 const r=currentRoutine(); let done=0;
 r.ex.forEach((id,idx)=>{const d=state.workoutDraft[`${r.id}:${id}#${idx%3}`]; if(d?.sets) done+=d.sets.filter(Boolean).length});
 $("#sessionSets").textContent=`${done}/18 series`;
 const burn=workoutBurn(); $("#sessionBurn").textContent=`Gasto estimado: ${burn==null?"configura tu peso":burn+" kcal"}`;
}
function renderCatalog(){
 const ms=["Todos",...new Set(exercises.map(x=>x.m))];
 if($("#muscleFilter").options.length===1) ms.slice(1).forEach(m=>$("#muscleFilter").insertAdjacentHTML("beforeend",`<option>${esc(m)}</option>`));
 const f=$("#muscleFilter").value,q=$("#exerciseSearch").value.trim().toLowerCase();
 const xs=exercises.filter(x=>(f==="Todos"||x.m===f)&&(!q||(`${x.n} ${x.m} ${x.equip}`).toLowerCase().includes(q)));
 $("#exerciseCatalog").innerHTML=xs.map(ex=>`<article class="card exercise-card"><button type="button" class="exercise-visual zoom-image" data-image-exercise="${ex.id}" aria-label="Ampliar imagen de ${esc(ex.n)}"><img src="${ex.img}" alt="${esc(ex.n)}"><span class="image-zoom-hint" aria-hidden="true">⤢ Ampliar</span></button><div class="exercise-body">
  <div class="muscle">${esc(ex.m)}</div><div class="exercise-name">${esc(ex.n)}</div><div class="tags"><span class="tag">${esc(ex.equip)}</span></div>
  <p class="small"><b>Preparación:</b> ${esc(ex.setup)}</p><p class="small"><b>Ejecución:</b> ${esc(ex.how)}</p><p class="small"><b>Clave:</b> ${esc(ex.tip)}</p>
 </div></article>`).join("");
}
function latestWorkoutBurnToday(){
 return state.workouts.filter(w=>w.date===todayISO()).reduce((a,w)=>a+(w.burn||0),0);
}
function renderHome(){
 const d=todayDiet(),burn=latestWorkoutBurnToday(),net=d.k-burn;
 $("#homeFood").textContent=d.k;$("#homeBurn").textContent="−"+burn;$("#homeNet").textContent=net;$("#homeProt").textContent=d.p+" g";
 $("#homeKcalTarget").textContent=`${state.settings.kMin}–${state.settings.kMax}`;$("#homeProtTarget").textContent=`${state.settings.pMin}–${state.settings.pMax}`;
 $("#homeKcalBar").style.width=Math.min(100,d.k/state.settings.kMax*100)+"%";$("#homeProtBar").style.width=Math.min(100,d.p/state.settings.pMax*100)+"%";
 const idx=state.workouts.length%routines.length,r=routines[idx];
 $("#homeRoutine").innerHTML=`<b>${esc(r.name)}</b><p class="small">${r.a}: 3 ejercicios · 3×10<br>${r.b}: 3 ejercicios · 3×10</p><button class="btn primary" data-home-routine="${r.id}">Abrir rutina</button>`;
 $("[data-home-routine]")?.addEventListener("click",e=>{$("#routineSelect").value=e.currentTarget.dataset.homeRoutine;renderRoutine();setTab("entreno")});
 renderWeightTrend();
}
function renderWeightTrend(){
 const arr=[...state.weights].sort((a,b)=>a.date.localeCompare(b.date));
 if(!arr.length){$("#weightTrendText").textContent="Añade pesajes para ver la tendencia.";return}
 const last=arr[arr.length-1],first=arr[Math.max(0,arr.length-4)],diff=(last.kg-first.kg);
 $("#weightTrendText").textContent=`Último: ${last.kg.toFixed(1)} kg · cambio reciente: ${diff>0?"+":""}${diff.toFixed(1)} kg`;
}
function saveWorkout(){
 const r=currentRoutine(), exs=[]; let sets=0;
 r.ex.forEach((id,idx)=>{const key=`${r.id}:${id}#${idx%3}`,d=exerciseDraft(id,key),ex=exById(id);sets+=d.sets.filter(Boolean).length;exs.push({id,name:ex.n,muscle:ex.m,weight:parseFloat(d.w)||0,reps:d.reps||10,sets:d.sets})});
 if(sets===0 && !confirm("No has marcado ninguna serie. ¿Guardar igualmente?"))return;
 state.workouts.push({id:Date.now(),date:$("#workoutDate").value||todayISO(),routine:r.id,routineName:r.name,minutes:+$("#workoutMinutes").value||0,intensity:+$("#workoutIntensity").value||5,burn:workoutBurn()||0,sets,exercises:exs});
 r.ex.forEach((id,idx)=>delete state.workoutDraft[`${r.id}:${id}#${idx%3}`]);
 saveState();cancelRest();renderRoutine();renderHome();alert("Entrenamiento guardado ✅");
}
function renderProgress(){
 $("#setKcalMin").value=state.settings.kMin;$("#setKcalMax").value=state.settings.kMax;$("#setProtMin").value=state.settings.pMin;$("#setProtMax").value=state.settings.pMax;$("#setBodyWeight").value=state.settings.bodyWeight||"";
 $("#progWorkouts").textContent=state.workouts.length;$("#progSets").textContent=state.workouts.reduce((a,w)=>a+w.sets,0);$("#progBurn").textContent=state.workouts.reduce((a,w)=>a+(w.burn||0),0);
 if(state.workouts.length){const last=state.workouts[state.workouts.length-1];$("#progBest").textContent=`Última sesión: ${last.date} · ${last.routineName} · ${last.sets}/18 series`;}
 else $("#progBest").textContent="Sin entrenamientos guardados todavía.";
 const hs=[...state.workouts].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,12);
 $("#workoutHistory").innerHTML=hs.length?`<table class="table"><thead><tr><th>Fecha</th><th>Rutina</th><th>Series</th><th>Kcal est.</th></tr></thead><tbody>${hs.map(w=>`<tr><td>${w.date}</td><td>${esc(w.routineName)}</td><td>${w.sets}/18</td><td>${w.burn||0}</td></tr>`).join("")}</tbody></table>`:"<p class='small'>Todavía no hay sesiones.</p>";
 const wt=[...state.weights].sort((a,b)=>a.date.localeCompare(b.date));
 $("#weightTable").innerHTML=wt.length?`<table class="table"><thead><tr><th>Fecha</th><th>Peso</th></tr></thead><tbody>${wt.slice(-10).reverse().map(w=>`<tr><td>${w.date}</td><td>${w.kg.toFixed(1)} kg</td></tr>`).join("")}</tbody></table>`:"<p class='small'>Todavía no hay pesajes.</p>";
 drawWeightChart(wt.slice(-20));renderExerciseProgress();renderBackupReminder();
}
function drawWeightChart(data){
 const c=$("#weightChart"),ctx=c.getContext("2d"),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);
 ctx.strokeStyle="#e2e8f0";ctx.lineWidth=1;for(let y=25;y<h-20;y+=40){ctx.beginPath();ctx.moveTo(35,y);ctx.lineTo(w-10,y);ctx.stroke()}
 if(data.length<2){ctx.fillStyle="#64748b";ctx.font="14px sans-serif";ctx.fillText("Añade al menos 2 pesajes para ver la gráfica.",45,105);return}
 const vals=data.map(x=>x.kg),mn=Math.min(...vals)-1,mx=Math.max(...vals)+1;
 ctx.strokeStyle="#2563eb";ctx.lineWidth=4;ctx.beginPath();
 data.forEach((p,i)=>{const x=40+i*(w-60)/(data.length-1),y=20+(mx-p.kg)/(mx-mn)*(h-50);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
 ctx.stroke();ctx.fillStyle="#0f172a";ctx.font="11px sans-serif";
 data.forEach((p,i)=>{const x=40+i*(w-60)/(data.length-1),y=20+(mx-p.kg)/(mx-mn)*(h-50);ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();if(i===0||i===data.length-1)ctx.fillText(p.kg.toFixed(1),x-12,y-9)});
}
function init(){
 migrateOld();
 const machinePhoto=$("#machinePhoto"); if(machinePhoto) machinePhoto.onerror=()=>{machinePhoto.src="assets/homegym.svg"};
 $("#todayLabel").textContent=new Intl.DateTimeFormat("es-ES",{weekday:"short",day:"numeric",month:"short"}).format(new Date());
 routines.forEach(r=>$("#routineSelect").insertAdjacentHTML("beforeend",`<option value="${r.id}">${esc(r.name)}</option>`));
 $("#workoutDate").value=todayISO();
 renderDiet();renderCatalog();renderRoutine();renderHome();renderProgress();initEnhancements();

 $$(".tabbtn").forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
 $$("[data-goto]").forEach(b=>b.onclick=()=>setTab(b.dataset.goto));
 $("#goTop").onclick=()=>scrollTo({top:0,behavior:"smooth"});
 $("#routineSelect").onchange=renderRoutine;$("#workoutMinutes").oninput=updateSessionSummary;$("#workoutIntensity").onchange=updateSessionSummary;
 $("#muscleFilter").onchange=renderCatalog;$("#exerciseSearch").oninput=renderCatalog;
 $("#finishWorkout").onclick=saveWorkout;
 $("#saveQuickWeight").onclick=()=>{const kg=parseFloat($("#quickWeight").value);if(!kg)return alert("Escribe un peso válido.");state.weights=state.weights.filter(x=>x.date!==todayISO());state.weights.push({date:todayISO(),kg});state.settings.bodyWeight=kg;saveState();$("#quickWeight").value="";renderHome();renderProgress();alert("Peso guardado ✅")};
 $("#saveSettings").onclick=()=>{state.settings={...state.settings,kMin:+$("#setKcalMin").value||1900,kMax:+$("#setKcalMax").value||2000,pMin:+$("#setProtMin").value||130,pMax:+$("#setProtMax").value||150,bodyWeight:$("#setBodyWeight").value};saveState();renderDiet();renderHome();updateSessionSummary();alert("Objetivos guardados ✅")};
 $("#addCustomMeal").onclick=()=>{const n=$("#customMealName").value.trim(),k=+$("#customMealKcal").value,p=+$("#customMealProt").value,d=$("#customMealDetail").value.trim();if(!n||!k)return alert("Añade nombre y calorías.");state.customMeals[n]={k,p,d,img:"assets/meal-custom.svg"};saveState();["#customMealName","#customMealKcal","#customMealProt","#customMealDetail"].forEach(s=>$(s).value="");renderDiet();alert("Plato añadido ✅")};
 $("#exportData").onclick=exportBackup;
 $("#importData").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{importBackup(JSON.parse(await f.text()));location.reload()}catch(err){alert("No he podido importar la copia: "+err.message);e.target.value=""}};
 $("#resetAll").onclick=()=>{if(confirm("¿Seguro que quieres borrar dieta, entrenamientos, pesos y ajustes?")){Object.keys(localStorage).filter(k=>k.startsWith("miPlan")).forEach(k=>localStorage.removeItem(k));location.reload()}};
}
if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
init();
