import React, { useEffect } from 'react';

const WM_TIERS = [
  { minAnn:15, maxAnn:29,  equity:325, dues:25, fee:4875,   mo12:487.5,   mo24:292.5,   refundable:3900  },
  { minAnn:30, maxAnn:59,  equity:320, dues:23, fee:9600,   mo12:960,     mo24:576,     refundable:7680  },
  { minAnn:60, maxAnn:99,  equity:315, dues:21, fee:18900,  mo12:1890,    mo24:1134,    refundable:15120 },
  { minAnn:100,maxAnn:364, equity:295, dues:19, fee:29500,  mo12:2950,    mo24:1770,    refundable:23600 },
  { minAnn:365,maxAnn:999, equity:275, dues:16, fee:100375, mo12:10037.5, mo24:6022.5,  refundable:80300 },
];

function getTier(annDays){
  for(const t of WM_TIERS) if(annDays >= t.minAnn && annDays <= t.maxAnn) return t;
  return WM_TIERS[0];
}

const $$ = id => document.getElementById(id);
const fmt = n => '$' + Math.round(n).toLocaleString();

function fmtMoney(n){
  const rounded = Math.round(n * 100) / 100;
  return '$' + (Number.isInteger(rounded)
    ? rounded.toLocaleString()
    : rounded.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2}));
}

function setPct(el){
  const p = ((el.value - el.min)/(el.max - el.min)*100).toFixed(1);
  el.style.setProperty('--p', p+'%');
}

const S = {
  rent:1500, water:50, elec:130, gas:80, net:65,
  hoa:0, trash:35, lawn:60, clean:0,
  util:325, homeSvc:95,
  stor:0, useStor:false,
  park:0, usePark:false,
  roadDays:20, roadDogRate:0,
  lhDays:100,
  wealthRate:6,
};
let curPane = 1;

const utilTotal = () => S.water + S.elec + S.gas + S.net;
const svcTotal = () => S.trash + S.lawn + S.clean;
const homeMo = () => S.rent + S.util + S.hoa + S.homeSvc + (S.useStor ? S.stor : 0) + (S.usePark ? S.park : 0);
const homeDays = () => Math.max(1, 30 - S.roadDays);
const cpd = () => homeMo() / homeDays();

function fv(monthlyPmt, annualRate, years){
  const r = annualRate/100/12;
  const n = years*12;
  if(r===0) return monthlyPmt*n;
  return monthlyPmt * ((Math.pow(1+r,n)-1)/r);
}

function slUpdate(el, labelId, setter, prefix){
  setPct(el);
  const v = parseInt(el.value);
  setter(v);
  const lbl = $$(labelId);
  if(lbl) lbl.textContent = (prefix||'') + v.toLocaleString();
  recalc();
}

function syncRoad(el){
  setPct(el);
  S.roadDays = parseInt(el.value);
  const home = 30 - S.roadDays;
  const h = $$('sHome'); h.value = home; setPct(h);
  $$('vRoad').textContent = S.roadDays;
  $$('vHome').textContent = home;
  $$('linkedBar').textContent = S.roadDays+' days on the road · '+home+' days at home · 30-day month';
  recalc();
}

function syncHome(el){
  setPct(el);
  const home = parseInt(el.value);
  S.roadDays = 30 - home;
  const r = $$('sRoad'); r.value = S.roadDays; setPct(r);
  $$('vRoad').textContent = S.roadDays;
  $$('vHome').textContent = home;
  $$('linkedBar').textContent = S.roadDays+' days on the road · '+home+' days at home · 30-day month';
  recalc();
}

function slRoadDog(el){
  setPct(el);
  S.roadDogRate = parseInt(el.value);
  $$('vRoadDog').textContent = S.roadDogRate > 0 ? '$'+S.roadDogRate+'/night' : '$0/night';
  recalc();
}

function slLH(el){
  setPct(el);
  S.lhDays = parseInt(el.value);
  $$('vLH').textContent = S.lhDays;
  recalc();
}

function resetToPromo(){
  const el = $$('sLH');
  el.value = 100;
  setPct(el);
  S.lhDays = 100;
  $$('vLH').textContent = 100;
  recalc();
}

function slWealthRate(el){
  setPct(el);
  S.wealthRate = parseInt(el.value);
  $$('wealthRateVal').textContent = S.wealthRate+'%';
  recalc();
}

function togStor(){
  const cb = $$('cbStor');
  S.useStor = cb.checked;
  $$('optStor').classList.toggle('open', cb.checked);
  if(!cb.checked) S.stor = 0;
  recalc();
}

function togPark(){
  const cb = $$('cbPark');
  S.usePark = cb.checked;
  $$('optPark').classList.toggle('open', cb.checked);
  if(!cb.checked) S.park = 0;
  recalc();
}

function tierLabel(tier){
  if(tier.minAnn >= 365) return '365-Day Tier';
  return tier.minAnn+'–'+tier.maxAnn+' Day Tier';
}

