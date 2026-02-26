module.exports=[93429,a=>{"use strict";var b=a.i(39046),c=a.i(85152),d=a.i(38158),e=a.i(90075);function f(a){let b=document.cookie.match(RegExp(`(?:^|; )${a}=([^;]*)`));return b?decodeURIComponent(b[1]):null}function g(a){document.cookie=`${a}=; path=/; max-age=0; SameSite=Lax`}function h(){let{locale:a}=(0,d.useParams)(),h=(0,d.useRouter)(),[i,j]=(0,c.useState)(null),[k,l]=(0,c.useState)(!0),[m,n]=(0,c.useState)("requirements"),[o,p]=(0,c.useState)(!0);return((0,c.useEffect)(()=>{let b=f("saubh_token"),c=f("saubh_user");if(!b||!c)return void h.replace(`/${a}/login`);try{j(JSON.parse(c))}catch{h.replace(`/${a}/login`);return}l(!1)},[a,h]),k||!i)?(0,b.jsx)("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#05070d",color:"#fff"},children:(0,b.jsx)("div",{className:"db-spinner"})}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --line:rgba(255,255,255,.10);
  --text:#e5e7eb;
  --muted:#94a3b8;
  --pri:#7c3aed;
  --pri2:#06b6d4;
  --danger:#ef4444;
  --live:#22c55e;
  --shadow:0 20px 60px rgba(0,0,0,.35);
  --glass:rgba(255,255,255,.03);
  --glass2:rgba(255,255,255,.05);
}

.db{
  display:grid;grid-template-columns:260px 1fr;height:100vh;
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:var(--text);
  background:
    radial-gradient(900px 500px at -10% -10%, rgba(124,58,237,.2), transparent 60%),
    radial-gradient(800px 500px at 110% 0%, rgba(6,182,212,.14), transparent 60%),
    linear-gradient(180deg, #05070d, #0a1020 50%, #080d17);
}

/* ═══ SIDEBAR ═══ */
.db-side{
  border-right:1px solid var(--line);
  background:linear-gradient(180deg, rgba(255,255,255,.025), rgba(255,255,255,.008));
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  padding:14px;overflow-y:auto;overflow-x:hidden;
  display:flex;flex-direction:column;gap:12px;
}
.db-side::-webkit-scrollbar{width:4px}
.db-side::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:99px}

.db-brand{
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  border:1px solid var(--line);border-radius:16px;background:var(--glass);
  box-shadow:var(--shadow);
}
.db-brand-icon{width:36px;height:36px;border-radius:11px;object-fit:cover;
  box-shadow:0 0 16px rgba(124,58,237,.3)}
.db-brand h1{font-family:'Outfit',sans-serif;font-size:15px;font-weight:900;line-height:1.1}
.db-brand small{color:var(--muted);font-size:11px}

.db-user-card{
  display:flex;align-items:center;gap:10px;padding:10px 12px;
  border:1px solid var(--line);border-radius:14px;background:var(--glass);
}
.db-user-av{
  width:34px;height:34px;border-radius:10px;
  background:linear-gradient(135deg,#f59e0b,#ef4444);
  display:grid;place-items:center;font-weight:800;color:#fff;font-size:14px;flex-shrink:0;
}
.db-user-name{font-size:13px;font-weight:700;line-height:1.2}
.db-user-type{font-size:11px;color:var(--muted)}
.db-user-logout{
  margin-left:auto;background:none;border:none;color:var(--muted);cursor:pointer;
  font-size:16px;padding:4px;border-radius:8px;transition:.2s;
}
.db-user-logout:hover{color:#f87171;background:rgba(248,113,113,.1)}

.db-seg{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.db-seg button{
  border:1px solid var(--line);background:var(--glass);color:var(--text);
  border-radius:12px;padding:10px 8px;cursor:pointer;font-weight:700;font-size:12px;
  font-family:'Outfit',sans-serif;
  display:flex;align-items:center;justify-content:center;gap:6px;transition:.2s;
}
.db-seg button:hover{background:var(--glass2);border-color:rgba(255,255,255,.18)}
.db-seg button.active{
  background:linear-gradient(135deg, rgba(124,58,237,.2), rgba(6,182,212,.15));
  border-color:rgba(124,58,237,.4);
  box-shadow:0 0 20px rgba(124,58,237,.08);
}

.db-block{
  border:1px solid var(--line);background:var(--glass);
  border-radius:14px;padding:10px;
}
.db-block-title{
  font-family:'Outfit',sans-serif;
  font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);
  margin-bottom:8px;display:flex;align-items:center;gap:6px;
}
.db-filters{display:grid;gap:8px}
.db-fchip{background:var(--glass);border:1px solid var(--line);border-radius:10px;padding:7px}
.db-fchip label{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted);margin-bottom:4px}
.db-fchip select{
  width:100%;background:#0b1220;color:var(--text);border:1px solid var(--line);
  border-radius:8px;padding:7px 8px;font-size:12px;outline:none;font-family:inherit;
}
.db-checks{display:grid;gap:6px;margin-top:4px}
.db-check{
  display:flex;align-items:center;gap:7px;border:1px solid var(--line);border-radius:8px;
  padding:7px 8px;background:rgba(255,255,255,.015);font-size:12px;cursor:pointer;
}
.db-check input{accent-color:var(--pri)}
.db-range{margin-top:6px;padding:7px;border:1px solid var(--line);border-radius:10px;background:rgba(255,255,255,.015)}
.db-range-bar{
  height:6px;border-radius:99px;
  background:linear-gradient(90deg,rgba(124,58,237,.7),rgba(6,182,212,.7));
  border:1px solid rgba(255,255,255,.06);margin:6px 0 3px;
}
.db-minilinks{display:grid;gap:6px}
.db-minilink{
  display:flex;align-items:center;gap:8px;border:1px solid transparent;background:rgba(255,255,255,.015);
  color:var(--text);border-radius:10px;padding:9px 10px;cursor:pointer;font-weight:600;font-size:12px;
  font-family:inherit;transition:.2s;
}
.db-minilink:hover{border-color:var(--line);background:var(--glass2)}

/* ═══ MAIN ═══ */
.db-main{display:flex;flex-direction:column;overflow:hidden}

.db-topbar{
  padding:12px 16px;border-bottom:1px solid var(--line);
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  background:rgba(255,255,255,.015);backdrop-filter:blur(14px);
}
.db-top-h2{font-family:'Outfit',sans-serif;font-size:17px;font-weight:900;display:flex;align-items:center;gap:8px}
.db-top-sub{color:var(--muted);font-size:11px;margin-top:3px}
.db-top-pills{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.db-pill{
  border:1px solid var(--line);border-radius:99px;padding:7px 11px;font-size:11px;
  background:var(--glass);display:flex;align-items:center;gap:6px;font-weight:600;cursor:pointer;
  transition:.2s;
}
.db-pill:hover{border-color:rgba(255,255,255,.2);background:var(--glass2)}

/* ═══ HERO / SEARCH ═══ */
.db-hero{
  margin:12px 16px 0;border:1px solid var(--line);border-radius:18px;
  background:
    radial-gradient(400px 140px at 0% 0%, rgba(124,58,237,.2), transparent 60%),
    radial-gradient(300px 120px at 100% 0%, rgba(6,182,212,.15), transparent 60%),
    var(--glass);
  padding:12px;box-shadow:var(--shadow);
}
.db-hero-tabs{display:flex;gap:6px;margin-bottom:10px}
.db-htab{
  border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-weight:700;font-size:12px;
  background:var(--glass);cursor:pointer;color:var(--text);font-family:'Outfit',sans-serif;
  display:flex;align-items:center;gap:6px;transition:.2s;
}
.db-htab:hover{background:var(--glass2)}
.db-htab.active{
  background:linear-gradient(135deg, rgba(124,58,237,.25), rgba(6,182,212,.18));
  border-color:rgba(124,58,237,.4);box-shadow:0 0 16px rgba(124,58,237,.1);
}
.db-search{
  display:grid;
  grid-template-columns:repeat(10,minmax(100px,1fr));
  gap:6px;align-items:end;
}
.db-search .ctrl{display:flex;flex-direction:column;gap:3px}
.db-search .ctrl label{font-size:10px;color:var(--muted);display:flex;align-items:center;gap:4px}
.db-search select,.db-search input{
  width:100%;background:#0b1220;color:var(--text);border:1px solid var(--line);
  border-radius:8px;padding:8px;font-size:12px;outline:none;font-family:inherit;
}
.db-search-btn{
  border:none;border-radius:10px;padding:9px 12px;font-weight:800;cursor:pointer;color:#fff;
  font-family:'Outfit',sans-serif;font-size:12px;
  background:linear-gradient(135deg,var(--pri),var(--pri2));
  display:flex;align-items:center;justify-content:center;gap:5px;transition:.2s;
  box-shadow:0 4px 16px rgba(124,58,237,.25);
}
.db-search-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(124,58,237,.35)}
.db-hero-label{
  font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;
  display:flex;align-items:center;gap:8px;margin-top:8px;
}

/* ═══ CONTENT ═══ */
.db-content{padding:12px 16px 18px;overflow:auto;flex:1}
.db-content::-webkit-scrollbar{width:5px}
.db-content::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:99px}

/* ═══ REQUIREMENT CARD ═══ */
.req-card{
  border:1px solid var(--line);
  background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015));
  border-radius:18px;padding:12px;box-shadow:var(--shadow);display:grid;gap:10px;
}
.req-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap}
.req-rating{
  display:inline-flex;align-items:center;gap:5px;border:1px solid rgba(245,158,11,.25);
  background:rgba(245,158,11,.08);color:#fbbf24;border-radius:99px;padding:4px 8px;font-size:11px;font-weight:700;
}
.req-provider{display:flex;align-items:center;gap:10px;margin-top:6px;flex-wrap:wrap}
.req-av{
  width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#f472b6,#60a5fa);
  display:grid;place-items:center;font-weight:800;color:#fff;font-size:14px;flex-shrink:0;
  border:1px solid rgba(255,255,255,.15);
}
.req-cname{font-size:13px;font-weight:800;display:flex;align-items:center;gap:5px}
.req-badges{display:flex;gap:5px;flex-wrap:wrap}
.badge{
  border-radius:99px;border:1px solid var(--line);padding:4px 7px;font-size:10px;font-weight:700;
  background:var(--glass);display:inline-flex;align-items:center;gap:3px;
}
.badge-dv{color:#93c5fd;border-color:rgba(59,130,246,.3);background:rgba(59,130,246,.08)}
.badge-pv{color:#86efac;border-color:rgba(16,185,129,.3);background:rgba(16,185,129,.08)}
.req-title{font-family:'Outfit',sans-serif;font-size:14px;font-weight:800;line-height:1.25}
.req-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.meta-pill{
  border:1px solid var(--line);border-radius:99px;padding:5px 9px;font-size:11px;
  background:rgba(255,255,255,.02);font-weight:700;display:flex;align-items:center;gap:5px;
  white-space:nowrap;
}
.req-subtitle{font-family:'Outfit',sans-serif;font-size:14px;font-weight:800;line-height:1.25}
.req-desc{color:var(--muted);font-size:11px;line-height:1.45}
.view-more{color:#a78bfa;text-decoration:none;font-weight:700}
.view-more:hover{text-decoration:underline}

.req-grid{
  display:grid;grid-template-columns:1.1fr 1.5fr 1.2fr 1.2fr .8fr;gap:6px;
}
.req-col{
  border:1px solid var(--line);border-radius:12px;padding:8px;
  background:rgba(255,255,255,.015);min-height:110px;
}
.req-col h5{
  font-family:'Outfit',sans-serif;
  margin:0 0 6px;font-size:10px;color:var(--muted);
  text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:5px;
}
.req-col-stack{display:grid;gap:3px;font-size:11px;font-weight:700;line-height:1.4}
.req-col-stack .muted{color:var(--muted);font-weight:600}

.bid-btn{
  border:none;border-radius:8px;padding:7px 8px;cursor:pointer;font-weight:800;color:#fff;
  font-family:'Outfit',sans-serif;font-size:11px;width:100%;
  background:linear-gradient(135deg,var(--pri),var(--pri2));transition:.2s;
}
.bid-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(124,58,237,.3)}

.actions-row{
  display:flex;gap:6px;flex-wrap:wrap;align-items:center;
  border-top:1px solid var(--line);padding-top:8px;
}
.icon-btn{
  border:1px solid var(--line);background:rgba(255,255,255,.02);color:var(--text);
  border-radius:8px;padding:7px 9px;cursor:pointer;font-weight:700;font-size:11px;
  font-family:inherit;display:flex;align-items:center;justify-content:center;gap:5px;transition:.2s;
}
.icon-btn-pri{
  background:linear-gradient(135deg, rgba(124,58,237,.22), rgba(6,182,212,.16));
  border-color:rgba(124,58,237,.3);
}
.icon-btn-pri:hover{border-color:rgba(124,58,237,.5);transform:translateY(-1px)}
.live-badge{
  margin-left:auto;border-radius:99px;padding:5px 9px;font-size:11px;font-weight:800;
  border:1px solid;display:inline-flex;align-items:center;gap:5px;
}
.live-on{color:#86efac;border-color:rgba(34,197,94,.3);background:rgba(34,197,94,.08)}
.live-off{color:#fca5a5;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.06)}
.blink{
  width:7px;height:7px;border-radius:50%;background:var(--live);display:inline-block;
  animation:pulse 1.4s infinite;
}
@keyframes pulse{
  0%{box-shadow:0 0 0 0 rgba(34,197,94,.6)}
  70%{box-shadow:0 0 0 7px rgba(34,197,94,0)}
  100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}
}

/* ═══ OFFERINGS GRID ═══ */
.off-grid{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:10px;align-items:start;
}
.off-card{
  border:1px solid var(--line);
  background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.015));
  border-radius:18px;padding:12px;box-shadow:var(--shadow);display:grid;gap:10px;
}
.off-provider{display:flex;gap:10px;align-items:flex-start}
.off-av{
  width:48px;height:48px;border-radius:14px;
  display:grid;place-items:center;font-weight:800;color:#fff;font-size:15px;flex-shrink:0;
  border:1px solid rgba(255,255,255,.15);
}
.off-meta{display:grid;gap:4px;min-width:0}
.off-name{font-size:14px;font-weight:800;display:flex;align-items:center;gap:5px}
.off-sub{color:var(--muted);font-size:11px;font-weight:600}
.off-title{font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;line-height:1.25}
.off-desc{color:var(--muted);font-size:11px;line-height:1.45}
.mode-row{display:flex;gap:6px;flex-wrap:wrap}

/* ═══ PAGINATION & LEGEND ═══ */
.db-pagination{margin-top:10px;display:flex;justify-content:center}
.db-page-chip{
  border:1px dashed var(--line);border-radius:10px;padding:7px 12px;
  color:var(--muted);font-size:11px;background:rgba(255,255,255,.015);
}
.db-legend{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
.db-tag{
  border:1px solid var(--line);background:var(--glass);border-radius:99px;
  padding:6px 9px;font-size:11px;color:var(--muted);display:flex;align-items:center;gap:5px;
}
.dot{width:7px;height:7px;border-radius:99px;display:inline-block}
.dot-live{background:var(--live);box-shadow:0 0 8px rgba(34,197,94,.7)}
.dot-away{background:var(--danger)}
.db-messages{margin-top:8px;color:var(--muted);font-size:11px;display:flex;align-items:center;gap:5px}

/* ═══ SPINNER ═══ */
.db-spinner{
  width:28px;height:28px;border:3px solid rgba(255,255,255,.1);
  border-top-color:var(--pri);border-radius:50%;animation:spin .6s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}

/* ═══ MOBILE TOGGLE ═══ */
.db-menu-toggle{
  display:none;background:none;border:none;color:var(--text);font-size:22px;
  cursor:pointer;padding:4px;
}

/* ═══ RESPONSIVE ═══ */
@media(max-width:1500px){
  .db-search{grid-template-columns:repeat(5,minmax(120px,1fr))}
  .req-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:1400px){
  .off-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:980px){
  .db{grid-template-columns:1fr;height:auto;min-height:100vh}
  .db-side{
    position:fixed;left:0;top:0;bottom:0;width:260px;z-index:100;
    transform:translateX(-100%);transition:transform .3s;
  }
  .db-side.open{transform:translateX(0)}
  .db-side-overlay{
    position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99;
    opacity:0;pointer-events:none;transition:opacity .3s;
  }
  .db-side-overlay.open{opacity:1;pointer-events:auto}
  .db-main{overflow:auto}
  .db-menu-toggle{display:block}
}
@media(max-width:700px){
  .db-search{grid-template-columns:1fr 1fr}
  .db-search-btn{grid-column:span 2}
  .db-topbar{align-items:flex-start;flex-direction:column}
  .req-grid{grid-template-columns:1fr}
  .off-grid{grid-template-columns:1fr}
  .live-badge{margin-left:0}
}
      `}),(0,b.jsxs)("div",{className:"db",children:[(0,b.jsx)("div",{className:"db-side-overlay",style:{display:"none"},onClick:()=>p(!1)}),(0,b.jsxs)("aside",{className:`db-side${o?" open":""}`,children:[(0,b.jsxs)("div",{className:"db-brand",children:[(0,b.jsx)(e.default,{src:"/logo.jpg",alt:"Saubh.Tech",width:36,height:36,className:"db-brand-icon"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{children:"Saubh.Tech"}),(0,b.jsx)("small",{children:"Gig Marketplace"})]})]}),(0,b.jsxs)("div",{className:"db-user-card",children:[(0,b.jsx)("div",{className:"db-user-av",children:i.fname.charAt(0).toUpperCase()}),(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"db-user-name",children:i.fname}),(0,b.jsx)("div",{className:"db-user-type",children:"BO"===i.usertype?"Business Owner":"CL"===i.usertype?"Client":"Gig Worker"})]}),(0,b.jsx)("button",{className:"db-user-logout",onClick:()=>{g("saubh_token"),g("saubh_user"),h.replace(`/${a}/login`)},title:"Logout",children:"⏻"})]}),(0,b.jsxs)("div",{className:"db-seg",children:[(0,b.jsx)("button",{className:"requirements"===m?"active":"",onClick:()=>n("requirements"),children:"📋 Requirements"}),(0,b.jsx)("button",{className:"offerings"===m?"active":"",onClick:()=>n("offerings"),children:"🧰 Offerings"})]}),(0,b.jsxs)("div",{className:"db-block",children:[(0,b.jsx)("p",{className:"db-block-title",children:"🔎 Filter"}),(0,b.jsxs)("div",{className:"db-filters",children:[(0,b.jsxs)("div",{className:"db-fchip",children:[(0,b.jsxs)("label",{children:[(0,b.jsx)("span",{children:"🏷️"}),(0,b.jsx)("span",{children:"Sector"})]}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Sector"})})]}),(0,b.jsxs)("div",{className:"db-fchip",children:[(0,b.jsxs)("label",{children:[(0,b.jsx)("span",{children:"🧩"}),(0,b.jsx)("span",{children:"Field"})]}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Field"})})]}),(0,b.jsxs)("div",{className:"db-fchip",children:[(0,b.jsxs)("label",{children:[(0,b.jsx)("span",{children:"📦"}),(0,b.jsx)("span",{children:"Product"})]}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Product"})})]}),(0,b.jsxs)("div",{className:"db-fchip",children:[(0,b.jsxs)("label",{children:[(0,b.jsx)("span",{children:"🧰"}),(0,b.jsx)("span",{children:"Service"})]}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Service"})})]}),(0,b.jsxs)("div",{className:"db-fchip",children:[(0,b.jsxs)("label",{children:[(0,b.jsx)("span",{children:"🌍"}),(0,b.jsx)("span",{children:"Country"})]}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Country"})})]}),(0,b.jsxs)("div",{className:"db-fchip",children:[(0,b.jsxs)("label",{children:[(0,b.jsx)("span",{children:"🗺️"}),(0,b.jsx)("span",{children:"State"})]}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" State"})})]}),(0,b.jsxs)("div",{className:"db-fchip",children:[(0,b.jsxs)("label",{children:[(0,b.jsx)("span",{children:"📍"}),(0,b.jsx)("span",{children:"District"})]}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" District"})})]}),(0,b.jsxs)("div",{className:"db-fchip",children:[(0,b.jsxs)("label",{children:[(0,b.jsx)("span",{children:"🏤"}),(0,b.jsx)("span",{children:"Post code"})]}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Post code"})})]}),(0,b.jsxs)("div",{className:"db-fchip",children:[(0,b.jsxs)("label",{children:[(0,b.jsx)("span",{children:"📌"}),(0,b.jsx)("span",{children:"Place"})]}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Place"})})]}),(0,b.jsxs)("div",{className:"db-checks",children:[(0,b.jsxs)("label",{className:"db-check",children:[(0,b.jsx)("input",{type:"checkbox",defaultChecked:!0})," ✅ Verified"]}),(0,b.jsxs)("label",{className:"db-check",children:[(0,b.jsx)("input",{type:"checkbox"})," ⭐ Top Rated"]})]}),(0,b.jsxs)("div",{className:"db-range",children:[(0,b.jsx)("label",{style:{fontSize:"10px",color:"var(--muted)",display:"block",marginBottom:"4px"},children:"💰 Budget Range"}),(0,b.jsx)("div",{style:{fontSize:"11px",color:"#e5e7eb"},children:"₹1.00 to ₹999K"}),(0,b.jsx)("div",{className:"db-range-bar","aria-label":"Bar Slide"}),(0,b.jsx)("div",{style:{fontSize:"10px",color:"var(--muted)"},children:"Bar Slide."})]})]})]}),(0,b.jsx)("div",{className:"db-block",children:(0,b.jsxs)("div",{className:"db-minilinks",children:[(0,b.jsx)("button",{className:"db-minilink",onClick:()=>h.push(`/${a}/gig`),children:"🚀 Gig"}),(0,b.jsx)("button",{className:"db-minilink",children:"💸 Income"}),(0,b.jsx)("button",{className:"db-minilink",children:"🧾 My Bids"}),(0,b.jsx)("button",{className:"db-minilink",children:"🛡️ Escrow Money"})]})})]}),(0,b.jsxs)("main",{className:"db-main",children:[(0,b.jsxs)("div",{className:"db-topbar",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("button",{className:"db-menu-toggle",onClick:()=>p(!o),children:"☰"}),(0,b.jsx)("h2",{className:"db-top-h2",children:"🚀 Gig Marketplace"}),(0,b.jsx)("p",{className:"db-top-sub",children:"|| Real Clients || Verified Providers || Secured Payments ||"})]}),(0,b.jsxs)("div",{className:"db-top-pills",children:[(0,b.jsx)("div",{className:"db-pill",style:{cursor:"pointer"},onClick:()=>h.push(`/${a}/gig`),children:"🚀 Gig"}),(0,b.jsx)("div",{className:"db-pill",children:"💸 Income"}),(0,b.jsx)("div",{className:"db-pill",children:"🧾 My Bids"}),(0,b.jsx)("div",{className:"db-pill",children:"🛡️ Escrow Money"})]})]}),(0,b.jsxs)("section",{className:"db-hero",children:[(0,b.jsxs)("div",{className:"db-hero-tabs",children:[(0,b.jsx)("button",{className:`db-htab${"requirements"===m?" active":""}`,onClick:()=>n("requirements"),children:"📋 Requirements"}),(0,b.jsx)("button",{className:`db-htab${"offerings"===m?" active":""}`,onClick:()=>n("offerings"),children:"🧰 Offerings"})]}),(0,b.jsxs)("div",{className:"db-search",children:[(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"🏷️ Sector"}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Sector"})})]}),(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"🧩 Field"}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Field"})})]}),(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"📦 Product"}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Product"})})]}),(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"🧰 Service"}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Service"})})]}),(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"🌍 Country"}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Country"})})]}),(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"🗺️ State"}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" State"})})]}),(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"📍 District"}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" District"})})]}),(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"🏤 Post Code"}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Post Code"})})]}),(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"📌 Place"}),(0,b.jsx)("select",{children:(0,b.jsx)("option",{children:" Place"})})]}),(0,b.jsxs)("div",{className:"ctrl",children:[(0,b.jsx)("label",{children:"🔑 Search"}),(0,b.jsx)("input",{defaultValue:"Key Word"})]}),(0,b.jsx)("button",{className:"db-search-btn",children:"🔍 Search"}),(0,b.jsxs)("div",{className:"db-hero-label",children:["🪄 ","requirements"===m?"Requirements":"Offerings"]})]})]}),(0,b.jsxs)("section",{className:"db-content",children:["requirements"===m&&(0,b.jsx)(b.Fragment,{children:(0,b.jsxs)("article",{className:"req-card",children:[(0,b.jsx)("div",{className:"req-head",children:(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"req-rating",children:["⭐ 4.8 ",(0,b.jsx)("span",{style:{color:"var(--muted)",fontWeight:600},children:"(56)"})]}),(0,b.jsxs)("div",{className:"req-provider",children:[(0,b.jsx)("div",{className:"req-av",children:"CN"}),(0,b.jsx)("div",{className:"req-cname",children:"👤 Client Name"}),(0,b.jsxs)("div",{className:"req-badges",children:[(0,b.jsx)("span",{className:"badge badge-dv",children:"🛡️ DV"}),(0,b.jsx)("span",{className:"badge badge-pv",children:"✅ PV"})]})]})]})}),(0,b.jsx)("div",{className:"req-title",children:"Required Web Developer"}),(0,b.jsxs)("div",{className:"req-meta",children:[(0,b.jsx)("span",{className:"meta-pill",children:"🧰 Service"}),(0,b.jsx)("span",{className:"meta-pill",children:"📄 read"}),(0,b.jsx)("span",{className:"meta-pill",children:"🎬 view"})]}),(0,b.jsx)("div",{className:"req-subtitle",children:"E-Commerce Website for Fashion Brand"}),(0,b.jsxs)("p",{className:"req-desc",children:["Need experienced developer for Shopify custom e-commerce with …",(0,b.jsx)("a",{href:"#",className:"view-more",children:"<view more>"})]}),(0,b.jsxs)("div",{className:"req-grid",children:[(0,b.jsxs)("div",{className:"req-col",children:[(0,b.jsx)("h5",{children:"🚚 Delivery"}),(0,b.jsxs)("div",{className:"req-col-stack",children:[(0,b.jsx)("div",{children:"🏢 Physical"}),(0,b.jsx)("div",{children:"💻 Digital"})]})]}),(0,b.jsxs)("div",{className:"req-col",children:[(0,b.jsx)("h5",{children:"📍 Location"}),(0,b.jsxs)("div",{className:"req-col-stack",children:[(0,b.jsx)("div",{children:"Country"}),(0,b.jsx)("div",{children:"State"}),(0,b.jsx)("div",{children:"District"}),(0,b.jsx)("div",{children:"Postal code"}),(0,b.jsx)("div",{children:"Place"})]})]}),(0,b.jsxs)("div",{className:"req-col",children:[(0,b.jsx)("h5",{children:"✅ Eligibility"}),(0,b.jsxs)("div",{className:"req-col-stack",children:[(0,b.jsx)("div",{children:"Experience >1 yr"}),(0,b.jsx)("div",{className:"muted",children:"Must be resident"}),(0,b.jsx)("div",{className:"muted",children:"of"}),(0,b.jsx)("div",{children:"Patna"})]})]}),(0,b.jsxs)("div",{className:"req-col",children:[(0,b.jsx)("h5",{children:"💰 Budget"}),(0,b.jsxs)("div",{className:"req-col-stack",children:[(0,b.jsx)("div",{children:"₹50K approx."}),(0,b.jsx)("div",{children:"Escrow"}),(0,b.jsx)("div",{children:"₹20K paid"}),(0,b.jsx)("div",{children:"Deadline"}),(0,b.jsx)("div",{children:"26.02.2026"})]})]}),(0,b.jsxs)("div",{className:"req-col",children:[(0,b.jsx)("h5",{children:"🧾 Bids"}),(0,b.jsxs)("div",{className:"req-col-stack",children:[(0,b.jsx)("div",{children:"Total"}),(0,b.jsx)("div",{style:{fontSize:"18px",lineHeight:1},children:"12"}),(0,b.jsx)("button",{className:"bid-btn",children:"<Bid now>"})]})]})]}),(0,b.jsxs)("div",{className:"actions-row",children:[(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"📞 Call"}),(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"💬 Chat"}),(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"🎥 Video"}),(0,b.jsxs)("span",{className:"live-badge live-on",children:[(0,b.jsx)("span",{className:"blink"}),"Live"]})]})]})}),"offerings"===m&&(0,b.jsxs)("div",{className:"off-grid",children:[(0,b.jsxs)("article",{className:"off-card",children:[(0,b.jsxs)("div",{className:"off-provider",children:[(0,b.jsx)("div",{className:"off-av",style:{background:"linear-gradient(135deg,#f472b6,#60a5fa)"},children:"AS"}),(0,b.jsxs)("div",{className:"off-meta",children:[(0,b.jsxs)("div",{className:"req-rating",children:["⭐ 4.8 ",(0,b.jsx)("span",{style:{color:"var(--muted)",fontWeight:600},children:"(156)"})]}),(0,b.jsx)("div",{className:"off-name",children:"👤 Ananya Sharma"}),(0,b.jsxs)("div",{className:"req-badges",children:[(0,b.jsx)("span",{className:"badge badge-dv",children:"🛡️ DV"}),(0,b.jsx)("span",{className:"badge badge-pv",children:"✅ PV"})]}),(0,b.jsx)("div",{className:"off-sub",children:"Full-Stack Developer"})]})]}),(0,b.jsxs)("div",{className:"req-meta",children:[(0,b.jsx)("span",{className:"meta-pill",children:"🧰 Service"}),(0,b.jsx)("span",{className:"meta-pill",children:"📄 read"}),(0,b.jsx)("span",{className:"meta-pill",children:"🎬 view"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h4",{className:"off-title",children:"Offered Custom Web App & SaaS Development"}),(0,b.jsxs)("p",{className:"off-desc",children:["Full-stack web applications using Next.js, React, Node.js.",(0,b.jsx)("a",{href:"#",className:"view-more",children:"<more...>"})]})]}),(0,b.jsxs)("div",{className:"mode-row",children:[(0,b.jsx)("span",{className:"meta-pill",children:"🚚 Delivery:"}),(0,b.jsx)("span",{className:"meta-pill",children:"🏢 Physical"}),(0,b.jsx)("span",{className:"meta-pill",children:"💻 Digital"})]}),(0,b.jsxs)("div",{className:"actions-row",children:[(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"📞 Call"}),(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"💬 Chat"}),(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"🎥 Video"}),(0,b.jsxs)("span",{className:"live-badge live-on",children:[(0,b.jsx)("span",{className:"blink"}),"Live"]})]})]}),(0,b.jsxs)("article",{className:"off-card",children:[(0,b.jsxs)("div",{className:"off-provider",children:[(0,b.jsx)("div",{className:"off-av",style:{background:"linear-gradient(135deg,#34d399,#3b82f6)"},children:"AK"}),(0,b.jsxs)("div",{className:"off-meta",children:[(0,b.jsxs)("div",{className:"req-rating",children:["⭐ 4.8 ",(0,b.jsx)("span",{style:{color:"var(--muted)",fontWeight:600},children:"(156)"})]}),(0,b.jsx)("div",{className:"off-name",children:"👤 Ananya Sharma"}),(0,b.jsxs)("div",{className:"req-badges",children:[(0,b.jsx)("span",{className:"badge badge-dv",children:"🛡️ DV"}),(0,b.jsx)("span",{className:"badge badge-pv",children:"✅ PV"})]}),(0,b.jsx)("div",{className:"off-sub",children:"Full-Stack Developer"})]})]}),(0,b.jsxs)("div",{className:"req-meta",children:[(0,b.jsx)("span",{className:"meta-pill",children:"🧰 Service"}),(0,b.jsx)("span",{className:"meta-pill",children:"📄 read"}),(0,b.jsx)("span",{className:"meta-pill",children:"🎬 view"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h4",{className:"off-title",children:"Offered Custom Web App & SaaS Development"}),(0,b.jsxs)("p",{className:"off-desc",children:["Full-stack web applications using Next.js, React, Node.js.",(0,b.jsx)("a",{href:"#",className:"view-more",children:"<more...>"})]})]}),(0,b.jsxs)("div",{className:"mode-row",children:[(0,b.jsx)("span",{className:"meta-pill",children:"🚚 Delivery:"}),(0,b.jsx)("span",{className:"meta-pill",children:"🏢 Physical"}),(0,b.jsx)("span",{className:"meta-pill",children:"💻 Digital"})]}),(0,b.jsxs)("div",{className:"actions-row",children:[(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"📞 Call"}),(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"💬 Chat"}),(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"🎥 Video"}),(0,b.jsx)("span",{className:"live-badge live-off",children:"🔴 Off/Away"})]})]}),(0,b.jsxs)("article",{className:"off-card",children:[(0,b.jsxs)("div",{className:"off-provider",children:[(0,b.jsx)("div",{className:"off-av",style:{background:"linear-gradient(135deg,#f59e0b,#ef4444)"},children:"NS"}),(0,b.jsxs)("div",{className:"off-meta",children:[(0,b.jsxs)("div",{className:"req-rating",children:["⭐ 4.8 ",(0,b.jsx)("span",{style:{color:"var(--muted)",fontWeight:600},children:"(156)"})]}),(0,b.jsx)("div",{className:"off-name",children:"👤 Ananya Sharma"}),(0,b.jsxs)("div",{className:"req-badges",children:[(0,b.jsx)("span",{className:"badge badge-dv",children:"🛡️ DV"}),(0,b.jsx)("span",{className:"badge badge-pv",children:"✅ PV"})]}),(0,b.jsx)("div",{className:"off-sub",children:"Full-Stack Developer"})]})]}),(0,b.jsxs)("div",{className:"req-meta",children:[(0,b.jsx)("span",{className:"meta-pill",children:"🧰 Service"}),(0,b.jsx)("span",{className:"meta-pill",children:"📄 read"}),(0,b.jsx)("span",{className:"meta-pill",children:"🎬 view"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h4",{className:"off-title",children:"Offered Custom Web App & SaaS Development"}),(0,b.jsxs)("p",{className:"off-desc",children:["Full-stack web applications using Next.js, React, Node.js.",(0,b.jsx)("a",{href:"#",className:"view-more",children:"<more...>"})]})]}),(0,b.jsxs)("div",{className:"mode-row",children:[(0,b.jsx)("span",{className:"meta-pill",children:"🚚 Delivery:"}),(0,b.jsx)("span",{className:"meta-pill",children:"🏢 Physical"}),(0,b.jsx)("span",{className:"meta-pill",children:"💻 Digital"})]}),(0,b.jsxs)("div",{className:"actions-row",children:[(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"📞 Call"}),(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"💬 Chat"}),(0,b.jsx)("button",{className:"icon-btn icon-btn-pri",children:"🎥 Video"}),(0,b.jsxs)("span",{className:"live-badge live-on",children:[(0,b.jsx)("span",{className:"blink"}),"Live"]})]})]})]}),(0,b.jsx)("div",{className:"db-pagination",children:(0,b.jsx)("div",{className:"db-page-chip",children:"<Pagination>"})}),(0,b.jsxs)("div",{className:"db-legend",children:[(0,b.jsx)("div",{className:"db-tag",children:"📦 Product"}),(0,b.jsx)("div",{className:"db-tag",children:"🧰 Service"}),(0,b.jsx)("div",{className:"db-tag",children:"🏢 Physical"}),(0,b.jsx)("div",{className:"db-tag",children:"💻 Digital"}),(0,b.jsx)("div",{className:"db-tag",children:"🔀 Phygital"}),(0,b.jsx)("div",{className:"db-tag",children:"✅ Digital Verified"}),(0,b.jsx)("div",{className:"db-tag",children:"✅ Physical Verified"}),(0,b.jsxs)("div",{className:"db-tag",children:[(0,b.jsx)("span",{className:"dot dot-live"}),"Live"]}),(0,b.jsxs)("div",{className:"db-tag",children:[(0,b.jsx)("span",{className:"dot dot-away"}),"Off/Away"]})]}),(0,b.jsx)("div",{className:"db-messages",children:"💬 Messages"})]})]})]})]})}a.s(["default",()=>h])}];

//# sourceMappingURL=apps_web_src_app_%5Blocale%5D_dashboard_page_tsx_833327c7._.js.map