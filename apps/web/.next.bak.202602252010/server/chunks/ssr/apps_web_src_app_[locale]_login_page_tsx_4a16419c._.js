module.exports=[4424,a=>{"use strict";var b=a.i(39046),c=a.i(85152);a.i(53622);var d=a.i(42662),e=a.i(90075),f=a.i(38158);let g="https://api.saubh.tech/api";async function h(a,b,c=15e3){let d=new AbortController,e=setTimeout(()=>d.abort(),c);try{let c=await fetch(a,{...b,signal:d.signal});return clearTimeout(e),c}catch(d){if(clearTimeout(e),"AbortError"===d.name)throw Error("Request timed out. Please check your connection.");try{return await fetch(a,{...b,signal:AbortSignal.timeout(c)})}catch{throw Error("Unable to connect to server. Please check your internet and try again.")}}}function i(){let{t:a}=(0,d.useTranslation)(),{locale:i}=(0,f.useParams)(),j=(0,f.useRouter)(),k=(0,f.useSearchParams)().get("redirect"),[l,m]=(0,c.useState)(""),[n,o]=(0,c.useState)(""),[p,q]=(0,c.useState)("idle"),[r,s]=(0,c.useState)(""),[t,u]=(0,c.useState)(""),[v,w]=(0,c.useState)(""),[x,y]=(0,c.useState)(["","","",""]),[z,A]=(0,c.useState)("idle"),[B,C]=(0,c.useState)(""),[D,E]=(0,c.useState)(0),F=(0,c.useRef)([]),G=(0,c.useRef)(null);(0,c.useEffect)(()=>(D>0&&(G.current=setInterval(()=>{E(a=>a<=1?(G.current&&clearInterval(G.current),0):a-1)},1e3)),()=>{G.current&&clearInterval(G.current)}),[D]);let H=async b=>{b.preventDefault(),u(""),s("");let c=l.trim(),d=n.trim().replace(/[^\d]/g,"");if(!c)return void u(a("login.error.enterName"));if(!d||d.length<10)return void u(a("login.error.validPhone"));q("registering");try{let b=await h(`${g}/auth/whatsapp/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({whatsapp:d,fname:c,usertype:"GW"})}),e=await b.json();if(!b.ok){u(e.message||a("login.error.regFailed")),q("idle");return}q("done"),s(`Welcome ${e.user?.fname||c}! Check WhatsApp for your passcode.`),w(d)}catch(a){u(a.message||"Network error. Please try again."),q("idle")}},I=async b=>{b.preventDefault(),C("");let c=v.trim().replace(/[^\d]/g,"");if(!c||c.length<10)return void C(a("login.error.validPhoneShort"));A("sending");try{let b=await h(`${g}/auth/whatsapp/request-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({whatsapp:c})}),d=await b.json();if(!b.ok){C(d.message||a("login.error.otpFailed")),A("idle");return}A("otp"),y(["","","",""]),E(d.expiresIn||120),setTimeout(()=>F.current[0]?.focus(),100)}catch(a){C(a.message||"Network error. Please try again."),A("idle")}},J=async b=>{C("");let c=v.trim().replace(/[^\d]/g,"");A("verifying");try{let d=await h(`${g}/auth/whatsapp/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({whatsapp:c,otp:b})}),e=await d.json();if(!d.ok){C(e.message||a("login.error.invalidOtp")),A("otp"),y(["","","",""]),setTimeout(()=>F.current[0]?.focus(),100);return}A("success"),document.cookie=`saubh_token=${e.token}; path=/; max-age=86400; SameSite=Lax`,document.cookie=`saubh_user=${encodeURIComponent(JSON.stringify(e.user))}; path=/; max-age=86400; SameSite=Lax`,setTimeout(()=>{k?window.location.href=k:j.push(`/${i}/profile`)},800)}catch(a){C(a.message||"Network error. Please try again."),A("otp")}};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .lp{
          --lime:#a3e635;--green:#22c55e;--teal:#14b8a6;--orange:#f97316;--pink:#f43f5e;--violet:#8b5cf6;
          min-height:100vh;padding:20px;
          font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#f1f5f9;
          background:#080b12;position:relative;overflow:hidden;
          display:flex;align-items:center;justify-content:center;
        }
        .lp-mesh{position:fixed;inset:0;z-index:0;pointer-events:none;}
        .lp-mesh div{position:absolute;border-radius:50%;filter:blur(100px);opacity:.4;animation:drift 14s ease-in-out infinite alternate;}
        .lp-m1{width:500px;height:500px;top:-10%;left:-8%;background:var(--green);}
        .lp-m2{width:400px;height:400px;top:10%;right:-5%;background:var(--orange);animation-delay:-3s!important;animation-duration:16s!important;}
        .lp-m3{width:350px;height:350px;bottom:-5%;left:30%;background:var(--violet);animation-delay:-7s!important;animation-duration:18s!important;opacity:.25;}
        .lp-m4{width:280px;height:280px;bottom:15%;right:15%;background:var(--teal);animation-delay:-5s!important;opacity:.2;}
        @keyframes drift{0%{transform:translate(0,0) scale(1);}50%{transform:translate(30px,-20px) scale(1.1);}100%{transform:translate(-15px,25px) scale(.95);}}
        .lp::after{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px);
          background-size:24px 24px;opacity:.6;}
        .lp-inner{position:relative;z-index:1;width:100%;max-width:960px;}
        .lp-head{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:20px;}
        .lp-logo-img{width:40px;height:40px;border-radius:12px;object-fit:cover;
          box-shadow:0 0 20px rgba(34,197,94,.35),0 0 40px rgba(34,197,94,.15);}
        .lp-brand{font-family:'Outfit',sans-serif;font-weight:900;font-size:1.6rem;letter-spacing:-.5px;color:#fff;}
        .lp-brand-dot{background:linear-gradient(135deg,var(--lime),var(--orange));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .lp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        .lp-card{
          position:relative;border-radius:22px;overflow:hidden;
          background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
          backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
          transition:border-color .3s,box-shadow .3s;
        }
        .lp-card:hover{border-color:rgba(255,255,255,.14);}
        .lp-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;}
        .lp-card-left::before{background:linear-gradient(90deg,var(--green),var(--teal),var(--violet));}
        .lp-card-left:hover{box-shadow:0 0 50px rgba(34,197,94,.08),0 20px 60px rgba(0,0,0,.3);}
        .lp-card-right::before{background:linear-gradient(90deg,var(--orange),var(--pink));}
        .lp-card-right:hover{box-shadow:0 0 50px rgba(249,115,22,.08),0 20px 60px rgba(0,0,0,.3);}
        .lp-card-left::after{content:'';position:absolute;top:0;left:0;width:60%;height:40%;
          background:radial-gradient(ellipse at top left,rgba(34,197,94,.06),transparent);pointer-events:none;}
        .lp-card-right::after{content:'';position:absolute;top:0;right:0;width:60%;height:40%;
          background:radial-gradient(ellipse at top right,rgba(249,115,22,.06),transparent);pointer-events:none;}
        .lp-card-inner{padding:22px;display:grid;gap:16px;position:relative;z-index:1;}
        .lp-title{font-family:'Outfit',sans-serif;font-size:1.12rem;font-weight:800;letter-spacing:.1px;}
        .lp-subtitle{color:rgba(255,255,255,.45);font-size:.84rem;line-height:1.5;}
        .lp-block{padding:14px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);}
        .lp-form{display:grid;gap:10px;}
        .lp-input{
          height:46px;border-radius:12px;padding:0 14px;font-size:.9rem;width:100%;
          font-family:'Plus Jakarta Sans',sans-serif;color:#f1f5f9;outline:none;
          background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);transition:.25s;
        }
        .lp-input::placeholder{color:rgba(255,255,255,.28);}
        .lp-input:focus{border-color:rgba(163,230,53,.35);box-shadow:0 0 0 3px rgba(163,230,53,.08);background:rgba(255,255,255,.07);}
        .lp-input:disabled{opacity:.5;}
        .lp-otp-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
        .lp-otp-box{
          height:56px;border-radius:14px;text-align:center;font-size:1.5rem;font-weight:800;
          font-family:'Outfit',sans-serif;color:#fff;outline:none;
          background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.1);
          transition:.25s;caret-color:var(--lime);width:100%;
        }
        .lp-otp-box:focus{border-color:var(--lime);box-shadow:0 0 0 3px rgba(163,230,53,.12);background:rgba(255,255,255,.08);}
        .lp-otp-box.filled{border-color:rgba(163,230,53,.5);background:rgba(163,230,53,.06);}
        .lp-btn{
          height:46px;border:none;border-radius:12px;font-weight:700;font-size:.92rem;
          cursor:pointer;width:100%;font-family:'Outfit',sans-serif;letter-spacing:.2px;
          transition:.2s;position:relative;overflow:hidden;
        }
        .lp-btn:active{transform:scale(.98);}
        .lp-btn:disabled{opacity:.5;cursor:not-allowed;}
        .lp-btn::after{
          content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);transition:.5s;
        }
        .lp-btn:hover:not(:disabled)::after{left:120%;}
        .lp-btn-green{color:#fff;background:linear-gradient(135deg,#25D366 0%,#128C7E 100%);box-shadow:0 8px 24px rgba(37,211,102,.25);}
        .lp-btn-green:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(37,211,102,.35);}
        .lp-btn-orange{color:#fff;background:linear-gradient(135deg,var(--orange) 0%,var(--pink) 100%);box-shadow:0 8px 24px rgba(249,115,22,.2);}
        .lp-btn-orange:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(249,115,22,.3);}
        .lp-btn-violet{color:#fff;background:linear-gradient(135deg,var(--violet) 0%,var(--teal) 100%);box-shadow:0 8px 24px rgba(139,92,246,.2);}
        .lp-btn-violet:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(139,92,246,.3);}
        .lp-btn-ghost{color:rgba(255,255,255,.55);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);box-shadow:none;}
        .lp-btn-ghost:hover:not(:disabled){color:#fff;background:rgba(255,255,255,.08);transform:none;}
        .lp-err{background:rgba(244,63,94,.12);color:#fda4af;padding:10px 14px;border-radius:10px;font-size:.84rem;border:1px solid rgba(244,63,94,.15);}
        .lp-success{background:rgba(34,197,94,.1);color:#86efac;padding:10px 14px;border-radius:10px;font-size:.84rem;border:1px solid rgba(34,197,94,.15);}
        .lp-timer{text-align:center;color:rgba(255,255,255,.4);font-size:.82rem;font-weight:600;margin-top:2px;}
        .lp-timer b{color:var(--lime);}
        .lp-link{color:var(--lime);text-decoration:none;font-weight:700;cursor:pointer;font-size:.84rem;}
        .lp-link:hover{text-decoration:underline;}
        .lp-divider{display:flex;align-items:center;gap:12px;color:rgba(255,255,255,.2);font-size:.78rem;}
        .lp-divider::before,.lp-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.08);}
        .lp-check{display:flex;align-items:center;justify-content:center;gap:8px;padding:20px;color:#86efac;font-weight:700;font-size:1rem;}
        .lp-check-icon{
          width:48px;height:48px;border-radius:50%;
          background:rgba(34,197,94,.15);border:2px solid rgba(34,197,94,.4);
          display:grid;place-items:center;font-size:1.4rem;
          animation:pop .4s cubic-bezier(.68,-.55,.27,1.55);
        }
        @keyframes pop{0%{transform:scale(0);}100%{transform:scale(1);}}
        .lp-spinner{
          width:18px;height:18px;border:2px solid rgba(255,255,255,.2);
          border-top-color:#fff;border-radius:50%;
          animation:spin .6s linear infinite;display:inline-block;vertical-align:middle;margin-right:6px;
        }
        @keyframes spin{to{transform:rotate(360deg);}}
        .lp-wa-badge{
          display:inline-flex;align-items:center;gap:6px;
          padding:6px 12px;border-radius:20px;font-size:.78rem;font-weight:700;
          background:rgba(37,211,102,.1);color:#25D366;border:1px solid rgba(37,211,102,.2);
        }
        @media(max-width:720px){
          .lp{padding:14px;}
          .lp-grid{grid-template-columns:1fr;gap:14px;}
          .lp-card-inner{padding:18px;}
          .lp-brand{font-size:1.3rem;}
          .lp-m1,.lp-m2{width:300px;height:300px;}
          .lp-m3,.lp-m4{display:none;}
        }
      `}),(0,b.jsxs)("div",{className:"lp",children:[(0,b.jsxs)("div",{className:"lp-mesh",children:[(0,b.jsx)("div",{className:"lp-m1"}),(0,b.jsx)("div",{className:"lp-m2"}),(0,b.jsx)("div",{className:"lp-m3"}),(0,b.jsx)("div",{className:"lp-m4"})]}),(0,b.jsxs)("div",{className:"lp-inner",children:[(0,b.jsxs)("div",{className:"lp-head",children:[(0,b.jsx)(e.default,{src:"/logo.jpg",alt:"Saubh.Tech",width:40,height:40,className:"lp-logo-img"}),(0,b.jsxs)("div",{className:"lp-brand",children:["Saubh",(0,b.jsx)("span",{className:"lp-brand-dot",children:"."}),"Tech"]})]}),(0,b.jsxs)("div",{className:"lp-grid",children:[(0,b.jsx)("section",{className:"lp-card lp-card-left",children:(0,b.jsxs)("div",{className:"lp-card-inner",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"lp-title",children:a("login.register.title")}),(0,b.jsx)("p",{className:"lp-subtitle",children:a("login.register.subtitle")})]}),"done"===p?(0,b.jsxs)("div",{className:"lp-block",children:[(0,b.jsx)("div",{className:"lp-check",children:(0,b.jsx)("div",{className:"lp-check-icon",children:"✓"})}),(0,b.jsx)("div",{className:"lp-success",style:{textAlign:"center"},children:r}),(0,b.jsx)("div",{style:{textAlign:"center",marginTop:"12px"},children:(0,b.jsx)("span",{className:"lp-wa-badge",children:a("login.register.checkWhatsapp")})}),(0,b.jsx)("div",{style:{textAlign:"center",marginTop:"12px"},children:(0,b.jsx)("span",{className:"lp-link",onClick:()=>{q("idle"),s("")},children:a("login.register.another")})})]}):(0,b.jsxs)("div",{className:"lp-block",children:[t&&(0,b.jsx)("div",{className:"lp-err",children:t}),(0,b.jsxs)("form",{className:"lp-form",onSubmit:H,children:[(0,b.jsx)("input",{className:"lp-input",type:"text",placeholder:a("login.register.namePlaceholder"),value:l,onChange:a=>m(a.target.value),disabled:"registering"===p}),(0,b.jsx)("input",{className:"lp-input",type:"tel",inputMode:"numeric",placeholder:a("login.register.phonePlaceholder"),value:n,onChange:a=>o(a.target.value.replace(/[^\d+\s-]/g,"")),disabled:"registering"===p}),(0,b.jsx)("button",{className:"lp-btn lp-btn-green",type:"submit",disabled:"registering"===p,children:"registering"===p?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("span",{className:"lp-spinner"}),a("login.register.creating")]}):a("login.register.btn")})]})]}),(0,b.jsx)("div",{className:"lp-divider",children:a("login.register.already")}),(0,b.jsx)("p",{className:"lp-subtitle",style:{textAlign:"center"},children:a("login.register.useSignIn")})]})}),(0,b.jsx)("section",{className:"lp-card lp-card-right",children:(0,b.jsxs)("div",{className:"lp-card-inner",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"lp-title",children:a("login.signin.title")}),(0,b.jsx)("p",{className:"lp-subtitle",children:a("login.signin.subtitle")})]}),"success"===z?(0,b.jsxs)("div",{className:"lp-block",children:[(0,b.jsx)("div",{className:"lp-check",children:(0,b.jsx)("div",{className:"lp-check-icon",children:"✓"})}),(0,b.jsx)("div",{className:"lp-success",style:{textAlign:"center"},children:a("login.signin.verified")})]}):"otp"===z||"verifying"===z?(0,b.jsxs)("div",{className:"lp-block",children:[(0,b.jsx)("div",{style:{textAlign:"center",marginBottom:"8px"},children:(0,b.jsxs)("span",{className:"lp-wa-badge",children:[a("login.signin.codeSentTo")," ",v]})}),B&&(0,b.jsx)("div",{className:"lp-err",children:B}),(0,b.jsxs)("form",{className:"lp-form",onSubmit:b=>{b.preventDefault();let c=x.join("");4!==c.length?C(a("login.error.enter4digit")):J(c)},children:[(0,b.jsx)("div",{className:"lp-otp-row",onPaste:a=>{a.preventDefault();let b=a.clipboardData.getData("text").replace(/\D/g,"").slice(0,4);4===b.length&&(y(b.split("")),F.current[3]?.focus(),J(b))},children:x.map((a,c)=>(0,b.jsx)("input",{ref:a=>{F.current[c]=a},className:`lp-otp-box${a?" filled":""}`,type:"text",inputMode:"numeric",maxLength:1,value:a,onChange:a=>((a,b)=>{if(!/^\d?$/.test(b))return;let c=[...x];c[a]=b,y(c),b&&a<3&&F.current[a+1]?.focus(),b&&3===a&&c.every(a=>""!==a)&&J(c.join(""))})(c,a.target.value),onKeyDown:a=>{"Backspace"===a.key&&!x[c]&&c>0&&F.current[c-1]?.focus()},disabled:"verifying"===z,autoFocus:0===c},c))}),"verifying"===z?(0,b.jsxs)("div",{style:{textAlign:"center",padding:"8px",color:"rgba(255,255,255,.5)"},children:[(0,b.jsx)("span",{className:"lp-spinner"})," ",a("login.signin.verifying")]}):(0,b.jsx)("button",{className:"lp-btn lp-btn-violet",type:"submit",children:a("login.signin.verifyBtn")})]}),(0,b.jsx)("div",{className:"lp-timer",children:D>0?(0,b.jsxs)(b.Fragment,{children:[a("login.signin.codeExpiresIn")," ",(0,b.jsxs)("b",{children:[Math.floor(D/60),":",(D%60).toString().padStart(2,"0")]})]}):(0,b.jsx)("span",{style:{color:"var(--pink)"},children:a("login.signin.codeExpired")})}),(0,b.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",marginTop:"8px"},children:[(0,b.jsx)("span",{className:"lp-link",onClick:()=>{A("idle"),C(""),y(["","","",""])},children:a("login.signin.changeNumber")}),(0,b.jsx)("span",{className:"lp-link",style:{opacity:D>90?.3:1,pointerEvents:D>90?"none":"auto"},onClick:I,children:a("login.signin.resendCode")})]})]}):(0,b.jsxs)("div",{className:"lp-block",children:[B&&(0,b.jsx)("div",{className:"lp-err",children:B}),(0,b.jsxs)("form",{className:"lp-form",onSubmit:I,children:[(0,b.jsx)("input",{className:"lp-input",type:"tel",inputMode:"numeric",placeholder:a("login.register.phonePlaceholder"),value:v,onChange:a=>w(a.target.value.replace(/[^\d+\s-]/g,"")),disabled:"sending"===z}),(0,b.jsx)("button",{className:"lp-btn lp-btn-orange",type:"submit",disabled:"sending"===z,children:"sending"===z?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("span",{className:"lp-spinner"}),a("login.signin.sendingOtp")]}):a("login.signin.sendOtp")})]}),(0,b.jsx)("div",{className:"lp-divider",children:a("login.signin.orPasscode")}),(0,b.jsx)("p",{className:"lp-subtitle",style:{textAlign:"center"},children:a("login.signin.passcodeHint")}),(0,b.jsxs)("form",{className:"lp-form",onSubmit:b=>{b.preventDefault();let c=document.getElementById("staticPass")?.value||"";4!==c.length?C(a("login.error.enter4passcode")):J(c)},children:[(0,b.jsx)("input",{id:"staticPass",className:"lp-input",type:"password",inputMode:"numeric",maxLength:4,placeholder:a("login.signin.passcodePlaceholder")}),(0,b.jsx)("button",{className:"lp-btn lp-btn-ghost",type:"submit",children:a("login.signin.passcodeBtn")})]})]}),(0,b.jsx)("div",{className:"lp-divider",children:a("login.signin.newUser")}),(0,b.jsx)("p",{className:"lp-subtitle",style:{textAlign:"center"},children:a("login.signin.useRegister")})]})})]})]})]})]})}function j(){return(0,b.jsx)(d.TranslationProvider,{children:(0,b.jsx)(i,{})})}a.s(["default",()=>j])}];

//# sourceMappingURL=apps_web_src_app_%5Blocale%5D_login_page_tsx_4a16419c._.js.map