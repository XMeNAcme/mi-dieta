const meals={
"— Selecciona —":[0,0],
"Arroz Brillante XL + kebab + 2 salsas":[761,53],
"Arroz Brillante XL + pollo":[690,55],
"Arroz Brillante XL + carne picada":[760,45],
"Macarrones boloñesa":[775,50],
"Pasta + pollo":[725,65],
"Pollo + patatas Airfryer":[700,55],
"Lomo + patatas Airfryer":[700,50],
"Hamburguesa + pan + patatas":[825,50],
"Fajitas de pollo":[775,65],
"Fajitas de ternera":[800,55],
"Fajitas de kebab":[790,50],
"Huevos + patatas":[700,35],
"Bocadillo de lomo":[800,55],
"Pollo empanado":[725,55],
"Pizza pollo con queso Lafuente":[760,55],
"Pizza kebab con queso Lafuente":[773,43],
"Kebab + patatas Airfryer + 2 salsas":[810,50]
};
const details={
"Arroz Brillante XL + kebab + 2 salsas":"200 g arroz Brillante XL + 200 g kebab Mercadona + 15 ml salsa kebab + 15 g ketchup Zero",
"Arroz Brillante XL + pollo":"200 g arroz Brillante XL + 200 g pollo + 60 g tomate Helios",
"Arroz Brillante XL + carne picada":"200 g arroz Brillante XL + 180 g carne picada + 60 g tomate Helios",
"Macarrones boloñesa":"100 g pasta seca + 180 g carne + 80 g tomate Helios + 20 g queso",
"Pasta + pollo":"100 g pasta seca + 200 g pollo + 80 g tomate Helios + 25 g queso",
"Pollo + patatas Airfryer":"220 g pollo + ración de patata + ketchup Zero",
"Lomo + patatas Airfryer":"200 g lomo + ración de patata",
"Hamburguesa + pan + patatas":"hamburguesa + pan + queso + ración de patata",
"Fajitas de pollo":"3 tortillas + 200 g pollo + 50 g queso",
"Fajitas de ternera":"3 tortillas + 180 g ternera + 50 g queso",
"Fajitas de kebab":"3 tortillas + 150 g kebab + 40 g queso + 15 ml salsa kebab + 15 g ketchup Zero",
"Huevos + patatas":"4 huevos + ración de patata",
"Bocadillo de lomo":"120 g pan + 180 g lomo + 30 g queso + patata",
"Pollo empanado":"200 g pollo + 30 g pan rallado + patata",
"Pizza pollo con queso Lafuente":"1 base 140 g + 60 g Helios + 50 g queso Lafuente + 150 g pollo",
"Pizza kebab con queso Lafuente":"1 base 140 g + 60 g Helios + 50 g queso Lafuente + 100 g kebab",
"Kebab + patatas Airfryer + 2 salsas":"200 g kebab + patata Airfryer + 15 ml salsa kebab + 15 g ketchup Zero"
};
const extras={"Whey con agua":[120,24],"Skyr / yogur proteico":[105,15],"Queso fresco batido 0% (250 g)":[135,20],
"Almendras/anacardos 20 g":[120,4],"Helado (~200 kcal)":[200,3],"Whey + 250 ml leche":[245,32]};
const days=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const mealOptions=()=>Object.keys(meals).map(x=>`<option>${x}</option>`).join("");

