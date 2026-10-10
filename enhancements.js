const DAY_MS=86400000;
const BACKUP_KEY="miPlanBackupMeta", REST_KEY="miPlanRestTimer";
function readLocalObject(key){try{const x=JSON.parse(localStorage.getItem(key)||"{}");return x&&typeof x==="object"&&!Array.isArray(x)?x:{}}catch{return {}}}
let backupMeta=readLocalObject(BACKUP_KEY),restState=readLocalObject(REST_KEY);

function completedSets(ex){return Array.isArray(ex.sets)?ex.sets.filter(Boolean).length:0}
function exerciseEntries(id){
 return state.workouts.flatMap((w,index)=>(w.exercises||[]).filter(ex=>ex.id===id&&completedSets(ex)>0).map((ex,position)=>({date:w.date,index,position,weight:Number(ex.weight)||0,reps:Number(ex.reps)||10,sets:completedSets(ex)})))
  .sort((a,b)=>String(a.date).localeCompare(String(b.date))||a.index-b.index||a.position-b.position);
}
function lastExerciseLoad(id){return exerciseEntries(id).at(-1)||null}
function freshExerciseDraft(id){const last=lastExerciseLoad(id);return {w:last?String(last.weight):"",reps:last?.reps||10,sets:[false,false,false]}}
function exerciseDraft(id,key){return state.workoutDraft[key]||freshExerciseDraft(id)}
function idFromDraftKey(key){return key.slice(key.indexOf(":")+1,key.lastIndexOf("#"))}
function draftForEdit(key){return state.workoutDraft[key]||(state.workoutDraft[key]=freshExerciseDraft(idFromDraftKey(key)))}
function exerciseSessions(id){
 const sessions=[];
 for(const e of exerciseEntries(id)){
  let row=sessions.find(x=>x.index===e.index);
  if(!row){row={date:e.date,index:e.index,weight:e.weight,reps:e.reps,sets:0,volume:0};sessions.push(row)}
  if(e.weight>=row.weight){row.weight=e.weight;row.reps=e.reps}
  row.sets+=e.sets;row.volume+=e.weight*e.reps*e.sets;
 }
 return sessions;
}
function kgLabel(n){return Number(n).toLocaleString("es-ES",{maximumFractionDigits:2})+" kg"}
function shortDate(date){return new Date(date+"T12:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short"})}
function renderExerciseProgress(){
 const select=$("#exerciseProgressSelect");if(!select)return;
 if(!select.options.length)select.innerHTML=exercises.map(ex=>`<option value="${ex.id}">${esc(ex.m+" · "+ex.n)}</option>`).join("");
 const ex=exById(select.value)||exercises[0],data=exerciseSessions(ex.id),last=data.at(-1);
 $("#exerciseProgressEmpty").classList.toggle("hidden",!!last);$("#exerciseProgressData").classList.toggle("hidden",!last);
 if(!last)return;
 $("#exerciseBest").textContent=kgLabel(Math.max(...data.map(x=>x.weight)));
 $("#exerciseLast").textContent=kgLabel(last.weight)+" × "+last.reps;
 $("#exerciseCount").textContent=data.length;
 $("#exerciseProgressNote").textContent="Solo cuenta sesiones con alguna serie completada. La gráfica muestra la mayor carga de cada sesión.";
 const points=data.slice(-12),vals=points.map(x=>x.weight),padding=Math.max(2,(Math.max(...vals)-Math.min(...vals))*.2),min=Math.max(0,Math.min(...vals)-padding),max=Math.max(...vals)+padding;
 const coords=points.map((p,i)=>({x:55+(points.length===1?265:i*530/(points.length-1)),y:20+(max-p.weight)/(max-min)*145,p}));
 const labels=new Set([0,Math.floor((points.length-1)/2),points.length-1]);
 $("#exerciseLoadChart").innerHTML=`<svg viewBox="0 0 640 215" role="img" aria-label="Evolución de carga de ${esc(ex.n)} en ${points.length} sesiones"><title>${esc(ex.n)}: cargas por sesión</title>
  ${[0,1,2].map(i=>{const y=20+i*72.5;return `<line x1="55" y1="${y}" x2="585" y2="${y}" stroke="#e2e8f0"/><text x="45" y="${y+4}" text-anchor="end" fill="#64748b" font-size="12">${(max-i*(max-min)/2).toLocaleString("es-ES",{maximumFractionDigits:1})}</text>`}).join("")}
  <polyline points="${coords.map(c=>c.x+","+c.y).join(" ")}" fill="none" stroke="#2563eb" stroke-width="3"/>
  ${coords.map((c,i)=>`<circle cx="${c.x}" cy="${c.y}" r="5" fill="#2563eb"><title>${esc(c.p.date)}: ${kgLabel(c.p.weight)}</title></circle>${labels.has(i)?`<text x="${c.x}" y="200" text-anchor="middle" fill="#64748b" font-size="12">${esc(shortDate(c.p.date))}</text>`:""}`).join("")}</svg>`;
 $("#exerciseLoadHistory").innerHTML=`<table class="table"><thead><tr><th>Fecha</th><th>Carga máx.</th><th>Reps</th><th>Series</th></tr></thead><tbody>${data.slice(-12).reverse().map(p=>`<tr><td>${esc(p.date)}</td><td>${kgLabel(p.weight)}</td><td>${p.reps}</td><td>${p.sets}</td></tr>`).join("")}</tbody></table>`;
}

