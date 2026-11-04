const STEP_IDS = ["cuff","leg","heel","gusset","toe","finish"];
let lang = localStorage.getItem("kollisto-chat-lang") || "ru";
let content = {};
let currentStep = "cuff";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const get = (path) => path.split(".").reduce((o,k)=>o?.[k],content[lang]) ?? path.split(".").reduce((o,k)=>o?.[k],content.en);
const page = (key) => get("page."+key);
const ui = (key) => get("ui."+key);
const step = (id) => get("steps."+id);
const safe = (value) => String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function setText(selector,value){const el=$(selector);if(el)el.textContent=value??"";}
function renderStatic(){
 document.documentElement.lang=lang;
 $$("[data-page]").forEach(el=>el.textContent=page(el.dataset.page)??"");
 $$("[data-ui]").forEach(el=>el.textContent=ui(el.dataset.ui)??"");
 $$("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
 const subtitle = lang==="ru" ? "Пошаговый урок для начинающих" : "A step-by-step lesson for beginners";
 setText("[data-hero-sub]",subtitle);
 const hint = lang==="ru" ? "Нажми на часть носка, чтобы перейти к инструкции" : "Choose a part of the sock to open its instructions";
 setText("[data-ui=diagramHint]",hint);
 renderInfo();
 renderNav();
 renderStep(currentStep);
}
function renderInfo(){
 const items=[
  ["🧶","yarn-h","yarn-1","yarn-2"],["⚒","needles-h","needles-1","needles-2"],["✦","skills-h","skills-1","skills-2"],["▤","measure-h","measure-1",null]
 ];
 $("#info-grid").innerHTML=items.map(([icon,h,a,b])=>`<article class="info-card"><div class="info-heading"><span class="info-icon">${icon}</span>${safe(page(h))}</div><p>${safe(page(a))}</p>${b? `<p>${safe(page(b))}</p>`:""}</article>`).join("");
}
function renderNav(){
 $("#step-nav").innerHTML=STEP_IDS.slice(0,5).map((id,i)=>`<button class="step-pill" data-step="${id}" ${id===currentStep?'aria-current="step"':""}><span class="num">${i+1}</span><span>${safe(step(id).chip||step(id).name)}</span></button>`).join("");
 $$(".sock-zone").forEach(z=>z.classList.toggle("active",z.dataset.id===currentStep));
 $$(".map-label").forEach((g,i)=>{const key=["cuff","leg","heel","gusset","toe"][i];const label=g.querySelector(".label-text");if(label)label.textContent=step(key).name;});
}
function renderStep(id){
 currentStep=id;
 const s=step(id);const n=STEP_IDS.indexOf(id)+1;
 const heading=lang==="ru"?"Что делаем":"What to do";
 const notes=s.watchLabel || (lang==="ru"?"Совет":"Tip");
 $("#lesson-content").innerHTML=`<p class="step-meta">${safe(ui("stepOf").replace("{n}",n).replace("{m}",STEP_IDS.length))}${safe(s.kind)}</p><h2>${safe(s.name)}</h2><p class="lead">${safe(s.what)}</p><h3>${safe(heading)}</h3><ol>${(s.how||[]).map(x=>`<li>${safe(x)}</li>`).join("")}</ol><h3 class="notes-title">${safe(notes)}</h3><ul class="notes">${(s.watch||[]).map(x=>`<li>${safe(x)}</li>`).join("")}</ul>`;
 $("#step-nav").innerHTML=STEP_IDS.slice(0,5).map((key,i)=>`<button class="step-pill" data-step="${key}" ${key===id?'aria-current="step"':""}><span class="num">${i+1}</span><span>${safe(step(key).chip||step(key).name)}</span></button>`).join("");
 $$(".sock-zone").forEach(z=>z.classList.toggle("active",z.dataset.id===id));
 $("#prev-step").disabled=n===1;
 $("#prev-step").style.opacity=n===1?".35":"1";
 const next=STEP_IDS[Math.min(n,STEP_IDS.length-1)];
 $("#next-step").textContent=n===STEP_IDS.length?(lang==="ru"?"Сначала ↺":"Start again ↺"):(lang==="ru"?"Далее →":"Next →");
 $("#next-step").dataset.step=n===STEP_IDS.length?"cuff":next;
 $$(".map-label .label-text").forEach((el,i)=>el.textContent=step(["cuff","leg","heel","gusset","toe"][i]).name);
}
function stitchCount(c,g,r){const repeat=r==="1x1"?2:4;return Math.max(Math.round((c*(g/10)*.9)/repeat)*repeat,repeat);}
function renderCalc(){const c=parseFloat($("#circ").value),g=parseFloat($("#gauge").value);$("#cast").textContent=c>0&&g>0?stitchCount(c,g,$("#ribbing").value):"–";}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-step]");if(b){renderStep(b.dataset.step);return;}
 const z=e.target.closest(".sock-zone");if(z){renderStep(z.dataset.id);return;}
});
$$("[data-lang]").forEach(b=>b.addEventListener("click",()=>{lang=b.dataset.lang;localStorage.setItem("kollisto-chat-lang",lang);renderStatic();}));
$("#next-step").addEventListener("click",e=>renderStep(e.currentTarget.dataset.step));
$("#prev-step").addEventListener("click",()=>{const i=STEP_IDS.indexOf(currentStep);if(i>0)renderStep(STEP_IDS[i-1]);});
["circ","gauge","ribbing"].forEach(id=>$("#"+id).addEventListener("input",renderCalc));
$("#ribbing").addEventListener("change",renderCalc);
$("#calculate").addEventListener("click",renderCalc);
(async()=>{
 try{
  const [en,ru]=await Promise.all([fetch("content/en.json").then(r=>r.json()),fetch("content/ru.json").then(r=>r.json())]);
  content={en,ru};if(!content[lang])lang="ru";renderStatic();renderCalc();
  document.title=page("title")+" — KOLLISTO";
  $("#calculate").textContent=lang==="ru"?"Рассчитать":"Calculate";
 }catch(err){console.error(err);$("#lesson-content").textContent="Could not load tutorial content.";}
})();
document.addEventListener("keydown",e=>{
 if((e.key==="Enter"||e.key===" ")&&e.target.matches(".sock-zone[role=button]")){
  e.preventDefault();renderStep(e.target.dataset.id);
 }
});