function recalc(){
  S.util = utilTotal();
  S.homeSvc = svcTotal();
  const hm = homeMo();
  const hd = homeDays();
  const cpdV = cpd();

  if($$('p1Mo')) $$('p1Mo').textContent = fmt(hm);
  if($$('p1Yr')) $$('p1Yr').textContent = fmt(hm*12);
  if($$('tCPD')) $$('tCPD').textContent = fmt(cpdV);
  if($$('tCPDcap')) $$('tCPDcap').textContent = 'Based on '+hd+' days at home this month. Your home base costs this for every day you\'re actually there.';
  if($$('tAllin')) $$('tAllin').textContent = fmt(hm);
  if($$('tAllinYr')) $$('tAllinYr').textContent = fmt(hm*12);
  if($$('tAllinNote')) $$('tAllinNote').textContent = 'You\'re paying '+fmt(cpdV)+' for each day you\'re actually home.';

  if(curPane < 3) return;

  const lh = S.lhDays;
  const annDays = lh;
  const tier = getTier(annDays);

  if($$('vLH')) $$('vLH').textContent = lh;
  if($$('phAnnual')) $$('phAnnual').textContent = annDays+' days/year · '+tierLabel(tier)+' · $'+tier.equity+'/day equity rate';

  const annualDues = annDays * tier.dues;
  const savingsAnn = hm * 12 - annualDues;
  const savingsMo = savingsAnn / 12;

  const savBig = $$('savingsBig');
  const savMath = $$('savingsMath');
  if(savBig){
    savBig.textContent = (savingsAnn >= 0 ? '' : '−') + fmt(Math.abs(savingsAnn)) + '/yr';
    savBig.className = 'savings-big ' + (savingsAnn >= 0 ? 'saving' : 'costing');
    if(savMath) savMath.textContent = fmt(hm*12)+'/yr current home costs − '+fmt(annualDues)+'/yr LineHaul dues';
  }

  const wbEl = $$('wealthBlock');
  if(wbEl){
    wbEl.style.display = savingsAnn > 0 ? '' : 'none';
    if(savingsAnn > 0){
      const rate = S.wealthRate;
      if($$('wealthSub')) $$('wealthSub').textContent = 'Invest '+fmt(savingsMo)+'/mo (your monthly savings) at '+rate+'% avg return:';
      const tbl = $$('wealthTable');
      if(tbl){
        const yrs = [10,20,30,40];
        tbl.innerHTML = yrs.map(y=>{
          const val = fv(savingsMo, rate, y);
          return `<div class="wealth-row"><div class="wealth-row-yr">${y} Years</div><div class="wealth-row-val">${fmt(val)}</div></div>`;
        }).join('');
      }
    }
  }

  const fee = annDays * tier.equity;
  const mo12 = fee / 12;
  const mo24 = fee / 24;
  const isPromo = (annDays === 100);
  const promoFee = 19500;
  const stdFee = 29500;
  const dispFee = isPromo ? promoFee : fee;
  const dispMo12 = dispFee / 12;
  const dispMo24 = dispFee / 24;

  const banner = $$('promoBanner');
  if(banner) banner.style.display = isPromo ? '' : 'none';
  const resetBtn = $$('promoResetBtn');
  if(resetBtn) resetBtn.style.display = isPromo ? 'none' : '';
  const markerStar = $$('markerStar');
  if(markerStar) markerStar.style.opacity = isPromo ? '1' : '0.4';
  if(isPromo){
    if($$('promoStandard')) $$('promoStandard').textContent = fmtMoney(stdFee);
    if($$('promoPrice')) $$('promoPrice').textContent = fmtMoney(promoFee);
    if($$('promoSave')) $$('promoSave').textContent = 'You save '+fmtMoney(stdFee - promoFee);
  }

  if($$('purchaseSub')) $$('purchaseSub').textContent = annDays+' days/year × $'+tier.equity+'/day equity rate'+(isPromo ? ' · Promo applied' : '');
  if($$('memfeeVal')) $$('memfeeVal').textContent = fmtMoney(dispFee);
  if($$('optFullAmt')) $$('optFullAmt').textContent = fmtMoney(dispFee);
  if($$('opt12Mo')) $$('opt12Mo').innerHTML = fmtMoney(dispMo12)+'<span>/mo</span>';
  if($$('opt12Total')) $$('opt12Total').textContent = fmtMoney(dispFee)+' total over 12 months';
  if($$('opt24Mo')) $$('opt24Mo').innerHTML = fmtMoney(dispMo24)+'<span>/mo</span>';
  if($$('opt24Total')) $$('opt24Total').textContent = fmtMoney(dispFee)+' total over 24 months';

  const spaceAvailAnn = 59 * annDays;
  const spaceAvailSavings = hm * 12 - spaceAvailAnn;
  const saNote = $$('memtypeSavingsNote');
  if(saNote){
    if(spaceAvailSavings > 0){
      saNote.textContent = 'At $59/day for '+annDays+' days, you\'d still save '+fmt(spaceAvailSavings)+'/yr vs. your current home costs.';
    } else {
      saNote.textContent = 'Even at $59/day, you get professional facilities, secure parking, and no lease commitment.';
    }
  }
}

function startCalc(){
  $$('heroSec').style.display = 'none';
  $$('progWrap').style.display = 'block';
  $$('calcMain').style.display = 'block';
  goTo(1);
}

function goTo(n){
  document.querySelectorAll('.pane').forEach(p=>p.classList.remove('active'));
  $$('pane'+n).classList.add('active');
  curPane = n;
  updateProg(n);
  if(n === 3){
    const el = $$('sLH'); el.value = S.lhDays; setPct(el);
    $$('vLH').textContent = S.lhDays;
  }
  recalc();
  window.scrollTo({top:0, behavior:'smooth'});
}

function tryJump(n){ if(n < curPane) goTo(n); }

function updateProg(n){
  for(let i=1;i<=3;i++){
    const dot=$$('dot'+i), lbl=$$('lbl'+i);
    dot.className='step-dot'; lbl.className='step-lbl';
    if(i<n){dot.classList.add('done');lbl.classList.add('done');}
    else if(i===n){dot.classList.add('active');lbl.classList.add('active');}
    if(i<3) $$('line'+i).className='step-line'+(i<n?' done':'');
  }
}