function restSecondsLeft(now=Date.now()){return restState.phase==="running"?Math.max(0,Math.ceil((restState.endAt-now)/1000)):Number(restState.remaining)||0}
function persistRest(){localStorage.setItem(REST_KEY,JSON.stringify(restState))}
function startRest(now=Date.now()){
 const seconds=restState.phase==="paused"?restSecondsLeft(now):Number(state.settings.restSeconds)||90;
 restState={phase:"running",remaining:seconds,endAt:now+seconds*1000};persistRest();renderRest(now);
}
function pauseRest(now=Date.now()){if(restState.phase!=="running")return;restState={phase:"paused",remaining:restSecondsLeft(now),endAt:0};persistRest();renderRest(now)}
function cancelRest(){restState={phase:"idle",remaining:Number(state.settings.restSeconds)||90,endAt:0};persistRest();renderRest()}
function selectRest(seconds){state.settings.restSeconds=seconds;saveState();cancelRest()}
function tickRest(now=Date.now()){
 if(restState.phase==="running"&&restSecondsLeft(now)===0){restState={phase:"finished",remaining:0,endAt:0};persistRest()}
 renderRest(now);
}
function renderRest(now=Date.now()){
 const display=$("#restCountdown");if(!display)return;
 const seconds=restState.phase==="idle"?Number(state.settings.restSeconds)||90:restSecondsLeft(now),time=Math.floor(seconds/60)+":"+String(seconds%60).padStart(2,"0");
 display.textContent=time;
 $("#restStatus").textContent=restState.phase==="finished"?"Descanso terminado. Puedes empezar la siguiente serie.":restState.phase==="paused"?"Descanso en pausa.":restState.phase==="running"?"Descanso en marcha.":"Elige el descanso entre series.";
 $("#restStart").disabled=restState.phase==="running";$("#restStart").textContent=restState.phase==="paused"?"Continuar":"Iniciar";
 $("#restPause").disabled=restState.phase!=="running";$("#restStop").disabled=restState.phase==="idle";
 $("#restAuto").checked=state.settings.restAuto!==false;
 $$("[data-rest-seconds]").forEach(b=>b.setAttribute("aria-pressed",String(Number(b.dataset.restSeconds)===Number(state.settings.restSeconds))));
 const mini=$("#restMini");mini.classList.toggle("hidden",!["running","paused","finished"].includes(restState.phase));mini.textContent=restState.phase==="finished"?"✓ Descanso terminado":"⏱ "+time+(restState.phase==="paused"?" · Pausa":"");
}

