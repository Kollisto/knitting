const STEP_IDS=["cuff","leg","heel","gusset","toe","finish"];
const MAP_IDS=["cuff","leg","heel","gusset","toe"];
let lang=localStorage.getItem("kollisto-chat-lang")||"ru",content={},currentStep="cuff";
const $=s=>document.querySelector(s),$=s=>[...document.querySelectorAll(s)];
const EXTRA_UI={
 ru:{tabCalc:"Калькулятор петель",tabAbout:"О проекте",calcIntro:"Рассчитайте количество петель для вашего носка",footLength:"Длина стопы (см)",calcFootnote:"Это расчётное значение. Перед началом свяжите образец."},
 en:{tabCalc:"Stitch calculator",tabAbout:"About",calcIntro:"Calculate the number of stitches for your sock",footLength:"Foot length (cm)",calcFootnote:"This is an estimate. Knit a gauge swatch before you begin."}
};
const get=path=>path.split(".").reduce((o,k)=>o?.[k],content[lang])??path.split(".").reduce((o,k)=>o?.[k],content.en);
const page=k=>get("page."+k),ui=k=>get("ui."+k),step=id=>get("steps."+id);
const safe=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function renderStatic(){
 document.documentElement.lang=lang;
 $$("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
 $$("[data-page]").forEach(el=>{const v=page(el.dataset.page);if(v!==undefined)el.textContent=v;});
 $$("[data-ui]").forEach(el=>{const v=ui(el.dataset.ui)??EXTRA_UI[lang]?.[el.dataset.ui];if(v!==undefined)el.textContent=v;});
 const hint=lang==="ru"?"Нажми на часть носка,\nчтобы узнать, как её вязать":"Choose a part of the sock\nto see how it is knitted";
 $(".instruction-hint").textContent=hint;
 renderNav();renderStep(currentStep);renderCalc();
 document.title=(page("title")||"Sock tutorial")+" — KOLLISTO";
}
function renderNav(){
 $("#step-nav").innerHTML=MAP_IDS.map((id,i)=>`<button class="step-pill" data-step="${id}" ${id===currentStep?'aria-current="step"':""}><span class="num">${i+1}</span><span>${safe(step(id).chip||step(id).name)}</span></button>`).join("");
 $$(".sock-zone").forEach(z=>z.classList.toggle("active",z.dataset.id===currentStep));
 $$(".sock-label").forEach((g,i)=>{const t=g.querySelector("[data-label]");if(t)t.textContent=step(MAP_IDS[i]).name;});
}
function renderStep(id){
 currentStep=id;const s=step(id),n=STEP_IDS.indexOf(id)+1;
 const title=lang==="ru"?"Что делаем":"What to do",tip=s.watchLabel||(lang==="ru"?"Маленький совет":"A little tip");
 const watch=(s.watch||[]).slice(0,2);
 const kitTitle=page("kit-h")||(lang==="ru"?"Что понадобится":"What you'll need");
 const kitText=[page("kit-1"),page("needles-1")].filter(Boolean).join(" ");
 $("#lesson-content").innerHTML=`<span class="step-count">${lang==="ru"?"ШАГ":"STEP"} ${n} ${lang==="ru"?"ИЗ":"OF"} ${STEP_IDS.length}</span><h1>${safe(s.name)}</h1><p class="lead">${safe(s.what)}</p><section class="how-card"><h3>${title}</h3><ol>${(s.how||[]).map(x=>`<li>${safe(x)}</li>`).join("")}</ol></section><section class="tip-card"><div class="tip-title"><span>✦</span>${safe(tip)}</div><ul>${watch.map(x=>`<li>${safe(x)}</li>`).join("")}</ul></section><section class="kit-card"><h3>✿ ${safe(kitTitle)}</h3><p>${safe(kitText)}</p></section>`;
 $$(".step-pill").forEach(b=>b.setAttribute("aria-current",b.dataset.step===id?"step":"false"));
 $$(".sock-zone").forEach(z=>z.classList.toggle("active",z.dataset.id===id));
 $("#prev-step").disabled=n===1;$("#prev-step").style.opacity=n===1?".35":"1";
 $("#next-step").innerHTML=n===STEP_IDS.length?(lang==="ru"?"Начать сначала <span>↺</span>":"Start again <span>↺</span>"):(lang==="ru"?"Следующий шаг <span>→</span>":"Next step <span>→</span>");
 $("#next-step").dataset.step=n===STEP_IDS.length?"cuff":STEP_IDS[n];
}
function stitchCount(c,g,r){const multiple=r==="1x1"?2:4;return Math.max(multiple,Math.round((c*g/10*.9)/multiple)*multiple);}
function renderCalc(){
 const c=parseFloat($("#circ").value),g=parseFloat($("#gauge").value),r=$("#ribbing").value;
 const count=c>0&&g>0?stitchCount(c,g,r):"–";$("#cast").textContent=count;
 $("#calc-fine").textContent=page("calc-fine")||"";
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-step]");if(b){renderStep(b.dataset.step);return;}const z=e.target.closest(".sock-zone");if(z)renderStep(z.dataset.id);});
document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".sock-zone[role=button]")){e.preventDefault();renderStep(e.target.dataset.id);}});
$$("[data-lang]").forEach(b=>b.addEventListener("click",()=>{lang=b.dataset.lang;localStorage.setItem("kollisto-chat-lang",lang);renderStatic();}));
$("#next-step").addEventListener("click",e=>renderStep(e.currentTarget.dataset.step));
$("#prev-step").addEventListener("click",()=>{const i=STEP_IDS.indexOf(currentStep);if(i>0)renderStep(STEP_IDS[i-1]);});
["circ","gauge","ribbing"].forEach(id=>$("#"+id).addEventListener("input",renderCalc));
$("#ribbing").addEventListener("change",renderCalc);
(async()=>{try{const [en,ru]=await Promise.all([fetch("../content/en.json").then(r=>{if(!r.ok)throw Error("English content unavailable");return r.json();}),fetch("../content/ru.json").then(r=>{if(!r.ok)throw Error("Russian content unavailable");return r.json();})]);content={en,ru};if(!content[lang])lang="ru";renderStatic();}catch(err){console.error(err);$("#lesson-content").textContent="Could not load tutorial content.";}})();