export default function OneHomeCalculator() {
  useEffect(() => {
    ['sRent','sWater','sElec','sGas','sNet','sHoa','sTrash','sLawn','sClean',
     'sStor','sPark','sRoad','sHome','sRoadDog','sLH','sWealthRate'
    ].forEach(id=>{
      const el=$$(id); if(!el) return; setPct(el);
    });
    recalc();
  }, []);

  return (
    <>
      <style>{`
:root {
  --navy:#160c08;
  --navy2:#2a1208;
  --gold:#ee752c;
  --gold-l:#f59b5e;
  --gold-bg:#2a1a0e;
  --gold-bd:#6b3010;
  --green:#3db87a;
  --green-bg:#0d2a1a;
  --green-bd:#1a5c38;
  --red:#d94040;
  --red-bg:#2a0d0d;
  --red-bd:#5c1a1a;
  --silver:#b6ada2;
  --ice:#8ec3de;
  --bg:#1a0e0a;
  --white:#f0eeec;
  --border:#3d1f14;
  --text:#f0eeec;
  --sub:#c4b5ac;
  --muted:#7a6058;
  --shadow:0 2px 12px rgba(0,0,0,.4),0 1px 4px rgba(0,0,0,.3);
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;-webkit-text-size-adjust:100%}
body{color:var(--text);font-family:'Figtree',sans-serif;font-size:15px;min-height:100vh}
.topbar{background:rgba(10,4,2,.96);backdrop-filter:blur(8px);border-bottom:2px solid rgba(238,117,44,.5);padding:0 32px;height:60px;display:flex;align-items:center;justify-content:center}
.logo{font-family:'Lexend Deca',sans-serif;font-size:19px;font-weight:800;letter-spacing:2px;color:#fff}
.logo em{color:var(--gold-l);font-style:normal}
.topbar-tag{font-family:'Lexend Deca',sans-serif;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--silver);padding:0}
.hero{background:rgba(6,2,1,.93);border-bottom:2px solid rgba(238,117,44,.35);padding:64px 28px 60px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(238,117,44,.08) 0%,transparent 70%);pointer-events:none}
.hero-eyebrow{font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--ice);margin-bottom:18px;opacity:.9}
.hero h1{font-family:'Lexend Deca',sans-serif;font-size:clamp(28px,5vw,48px);font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:10px;letter-spacing:1px}
.hero h1 span{color:var(--gold);text-shadow:0 0 30px rgba(238,117,44,.4)}
.hero p{font-size:17px;color:#ffffff;max-width:500px;margin:0 auto 36px;line-height:1.7;font-weight:500}
.hero-tagline{font-size:13px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--silver);margin-bottom:28px;opacity:.85}
.start-btn{display:inline-flex;align-items:center;gap:10px;background:var(--gold);color:#fff;font-family:'Lexend Deca',sans-serif;font-size:17px;font-weight:900;padding:18px 48px;border-radius:50px;border:2px solid rgba(255,255,255,.2);cursor:pointer;box-shadow:0 6px 32px rgba(238,117,44,.55),0 2px 8px rgba(0,0,0,.4);transition:all .22s;letter-spacing:.5px}
.start-btn:hover{transform:translateY(-3px);background:#f58540;box-shadow:0 10px 40px rgba(238,117,44,.65),0 4px 12px rgba(0,0,0,.5)}
.progress-wrap{background:rgba(18,8,4,.95);border-bottom:1px solid var(--border);padding:16px 24px 10px}
.step-row{display:flex;align-items:center}
.step-dot{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Lexend Deca',sans-serif;font-size:13px;font-weight:800;border:2.5px solid var(--border);background:rgba(30,12,6,.8);color:var(--muted);transition:all .3s;flex-shrink:0;cursor:pointer}
.step-dot.done{background:var(--green);border-color:var(--green);color:white}
.step-dot.active{background:var(--gold);border-color:var(--gold);color:#fff}
.step-line{flex:1;height:2px;background:var(--border);transition:background .3s}
.step-line.done{background:var(--green)}
.step-labels{display:flex;margin-top:7px}
.step-lbl{font-size:11px;font-weight:600;color:var(--muted);flex:1;text-align:center}
.step-lbl.active{color:var(--gold-l)}
.step-lbl.done{color:var(--green)}
.main{max-width:700px;margin:0 auto;padding:28px 20px 72px;position:relative}
.pane{display:none;animation:fadeUp .3s ease}
.pane.active{display:block}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.pane-badge{display:inline-block;background:var(--gold);color:var(--navy);font-family:'Lexend Deca',sans-serif;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:4px;margin-bottom:10px}
.pane-title{font-family:'Lexend Deca',sans-serif;font-size:clamp(22px,4vw,30px);font-weight:900;color:var(--white);line-height:1.15;margin-bottom:8px}
.pane-desc{font-size:14px;color:var(--sub);line-height:1.65;margin-bottom:24px}
.card{background:rgba(20,10,6,.88);backdrop-filter:blur(4px);border:1.5px solid var(--border);border-radius:14px;padding:22px;box-shadow:var(--shadow);margin-bottom:14px}
.card-label{font-family:'Lexend Deca',sans-serif;font-size:14px;font-weight:800;color:var(--silver);margin-bottom:18px;letter-spacing:.5px}
.sl-block{margin-bottom:22px}
.sl-block:last-child{margin-bottom:0}
.sl-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:9px}
.sl-q{font-size:15px;font-weight:600;color:var(--white);line-height:1.4}
.sl-v{font-family:'Lexend Deca',sans-serif;font-size:24px;font-weight:900;color:var(--gold);white-space:nowrap}
.sl-v.green{color:var(--green)}
input[type=range]{-webkit-appearance:none;width:100%;height:7px;border-radius:7px;background:linear-gradient(to right,var(--gold) 0%,var(--gold) var(--p,30%),var(--border) var(--p,30%),var(--border) 100%);outline:none;cursor:pointer;display:block}
input[type=range].green-track{background:linear-gradient(to right,var(--green) 0%,var(--green) var(--p,30%),var(--border) var(--p,30%),var(--border) 100%)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:28px;height:28px;border-radius:50%;background:var(--white);border:3px solid var(--gold);box-shadow:0 2px 8px rgba(238,117,44,.28);cursor:pointer;transition:transform .12s;touch-action:none}
input[type=range].green-track::-webkit-slider-thumb{border-color:var(--green)}
input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.18)}
.sl-hint{font-size:12px;color:var(--muted);margin-top:6px}
.opt-row{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:10px;border:2.5px solid rgba(238,117,44,.3);background:rgba(25,10,4,.8);cursor:pointer;user-select:none;margin-top:14px;transition:all .15s;box-shadow:var(--shadow)}
.opt-row:hover{border-color:var(--gold);background:rgba(40,18,6,.9)}
.opt-row-lbl{font-size:14px;font-weight:800;color:var(--white)}
.tog{position:relative;width:40px;height:22px;flex-shrink:0}
.tog input{opacity:0;width:0;height:0}
.tog-track{position:absolute;inset:0;background:var(--border);border-radius:22px;transition:.25s}
.tog input:checked+.tog-track{background:var(--gold)}
.tog-track::after{content:'';position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:white;transition:.25s}
.tog input:checked+.tog-track::after{left:21px}
.opt-field{display:none;padding:4px 0 0}
.opt-field.open{display:block}
.anchor{border-radius:14px;padding:20px 22px;margin-bottom:14px}
.anchor.gold{background:rgba(40,18,6,.9);border:1.5px solid rgba(238,117,44,.4)}
.anchor.red{background:rgba(35,8,8,.9);border:1.5px solid rgba(180,40,40,.4)}
.anchor-eyebrow{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--silver);margin-bottom:8px}
.anchor-num{font-family:'Lexend Deca',sans-serif;font-size:clamp(40px,8vw,58px);font-weight:900;line-height:1;margin-bottom:6px}
.anchor.gold .anchor-num{color:var(--gold)}
.anchor.red .anchor-num{color:var(--red)}
.anchor-caption{font-size:13px;color:var(--sub);line-height:1.6}
.anchor-pills{display:flex;gap:10px;margin-top:10px}
.anchor-pill{background:rgba(255,255,255,.07);border:1px solid var(--border);border-radius:8px;padding:8px 14px}
.pill-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:2px}
.pill-val{font-family:'Lexend Deca',sans-serif;font-size:16px;font-weight:900;color:var(--white)}
.linked-panel{background:rgba(10,4,2,.7);border:1px solid var(--border);border-radius:12px;padding:18px}
.linked-eyebrow{font-size:12px;color:var(--muted);font-weight:600;margin-bottom:14px;text-align:center}
.linked-grid{display:grid;grid-template-columns:1fr 32px 1fr;align-items:center;gap:8px}
.linked-col{text-align:center}
.linked-col-label{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.linked-col-num{font-family:'Lexend Deca',sans-serif;font-size:42px;font-weight:900;line-height:1;margin-bottom:8px}
.linked-col-num.road{color:var(--silver)}
.linked-col-num.home{color:var(--green)}
.linked-col-sub{font-size:11px;color:var(--muted);margin-top:6px}
.linked-divider{text-align:center;font-size:18px;color:var(--muted)}
.linked-bar{text-align:center;font-size:12px;color:var(--sub);margin-top:12px;font-weight:600}
.allin-total{background:var(--navy);border-radius:12px;padding:20px 22px;color:white;margin-bottom:14px}
.allin-total-eyebrow{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold-l);margin-bottom:8px}
.allin-total-big{font-family:'Lexend Deca',sans-serif;font-size:48px;font-weight:900;color:var(--gold-l);line-height:1;margin-bottom:5px}
.allin-total-sub{font-size:13px;color:rgba(255,255,255,.55)}
.allin-total-note{font-size:13px;color:rgba(255,255,255,.55);margin-top:10px;font-style:italic;border-top:1px solid rgba(255,255,255,.1);padding-top:10px}
.pricing-header{background:var(--navy);border-radius:16px;padding:24px;margin-bottom:14px}
.ph-row{margin-bottom:20px}
.ph-row:last-child{margin-bottom:0}
.ph-row-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:10px}
.ph-days-row{display:flex;align-items:center;gap:14px}
.ph-days-row input[type=range]{flex:1}
.ph-days-val{font-family:'Lexend Deca',sans-serif;font-size:40px;font-weight:900;color:var(--gold-l);min-width:54px;text-align:right;line-height:1}
.ph-annual{font-size:12px;color:rgba(255,255,255,.35);margin-top:8px}
.slider-marker-track{position:relative;height:36px;margin:0 13px 4px}
.slider-marker{position:absolute;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer}
.slider-marker:hover .slider-marker-star{transform:scale(1.3);transition:transform .15s}
.slider-marker:hover .slider-marker-label{color:var(--gold)}
.slider-marker-star{font-size:18px;color:var(--gold);line-height:1;filter:drop-shadow(0 0 6px rgba(238,117,44,.7))}
.slider-marker-label{font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:var(--gold-l);text-align:center;line-height:1.3;margin-top:2px;white-space:nowrap}
.memtype-block{margin-bottom:14px}
.memtype-header{font-family:'Lexend Deca',sans-serif;font-size:18px;font-weight:900;color:var(--white);margin-bottom:4px}
.memtype-sub{font-size:13px;color:var(--sub);margin-bottom:14px}
.memtype-cards{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.memtype-card{border-radius:14px;padding:20px 18px;border:1.5px solid var(--border);background:rgba(255,255,255,.04)}
.memtype-primary{border-color:var(--gold);background:linear-gradient(160deg,rgba(238,117,44,.12) 0%,rgba(238,117,44,.04) 100%)}
.memtype-secondary{border-color:var(--border)}
.memtype-badge{display:inline-block;background:var(--gold);color:#fff;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:10px}
.memtype-name{font-family:'Lexend Deca',sans-serif;font-size:14px;font-weight:900;color:var(--white);margin-bottom:8px;line-height:1.3}
.memtype-rate{font-family:'Lexend Deca',sans-serif;font-size:38px;font-weight:900;color:var(--gold);line-height:1}
.memtype-rate span{font-size:16px;font-weight:700;color:var(--gold-l)}
.memtype-secondary .memtype-rate{color:var(--silver)}
.memtype-secondary .memtype-rate span{color:var(--muted)}
.memtype-rate-note{font-size:11px;color:var(--muted);margin:4px 0 10px}
.memtype-divider{border-top:1px solid var(--border);margin:10px 0}
.memtype-detail{font-size:12px;color:var(--sub);margin-bottom:10px;line-height:1.5}
.memtype-list{list-style:none;padding:0;margin:0}
.memtype-list li{font-size:12px;color:var(--sub);padding:3px 0;padding-left:14px;position:relative;line-height:1.4}
.memtype-list li::before{content:"✓";position:absolute;left:0;color:var(--gold);font-weight:900;font-size:10px;top:4px}
.memtype-secondary .memtype-list li::before{color:var(--muted)}
.memtype-savings-note{margin-top:12px;padding:10px 12px;background:rgba(110,231,183,.08);border:1px solid rgba(110,231,183,.25);border-radius:8px;font-size:11px;color:#6ee7b7;line-height:1.5}
.purchase-block{background:rgba(20,10,6,.88);border:1.5px solid var(--border);border-radius:14px;padding:22px;margin-bottom:14px}
.purchase-header{font-family:'Lexend Deca',sans-serif;font-size:18px;font-weight:900;color:var(--white);margin-bottom:4px}
.purchase-sub{font-size:13px;color:var(--sub);margin-bottom:18px}
.memfee-row{background:rgba(255,255,255,.05);border-radius:10px;padding:16px;margin-bottom:16px;text-align:center}
.memfee-label{font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--silver);margin-bottom:6px}
.memfee-val{font-family:'Lexend Deca',sans-serif;font-size:clamp(28px,6vw,40px);font-weight:900;color:var(--gold-l);margin-bottom:4px}
.memfee-note{font-size:11px;color:var(--muted)}
.option-cards{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px}
.option-card{background:rgba(255,255,255,.04);border:1.5px solid var(--border);border-radius:12px;padding:16px 12px;text-align:center;position:relative}
.option-highlight{border-color:var(--gold);background:rgba(40,18,6,.9)}
.option-badge{font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--silver);margin-bottom:8px}
.option-highlight .option-badge{color:var(--gold)}
.option-amount{font-family:'Lexend Deca',sans-serif;font-size:clamp(20px,3.5vw,28px);font-weight:900;color:var(--white);line-height:1.1;margin-bottom:4px}
.option-amount span{font-size:14px;font-weight:600;color:var(--muted)}
.option-small{font-size:11px;color:var(--muted);margin-bottom:8px}
.option-desc{font-size:11px;color:var(--sub);line-height:1.5}
.option-tag{display:inline-block;margin-top:8px;font-size:10px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;background:var(--gold);color:#fff;padding:2px 8px;border-radius:4px}
.purchase-footer{font-size:12px;color:var(--muted);text-align:center;border-top:1px solid var(--border);padding-top:12px}
.purchase-footer strong{color:var(--gold-l)}
.savings-block{background:rgba(8,28,18,.9);border:1.5px solid var(--green-bd);border-radius:14px;padding:22px;text-align:center;margin-bottom:14px}
.savings-eyebrow{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--green);margin-bottom:10px}
.savings-big{font-family:'Lexend Deca',sans-serif;font-size:clamp(38px,8vw,60px);font-weight:900;color:var(--green);line-height:1;margin-bottom:6px}
.savings-big.negative{color:var(--red)}
.savings-math{font-size:13px;color:var(--sub);margin-bottom:10px}
.savings-note{font-size:12px;color:var(--muted);line-height:1.6}
.savings-note strong{color:var(--silver)}
.wealth-block{background:rgba(20,10,6,.88);border:1.5px solid var(--border);border-radius:14px;padding:22px;margin-bottom:14px}
.wealth-header{font-family:'Lexend Deca',sans-serif;font-size:16px;font-weight:900;color:var(--white);margin-bottom:6px}
.wealth-sub{font-size:13px;color:var(--sub);margin-bottom:14px}
.wealth-rate-row{display:flex;align-items:center;gap:8px;margin-bottom:18px;flex-wrap:wrap}
.wealth-rate-lbl{font-size:12px;color:var(--muted);font-weight:600;white-space:nowrap}
.wealth-rate-val{font-family:'Lexend Deca',sans-serif;font-size:18px;font-weight:900;color:var(--gold);min-width:36px}
.wealth-table{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.wealth-row{background:rgba(255,255,255,.05);border-radius:8px;padding:12px 14px;text-align:center}
.wealth-row-yr{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:4px}
.wealth-row-val{font-family:'Lexend Deca',sans-serif;font-size:22px;font-weight:900;color:var(--gold-l)}
.wealth-note{font-size:11px;color:var(--muted);font-style:italic}
.nav-btns{display:flex;justify-content:space-between;align-items:center;margin-top:24px;gap:12px}
.btn-next{background:rgba(15,7,3,.9);border:1.5px solid rgba(238,117,44,.3);color:white;font-family:'Lexend Deca',sans-serif;font-size:14px;font-weight:800;padding:14px 28px;border-radius:50px;cursor:pointer;transition:all .2s;letter-spacing:.5px}
.btn-next:hover{background:rgba(30,12,4,.95);border-color:var(--gold)}
.btn-next.btn-gold{background:var(--gold);color:#fff;border-color:var(--gold)}
.btn-back{background:transparent;border:2px solid var(--border);color:var(--sub);font-family:'Lexend Deca',sans-serif;font-size:13px;font-weight:700;padding:13px 24px;border-radius:50px;cursor:pointer;transition:all .2s}
.btn-back:hover{border-color:var(--silver);color:var(--white)}
.disclaimer{font-size:12px;color:var(--muted);line-height:1.65;padding:16px;background:rgba(15,6,3,.8);border-radius:10px;border:1px solid var(--border);margin-bottom:14px}
.sl-q-sub{font-size:11px;font-weight:500;color:var(--muted);text-transform:none;letter-spacing:0;display:block;margin-top:2px}
.sl-group-label{font-family:'Lexend Deca',sans-serif;font-size:11px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;color:var(--silver);margin:20px 0 10px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.08)}
.sl-group-label:first-child{margin-top:0}
.sl-block.sl-sub{margin-bottom:14px}
.sl-block.sl-sub .sl-q{font-size:14px;color:rgba(255,255,255,.75)}
.sl-q-dim{font-size:14px;color:rgba(255,255,255,.5) !important}
.promo-banner{background:linear-gradient(135deg,rgba(238,117,44,.18) 0%,rgba(238,117,44,.06) 100%);border:2px solid var(--gold);border-radius:14px;padding:18px 20px;margin-bottom:16px}
.promo-location{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold-l);margin-bottom:6px}
.promo-title{font-family:'Lexend Deca',sans-serif;font-size:17px;font-weight:900;color:var(--white);margin-bottom:14px}
.promo-pricing{display:flex;align-items:center;gap:16px;margin-bottom:10px}
.promo-standard,.promo-early{display:flex;flex-direction:column;gap:3px}
.promo-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted)}
.promo-strikethrough{font-family:'Lexend Deca',sans-serif;font-size:22px;font-weight:900;color:var(--muted);text-decoration:line-through}
.promo-price{font-family:'Lexend Deca',sans-serif;font-size:32px;font-weight:900;color:var(--gold)}
.promo-arrow{font-size:22px;color:var(--gold);margin-top:14px}
.promo-tag{font-size:11px;font-weight:700;color:var(--silver);letter-spacing:.5px;margin-bottom:6px}
.promo-save{font-size:13px;font-weight:800;color:#6ee7b7}
.promo-reset-btn{width:100%;margin-top:10px;padding:12px 16px;background:transparent;border:2px solid var(--gold);border-radius:10px;color:var(--gold);font-family:'Lexend Deca',sans-serif;font-size:13px;font-weight:800;cursor:pointer;letter-spacing:.5px;transition:all .2s}
.promo-reset-btn:hover{background:rgba(238,117,44,.15)}
@media(max-width:480px){
  .hero{padding:44px 20px 44px}
  .hero h1{font-size:clamp(26px,8vw,38px)}
  .start-btn{font-size:16px;padding:16px 36px;width:100%;justify-content:center}
  .topbar{height:52px;padding:0 16px}
  .topbar-tag{font-size:10px;letter-spacing:1.5px}
  .progress-wrap{padding:12px 16px 8px}
  .step-dot{width:30px;height:30px;font-size:12px}
  .step-lbl{font-size:10px}
  .main{padding:20px 14px 60px}
  .pane-badge{font-size:9px;padding:3px 10px}
  .pane-title{font-size:clamp(20px,6vw,26px)}
  .pane-desc{font-size:13px;margin-bottom:18px}
  .card{padding:16px 14px}
  .card-label{font-size:13px;margin-bottom:14px}
  .sl-block{margin-bottom:18px}
  .sl-block.sl-sub{margin-bottom:12px}
  .sl-row{margin-bottom:6px}
  .sl-q{font-size:13px}
  .sl-q.sl-q-dim{font-size:13px}
  .sl-block.sl-sub .sl-q{font-size:13px}
  .sl-v{font-size:20px}
  .sl-group-label{font-size:10px;letter-spacing:1.5px;margin:16px 0 8px}
  input[type=range]{height:8px}
  input[type=range]::-webkit-slider-thumb{width:30px;height:30px}
  .anchor{padding:16px 16px}
  .anchor-num{font-size:clamp(36px,9vw,48px)}
  .anchor-pills{flex-wrap:wrap}
  .anchor-pill{padding:6px 12px}
  .pill-val{font-size:14px}
  .opt-row{padding:12px 14px}
  .opt-row-lbl{font-size:13px}
  .nav-btns{flex-direction:column-reverse;gap:10px;margin-top:20px}
  .btn-next{width:100%;text-align:center;padding:16px 20px;font-size:15px}
  .btn-back{width:100%;text-align:center;padding:14px 20px;font-size:13px}
  .linked-grid{grid-template-columns:1fr 20px 1fr}
  .linked-col-num{font-size:36px}
  .linked-col-label{font-size:10px}
  .linked-panel{padding:14px}
  .allin-total-big{font-size:38px}
  .pricing-header{padding:18px 16px}
  .ph-days-val{font-size:32px;min-width:44px}
  .ph-daily-result{flex-direction:column}
  .ph-dr-left{border-right:none;border-bottom:1px solid rgba(255,255,255,.1);padding:16px 16px}
  .ph-dr-num{font-size:clamp(36px,9vw,48px)}
  .ph-dr-breakdown{padding:16px 16px}
  .option-cards{grid-template-columns:1fr}
  .memtype-cards{grid-template-columns:1fr}
  .swap-cols{grid-template-columns:1fr}
  .disclaimer{padding:12px 14px;font-size:11px}
  .wealth-table{grid-template-columns:1fr 1fr}
}
      `}</style>

      <div className="topbar"><div className="topbar-tag">Driver One-Home Calculator</div></div>

      <div id="heroSec" className="hero">
        <h1>ONE<span>★</span>HOME<br/>LIFESTYLE CALCULATOR</h1>
        <div className="hero-tagline">Find out what your home base is really costing you</div>
        <p>Move the sliders, see the numbers. We'll show you what you're spending — and what a LineHaul Station membership would cost to replace it.</p>
        <button className="start-btn" onClick={startCalc}>Show Me the Numbers →</button>
      </div>

      <div id="progWrap" style={{display:'none'}}>
        <div className="progress-wrap">
          <div className="step-row">
            <div className="step-dot active" id="dot1" onClick={() => tryJump(1)}>1</div>
            <div className="step-line" id="line1"></div>
            <div className="step-dot" id="dot2" onClick={() => tryJump(2)}>2</div>
            <div className="step-line" id="line2"></div>
            <div className="step-dot" id="dot3" onClick={() => tryJump(3)}>3</div>
          </div>
          <div className="step-labels">
            <span className="step-lbl active" id="lbl1">Home Setup</span>
            <span className="step-lbl" id="lbl2">Road Reality</span>
            <span className="step-lbl" id="lbl3">Your Plan</span>
          </div>
        </div>
      </div>

      <div className="main" id="calcMain" style={{display:'none'}}>

        {/* PANE 1 */}
        <div className="pane active" id="pane1">
          <div className="pane-badge">Step 1 of 3</div>
          <div className="pane-title">Your Current Home Base</div>
          <div className="pane-desc">What does it cost to keep a place waiting for you? Best estimates are fine.</div>

          <div className="card">
            <div className="card-label">🏠 YOUR CURRENT MONTHLY HOME COSTS</div>

            <div className="sl-block">
              <div className="sl-row"><span className="sl-q">MONTHLY RENT OR MORTGAGE<br/><span className="sl-q-sub">(Includes Property Taxes &amp; Insurance)</span></span><span className="sl-v" id="vRent">$1,500</span></div>
              <input type="range" id="sRent" min="0" max="5000" step="50" defaultValue="1500" onChange={(e) => slUpdate(e,'vRent',v=>{S.rent=v},'$')} />
            </div>

            <div className="sl-group-label">MONTHLY UTILITIES</div>

            <div className="sl-block sl-sub">
              <div className="sl-row"><span className="sl-q">Water</span><span className="sl-v" id="vWater">$50</span></div>
              <input type="range" id="sWater" min="0" max="200" step="5" defaultValue="50" onChange={(e) => slUpdate(e,'vWater',v=>{S.water=v;S.util=utilTotal()},'$')} />
            </div>

            <div className="sl-block sl-sub">
              <div className="sl-row"><span className="sl-q">Electric</span><span className="sl-v" id="vElec">$130</span></div>
              <input type="range" id="sElec" min="0" max="400" step="5" defaultValue="130" onChange={(e) => slUpdate(e,'vElec',v=>{S.elec=v;S.util=utilTotal()},'$')} />
            </div>

            <div className="sl-block sl-sub">
              <div className="sl-row"><span className="sl-q">Gas</span><span className="sl-v" id="vGas">$80</span></div>
              <input type="range" id="sGas" min="0" max="300" step="5" defaultValue="80" onChange={(e) => slUpdate(e,'vGas',v=>{S.gas=v;S.util=utilTotal()},'$')} />
            </div>

            <div className="sl-block sl-sub" style={{marginBottom:'22px'}}>
              <div className="sl-row"><span className="sl-q">Internet</span><span className="sl-v" id="vNet">$65</span></div>
              <input type="range" id="sNet" min="0" max="200" step="5" defaultValue="65" onChange={(e) => slUpdate(e,'vNet',v=>{S.net=v;S.util=utilTotal()},'$')} />
            </div>

            <div className="sl-group-label">HOA OR BUILDING MAINTENANCE</div>

            <div className="sl-block" style={{marginBottom:'22px'}}>
              <div className="sl-row"><span className="sl-q sl-q-dim">Monthly HOA / Maintenance Fee</span><span className="sl-v" id="vHoa">$0</span></div>
              <input type="range" id="sHoa" min="0" max="600" step="25" defaultValue="0" onChange={(e) => slUpdate(e,'vHoa',v=>{S.hoa=v},'$')} />
            </div>

            <div className="sl-group-label">HOME SERVICES</div>

            <div className="sl-block sl-sub">
              <div className="sl-row"><span className="sl-q">Trash</span><span className="sl-v" id="vTrash">$35</span></div>
              <input type="range" id="sTrash" min="0" max="100" step="5" defaultValue="35" onChange={(e) => slUpdate(e,'vTrash',v=>{S.trash=v;S.homeSvc=svcTotal()},'$')} />
            </div>

            <div className="sl-block sl-sub">
              <div className="sl-row"><span className="sl-q">Lawn &amp; Snow</span><span className="sl-v" id="vLawn">$60</span></div>
              <input type="range" id="sLawn" min="0" max="300" step="10" defaultValue="60" onChange={(e) => slUpdate(e,'vLawn',v=>{S.lawn=v;S.homeSvc=svcTotal()},'$')} />
            </div>

            <div className="sl-block sl-sub" style={{marginBottom:'22px'}}>
              <div className="sl-row"><span className="sl-q">Cleaning</span><span className="sl-v" id="vClean">$0</span></div>
              <input type="range" id="sClean" min="0" max="400" step="25" defaultValue="0" onChange={(e) => slUpdate(e,'vClean',v=>{S.clean=v;S.homeSvc=svcTotal()},'$')} />
            </div>

            <div className="opt-row" onClick={togStor}>
              <label className="tog" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" id="cbStor" onChange={togStor} />
                <span className="tog-track"></span>
              </label>
              <span className="opt-row-lbl">I RENT A STORAGE UNIT</span>
            </div>
            <div className="opt-field" id="optStor">
              <div className="sl-block" style={{paddingTop:'14px',marginBottom:'0'}}>
                <div className="sl-row"><span className="sl-q">STORAGE UNIT MONTHLY COST</span><span className="sl-v" id="vStor">$150</span></div>
                <input type="range" id="sStor" min="0" max="400" step="25" defaultValue="150" onChange={(e) => slUpdate(e,'vStor',v=>{S.stor=v},'$')} />
              </div>
            </div>

            <div className="opt-row" onClick={togPark}>
              <label className="tog" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" id="cbPark" onChange={togPark} />
                <span className="tog-track"></span>
              </label>
              <span className="opt-row-lbl">I PAY FOR OFFSITE TRUCK PARKING</span>
            </div>
            <div className="opt-field" id="optPark">
              <div className="sl-block" style={{paddingTop:'14px',marginBottom:'0'}}>
                <div className="sl-row"><span className="sl-q">OFFSITE TRUCK PARKING COST</span><span className="sl-v" id="vPark">$200</span></div>
                <input type="range" id="sPark" min="0" max="600" step="25" defaultValue="200" onChange={(e) => slUpdate(e,'vPark',v=>{S.park=v},'$')} />
                <div className="sl-hint">Many drivers pay for dedicated truck parking when living in apartments or areas that restrict commercial vehicles.</div>
              </div>
            </div>
          </div>

          <div className="anchor gold">
            <div className="anchor-eyebrow">Your total monthly home base cost</div>
            <div className="anchor-num" id="p1Mo">$1,700</div>
            <div className="anchor-pills">
              <div className="anchor-pill"><div className="pill-label">Annual</div><div className="pill-val" id="p1Yr">$20,400</div></div>
            </div>
          </div>

          <div className="nav-btns">
            <div></div>
            <button className="btn-next" onClick={() => goTo(2)}>Next: My Road Reality →</button>
          </div>
        </div>

        {/* PANE 2 */}
        <div className="pane" id="pane2">
          <div className="pane-badge">Step 2 of 3</div>
          <div className="pane-title">Your Schedule &amp; Road Reality</div>
          <div className="pane-desc">Move either slider — they're linked. Drag one and watch the other respond.</div>

          <div className="card">
            <div className="card-label">🚛 Days on the Road vs. Days at Home</div>
            <div className="linked-panel">
              <div className="linked-eyebrow">They add up to 30 — move one, the other adjusts</div>
              <div className="linked-grid">
                <div className="linked-col">
                  <div className="linked-col-label">Days on Road</div>
                  <div className="linked-col-num road" id="vRoad">20</div>
                  <input type="range" id="sRoad" min="0" max="30" step="1" defaultValue="20" onChange={syncRoad} />
                  <div className="linked-col-sub">per month</div>
                </div>
                <div className="linked-divider">⇄</div>
                <div className="linked-col">
                  <div className="linked-col-label">Days at Home</div>
                  <div className="linked-col-num home" id="vHome">10</div>
                  <input type="range" id="sHome" min="0" max="30" step="1" defaultValue="10" className="green-track" onChange={syncHome} />
                  <div className="linked-col-sub">per month</div>
                </div>
              </div>
              <div className="linked-bar" id="linkedBar">20 days on the road · 10 days at home · 30-day month</div>
            </div>
          </div>

          <div className="anchor red">
            <div className="anchor-eyebrow">What you're really paying for each day you're actually home</div>
            <div className="anchor-num" id="tCPD">$170</div>
            <div className="anchor-caption" id="tCPDcap">Based on 10 days at home this month.</div>
          </div>

          <div className="card">
            <div className="card-label">🚛 My Current Truck Parking Costs</div>
            <div className="sl-block" style={{marginBottom:'0'}}>
              <div className="sl-row">
                <span className="sl-q">What do overnight stops typically cost?</span>
                <span className="sl-v" id="vRoadDog">$0/night</span>
              </div>
              <input type="range" id="sRoadDog" min="0" max="50" step="5" defaultValue="0" onChange={slRoadDog} />
              <div className="sl-hint">Shown on your plan for context — not counted as savings LineHaul creates.</div>
            </div>
          </div>

          <div className="allin-total">
            <div className="allin-total-eyebrow">Fixed home-base cost — paid whether you're there or not</div>
            <div className="allin-total-big" id="tAllin">$1,700</div>
            <div className="allin-total-sub">per month &nbsp;·&nbsp; <span id="tAllinYr">$20,400</span>/year</div>
            <div className="allin-total-note" id="tAllinNote">You're paying $170 for each day you're actually home.</div>
          </div>

          <div className="nav-btns">
            <button className="btn-back" onClick={() => goTo(1)}>← Back</button>
            <button className="btn-next" onClick={() => goTo(3)}>See My Plan →</button>
          </div>
        </div>

        {/* PANE 3 */}
        <div className="pane" id="pane3">
          <div className="pane-badge">Step 3 of 3</div>
          <div className="pane-title">Your LineHaul One-Home Plan</div>
          <div className="pane-desc">Numbers update live as you adjust.</div>

          <div className="pricing-header">
            <div className="ph-row-label">LineHaul days per year</div>
            <div className="ph-days-row" style={{margin:'10px 0 4px'}}>
              <input type="range" id="sLH" min="1" max="365" step="1" defaultValue="100" onChange={slLH} />
              <div className="ph-days-val" id="vLH">100</div>
            </div>
            <div className="slider-marker-track" id="sliderMarkerTrack">
              <div className="slider-marker" id="sliderMarker100" style={{left:'calc((99/364)*100%)',cursor:'pointer'}} onClick={resetToPromo} title="Click to return to Early Adopter Promotion">
                <div className="slider-marker-star" id="markerStar">★</div>
                <div className="slider-marker-label">Early Adopter Promotion<br/>100 Days</div>
              </div>
            </div>
            <div className="ph-annual" id="phAnnual">100–364 Day tier · $295/day equity rate</div>
          </div>

          <div className="memtype-block">
            <div className="memtype-header">Two Ways to Be Part of One Home</div>
            <div className="memtype-sub">Choose the membership that fits your situation.</div>
            <div className="memtype-cards">

              <div className="memtype-card memtype-primary">
                <div className="memtype-badge">⭐ Best Value</div>
                <div className="memtype-name">Proprietary Space Membership</div>
                <div className="memtype-rate">~$19<span>/day</span></div>
                <div className="memtype-rate-note">Once your membership is purchased</div>
                <div className="memtype-divider"></div>
                <div className="memtype-detail">Your dedicated space — reserved for you every time.</div>
                <ul className="memtype-list">
                  <li>Pay in full — immediate ownership</li>
                  <li>12-month financing available</li>
                  <li>24-month financing available</li>
                  <li>Refundable membership fee</li>
                  <li>Locks in your rate forever</li>
                </ul>
              </div>

              <div className="memtype-card memtype-secondary">
                <div className="memtype-name">Space Available Membership</div>
                <div className="memtype-rate">$59<span>/day</span></div>
                <div className="memtype-rate-note">No purchase required</div>
                <div className="memtype-divider"></div>
                <div className="memtype-detail">Use LineHaul when space is available — no commitment.</div>
                <ul className="memtype-list">
                  <li>No upfront purchase</li>
                  <li>Pay as you go</li>
                  <li>Subject to availability</li>
                </ul>
                <div className="memtype-savings-note" id="memtypeSavingsNote">
                  Even at $59/day, most drivers still save vs. traditional rent + truck parking + facilities.
                </div>
              </div>

            </div>
          </div>

          <div className="purchase-block">
            <div className="purchase-header">Purchase Your Space</div>
            <div className="purchase-sub" id="purchaseSub">Based on your selected days — refundable membership</div>

            <div className="promo-banner" id="promoBanner">
              <div className="promo-location">📍 West Memphis Launch Hub</div>
              <div className="promo-title">⚡ Early Adopter Promotion</div>
              <div className="promo-pricing">
                <div className="promo-standard">
                  <span className="promo-label">Standard Price</span>
                  <span className="promo-strikethrough" id="promoStandard">$29,500</span>
                </div>
                <div className="promo-arrow">→</div>
                <div className="promo-early">
                  <span className="promo-label">Your Price</span>
                  <span className="promo-price" id="promoPrice">$19,500</span>
                </div>
              </div>
              <div className="promo-tag">100-Day Package · Purchase Only · Limited Availability</div>
              <div className="promo-save" id="promoSave">You save $10,000</div>
            </div>

            <button className="promo-reset-btn" id="promoResetBtn" onClick={resetToPromo} style={{display:'none'}}>
              ★ Return to Early Adopter Promotion (100 Days)
            </button>

            <div className="memfee-row">
              <div className="memfee-label">ONE-TIME REFUNDABLE MEMBERSHIP FEE</div>
              <div className="memfee-val" id="memfeeVal">$19,500</div>
              <div className="memfee-note">Refundable based on program terms</div>
            </div>

            <div className="option-cards">

              <div className="option-card option-highlight">
                <div className="option-badge">✓ PAY IN FULL</div>
                <div className="option-amount" id="optFullAmt">$19,500</div>
                <div className="option-desc">One payment — done.<br/>Then $19/day member dues.</div>
                <div className="option-tag">Best Value</div>
              </div>

              <div className="option-card">
                <div className="option-badge">12-MONTH PLAN</div>
                <div className="option-amount" id="opt12Mo">$1,950<span>/mo</span></div>
                <div className="option-small" id="opt12Total">$23,400 total</div>
                <div className="option-desc">12 monthly payments.<br/>Then $19/day member dues.</div>
              </div>

              <div className="option-card">
                <div className="option-badge">24-MONTH PLAN</div>
                <div className="option-amount" id="opt24Mo">$975<span>/mo</span></div>
                <div className="option-small" id="opt24Total">$23,400 total</div>
                <div className="option-desc">24 monthly payments.<br/>Then $19/day member dues.</div>
              </div>

            </div>
            <div className="purchase-footer">All plans lead to the same result: <strong>$19/day</strong> once your membership is purchased.</div>
          </div>

          <div className="savings-block">
            <div className="savings-eyebrow">Your Annual Savings vs. Today</div>
            <div className="savings-big" id="savingsBig">—</div>
            <div className="savings-math" id="savingsMath"></div>
            <div className="savings-note">Your current home costs vs. your LineHaul member dues.<br/>Your membership is a <strong>refundable asset</strong> — never counted as a cost.</div>
          </div>

          <div className="wealth-block" id="wealthBlock">
            <div className="wealth-header">💰 What Your Savings Could Become</div>
            <div className="wealth-sub" id="wealthSub">Invest your annual savings at a 6% average return:</div>
            <div className="wealth-rate-row">
              <span className="wealth-rate-lbl">Rate of return:</span>
              <span className="wealth-rate-val" id="wealthRateVal">6%</span>
              <input type="range" id="sWealthRate" min="4" max="12" step="1" defaultValue="6" onChange={slWealthRate} style={{flex:'1',margin:'0 10px'}} />
            </div>
            <div className="wealth-table" id="wealthTable"></div>
            <div className="wealth-note">Compounding monthly contributions. Past performance not guaranteed.</div>
          </div>

          <div className="disclaimer"><strong>Note:</strong> West Memphis is LineHaul Station's first hub — amenities phase in over time. All figures are estimates for planning purposes. Your road expenses outside LineHaul locations may continue.</div>

          <div className="nav-btns">
            <button className="btn-back" onClick={() => goTo(2)}>← Back</button>
          </div>
        </div>

      </div>
    </>
  );
}