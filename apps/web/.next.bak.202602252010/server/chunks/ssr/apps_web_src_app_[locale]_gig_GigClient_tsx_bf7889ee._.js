module.exports=[52609,a=>{"use strict";var b=a.i(39046),c=a.i(85152);let d={PH:"Physical",DG:"Digital",PD:"Phygital"};async function e(a,b){let c=await fetch(`/api/gig${a}`,{headers:{"Content-Type":"application/json"},...b});if(!c.ok)throw Error(await c.text());return 204===c.status?null:c.json()}let f=`
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
`;function g({title:a,fields:d,data:e,onSave:f,onClose:g}){let[h,i]=(0,c.useState)(e),[j,k]=(0,c.useState)(!1),l=(a,b)=>i(c=>({...c,[a]:b})),m=async a=>{a.preventDefault(),k(!0);try{await f(h)}finally{k(!1)}};return(0,b.jsx)("div",{className:"gig-overlay",onClick:a=>a.target===a.currentTarget&&g(),children:(0,b.jsxs)("form",{className:"gig-modal",onSubmit:m,children:[(0,b.jsx)("div",{className:"gig-modal-title",children:a}),d.map(a=>(0,b.jsxs)("div",{className:"gig-input-group",children:[(0,b.jsxs)("label",{className:"gig-label",children:[a.label,a.required&&" *"]}),"select"===a.type?(0,b.jsxs)("select",{className:"gig-input",value:h[a.key]||"",onChange:b=>l(a.key,b.target.value),required:a.required,children:[(0,b.jsx)("option",{value:"",children:"Select..."}),a.options?.map(a=>(0,b.jsx)("option",{value:a.v,children:a.l},a.v))]}):"textarea"===a.type?(0,b.jsx)("textarea",{className:"gig-input",value:h[a.key]||"",onChange:b=>l(a.key,b.target.value),placeholder:a.label,required:a.required}):"checkbox"===a.type?(0,b.jsx)("input",{type:"checkbox",checked:!!h[a.key],onChange:b=>l(a.key,b.target.checked)}):(0,b.jsx)("input",{className:"gig-input",type:a.type,value:h[a.key]||"",onChange:b=>l(a.key,b.target.value),placeholder:a.label,required:a.required,step:"number"===a.type?"0.01":void 0})]},a.key)),(0,b.jsxs)("div",{className:"gig-modal-footer",children:[(0,b.jsx)("button",{type:"button",className:"gig-btn gig-btn-ghost",onClick:g,children:"Cancel"}),(0,b.jsx)("button",{type:"submit",className:"gig-btn gig-btn-primary",disabled:j,children:j?"Saving...":"Save"})]})]})})}function h({message:a,onConfirm:c,onCancel:d}){return(0,b.jsx)("div",{className:"gig-overlay",onClick:a=>a.target===a.currentTarget&&d(),children:(0,b.jsxs)("div",{className:"gig-modal",style:{maxWidth:400,textAlign:"center"},children:[(0,b.jsx)("div",{style:{fontSize:40,marginBottom:16},children:"⚠️"}),(0,b.jsx)("p",{style:{fontSize:15,marginBottom:24,color:"var(--text)"},children:a}),(0,b.jsxs)("div",{className:"gig-modal-footer",style:{justifyContent:"center"},children:[(0,b.jsx)("button",{className:"gig-btn gig-btn-ghost",onClick:d,children:"Cancel"}),(0,b.jsx)("button",{className:"gig-btn gig-btn-danger",onClick:c,children:"Delete"})]})]})})}let i=[{v:"PH",l:"Physical"},{v:"DG",l:"Digital"},{v:"PD",l:"Phygital"}],j=[{key:"userid",label:"User ID",type:"number",required:!0},{key:"marketid",label:"Market ID",type:"number",required:!0},{key:"delivery_mode",label:"Delivery Mode",type:"select",options:i},{key:"requirements",label:"Requirements",type:"textarea"},{key:"eligibility",label:"Eligibility",type:"textarea"},{key:"budget",label:"Budget",type:"number"},{key:"escrow",label:"Escrow",type:"number"},{key:"bidate",label:"Bid Date",type:"date"},{key:"delivdate",label:"Delivery Date",type:"date"},{key:"doc_url",label:"Document URL",type:"text"},{key:"audio_url",label:"Audio URL",type:"text"},{key:"video_url",label:"Video URL",type:"text"}],k=[{key:"userid",label:"User ID",type:"number",required:!0},{key:"marketid",label:"Market ID",type:"number",required:!0},{key:"delivery_mode",label:"Delivery Mode",type:"select",options:i},{key:"offerings",label:"Offerings",type:"textarea"},{key:"doc_url",label:"Document URL",type:"text"},{key:"audio_url",label:"Audio URL",type:"text"},{key:"video_url",label:"Video URL",type:"text"}],l=[{key:"requirid",label:"Requirement ID",type:"number",required:!0},{key:"userid",label:"User ID",type:"number",required:!0},{key:"amount",label:"Amount",type:"number"},{key:"escrow",label:"Escrow",type:"number"},{key:"selected",label:"Selected",type:"checkbox"}],m=[{key:"bidid",label:"Bid ID",type:"number",required:!0},{key:"agreement",label:"Agreement",type:"textarea"},{key:"client_sign",label:"Client Signature",type:"text"},{key:"provider_sign",label:"Provider Signature",type:"text"}];function n(){let[a,i]=(0,c.useState)("requirements"),[n,o]=(0,c.useState)([]),[p,q]=(0,c.useState)(!0),[r,s]=(0,c.useState)(0),[t,u]=(0,c.useState)(null),[v,w]=(0,c.useState)(null),x={requirements:"/requirements",offerings:"/offerings",bids:"/bids",agreements:"/agreements"},y={requirements:"requirid",offerings:"offerid",bids:"bidid",agreements:"agreeid"},z=(0,c.useCallback)(async()=>{q(!0);try{let b=await e(x[a]);o(b.data),s(b.total)}catch{o([]),s(0)}q(!1)},[a]);(0,c.useEffect)(()=>{z()},[z]);let A=async b=>{if(t?.mode==="create")await e(x[a],{method:"POST",body:JSON.stringify(b)});else{let c=t?.item?.[y[a]];await e(`${x[a]}/${c}`,{method:"PUT",body:JSON.stringify(b)})}u(null),z()},B=async()=>{v&&(await e(`${x[a]}/${v[y[a]]}`,{method:"DELETE"}),w(null),z())},C=a=>a?new Date(a).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—",D=a=>a?`₹${Number(a).toLocaleString("en-IN",{minimumFractionDigits:2})}`:"—",E=a=>a?(0,b.jsx)("span",{className:`gig-badge ${a.toLowerCase()}`,children:d[a]||a}):null,F={requirements:"📋 Requirements",offerings:"🎯 Offerings",bids:"💰 Bids",agreements:"🤝 Agreements"};return(0,b.jsxs)("div",{className:"gig-root",children:[(0,b.jsx)("style",{children:f}),(0,b.jsxs)("div",{className:"gig-container",children:[(0,b.jsx)("div",{className:"gig-header",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"gig-title",children:"Gig Marketplace"}),(0,b.jsx)("p",{className:"gig-subtitle",children:"Manage requirements, offerings, bids & agreements"})]})}),(0,b.jsx)("div",{className:"gig-tabs",children:Object.keys(F).map(c=>(0,b.jsx)("button",{className:`gig-tab ${a===c?"active":""}`,onClick:()=>i(c),children:F[c]},c))}),(0,b.jsxs)("div",{className:"gig-toolbar",children:[(0,b.jsxs)("span",{className:"gig-count",children:[r," record",1!==r?"s":""]}),(0,b.jsxs)("button",{className:"gig-btn gig-btn-primary",onClick:()=>u({mode:"create"}),children:["+ New ",a.slice(0,-1)]})]}),p?(0,b.jsx)("div",{className:"gig-spinner"}):0===n.length?(0,b.jsxs)("div",{className:"gig-empty",children:[(0,b.jsx)("div",{className:"gig-empty-icon",children:"📭"}),(0,b.jsxs)("div",{className:"gig-empty-text",children:["No ",a," yet. Create your first one!"]}),(0,b.jsxs)("button",{className:"gig-btn gig-btn-primary",onClick:()=>u({mode:"create"}),children:["+ Create ",a.slice(0,-1)]})]}):(0,b.jsx)("div",{className:"gig-grid",children:n.map(c=>{switch(a){case"requirements":return(0,b.jsxs)("div",{className:"gig-card",children:[(0,b.jsxs)("div",{className:"gig-card-header",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"gig-card-id",children:["#REQ-",c.requirid]}),E(c.delivery_mode)]}),(0,b.jsxs)("div",{className:"gig-card-actions",children:[(0,b.jsx)("button",{className:"gig-btn gig-btn-ghost gig-btn-sm",onClick:()=>u({mode:"edit",item:c}),children:"Edit"}),(0,b.jsx)("button",{className:"gig-btn gig-btn-danger gig-btn-sm",onClick:()=>w(c),children:"Del"})]})]}),c.requirements&&(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Requirements"}),(0,b.jsx)("div",{className:"gig-field-value",children:c.requirements})]}),c.eligibility&&(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Eligibility"}),(0,b.jsx)("div",{className:"gig-field-value",children:c.eligibility})]}),(0,b.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8},children:[(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Budget"}),(0,b.jsx)("div",{className:"gig-money",children:D(c.budget)})]}),(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Escrow"}),(0,b.jsx)("div",{className:"gig-money",children:D(c.escrow)})]}),(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Bid Date"}),(0,b.jsx)("div",{className:"gig-date",children:C(c.bidate)})]}),(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Delivery"}),(0,b.jsx)("div",{className:"gig-date",children:C(c.delivdate)})]})]}),(0,b.jsxs)("div",{style:{marginTop:10,fontSize:12,color:"var(--text-dim)"},children:["User: ",c.userid," · Market: ",c.marketid," · Bids: ",c.bids?.length||0]})]},c.requirid);case"offerings":return(0,b.jsxs)("div",{className:"gig-card",children:[(0,b.jsxs)("div",{className:"gig-card-header",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"gig-card-id",children:["#OFF-",c.offerid]}),E(c.delivery_mode)]}),(0,b.jsxs)("div",{className:"gig-card-actions",children:[(0,b.jsx)("button",{className:"gig-btn gig-btn-ghost gig-btn-sm",onClick:()=>u({mode:"edit",item:c}),children:"Edit"}),(0,b.jsx)("button",{className:"gig-btn gig-btn-danger gig-btn-sm",onClick:()=>w(c),children:"Del"})]})]}),c.offerings&&(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Offerings"}),(0,b.jsx)("div",{className:"gig-field-value",children:c.offerings})]}),(0,b.jsxs)("div",{style:{marginTop:10,fontSize:12,color:"var(--text-dim)"},children:["User: ",c.userid," · Market: ",c.marketid]})]},c.offerid);case"bids":return(0,b.jsxs)("div",{className:"gig-card",children:[(0,b.jsxs)("div",{className:"gig-card-header",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("div",{className:"gig-card-id",children:["#BID-",c.bidid]}),(0,b.jsx)("span",{className:`gig-badge ${c.selected?"selected":"pending"}`,children:c.selected?"Selected":"Pending"})]}),(0,b.jsxs)("div",{className:"gig-card-actions",children:[(0,b.jsx)("button",{className:"gig-btn gig-btn-ghost gig-btn-sm",onClick:()=>u({mode:"edit",item:c}),children:"Edit"}),(0,b.jsx)("button",{className:"gig-btn gig-btn-danger gig-btn-sm",onClick:()=>w(c),children:"Del"})]})]}),(0,b.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8},children:[(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Amount"}),(0,b.jsx)("div",{className:"gig-money",children:D(c.amount)})]}),(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Escrow"}),(0,b.jsx)("div",{className:"gig-money",children:D(c.escrow)})]})]}),(0,b.jsxs)("div",{style:{marginTop:10,fontSize:12,color:"var(--text-dim)"},children:["Req: #",c.requirid," · User: ",c.userid]})]},c.bidid);case"agreements":return(0,b.jsxs)("div",{className:"gig-card",children:[(0,b.jsxs)("div",{className:"gig-card-header",children:[(0,b.jsx)("div",{children:(0,b.jsxs)("div",{className:"gig-card-id",children:["#AGR-",c.agreeid]})}),(0,b.jsxs)("div",{className:"gig-card-actions",children:[(0,b.jsx)("button",{className:"gig-btn gig-btn-ghost gig-btn-sm",onClick:()=>u({mode:"edit",item:c}),children:"Edit"}),(0,b.jsx)("button",{className:"gig-btn gig-btn-danger gig-btn-sm",onClick:()=>w(c),children:"Del"})]})]}),c.agreement&&(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Agreement"}),(0,b.jsx)("div",{className:"gig-field-value",children:c.agreement})]}),(0,b.jsxs)("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8},children:[(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Client Sign"}),(0,b.jsx)("div",{className:"gig-field-value",children:c.client_sign||"—"})]}),(0,b.jsxs)("div",{className:"gig-field",children:[(0,b.jsx)("div",{className:"gig-field-label",children:"Provider Sign"}),(0,b.jsx)("div",{className:"gig-field-value",children:c.provider_sign||"—"})]})]}),(0,b.jsxs)("div",{style:{marginTop:10,fontSize:12,color:"var(--text-dim)"},children:["Bid: #",c.bidid]})]},c.agreeid)}})})]}),t&&(0,b.jsx)(g,{title:"create"===t.mode?`New ${a.slice(0,-1)}`:`Edit ${a.slice(0,-1)}`,fields:{requirements:j,offerings:k,bids:l,agreements:m}[a],data:"edit"===t.mode?t.item:{},onSave:A,onClose:()=>u(null)}),v&&(0,b.jsx)(h,{message:`Delete ${a.slice(0,-1)} #${v[y[a]]}? This cannot be undone.`,onConfirm:B,onCancel:()=>w(null)})]})}a.s(["default",()=>n])}];

//# sourceMappingURL=apps_web_src_app_%5Blocale%5D_gig_GigClient_tsx_bf7889ee._.js.map