function renderDays(){const root=document.getElementById("days");root.innerHTML="";
days.forEach((d,i)=>root.insertAdjacentHTML("beforeend",`<section class="day"><div class="daytop"><div class="dayname">${d}</div><div class="badge neutral" id="badge${i}">Sin marcar</div></div>
<label>Comida</label><select id="m${i}">${mealOptions()}</select><div class="small" id="md${i}"></div>
<label>Cena</label><select id="d${i}">${mealOptions()}</select><div class="small" id="dd${i}"></div>
<label>Extras / comodines</label><div class="extras">${Object.keys(extras).map((e,j)=>`<label class="extra"><input type="checkbox" id="e${i}_${j}"><span>${e}</span></label>`).join("")}</div>
<div class="numbers"><div class="metric"><b id="k${i}">0</b><span>kcal</span></div><div class="metric"><b id="p${i}">0 g</b><span>proteína</span></div></div>
<div class="rec neutral" id="r${i}">Marca comida y cena para ver la recomendación.</div></section>`));
load(); attach(); calc();}
function classify(k,p){if(k===0)return["Sin marcar","neutral","Marca comida y cena para ver la recomendación."];
if(k<1700&&p<120)return["Falta comida","warn","Te faltan kcal y proteína: añade whey + un lácteo o revisa si has marcado todo."];
if(k<1850&&p>=120)return["Cabe extra","warn","Vas bien de proteína. Puedes añadir un extra pequeño si tienes hambre."];
if(k>=1850&&k<=2050&&p>=125)return["Muy bien","ok","Día muy bien cuadrado para tu objetivo."];
if(k>2050)return["Pasado","bad","Has pasado el rango: revisa extras, queso, aceite o raciones."];
if(p<125)return["Falta proteína","warn","Calorías razonables, pero intenta añadir proteína (whey, Skyr o queso fresco batido)."];
return["Bien","ok","Día bastante bien cuadrado."];}
function calc(){let sumK=0,sumP=0,filled=0,ok=0;days.forEach((_,i)=>{let k=0,p=0;
const mv=document.getElementById("m"+i).value,dv=document.getElementById("d"+i).value;
[mv,dv].forEach(v=>{k+=meals[v][0];p+=meals[v][1]});
document.getElementById("md"+i).textContent=details[mv]||"";
document.getElementById("dd"+i).textContent=details[dv]||"";
Object.keys(extras).forEach((e,j)=>{if(document.getElementById(`e${i}_${j}`).checked){k+=extras[e][0];p+=extras[e][1]}});
document.getElementById("k"+i).textContent=k;document.getElementById("p"+i).textContent=p+" g";
const [label,cls,msg]=classify(k,p);const b=document.getElementById("badge"+i);b.className="badge "+cls;b.textContent=label;
const r=document.getElementById("r"+i);r.className="rec "+cls;r.textContent=msg;if(k>0){sumK+=k;sumP+=p;filled++}if(cls==="ok")ok++;});
document.getElementById("avgKcal").textContent=filled?Math.round(sumK/filled):0;document.getElementById("avgProt").textContent=filled?Math.round(sumP/filled)+" g":"0 g";
document.getElementById("daysOk").textContent=ok+"/7";save();}
function save(){const s={};days.forEach((_,i)=>{s["m"+i]=document.getElementById("m"+i).value;s["d"+i]=document.getElementById("d"+i).value;
Object.keys(extras).forEach((e,j)=>s[`e${i}_${j}`]=document.getElementById(`e${i}_${j}`).checked)});localStorage.setItem("miDietaSemana",JSON.stringify(s));}
function load(){const s=JSON.parse(localStorage.getItem("miDietaSemana")||"{}");Object.entries(s).forEach(([id,v])=>{const el=document.getElementById(id);if(el){if(el.type==="checkbox")el.checked=v;else if([...el.options].some(o=>o.value===v))el.value=v}});
["w1","w2","w3"].forEach(id=>document.getElementById(id).value=localStorage.getItem(id)||"");saveWeights(false);}
function saveWeights(store=true){const vals=["w1","w2","w3"].map(id=>parseFloat(document.getElementById(id).value)).filter(x=>!Number.isNaN(x));
if(store)["w1","w2","w3"].forEach(id=>localStorage.setItem(id,document.getElementById(id).value));const avg=vals.length?(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):"—";
document.getElementById("wavg").textContent=avg;document.getElementById("topWavg").textContent=avg==="—"?"—":avg+" kg";}
function attach(){days.forEach((_,i)=>{document.getElementById("m"+i).addEventListener("change",calc);document.getElementById("d"+i).addEventListener("change",calc);
Object.keys(extras).forEach((e,j)=>document.getElementById(`e${i}_${j}`).addEventListener("change",calc))});
["w1","w2","w3"].forEach(id=>document.getElementById(id).addEventListener("input",()=>saveWeights(true)));}
document.getElementById("goTop").addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));
document.getElementById("reset").addEventListener("click",()=>{if(confirm("¿Borrar las selecciones y pesos de esta semana?")){localStorage.clear();renderDays();}});
if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js").catch(()=>{});}
renderDays();