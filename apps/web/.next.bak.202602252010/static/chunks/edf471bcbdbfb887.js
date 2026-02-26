(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,62841,e=>{"use strict";var i=e.i(14270),a=e.i(5034);let r={PH:"Physical",DG:"Digital",PD:"Phygital"};async function t(e,i){let a=await fetch(`/api/gig${e}`,{headers:{"Content-Type":"application/json"},...i});if(!a.ok)throw Error(await a.text());return 204===a.status?null:a.json()}let s=`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  :root {
    --bg: #080b12; --surface: rgba(255,255,255,0.04); --surface-hover: rgba(255,255,255,0.08);
    --border: rgba(255,255,255,0.08); --border-focus: rgba(0,240,255,0.4);
    --text: #e2e8f0; --text-dim: #64748b; --text-bright: #f8fafc;
    --cyan: #00f0ff; --purple: #a855f7; --emerald: #10b981; --rose: #f43f5e;
    --amber: #f59e0b; --font: 'Outfit', sans-serif; --mono: 'JetBrains Mono', monospace;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .gig-root {
    min-height: 100vh; background: var(--bg); color: var(--text); font-family: var(--font);
    background-image:
      radial-gradient(ellipse 80% 60% at 10% 20%, rgba(0,240,255,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 90% 80%, rgba(168,85,247,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 50% 50%, rgba(16,185,129,0.03) 0%, transparent 60%);
  }
  .gig-container { max-width: 1280px; margin: 0 auto; padding: 24px 20px; }
  .gig-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
  .gig-title { font-size: 28px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(135deg, var(--cyan), var(--purple)); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text; }
  .gig-subtitle { font-size: 13px; color: var(--text-dim); margin-top: 4px; font-weight: 400; }
  /* Tabs */
  .gig-tabs { display: flex; gap: 4px; background: var(--surface); border-radius: 14px;
    padding: 4px; border: 1px solid var(--border); margin-bottom: 28px; overflow-x: auto; }
  .gig-tab { padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; color: var(--text-dim); border: none; background: none;
    white-space: nowrap; font-family: var(--font); }
  .gig-tab:hover { color: var(--text); background: var(--surface-hover); }
  .gig-tab.active { color: var(--bg); background: var(--cyan); font-weight: 600; }
  /* Cards */
  .gig-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    padding: 20px; transition: all 0.2s; backdrop-filter: blur(20px); }
  .gig-card:hover { border-color: rgba(0,240,255,0.15); background: var(--surface-hover); }
  .gig-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
  .gig-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .gig-card-id { font-family: var(--mono); font-size: 12px; color: var(--cyan); opacity: 0.7; }
  .gig-card-actions { display: flex; gap: 6px; }
  .gig-badge { display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 11px;
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .gig-badge.ph { background: rgba(0,240,255,0.1); color: var(--cyan); }
  .gig-badge.dg { background: rgba(168,85,247,0.1); color: var(--purple); }
  .gig-badge.pd { background: rgba(16,185,129,0.1); color: var(--emerald); }
  .gig-badge.selected { background: rgba(16,185,129,0.15); color: var(--emerald); }
  .gig-badge.pending { background: rgba(245,158,11,0.12); color: var(--amber); }
  .gig-field { margin-bottom: 8px; }
  .gig-field-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase;
    letter-spacing: 0.8px; margin-bottom: 2px; }
  .gig-field-value { font-size: 14px; color: var(--text-bright); }
  .gig-money { font-family: var(--mono); color: var(--emerald); font-weight: 500; }
  .gig-date { font-family: var(--mono); font-size: 13px; color: var(--text-dim); }
  /* Buttons */
  .gig-btn { padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s; border: 1px solid var(--border);
    font-family: var(--font); display: inline-flex; align-items: center; gap: 6px; }
  .gig-btn-primary { background: var(--cyan); color: var(--bg); border-color: var(--cyan); font-weight: 600; }
  .gig-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .gig-btn-ghost { background: transparent; color: var(--text-dim); }
  .gig-btn-ghost:hover { color: var(--text); background: var(--surface-hover); }
  .gig-btn-danger { background: transparent; color: var(--rose); border-color: rgba(244,63,94,0.3); }
  .gig-btn-danger:hover { background: rgba(244,63,94,0.1); }
  .gig-btn-sm { padding: 5px 10px; font-size: 12px; border-radius: 8px; }
  .gig-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .gig-count { font-size: 13px; color: var(--text-dim); }
  /* Modal */
  .gig-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
    animation: fadeIn 0.2s ease; }
  .gig-modal { background: #0f1319; border: 1px solid var(--border); border-radius: 20px;
    width: 100%; max-width: 560px; max-height: 85vh; overflow-y: auto; padding: 28px;
    animation: slideUp 0.3s ease; }
  .gig-modal-title { font-size: 20px; font-weight: 700; margin-bottom: 24px;
    background: linear-gradient(135deg, var(--cyan), var(--purple)); -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; background-clip: text; }
  .gig-input-group { margin-bottom: 16px; }
  .gig-label { display: block; font-size: 12px; font-weight: 500; color: var(--text-dim);
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .gig-input { width: 100%; padding: 10px 14px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text-bright); font-size: 14px; font-family: var(--font);
    transition: border-color 0.2s; outline: none; }
  .gig-input:focus { border-color: var(--border-focus); }
  .gig-input::placeholder { color: var(--text-dim); opacity: 0.5; }
  select.gig-input { appearance: none; cursor: pointer; }
  textarea.gig-input { resize: vertical; min-height: 80px; }
  .gig-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .gig-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;
    padding-top: 16px; border-top: 1px solid var(--border); }
  /* Empty state */
  .gig-empty { text-align: center; padding: 60px 20px; }
  .gig-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }
  .gig-empty-text { font-size: 16px; color: var(--text-dim); margin-bottom: 20px; }
  /* Animations */
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .gig-card { animation: slideUp 0.3s ease backwards; }
  .gig-grid .gig-card:nth-child(1) { animation-delay: 0.02s; }
  .gig-grid .gig-card:nth-child(2) { animation-delay: 0.04s; }
  .gig-grid .gig-card:nth-child(3) { animation-delay: 0.06s; }
  .gig-grid .gig-card:nth-child(4) { animation-delay: 0.08s; }
  .gig-grid .gig-card:nth-child(5) { animation-delay: 0.10s; }
  .gig-grid .gig-card:nth-child(6) { animation-delay: 0.12s; }
  /* Scrollbar */
  .gig-modal::-webkit-scrollbar { width: 6px; }
  .gig-modal::-webkit-scrollbar-track { background: transparent; }
  .gig-modal::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  /* Loading */
  .gig-spinner { width: 24px; height: 24px; border: 2px solid var(--border);
    border-top-color: var(--cyan); border-radius: 50%; animation: spin 0.6s linear infinite; margin: 40px auto; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 640px) {
    .gig-grid { grid-template-columns: 1fr; }
    .gig-row { grid-template-columns: 1fr; }
    .gig-tabs { flex-wrap: nowrap; }
    .gig-tab { padding: 8px 14px; font-size: 13px; }
  }
`;function l({title:e,fields:r,data:t,onSave:s,onClose:l}){let[n,d]=(0,a.useState)(t),[g,o]=(0,a.useState)(!1),c=(e,i)=>d(a=>({...a,[e]:i})),m=async e=>{e.preventDefault(),o(!0);try{await s(n)}finally{o(!1)}};return(0,i.jsx)("div",{className:"gig-overlay",onClick:e=>e.target===e.currentTarget&&l(),children:(0,i.jsxs)("form",{className:"gig-modal",onSubmit:m,children:[(0,i.jsx)("div",{className:"gig-modal-title",children:e}),r.map(e=>(0,i.jsxs)("div",{className:"gig-input-group",children:[(0,i.jsxs)("label",{className:"gig-label",children:[e.label,e.required&&" *"]}),"select"===e.type?(0,i.jsxs)("select",{className:"gig-input",value:n[e.key]||"",onChange:i=>c(e.key,i.target.value),required:e.required,children:[(0,i.jsx)("option",{value:"",children:"Select..."}),e.options?.map(e=>(0,i.jsx)("option",{value:e.v,children:e.l},e.v))]}):"textarea"===e.type?(0,i.jsx)("textarea",{className:"gig-input",value:n[e.key]||"",onChange:i=>c(e.key,i.target.value),placeholder:e.label,required:e.required}):"checkbox"===e.type?(0,i.jsx)("input",{type:"checkbox",checked:!!n[e.key],onChange:i=>c(e.key,i.target.checked)}):(0,i.jsx)("input",{className:"gig-input",type:e.type,value:n[e.key]||"",onChange:i=>c(e.key,i.target.value),placeholder:e.label,required:e.required,step:"number"===e.type?"0.01":void 0})]},e.key)),(0,i.jsxs)("div",{className:"gig-modal-footer",children:[(0,i.jsx)("button",{type:"button",className:"gig-btn gig-btn-ghost",onClick:l,children:"Cancel"}),(0,i.jsx)("button",{type:"submit",className:"gig-btn gig-btn-primary",disabled:g,children:g?"Saving...":"Save"})]})]})})}function n({message:e,onConfirm:a,onCancel:r}){return(0,i.jsx)("div",{className:"gig-overlay",onClick:e=>e.target===e.currentTarget&&r(),children:(0,i.jsxs)("div",{className:"gig-modal",style:{maxWidth:400,textAlign:"center"},children:[(0,i.jsx)("div",{style:{fontSize:40,marginBottom:16},children:"⚠️"}),(0,i.jsx)("p",{style:{fontSize:15,marginBottom:24,color:"var(--text)"},children:e}),(0,i.jsxs)("div",{className:"gig-modal-footer",style:{justifyContent:"center"},children:[(0,i.jsx)("button",{className:"gig-btn gig-btn-ghost",onClick:r,children:"Cancel"}),(0,i.jsx)("button",{className:"gig-btn gig-btn-danger",onClick:a,children:"Delete"})]})]})})}let d=[{v:"PH",l:"Physical"},{v:"DG",l:"Digital"},{v:"PD",l:"Phygital"}],g=[{key:"userid",label:"User ID",type:"number",required:!0},{key:"marketid",label:"Market ID",type:"number",required:!0},{key:"delivery_mode",label:"Delivery Mode",type:"select",options:d},{key:"requirements",label:"Requirements",type:"textarea"},{key:"eligibility",label:"Eligibility",type:"textarea"},{key:"budget",label:"Budget",type:"number"},{key:"escrow",label:"Escrow",type:"number"},{key:"bidate",label:"Bid Date",type:"date"},{key:"delivdate",label:"Delivery Date",type:"date"},{key:"doc_url",label:"Document URL",type:"text"},{key:"audio_url",label:"Audio URL",type:"text"},{key:"video_url",label:"Video URL",type:"text"}],o=[{key:"userid",label:"User ID",type:"number",required:!0},{key:"marketid",label:"Market ID",type:"number",required:!0},{key:"delivery_mode",label:"Delivery Mode",type:"select",options:d},{key:"offerings",label:"Offerings",type:"textarea"},{key:"doc_url",label:"Document URL",type:"text"},{key:"audio_url",label:"Audio URL",type:"text"},{key:"video_url",label:"Video URL",type:"text"}],c=[{key:"requirid",label:"Requirement ID",type:"number",required:!0},{key:"userid",label:"User ID",type:"number",required:!0},{key:"amount",label:"Amount",type:"number"},{key:"escrow",label:"Escrow",type:"number"},{key:"selected",label:"Selected",type:"checkbox"}],m=[{key:"bidid",label:"Bid ID",type:"number",required:!0},{key:"agreement",label:"Agreement",type:"textarea"},{key:"client_sign",label:"Client Signature",type:"text"},{key:"provider_sign",label:"Provider Signature",type:"text"}];function p(){let[e,d]=(0,a.useState)("requirements"),[p,b]=(0,a.useState)([]),[x,u]=(0,a.useState)(!0),[f,h]=(0,a.useState)(0),[v,y]=(0,a.useState)(null),[j,k]=(0,a.useState)(null),N={requirements:"/requirements",offerings:"/offerings",bids:"/bids",agreements:"/agreements"},w={requirements:"requirid",offerings:"offerid",bids:"bidid",agreements:"agreeid"},C=(0,a.useCallback)(async()=>{u(!0);try{let i=await t(N[e]);b(i.data),h(i.total)}catch{b([]),h(0)}u(!1)},[e]);(0,a.useEffect)(()=>{C()},[C]);let q=async i=>{if(v?.mode==="create")await t(N[e],{method:"POST",body:JSON.stringify(i)});else{let a=v?.item?.[w[e]];await t(`${N[e]}/${a}`,{method:"PUT",body:JSON.stringify(i)})}y(null),C()},D=async()=>{j&&(await t(`${N[e]}/${j[w[e]]}`,{method:"DELETE"}),k(null),C())},S=e=>e?new Date(e).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—",z=e=>e?`₹${Number(e).toLocaleString("en-IN",{minimumFractionDigits:2})}`:"—",T=e=>e?(0,i.jsx)("span",{className:`gig-badge ${e.toLowerCase()}`,children:r[e]||e}):null,E={requirements:"📋 Requirements",offerings:"🎯 Offerings",bids:"💰 Bids",agreements:"🤝 Agreements"};return(0,i.jsxs)("div",{className:"gig-root",children:[(0,i.jsx)("style",{children:s}),(0,i.jsxs)("div",{className:"gig-container",children:[(0,i.jsx)("div",{className:"gig-header",children:(0,i.jsxs)("div",{children:[(0,i.jsx)("h1",{className:"gig-title",children:"Gig Marketplace"}),(0,i.jsx)("p",{className:"gig-subtitle",children:"Manage requirements, offerings, bids & agreements"})]})}),(0,i.jsx)("div",{className:"gig-tabs",children:Object.keys(E).map(a=>(0,i.jsx)("button",{className:`gig-tab ${e===a?"active":""}`,onClick:()=>d(a),children:E[a]},a))}),(0,i.jsxs)("div",{className:"gig-toolbar",children:[(0,i.jsxs)("span",{className:"gig-count",children:[f," record",1!==f?"s":""]}),(0,i.jsxs)("button",{className:"gig-btn gig-btn-primary",onClick:()=>y({mode:"create"}),children:["+ New ",e.slice(0,-1)]})]}),x?(0,i.jsx)("div",{className:"gig-spinner"}):0===p.length?(0,i.jsxs)("div",{className:"gig-empty",children:[(0,i.jsx)("div",{className:"gig-empty-icon",children:"📭"}),(0,i.jsxs)("div",{className:"gig-empty-text",children:["No ",e," yet. Create your first one!"]}),(0,i.jsxs)("button",{className:"gig-btn gig-btn-primary",onClick:()=>y({mode:"create"}),children:["+ Create ",e.slice(0,-1)]})]}):(0,i.jsx)("div",{className:"gig-grid",children:p.map(a=>{switch(e){case"requirements":return(0,i.jsxs)("div",{className:"gig-card",children:[(0,i.jsxs)("div",{className:"gig-card-header",children:[(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{className:"gig-card-id",children:["#REQ-",a.requirid]}),T(a.delivery_mode)]}),(0,i.jsxs)("div",{className:"gig-card-actions",children:[(0,i.jsx)("button",{className:"gig-btn gig-btn-ghost gig-btn-sm",onClick:()=>y({mode:"edit",item:a}),children:"Edit"}),(0,i.jsx)("button",{className:"gig-btn gig-btn-danger gig-btn-sm",onClick:()=>k(a),children:"Del"})]})]}),a.requirements&&(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Requirements"}),(0,i.jsx)("div",{className:"gig-field-value",children:a.requirements})]}),a.eligibility&&(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Eligibility"}),(0,i.jsx)("div",{className:"gig-field-value",children:a.eligibility})]}),(0,i.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8},children:[(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Budget"}),(0,i.jsx)("div",{className:"gig-money",children:z(a.budget)})]}),(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Escrow"}),(0,i.jsx)("div",{className:"gig-money",children:z(a.escrow)})]}),(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Bid Date"}),(0,i.jsx)("div",{className:"gig-date",children:S(a.bidate)})]}),(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Delivery"}),(0,i.jsx)("div",{className:"gig-date",children:S(a.delivdate)})]})]}),(0,i.jsxs)("div",{style:{marginTop:10,fontSize:12,color:"var(--text-dim)"},children:["User: ",a.userid," · Market: ",a.marketid," · Bids: ",a.bids?.length||0]})]},a.requirid);case"offerings":return(0,i.jsxs)("div",{className:"gig-card",children:[(0,i.jsxs)("div",{className:"gig-card-header",children:[(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{className:"gig-card-id",children:["#OFF-",a.offerid]}),T(a.delivery_mode)]}),(0,i.jsxs)("div",{className:"gig-card-actions",children:[(0,i.jsx)("button",{className:"gig-btn gig-btn-ghost gig-btn-sm",onClick:()=>y({mode:"edit",item:a}),children:"Edit"}),(0,i.jsx)("button",{className:"gig-btn gig-btn-danger gig-btn-sm",onClick:()=>k(a),children:"Del"})]})]}),a.offerings&&(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Offerings"}),(0,i.jsx)("div",{className:"gig-field-value",children:a.offerings})]}),(0,i.jsxs)("div",{style:{marginTop:10,fontSize:12,color:"var(--text-dim)"},children:["User: ",a.userid," · Market: ",a.marketid]})]},a.offerid);case"bids":return(0,i.jsxs)("div",{className:"gig-card",children:[(0,i.jsxs)("div",{className:"gig-card-header",children:[(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{className:"gig-card-id",children:["#BID-",a.bidid]}),(0,i.jsx)("span",{className:`gig-badge ${a.selected?"selected":"pending"}`,children:a.selected?"Selected":"Pending"})]}),(0,i.jsxs)("div",{className:"gig-card-actions",children:[(0,i.jsx)("button",{className:"gig-btn gig-btn-ghost gig-btn-sm",onClick:()=>y({mode:"edit",item:a}),children:"Edit"}),(0,i.jsx)("button",{className:"gig-btn gig-btn-danger gig-btn-sm",onClick:()=>k(a),children:"Del"})]})]}),(0,i.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},children:[(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Amount"}),(0,i.jsx)("div",{className:"gig-money",children:z(a.amount)})]}),(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Escrow"}),(0,i.jsx)("div",{className:"gig-money",children:z(a.escrow)})]})]}),(0,i.jsxs)("div",{style:{marginTop:10,fontSize:12,color:"var(--text-dim)"},children:["Req: #",a.requirid," · User: ",a.userid]})]},a.bidid);case"agreements":return(0,i.jsxs)("div",{className:"gig-card",children:[(0,i.jsxs)("div",{className:"gig-card-header",children:[(0,i.jsx)("div",{children:(0,i.jsxs)("div",{className:"gig-card-id",children:["#AGR-",a.agreeid]})}),(0,i.jsxs)("div",{className:"gig-card-actions",children:[(0,i.jsx)("button",{className:"gig-btn gig-btn-ghost gig-btn-sm",onClick:()=>y({mode:"edit",item:a}),children:"Edit"}),(0,i.jsx)("button",{className:"gig-btn gig-btn-danger gig-btn-sm",onClick:()=>k(a),children:"Del"})]})]}),a.agreement&&(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Agreement"}),(0,i.jsx)("div",{className:"gig-field-value",children:a.agreement})]}),(0,i.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8},children:[(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Client Sign"}),(0,i.jsx)("div",{className:"gig-field-value",children:a.client_sign||"—"})]}),(0,i.jsxs)("div",{className:"gig-field",children:[(0,i.jsx)("div",{className:"gig-field-label",children:"Provider Sign"}),(0,i.jsx)("div",{className:"gig-field-value",children:a.provider_sign||"—"})]})]}),(0,i.jsxs)("div",{style:{marginTop:10,fontSize:12,color:"var(--text-dim)"},children:["Bid: #",a.bidid]})]},a.agreeid)}})})]}),v&&(0,i.jsx)(l,{title:"create"===v.mode?`New ${e.slice(0,-1)}`:`Edit ${e.slice(0,-1)}`,fields:{requirements:g,offerings:o,bids:c,agreements:m}[e],data:"edit"===v.mode?v.item:{},onSave:q,onClose:()=>y(null)}),j&&(0,i.jsx)(n,{message:`Delete ${e.slice(0,-1)} #${j[w[e]]}? This cannot be undone.`,onConfirm:D,onCancel:()=>k(null)})]})}e.s(["default",()=>p])}]);