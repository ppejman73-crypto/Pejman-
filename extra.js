/* extra.js - Gold / Silver toggle + 22k options for Goldsmith's Bench
   Loaded after the main script. Add this line before </body> in index.html:
   <script src="extra.js"></script>
*/
(function(){
var M='gold';
try{M=localStorage.getItem('gb-metal')==='silver'?'silver':'gold'}catch(e){}

/* ---------- styles ---------- */
var st=document.createElement('style');
st.textContent=
':root[data-metal="silver"]{--gold:#cfd6da}'+
':root:not([data-metal="silver"]) .s{display:none!important}'+
':root[data-metal="silver"] .g{display:none!important}'+
'.mtog{display:flex;gap:8px;margin-top:12px}'+
'.mtog button{flex:1;font:inherit;font-weight:500;padding:10px 12px;border-radius:14px;border:1px solid var(--glb);background:var(--gl);color:var(--ink);cursor:pointer;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}'+
'.mtog button[aria-pressed="true"]{background:rgba(36,65,58,.78);color:var(--gold);border-color:rgba(36,65,58,.78)}'+
'.mtog button:focus-visible{outline:2px solid var(--acc);outline-offset:2px}';
document.head.appendChild(st);

/* ---------- translations ---------- */
Object.assign(FA,{
'22k yellow gold':'طلای زرد 22 عیار','Fine silver (999)':'نقرهٔ خالص (999)','Silver 800':'نقره 800',
'Fineness and percent':'خلوص و درصد',
'Enter the silver purity as fineness or percent. The other one updates, plus the pure silver in your piece.':'خلوص نقره را به‌صورت خلوص یا درصد وارد کنید. مورد دیگر و مقدار نقرهٔ خالص قطعه هم محاسبه می‌شود.',
'Fineness (‰, e.g. 925)':'خلوص (‰، مثلاً 925)','Silver content':'میزان نقره','Pure silver in piece':'نقرهٔ خالص قطعه',
'Purity must be between 0 and 1000 ‰':'خلوص باید بین 0 تا 1000 باشد',
'Common silver marks':'مهرهای رایج نقره','Silver %':'درصد نقره','Britannia':'بریتانیا','Sterling':'استرلینگ','Coin silver':'نقرهٔ سکه‌ای','European 835':'اروپایی 835','European 800':'اروپایی 800',
'Make a silver batch':'ساخت ذوب نقره','How much source silver and alloy metal (copper) to melt for a target fineness.':'برای رسیدن به خلوص هدف، چه مقدار نقرهٔ پایه و فلز آلیاژ (مس) باید ذوب کنید.',
'Source silver fineness (‰)':'خلوص نقرهٔ پایه (‰)','Source fineness must be at least the target':'خلوص نقرهٔ پایه باید حداقل برابر هدف باشد',
'Source silver to melt':'نقرهٔ پایه برای ذوب','Pure silver in batch':'نقرهٔ خالص در ذوب',
'Mix two silvers':'مخلوط دو نقره','Melt two lots together and find the resulting fineness.':'دو مقدار نقره را با هم ذوب کنید و خلوص نهایی را ببینید.',
'Lot 1 fineness (‰)':'خلوص نقرهٔ اول (‰)','Lot 2 fineness (‰)':'خلوص نقرهٔ دوم (‰)','Resulting fineness':'خلوص نهایی','Pure silver':'نقرهٔ خالص',
'Melt silver lots into one alloy':'ذوب چند نقره در یک آلیاژ',
'Add every lot of melted silver with its weight and fineness. Enter the fineness you want, and see how much fine silver or alloy metal to add.':'همهٔ نقره‌های آب‌شده را با وزن و خلوصشان اضافه کنید. خلوص مورد نظر را بدهید تا ببینید چقدر نقرهٔ خالص یا فلز آلیاژ باید اضافه کنید.',
'Fine silver fineness (‰)':'خلوص نقرهٔ خالص (‰)','Fine gold fineness (‰)':'خلوص طلای خالص برای افزودن (‰)',
'Add fine silver':'نقرهٔ خالص برای افزودن','Pure silver in the lots':'نقرهٔ خالص در نقره‌های موجود',
'Silver alloys':'آلیاژهای نقره',
'Pick a standard to load its fineness, then set how the alloy part (everything except silver) is split between copper and zinc. Ratios must add up to 100. Melt a small test first.':'یک استاندارد را انتخاب کنید تا خلوصش بیاید، سپس تقسیم بخش آلیاژ (همه به‌جز نقره) بین مس و روی را تنظیم کنید. مجموع نسبت‌ها باید 100 باشد. اول یک نمونهٔ کوچک ذوب کنید.',
'Standard':'استاندارد','Sterling 925':'استرلینگ 925','Britannia 958':'بریتانیا 958','Coin silver 900':'نقرهٔ سکه‌ای 900','Silver 835':'نقره 835','Silver 800 ':'نقره 800',
'Check the target fineness, fine silver fineness and weight':'خلوص هدف، خلوص نقرهٔ خالص و وزن را بررسی کنید',
'Silver fineness (‰)':'خلوص نقره (‰)','Fine silver price per gram':'قیمت هر گرم نقرهٔ خالص','Enter weight, fineness and silver price':'وزن، خلوص و قیمت نقره را وارد کنید','Pure silver used':'نقرهٔ خالص مصرفی'
});

/* ---------- helpers ---------- */
function ins(sel,afterVal,list){var s=$(sel);if(!s)return;var ix=-1,i;
 for(i=0;i<s.options.length;i++){if(s.options[i].value===afterVal){ix=i;break}}
 if(ix<0)return;var ref=s.options[ix+1]||null;
 list.forEach(function(o){s.add(new Option(o[0],o[1]),ref)})}
function relabel(id,txt){var l=$(id).closest('label');if(!l)return;var n=l.firstChild;if(n&&n.nodeType===3)l.replaceChild(document.createTextNode(txt),n)}
function lotKey(){return M==='silver'?'gb-lots-s':'gb-lots'}
function loadLots(){var sv=null;try{sv=JSON.parse(localStorage.getItem(lotKey()))}catch(e){}
 $('f-lots').innerHTML='';
 if(sv&&Array.isArray(sv.l)&&sv.l.length){sv.l.forEach(function(p){addLot(p[0],p[1])});$('f-t').value=sv.t||(M==='silver'?925:750)}
 else if(M==='silver'){addLot(20,800);addLot(15,925);addLot(10,999);$('f-t').value=925}
 else{addLot(20,900);addLot(15,585);addLot(10,750);$('f-t').value=750}}

/* ---------- 22k and extra silver options in metal lists ---------- */
['ch-m1','ch-m2','y-m','b-m','q-m'].forEach(function(i){ins(i,'15.5',[['22k yellow gold','17.7']])});
ins('x-m','15.6',[['22k yellow gold','17.8']]);
['ch-m1','ch-m2','b-m','q-m'].forEach(function(i){ins(i,'10.36',[['Fine silver (999)','10.49'],['Silver 800','10.2']])});
ins('y-m','10.49',[['Silver 800','10.2']]);
ins('x-m','10.4',[['Fine silver (999)','10.5'],['Silver 800','10.3']]);

/* ---------- silver markup ---------- */
function gOnly(sec,idxs){var c=$(sec).children;idxs.forEach(function(i){if(c[i])c[i].classList.add('g')})}

// Purity
gOnly('purity',[0,1,4,5]);
$('purity').insertAdjacentHTML('afterbegin','<h2 class="s">Fineness and percent</h2><p class="hint s">Enter the silver purity as fineness or percent. The other one updates, plus the pure silver in your piece.</p>');
$('purity').insertAdjacentHTML('beforeend','<h2 class="s">Common silver marks</h2><div class="scroll s"><table><tr><th>Name</th><th>Fineness</th><th>Silver %</th></tr><tr><td>Fine silver</td><td>999</td><td>99.9</td></tr><tr><td>Britannia</td><td>958</td><td>95.8</td></tr><tr><td>Sterling</td><td>925</td><td>92.5</td></tr><tr><td>Coin silver</td><td>900</td><td>90.0</td></tr><tr><td>European 835</td><td>835</td><td>83.5</td></tr><tr><td>European 800</td><td>800</td><td>80.0</td></tr></table></div>');

// Alloy
[].forEach.call($('alloy').children,function(e){e.classList.add('g')});
$('alloy').insertAdjacentHTML('beforeend',
'<h2 class="s">Make a silver batch</h2><p class="hint s">How much source silver and alloy metal (copper) to melt for a target fineness.</p>'+
'<div class="grid s"><label>Target fineness (‰)<input id="as-t" type="number" inputmode="decimal" value="925" step="any"></label>'+
'<label>Total weight (g)<input id="as-w" type="number" inputmode="decimal" value="50" step="any"></label>'+
'<label>Source silver fineness (‰)<input id="as-s" type="number" inputmode="decimal" value="999" step="any"></label></div>'+
'<dl class="out s" id="as-out"></dl>'+
'<h2 class="s">Mix two silvers</h2><p class="hint s">Melt two lots together and find the resulting fineness.</p>'+
'<div class="grid s"><label>Lot 1 weight (g)<input id="ms-w1" type="number" inputmode="decimal" value="20" step="any"></label>'+
'<label>Lot 1 fineness (‰)<input id="ms-k1" type="number" inputmode="decimal" value="925" step="any"></label>'+
'<label>Lot 2 weight (g)<input id="ms-w2" type="number" inputmode="decimal" value="30" step="any"></label>'+
'<label>Lot 2 fineness (‰)<input id="ms-k2" type="number" inputmode="decimal" value="800" step="any"></label></div>'+
'<dl class="out s" id="ms-out"></dl>');

// Melt
gOnly('melt',[0,1]);
$('melt').insertAdjacentHTML('afterbegin','<h2 class="s">Melt silver lots into one alloy</h2><p class="hint s">Add every lot of melted silver with its weight and fineness. Enter the fineness you want, and see how much fine silver or alloy metal to add.</p>');

// Color
[].forEach.call($('color').children,function(e){e.classList.add('g')});
$('color').insertAdjacentHTML('beforeend',
'<h2 class="s">Silver alloys</h2><p class="hint s">Pick a standard to load its fineness, then set how the alloy part (everything except silver) is split between copper and zinc. Ratios must add up to 100. Melt a small test first.</p>'+
'<div class="grid s"><label>Standard<select id="ks-c"><option value="925">Sterling 925</option><option value="958">Britannia 958</option><option value="900">Coin silver 900</option><option value="835">Silver 835</option><option value="800">Silver 800</option><option value="custom">Custom</option></select></label>'+
'<label>Target fineness (‰)<input id="ks-t" type="number" inputmode="decimal" value="925" step="any"></label>'+
'<label>Total weight (g)<input id="ks-w" type="number" inputmode="decimal" value="10" step="any"></label>'+
'<label>Fine silver fineness (‰)<input id="ks-g" type="number" inputmode="decimal" value="999" step="any"></label>'+
'<label>Copper (% of alloy part)<input id="ks-cu" type="number" inputmode="decimal" value="100" step="any"></label>'+
'<label>Zinc (% of alloy part)<input id="ks-zn" type="number" inputmode="decimal" value="0" step="any"></label></div>'+
'<dl class="out s" id="ks-out"></dl>');
$('ks-c').addEventListener('change',function(){if(this.value!=='custom')$('ks-t').value=this.value});
$('ks-t').addEventListener('input',function(){$('ks-c').value='custom'});

// Price
$('c-k').closest('label').classList.add('g');
$('c-p').closest('label').classList.add('g');
$('c-w').closest('label').insertAdjacentHTML('afterend',
'<label class="s">Silver fineness (‰)<input id="sc-f" type="number" inputmode="decimal" value="925" step="any"></label>'+
'<label class="s">Fine silver price per gram<input id="sc-p" type="number" inputmode="decimal" value="420000" step="any"></label>');

/* ---------- calculation overrides ---------- */
var SW={'Gold content':'Silver content','Pure gold in piece':'Pure silver in piece','Add fine gold':'Add fine silver','Pure gold in the lots':'Pure silver in the lots'};
var _out=out;
out=function(i,rows){
 if(M==='silver'&&(i==='p-out'||i==='f-out')){
  rows=rows.filter(function(r){return r[0]!=='Karat'}).map(function(r){return [SW[r[0]]||r[0],String(r[1]).replace(/\s*\([\d.]+k\)/,'')]})}
 _out(i,rows)};
var _err=err;
err=function(i,m){if(M==='silver'&&m==='Purity must be between 0 and 24k')m='Purity must be between 0 and 1000 ‰';_err(i,m)};

var _alloy=alloy;
alloy=function(){
 if(M!=='silver')return _alloy();
 var T=v('as-t'),W=v('as-w'),S=v('as-s');
 if(!(T>0&&W>0&&S>0))err('as-out','Enter all three values');
 else if(S<T)err('as-out','Source fineness must be at least the target');
 else{var pure=W*T/1000,src=pure/(S/1000);
  out('as-out',[['Source silver to melt',f(src)+' g'],['Alloy metal to add',f(W-src)+' g'],['Pure silver in batch',f(pure)+' g'],['Total batch',f(W)+' g']])}
 var w1=v('ms-w1'),k1=v('ms-k1'),w2=v('ms-w2'),k2=v('ms-k2'),tot=w1+w2;
 if(!(tot>0))return err('ms-out','Enter the lot weights');
 var p=(w1*k1+w2*k2)/1000;
 out('ms-out',[['Resulting fineness',f(p/tot*1000,1)+' ‰'],['Total weight',f(tot)+' g'],['Pure silver',f(p)+' g']])};

var _colr=colr;
colr=function(){
 if(M!=='silver')return _colr();
 var T=v('ks-t')/1000,W=v('ks-w'),G=(v('ks-g')||999)/1000,cu=v('ks-cu')||0,zn=v('ks-zn')||0;
 if(!(T>0&&T<G&&W>0))return err('ks-out','Check the target fineness, fine silver fineness and weight');
 if(Math.abs(cu+zn-100)>.01)return out('ks-out',[['Ratios must add up to 100',f(cu+zn,2)]]);
 var ag=W*T/G,rest=W-ag,rows=[['Fine silver',f(ag,2)+' g']];
 if(cu>0)rows.push(['Copper',f(rest*cu/100,2)+' g ('+f(cu,1)+'%)']);
 if(zn>0)rows.push(['Zinc',f(rest*zn/100,2)+' g ('+f(zn,1)+'%)']);
 rows.push(['Total',f(W,2)+' g'],['Final fineness',f(T*1000,1)+' ‰']);
 out('ks-out',rows)};

var _price=price;
price=function(){
 if(M!=='silver')return _price();
 var w=v('c-w'),fn=v('sc-f'),p=v('sc-p'),ws=v('c-ws')||0,l=v('c-l')||0,st2=v('c-st')||0,m=v('c-m')||0,tx=v('c-tx')||0;
 if(!(w>0&&fn>0&&p>=0))return err('c-out','Enter weight, fineness and silver price');
 var pure=w*(1+ws/100)*fn/1000,metal=pure*p,labor=w*l,cost=metal+labor+st2,sell=cost*(1+m/100),tax=sell*tx/100;
 out('c-out',[['Final price',f(sell+tax,2)],['Metal incl. wastage',f(metal,2)],['Labor',f(labor,2)],['Stones',f(st2,2)],['Cost',f(cost,2)],['Profit',f(sell-cost,2)],['Tax',f(tax,2)],['Pure silver used',f(pure)+' g']])};

/* separate saved lots for silver */
saveLots=function(){try{localStorage.setItem(lotKey(),JSON.stringify({l:[].map.call($('f-lots').children,function(r){return [r.children[0].value,r.children[1].value]}),t:$('f-t').value,u:$('f-u').value}))}catch(e){}};

/* ---------- Gold / Silver toggle ---------- */
var GP='<option value="k">Karat (k)</option><option value="f">Fineness (‰, e.g. 750)</option><option value="p">Percent (%)</option>';
var SP='<option value="f">Fineness (‰, e.g. 925)</option><option value="p">Percent (%)</option>';
var GF='<option value="f" selected>Fineness (‰, e.g. 750)</option><option value="k">Karat (k)</option>';
var SF='<option value="f" selected>Fineness (‰, e.g. 925)</option>';

var bar=document.createElement('div');
bar.className='mtog';
bar.innerHTML='<button type="button" data-m="gold">Gold</button><button type="button" data-m="silver">Silver</button>';
document.querySelector('header').appendChild(bar);
bar.onclick=function(e){var b=e.target.closest('button');if(b&&b.dataset.m!==M)setMetal(b.dataset.m)};

function setMetal(m,init){
 if(!init)saveLots();
 M=m;
 document.documentElement.setAttribute('data-metal',m);
 try{localStorage.setItem('gb-metal',m)}catch(e){}
 [].forEach.call(bar.children,function(b){b.setAttribute('aria-pressed',b.dataset.m===m)});
 var s=m==='silver';
 if(!init||s){
  $('p-type').innerHTML=s?SP:GP;
  $('p-val').value=s?925:18;
  $('f-u').innerHTML=s?SF:GF;
  relabel('f-g',s?'Fine silver fineness (‰)':'Fine gold fineness (‰)');
  $('f-g').value=999;$('f-a').value=0;
  loadLots();
 }
 applyLang();
}
setMetal(M,true);
})();