function backupPayload(){return {version:4,settings:state.settings,customMeals:state.customMeals,diet:state.diet,workoutDraft:state.workoutDraft,workouts:state.workouts,weights:state.weights,media:state.media}}
function fingerprint(){const str=JSON.stringify(backupPayload());let hash=2166136261;for(let i=0;i<str.length;i++){hash^=str.charCodeAt(i);hash=Math.imul(hash,16777619)}return (hash>>>0).toString(16)}
function hasUserData(){return state.workouts.length>0||state.weights.length>0||Object.keys(state.customMeals).length>0||Object.keys(state.workoutDraft).length>0||Object.keys(state.media).length>0||Object.values(state.diet).some(e=>e.meal&&e.meal!=="— Selecciona —"||e.dinner&&e.dinner!=="— Selecciona —"||Object.values(e.extras||{}).some(Boolean))||["kMin","kMax","pMin","pMax","bodyWeight"].some(k=>state.settings[k]!==defaultSettings[k])}
function backupStatus(now=Date.now()){
 const data=hasUserData(),dirty=fingerprint()!==backupMeta.lastExportFingerprint,last=Number(backupMeta.lastExportAt)||0;
 return {data,dirty,last,due:data&&dirty&&now>=(Number(backupMeta.snoozeUntil)||0)&&(!last||now-last>=7*DAY_MS)};
}
function renderBackupReminder(){
 const banner=$("#backupReminder");if(!banner)return;const s=backupStatus();banner.classList.toggle("hidden",!s.due);
 $("#backupReminderText").textContent=s.last?"Tienes cambios nuevos y hace al menos una semana que no exportas tus datos.":"Ya tienes datos guardados. Guarda una copia para poder recuperarlos en otro dispositivo.";
 $("#backupStatusText").textContent=s.last?"Última exportación: "+new Date(s.last).toLocaleString("es-ES")+(s.dirty?". Hay cambios pendientes de copiar.":". Tu copia está al día."):"Aún no has exportado una copia de seguridad.";
}
function noteDataSaved(){backupMeta.lastChangedAt=Date.now();localStorage.setItem(BACKUP_KEY,JSON.stringify(backupMeta));renderBackupReminder()}
function snoozeBackup(now=Date.now()){backupMeta.snoozeUntil=now+7*DAY_MS;localStorage.setItem(BACKUP_KEY,JSON.stringify(backupMeta));renderBackupReminder()}
function markBackupExported(now=Date.now()){backupMeta={...backupMeta,lastExportAt:now,lastExportFingerprint:fingerprint(),snoozeUntil:0};localStorage.setItem(BACKUP_KEY,JSON.stringify(backupMeta));renderBackupReminder()}
function exportBackup(){
 const data={...backupPayload(),exportedAt:new Date().toISOString()},blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),a=document.createElement("a"),url=URL.createObjectURL(blob);
 a.href=url;a.download=`mi-plan-backup-${todayISO()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);markBackupExported();
}
function validateBackup(x){
 const obj=v=>v&&typeof v==="object"&&!Array.isArray(v);
 if(!obj(x)||!obj(x.settings)||!obj(x.customMeals)||!obj(x.diet)||!Array.isArray(x.workouts)||!Array.isArray(x.weights))throw Error("No es una copia de Mi Plan.");
 if(x.workoutDraft!==undefined&&!obj(x.workoutDraft)||x.media!==undefined&&!obj(x.media))throw Error("Datos de copia no válidos.");
 const settings={...defaultSettings,...x.settings};
 for(const k of ["kMin","kMax","pMin","pMax"]){if(!Number.isFinite(Number(settings[k]))||Number(settings[k])<=0)throw Error("Objetivos no válidos.");settings[k]=Number(settings[k])}
 if(settings.kMin>settings.kMax||settings.pMin>settings.pMax)throw Error("Revisa los objetivos de la copia.");
 if(settings.bodyWeight!==""&&(!Number.isFinite(Number(settings.bodyWeight))||Number(settings.bodyWeight)<=0))throw Error("Peso no válido.");
 if(![60,90,120].includes(Number(settings.restSeconds)))settings.restSeconds=90;
 if(x.weights.some(w=>!obj(w)||!/^\d{4}-\d{2}-\d{2}$/.test(w.date)||typeof w.kg!=="number"||!Number.isFinite(w.kg)||w.kg<=0))throw Error("Pesajes no válidos.");
 if(x.workouts.some(w=>!obj(w)||!/^\d{4}-\d{2}-\d{2}$/.test(w.date)||!Number.isFinite(w.sets)||w.sets<0||w.exercises!==undefined&&!Array.isArray(w.exercises)))throw Error("Sesiones no válidas.");
 if(x.workouts.some(w=>(w.exercises||[]).some(ex=>!obj(ex)||typeof ex.id!=="string"||!Number.isFinite(ex.weight)||ex.weight<0||!Number.isFinite(ex.reps)||ex.reps<1||!Array.isArray(ex.sets))))throw Error("Ejercicios no válidos.");
 if(Object.values(x.diet).some(e=>!obj(e)||!obj(e.extras)))throw Error("Dieta no válida.");
 if(Object.values(x.customMeals).some(e=>!obj(e)||typeof e.k!=="number"||!Number.isFinite(e.k)||typeof e.p!=="number"||!Number.isFinite(e.p)))throw Error("Platos no válidos.");
 if(Object.values(x.workoutDraft||{}).some(e=>!obj(e)||!Array.isArray(e.sets)))throw Error("Borrador no válido.");
 return {...x,settings};
}
function importBackup(x){
 const copy=validateBackup(x);
 state.settings=copy.settings;state.customMeals=copy.customMeals;state.diet=copy.diet;state.workouts=copy.workouts;state.weights=copy.weights;
 state.workoutDraft=copy.workoutDraft||{};if(copy.media!==undefined){state.media=copy.media;localStorage.setItem("miPlanMedia",JSON.stringify(state.media))}
 saveState();backupMeta={lastExportAt:Number.isFinite(Date.parse(copy.exportedAt))?Date.parse(copy.exportedAt):0,lastExportFingerprint:fingerprint(),snoozeUntil:0};localStorage.setItem(BACKUP_KEY,JSON.stringify(backupMeta));
 cancelRest();
}

function initEnhancements(){
 if(!["idle","running","paused","finished"].includes(restState.phase)||!Number.isFinite(restState.remaining)||!Number.isFinite(restState.endAt))restState={phase:"idle",remaining:Number(state.settings.restSeconds)||90,endAt:0};
 $("#restStart").onclick=()=>startRest();$("#restPause").onclick=()=>pauseRest();$("#restStop").onclick=cancelRest;
 $$("[data-rest-seconds]").forEach(b=>b.onclick=()=>selectRest(Number(b.dataset.restSeconds)));
 $("#restAuto").onchange=e=>{state.settings.restAuto=e.target.checked;saveState()};
 $("#restMini").onclick=()=>{setTab("entreno");$("#restPanel").scrollIntoView({behavior:"smooth",block:"center"})};
 tickRest();setInterval(()=>tickRest(),500);document.addEventListener("visibilitychange",()=>{tickRest();renderBackupReminder()});
 $("#exerciseProgressSelect").onchange=renderExerciseProgress;renderExerciseProgress();
 $("#backupNow").onclick=exportBackup;$("#backupLater").onclick=()=>snoozeBackup();renderBackupReminder();
 const dialog=$("#exerciseImageDialog");
 document.addEventListener("click",e=>{const b=e.target.closest("[data-image-exercise]");if(!b)return;const ex=exById(b.dataset.imageExercise);if(!ex)return;$("#exerciseImageTitle").textContent=ex.n;$("#exerciseImageLarge").src=ex.img;$("#exerciseImageLarge").alt=ex.n+" · posición inicial y final";$("#exerciseImageCaption").textContent=ex.how;dialog.showModal()});
 $("#closeExerciseImage").onclick=()=>dialog.close();dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
}
