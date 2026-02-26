module.exports=[79205,a=>{"use strict";var b=a.i(39046),c=a.i(85152),d=a.i(38158),e=a.i(90075);let f="https://api.saubh.tech/api",g=Object.entries({M:"Male",F:"Female",T:"Transgender",O:"Other"}),h=Object.entries({BO:"Business Owner",CL:"Client",GW:"Gig Worker"});function i(a){return a<40?"#ef4444":a<70?"#f59e0b":"#22c55e"}function j(){var a;let j,{locale:l}=(0,d.useParams)(),m=(0,d.useRouter)(),[n,o]=(0,c.useState)(null),[p,q]=(0,c.useState)(!0),[r,s]=(0,c.useState)(!1),[t,u]=(0,c.useState)(""),[v,w]=(0,c.useState)(""),[x,y]=(0,c.useState)(""),[z,A]=(0,c.useState)(""),[B,C]=(0,c.useState)(""),[D,E]=(0,c.useState)(""),[F,G]=(0,c.useState)(""),[H,I]=(0,c.useState)(""),[J,K]=(0,c.useState)(""),[L,M]=(0,c.useState)([]),[N,O]=(0,c.useState)(""),[P,Q]=(0,c.useState)(""),[R,S]=(0,c.useState)("GW"),[T,U]=(0,c.useState)(null),[V,W]=(0,c.useState)(null),[X,Y]=(0,c.useState)(""),[Z,$]=(0,c.useState)(null),[_,aa]=(0,c.useState)(""),[ab,ac]=(0,c.useState)(!1),[ad,ae]=(0,c.useState)([]),[af,ag]=(0,c.useState)(null),[ah,ai]=(0,c.useState)(null),[aj,ak]=(0,c.useState)(null),[al,am]=(0,c.useState)(!1),[an,ao]=(0,c.useState)(!1),ap=(0,c.useRef)(null),aq=(0,c.useRef)(null),ar=(0,c.useRef)(null),as=(0,c.useRef)(null),[at,au]=(0,c.useState)([]),[av,aw]=(0,c.useState)([]),[ax,ay]=(0,c.useState)([]),[az,aA]=(0,c.useState)([]),[aB,aC]=(0,c.useState)([]),[aD,aE]=(0,c.useState)(""),[aF,aG]=(0,c.useState)(!1),[aH,aI]=(0,c.useState)(["","","",""]),[aJ,aK]=(0,c.useState)(!1),[aL,aM]=(0,c.useState)(!1),[aN,aO]=(0,c.useState)(!1),[aP,aQ]=(0,c.useState)(0),aR=(0,c.useRef)([]),[aS,aT]=(0,c.useState)(["","","","","",""]),[aU,aV]=(0,c.useState)(!1),[aW,aX]=(0,c.useState)(!1),[aY,aZ]=(0,c.useState)(!1),[a$,a_]=(0,c.useState)(0),a0=(0,c.useRef)([]);(0,c.useEffect)(()=>{if(aP<=0)return;let a=setInterval(()=>aQ(a=>a<=1?0:a-1),1e3);return()=>clearInterval(a)},[aP]),(0,c.useEffect)(()=>{if(a$<=0)return;let a=setInterval(()=>a_(a=>a<=1?0:a-1),1e3);return()=>clearInterval(a)},[a$]);let a1=(0,c.useCallback)(async(a,b)=>fetch(a,{...b,headers:{...b?.headers,Authorization:`Bearer ${n}`}}),[n]);(0,c.useEffect)(()=>{let a=function(a){if("u"<typeof document)return null;let b=document.cookie.match(RegExp(`(?:^|; )${a}=([^;]*)`));return b?decodeURIComponent(b[1]):null}("saubh_token");a?(o(a),(async()=>{try{let b=await fetch(`${f}/auth/profile`,{headers:{Authorization:`Bearer ${a}`}});if(!b.ok)return void m.replace(`/${l}/login`);let c=await b.json();if(c.isComplete)return void m.replace(`/${l}/dashboard`);let d=c.user;y(d.fname||""),A(d.lname||""),C(d.whatsapp||""),E(d.email||""),G(d.phone||""),I(d.gender||""),K(d.dob?d.dob.split("T")[0]:""),M(d.langid||[]),O(d.qualification||""),Q(d.experience||""),S(d.usertype||"GW"),U(d.stateid||null),W(d.districtid||null),Y(d.pincode||""),$(d.placeid?Number(d.placeid):null),ag(d.pic||null),c.emailVerified&&aX(!0),c.phoneVerified&&aM(!0)}catch{m.replace(`/${l}/login`);return}q(!1)})()):m.replace(`/${l}/login`)},[l,m]),(0,c.useEffect)(()=>{fetch(`${f}/master/geo/languages`).then(a=>a.json()).then(a=>au(a.data||[])).catch(()=>{}),fetch(`${f}/master/geo/states`).then(a=>a.json()).then(a=>aw(a.data||[])).catch(()=>{})},[]),(0,c.useEffect)(()=>{ay([]),aA([]),aC([]),T&&fetch(`${f}/master/geo/districts?stateId=${T}`).then(a=>a.json()).then(a=>ay(a.data||[])).catch(()=>{})},[T]),(0,c.useEffect)(()=>{aA([]),aC([]),V&&fetch(`${f}/master/geo/pincodes?districtId=${V}`).then(a=>a.json()).then(a=>aA(a.data||[])).catch(()=>{})},[V]),(0,c.useEffect)(()=>{aC([]),X&&fetch(`${f}/master/geo/places?pincode=${X}`).then(a=>a.json()).then(a=>aC(a.data||[])).catch(()=>{})},[X]);let a2=(a={fname:x,lname:z,email:D,phone:F,gender:H,dob:J,langid:L,qualification:N,experience:P,usertype:R,stateid:T,districtid:V,pincode:X,placeid:Z,pic:af},j=0,a.fname&&j++,a.lname&&j++,a.email&&j++,a.phone&&j++,a.gender&&j++,a.dob&&j++,a.langid&&a.langid.length>0&&j++,a.qualification&&j++,a.experience&&j++,a.usertype&&j++,j++,a.stateid&&j++,a.districtid&&j++,a.pincode&&j++,(a.placeid||"string"==typeof a.customPlace&&a.customPlace)&&j++,(a.pic||ah)&&j++,Math.round(j/16*100)),a3=async()=>{ao(!1),u(""),ar.current&&(ar.current.getTracks().forEach(a=>a.stop()),ar.current=null);try{ar.current=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:640},height:{ideal:640}},audio:!1}).catch(async a=>(console.warn("Camera first attempt failed, retrying with basic constraints...",a),navigator.mediaDevices.getUserMedia({video:!0,audio:!1}))),am(!0)}catch(b){console.error("Camera access denied:",b);let a=b?.message||String(b);ao(!0),a.includes("Permission denied")||a.includes("NotAllowedError")?u("Camera permission denied. Please allow camera access in your browser settings, or upload a photo instead."):a.includes("NotFoundError")||a.includes("DevicesNotFound")?u("No camera found on this device. Please upload a photo instead."):a.includes("NotReadableError")||a.includes("TrackStartError")?u("Camera is busy — close other tabs or apps using the camera, then try again. Or upload a photo below."):u(`Camera error: ${a}. You can upload a photo instead.`)}},a4=async()=>{if(!ap.current||!aq.current){console.error("capturePhoto: refs missing",{video:!!ap.current,canvas:!!aq.current}),u("Camera not ready. Please wait a moment and try again.");return}let a=ap.current,b=aq.current;if((0===a.videoWidth||0===a.videoHeight)&&(await new Promise(a=>setTimeout(a,500)),0===a.videoWidth||0===a.videoHeight))return void u("Camera still loading. Please wait a moment and tap Capture again.");let c=Math.min(a.videoWidth,a.videoHeight);b.width=c,b.height=c;let d=b.getContext("2d"),e=(a.videoWidth-c)/2,f=(a.videoHeight-c)/2;d.translate(c,0),d.scale(-1,1),d.drawImage(a,e,f,c,c,0,0,c,c),d.setTransform(1,0,0,1,0,0),b.toBlob(a=>{a&&(ai(new File([a],"selfie.jpg",{type:"image/jpeg"})),ak(URL.createObjectURL(a)),a5())},"image/jpeg",.9)},a5=()=>{ar.current&&(ar.current.getTracks().forEach(a=>a.stop()),ar.current=null),am(!1)};(0,c.useEffect)(()=>{if(al&&ar.current&&ap.current){let a=ap.current;a.srcObject=ar.current,a.onloadedmetadata=()=>{a.play().catch(()=>{})}}},[al]),(0,c.useEffect)(()=>{let a=()=>{ar.current&&(ar.current.getTracks().forEach(a=>{try{a.stop()}catch{}}),ar.current=null),am(!1)},b=()=>{"hidden"===document.visibilityState&&a()},c=()=>a();return document.addEventListener("visibilitychange",b),window.addEventListener("beforeunload",c),()=>{a(),document.removeEventListener("visibilitychange",b),window.removeEventListener("beforeunload",c)}},[]);let a6=(a,b,c,d,e,f,g)=>{if(!/^\d?$/.test(b))return;let h=[...d];h[a]=b,e(h),b&&a<c-1&&f.current[a+1]?.focus(),b&&a===c-1&&h.every(a=>""!==a)&&g&&g()},a7=(a,b,c,d)=>{"Backspace"===b.key&&!c[a]&&a>0&&d.current[a-1]?.focus()},a8=(a,b,c,d,e)=>{a.preventDefault();let f=a.clipboardData.getData("text").replace(/\D/g,"").slice(0,b);f.length===b&&(c(f.split("")),d.current[b-1]?.focus(),e&&e())},a9=async(a,b)=>{if(!n||!b.trim())return;let c="mobile"===a?aO:aZ;c(!0),u("");try{let c=await a1(`${f}/auth/profile/send-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:a,value:b.trim()})}),d=await c.json();c.ok?(("mobile"===a?aK:aV)(!0),("mobile"===a?aQ:a_)(d.expiresIn||120),"mobile"===a?(aI(["","","",""]),setTimeout(()=>aR.current[0]?.focus(),100)):(aT(["","","","","",""]),setTimeout(()=>a0.current[0]?.focus(),100))):u(d.message||`Failed to send ${a} OTP.`)}catch{u("Network error.")}c(!1)},ba=async(a,b,c)=>{if(!n||!c.trim())return;let d="mobile"===a?aO:aZ;d(!0);try{let d=await a1(`${f}/auth/profile/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:a,value:b.trim(),otp:c.trim()})});if(d.ok)("mobile"===a?aM:aX)(!0),u("");else{let b=await d.json().catch(()=>({}));u(b.message||`Invalid or expired ${a} OTP.`)}}catch{u("Network error.")}d(!1)};(0,c.useEffect)(()=>{let a=aS.join("");6===a.length&&/^\d{6}$/.test(a)&&!aW&&!aY&&aU&&ba("email",D,a)},[aS]),(0,c.useEffect)(()=>{let a=aH.join("");4===a.length&&/^\d{4}$/.test(a)&&!aL&&!aN&&aJ&&ba("mobile",F,a)},[aH]);let bb=async(a,b="complete")=>{if(a.preventDefault(),u(""),w(""),!x.trim())return void u("First name is required.");if("complete"===b){if(!z.trim())return void u("Last name is required.");if(!D.trim())return void u("Email is required.");if(!aW)return void u("Please verify your email to complete your profile.");if(!F.trim())return void u("Alternate mobile is required.");if(!aL)return void u("Please verify your mobile to complete your profile.");if(!H)return void u("Gender is required.");if(!J)return void u("Date of birth is required.");if(0===L.length)return void u("Select at least one language.");if(!N.trim())return void u("Qualification is required.");if(!P.trim())return void u("Experience is required.");if(!R)return void u("Please select your role.");if(!T)return void u("State is required.");if(!V)return void u("District is required.");if(!X)return void u("Pin code is required.");if(!Z&&!_.trim())return void u("Place is required.");if(!af&&!ah)return void u("Please take a selfie or upload a photo.")}s(!0);try{if(ah){let a=new FormData;a.append("photo",ah);let b=await a1(`${f}/auth/profile/photo`,{method:"POST",body:a});if(!b.ok){u("Photo upload failed."),s(!1);return}let c=await b.json().catch(()=>({}));c.pic&&ag(c.pic)}let a={fname:x.trim(),usertype:R,countryCode:"IN"};z.trim()&&(a.lname=z.trim()),D.trim()&&(a.email=D.trim()),F.trim()&&(a.phone=F.trim()),H&&(a.gender=H),J&&(a.dob=J),L.length>0&&(a.langid=L),N.trim()&&(a.qualification=N.trim()),P.trim()&&(a.experience=P.trim()),T&&(a.stateid=T),V&&(a.districtid=V),X&&(a.pincode=X),Z&&(a.placeid=Z),_.trim()&&(a.customPlace=_.trim());let c=await a1(`${f}/auth/profile`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!c.ok){let a=await c.json().catch(()=>({}));u(a.message||"Failed to save profile."),s(!1);return}let d=await c.json();if(d.isComplete)document.cookie=`saubh_user=${encodeURIComponent(JSON.stringify(d.user))}; path=/; max-age=86400; SameSite=Lax`,m.push(`/${l}/dashboard`);else if("draft"===b)w("Profile saved! Complete verification to finish setup."),s(!1);else{let a=[];d.emailVerified||a.push("email verification"),d.phoneVerified||a.push("mobile verification"),u("Almost there! Still need: "+(a.length>0?a.join(" and "):"some required fields")+"."),s(!1)}}catch{u("Network error. Please try again."),s(!1)}},bc=at.filter(a=>!L.includes(a.langid)&&a.language?.toLowerCase().includes(aD.toLowerCase()));return p?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:k}),(0,b.jsxs)("div",{className:"pp",style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,b.jsxs)("div",{className:"pp-mesh",children:[(0,b.jsx)("div",{className:"pp-m1"}),(0,b.jsx)("div",{className:"pp-m2"}),(0,b.jsx)("div",{className:"pp-m3"})]}),(0,b.jsx)("div",{style:{fontSize:"1.1rem",color:"#66708a",fontFamily:"Inter,system-ui,sans-serif"},children:"Loading profile..."})]})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:k}),(0,b.jsx)("canvas",{ref:aq,style:{display:"none"}}),(0,b.jsxs)("div",{className:"pp",children:[(0,b.jsxs)("div",{className:"pp-mesh",children:[(0,b.jsx)("div",{className:"pp-m1"}),(0,b.jsx)("div",{className:"pp-m2"}),(0,b.jsx)("div",{className:"pp-m3"})]}),(0,b.jsxs)("div",{className:"pp-inner",children:[(0,b.jsxs)("div",{className:"pp-head",children:[(0,b.jsx)(e.default,{src:"/logo.jpg",alt:"Saubh.Tech",width:36,height:36,style:{borderRadius:10,boxShadow:"0 0 16px rgba(124,58,237,0.25)"}}),(0,b.jsxs)("span",{className:"pp-brand",children:["Saubh",(0,b.jsx)("span",{className:"pp-dot",children:"."}),"Tech"]})]}),(0,b.jsxs)("div",{className:"pp-progress-wrap",children:[(0,b.jsxs)("div",{className:"pp-progress-label",children:["Profile ",a2,"% complete"]}),(0,b.jsx)("div",{className:"pp-progress-track",children:(0,b.jsx)("div",{className:"pp-progress-bar",style:{width:`${a2}%`,background:`linear-gradient(90deg, ${i(a2)}, ${a2>=70?"#06b6d4":i(a2)})`}})})]}),(0,b.jsxs)("form",{className:"pp-card",onSubmit:bb,children:[(0,b.jsx)("div",{className:"pp-card-top"}),(0,b.jsxs)("div",{className:"pp-grid",children:[(0,b.jsxs)("div",{className:"pp-left",children:[al?(0,b.jsxs)("div",{className:"pp-camera-wrap",children:[(0,b.jsx)("video",{ref:ap,autoPlay:!0,playsInline:!0,muted:!0,className:"pp-camera-video",style:{transform:"scaleX(-1)"}}),(0,b.jsxs)("div",{className:"pp-camera-actions",children:[(0,b.jsx)("button",{type:"button",className:"pp-cam-btn pp-cam-capture",onClick:a4,children:"📸 Capture"}),(0,b.jsx)("button",{type:"button",className:"pp-cam-btn pp-cam-cancel",onClick:a5,children:"✕ Cancel"})]})]}):aj||af?(0,b.jsxs)("div",{className:"pp-photo-area",children:[(0,b.jsx)("img",{src:aj||(af?.startsWith("http")?af:`${f.replace("/api","")}${af?.startsWith("/api")?af:`/api${af}`}`),alt:"Profile",className:"pp-photo-img"}),(0,b.jsx)("div",{className:"pp-photo-overlay",onClick:()=>{ai(null),ak(null),a3()},children:(0,b.jsx)("span",{children:"📸 Retake Selfie"})})]}):(0,b.jsxs)("div",{className:"pp-photo-area pp-photo-empty",onClick:a3,children:[(0,b.jsxs)("svg",{width:"48",height:"48",fill:"none",viewBox:"0 0 24 24",stroke:"#7c3aed",strokeWidth:"1.5",children:[(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"}),(0,b.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"})]}),(0,b.jsx)("div",{className:"pp-photo-text",children:"📸 Take a Selfie *"}),(0,b.jsx)("div",{className:"pp-photo-hint",children:"Camera will open for selfie"}),an&&(0,b.jsx)("div",{className:"pp-photo-fallback",onClick:a=>{a.stopPropagation(),as.current?.click()},children:"Or upload a photo instead"})]}),(0,b.jsx)("input",{ref:as,type:"file",accept:"image/*",onChange:a=>{let b=a.target.files?.[0];if(b){if(!b.type.startsWith("image/"))return void u("Only image files allowed.");if(b.size>5242880)return void u("Photo must be under 5MB.");ai(b),ak(URL.createObjectURL(b)),u("")}},style:{display:"none"}}),!al&&!aj&&!af&&(0,b.jsx)("div",{className:"pp-upload-fallback",onClick:()=>as.current?.click(),children:"📁 Upload instead"}),ah&&(0,b.jsxs)("div",{className:"pp-photo-name",children:[ah.name," (",(ah.size/1024).toFixed(0)," KB)"]}),(0,b.jsxs)("div",{className:"pp-field",style:{width:"100%",marginTop:"8px"},children:[(0,b.jsx)("label",{className:"pp-label",children:"I am a *"}),(0,b.jsx)("div",{className:"pp-usertype-group",children:h.map(([a,c])=>(0,b.jsxs)("button",{type:"button",className:`pp-usertype-btn${R===a?" pp-usertype-active":""}`,onClick:()=>S(a),children:["BO"===a?"🏢":"CL"===a?"👤":"⚡"," ",c]},a))})]})]}),(0,b.jsxs)("div",{className:"pp-right",children:[(0,b.jsxs)("div",{className:"pp-row",children:[(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"First Name *"}),(0,b.jsx)("input",{className:"pp-input",value:x,onChange:a=>y(a.target.value),placeholder:"First name"})]}),(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"Last Name *"}),(0,b.jsx)("input",{className:"pp-input",value:z,onChange:a=>A(a.target.value),placeholder:"Last name"})]})]}),(0,b.jsx)("div",{className:"pp-row",children:(0,b.jsxs)("div",{className:"pp-field",style:{gridColumn:"span 2"},children:[(0,b.jsxs)("label",{className:"pp-label",children:["Email * ",aW&&(0,b.jsx)("span",{className:"pp-verified-badge",children:"✓ Verified"})]}),aW?(0,b.jsx)("input",{className:"pp-input",value:D,readOnly:!0,style:{opacity:.7}}):(0,b.jsxs)("div",{className:"pp-verify-block",children:[(0,b.jsxs)("div",{className:"pp-otp-row",children:[(0,b.jsx)("input",{className:"pp-input pp-otp-input",type:"email",value:D,onChange:a=>{E(a.target.value),aV(!1),aX(!1)},placeholder:"your@email.com",disabled:aU&&!aW}),!aU&&(0,b.jsx)("button",{type:"button",className:"pp-otp-btn",disabled:!D.trim()||aY,onClick:()=>a9("email",D),children:aY?"...":"Send Code"})]}),aU&&!aW&&(0,b.jsxs)("div",{className:"pp-otp-verify-section",children:[(0,b.jsxs)("div",{className:"pp-otp-hint",children:["Enter 6-digit code sent to ",D]}),(0,b.jsx)("div",{className:"pp-otp-boxes",onPaste:a=>a8(a,6,aT,a0,void 0),children:aS.map((a,c)=>(0,b.jsx)("input",{ref:a=>{a0.current[c]=a},className:`pp-otp-box${a?" pp-otp-filled":""}`,type:"text",inputMode:"numeric",maxLength:1,value:a,onChange:a=>a6(c,a.target.value,6,aS,aT,a0,void 0),onKeyDown:a=>a7(c,a,aS,a0),disabled:aY},c))}),(0,b.jsxs)("div",{className:"pp-otp-meta",children:[a$>0?(0,b.jsxs)("span",{className:"pp-otp-timer",children:["Expires in ",Math.floor(a$/60),":",(a$%60).toString().padStart(2,"0")]}):(0,b.jsx)("span",{className:"pp-otp-expired",children:"Code expired"}),a$>0?(0,b.jsx)("span",{className:"pp-otp-resend",style:{opacity:a$>550?.3:1,pointerEvents:a$>550?"none":"auto"},onClick:()=>a9("email",D),children:"Resend"}):(0,b.jsx)("button",{type:"button",className:"pp-otp-btn",style:{height:"32px",fontSize:".78rem",padding:"0 12px"},onClick:()=>{aV(!1),aT(["","","","","",""])},children:"Send New Code"})]})]})]})]})}),(0,b.jsxs)("div",{className:"pp-row",children:[(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"WhatsApp (registered)"}),(0,b.jsx)("input",{className:"pp-input",value:B,readOnly:!0,style:{opacity:.6}})]}),(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsxs)("label",{className:"pp-label",children:["Alternate Mobile * ",aL&&(0,b.jsx)("span",{className:"pp-verified-badge",children:"✓ Verified"})]}),aL?(0,b.jsx)("input",{className:"pp-input",value:F,readOnly:!0,style:{opacity:.7}}):(0,b.jsxs)("div",{className:"pp-verify-block",children:[(0,b.jsxs)("div",{className:"pp-otp-row",children:[(0,b.jsx)("input",{className:"pp-input pp-otp-input",value:F,onChange:a=>{G(a.target.value),aK(!1),aM(!1)},placeholder:"Alt. mobile",disabled:aJ&&!aL}),!aJ&&(0,b.jsx)("button",{type:"button",className:"pp-otp-btn",disabled:!F.trim()||aN,onClick:()=>a9("mobile",F),children:aN?"...":"OTP"})]}),aJ&&!aL&&(0,b.jsxs)("div",{className:"pp-otp-verify-section",children:[(0,b.jsx)("div",{className:"pp-otp-hint",children:"Enter 4-digit code sent via WhatsApp"}),(0,b.jsx)("div",{className:"pp-otp-boxes",onPaste:a=>a8(a,4,aI,aR,()=>ba("mobile",F,aH.join(""))),children:aH.map((a,c)=>(0,b.jsx)("input",{ref:a=>{aR.current[c]=a},className:`pp-otp-box${a?" pp-otp-filled":""}`,type:"text",inputMode:"numeric",maxLength:1,value:a,onChange:a=>a6(c,a.target.value,4,aH,aI,aR,void 0),onKeyDown:a=>a7(c,a,aH,aR),disabled:aN},c))}),(0,b.jsxs)("div",{className:"pp-otp-meta",children:[aP>0?(0,b.jsxs)("span",{className:"pp-otp-timer",children:["Expires in ",Math.floor(aP/60),":",(aP%60).toString().padStart(2,"0")]}):(0,b.jsx)("span",{className:"pp-otp-expired",children:"Code expired"}),aP>0?(0,b.jsx)("span",{className:"pp-otp-resend",style:{opacity:aP>250?.3:1,pointerEvents:aP>250?"none":"auto"},onClick:()=>a9("mobile",F),children:"Resend"}):(0,b.jsx)("button",{type:"button",className:"pp-otp-btn",style:{height:"32px",fontSize:".78rem",padding:"0 12px"},onClick:()=>{aK(!1),aI(["","","",""])},children:"Send New Code"})]})]})]})]})]}),(0,b.jsxs)("div",{className:"pp-row",children:[(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"Gender *"}),(0,b.jsxs)("select",{className:"pp-input pp-select",value:H,onChange:a=>I(a.target.value),children:[(0,b.jsx)("option",{value:"",children:"Select gender"}),g.map(([a,c])=>(0,b.jsx)("option",{value:a,children:c},a))]})]}),(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"Date of Birth *"}),(0,b.jsx)("input",{className:"pp-input",type:"date",value:J,onChange:a=>K(a.target.value),max:new Date().toISOString().split("T")[0]})]})]}),(0,b.jsx)("div",{className:"pp-row",children:(0,b.jsxs)("div",{className:"pp-field",style:{gridColumn:"span 2",position:"relative"},children:[(0,b.jsx)("label",{className:"pp-label",children:"Languages * (select at least one)"}),(0,b.jsxs)("div",{className:"pp-chips-wrap",children:[L.map(a=>(0,b.jsxs)("span",{className:"pp-chip",children:[at.find(b=>b.langid===a)?.language||`#${a}`,(0,b.jsx)("button",{type:"button",className:"pp-chip-x",onClick:()=>M(L.filter(b=>b!==a)),children:"×"})]},a)),(0,b.jsx)("input",{className:"pp-chip-input",value:aD,onChange:a=>{aE(a.target.value),aG(!0)},onFocus:()=>aG(!0),placeholder:L.length?"Add more...":"Search languages..."})]}),aF&&bc.length>0&&(0,b.jsx)("div",{className:"pp-lang-drop",children:bc.slice(0,12).map(a=>(0,b.jsx)("div",{className:"pp-lang-opt",onClick:()=>{var b;return b=a.langid,void(!L.includes(b)&&M([...L,b]),aE(""),aG(!1))},children:a.language},a.langid))})]})}),(0,b.jsxs)("div",{className:"pp-row",children:[(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"Qualification *"}),(0,b.jsx)("input",{className:"pp-input",value:N,onChange:a=>O(a.target.value),placeholder:"e.g. B.Tech, MBA"})]}),(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"Experience *"}),(0,b.jsx)("input",{className:"pp-input",value:P,onChange:a=>Q(a.target.value),placeholder:"e.g. 3 years"})]})]}),(0,b.jsxs)("div",{className:"pp-row",children:[(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"Country"}),(0,b.jsx)("input",{className:"pp-input",value:"India",readOnly:!0,style:{opacity:.6}})]}),(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"State *"}),(0,b.jsxs)("select",{className:"pp-input pp-select",value:T||"",onChange:a=>{U(a.target.value?+a.target.value:null),W(null),Y(""),$(null)},children:[(0,b.jsx)("option",{value:"",children:"Select state"}),av.map(a=>(0,b.jsx)("option",{value:a.stateid,children:a.state},a.stateid))]})]})]}),(0,b.jsxs)("div",{className:"pp-row",children:[(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"District *"}),(0,b.jsxs)("select",{className:"pp-input pp-select",value:V||"",onChange:a=>{W(a.target.value?+a.target.value:null),Y(""),$(null)},disabled:!T,children:[(0,b.jsx)("option",{value:"",children:T?"Select district":"Select state first"}),ax.map(a=>(0,b.jsx)("option",{value:a.districtid,children:a.district},a.districtid))]})]}),(0,b.jsxs)("div",{className:"pp-field",children:[(0,b.jsx)("label",{className:"pp-label",children:"Pin Code *"}),(0,b.jsxs)("select",{className:"pp-input pp-select",value:X,onChange:a=>{Y(a.target.value),$(null)},disabled:!V,children:[(0,b.jsx)("option",{value:"",children:V?"Select pincode":"Select district first"}),az.map(a=>(0,b.jsxs)("option",{value:a.pincode,children:[a.pincode," — ",a.postoffice]},a.postid))]})]})]}),(0,b.jsx)("div",{className:"pp-row",children:(0,b.jsxs)("div",{className:"pp-field",style:{gridColumn:"span 2"},children:[(0,b.jsx)("label",{className:"pp-label",children:"Place *"}),ab?(0,b.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[(0,b.jsx)("input",{className:"pp-input",value:_,onChange:a=>{let b=a.target.value;aa(b),ae(((a,b)=>{if(!a||a.length<2||0===b.length)return[];let c=a.toLowerCase().trim();return b.map(a=>{let b=(a.place||a.name||"").toLowerCase();if(b.includes(c)||c.includes(b))return{...a,score:.9};let d=b.length>c.length?b:c,e=b.length>c.length?c:b,f=0;for(let a=0;a<e.length;a++)d.includes(e[a])&&f++;let g=f/d.length;return{...a,score:g}}).filter(a=>a.score>=.6).sort((a,b)=>b.score-a.score).slice(0,3)})(b,aB))},placeholder:"Enter your place name"}),ad.length>0&&_.length>=2&&(0,b.jsxs)("div",{style:{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:"8px",padding:"8px 12px"},children:[(0,b.jsx)("span",{style:{fontSize:".72rem",color:"#16a34a",fontWeight:600},children:"Did you mean:"}),ad.map(a=>(0,b.jsxs)("div",{onClick:()=>{$(Number(a.placeid)),aa(""),ac(!1),ae([])},style:{padding:"6px 10px",margin:"4px 0",cursor:"pointer",borderRadius:"6px",fontSize:".85rem",fontWeight:500,background:"white",border:"1px solid #d1fae5",transition:".15s"},onMouseEnter:a=>a.currentTarget.style.background="#dcfce7",onMouseLeave:a=>a.currentTarget.style.background="white",children:["✅ ",a.place||a.name]},a.placeid))]}),0===ad.length&&_.length>=3&&(0,b.jsx)("span",{style:{fontSize:".72rem",color:"#6b7280",fontStyle:"italic"},children:"No similar place found — your entry will be reviewed and added to our directory"}),(0,b.jsx)("span",{className:"pp-custom-place-link",onClick:()=>{ac(!1),aa(""),ae([])},children:"← Select from list instead"})]}):(0,b.jsxs)("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[(0,b.jsxs)("select",{className:"pp-input pp-select",value:Z||"",onChange:a=>{$(a.target.value?+a.target.value:null),aa("")},disabled:!X,children:[(0,b.jsx)("option",{value:"",children:X?"Select place":"Select pincode first"}),aB.map(a=>(0,b.jsx)("option",{value:Number(a.placeid),children:a.place},a.placeid))]}),X&&(0,b.jsx)("span",{className:"pp-custom-place-link",onClick:()=>{ac(!0),$(null)},children:"+ Add new place (not in list)"})]})]})}),t&&(0,b.jsx)("div",{className:"pp-error",children:t}),v&&(0,b.jsx)("div",{className:"pp-success",children:v}),(0,b.jsxs)("div",{className:"pp-submit-row",children:[(0,b.jsx)("button",{type:"button",className:"pp-draft-btn",disabled:r,onClick:a=>bb(a,"draft"),children:r?"Saving...":"💾 Save Draft"}),(0,b.jsx)("button",{type:"submit",className:"pp-submit-btn",disabled:r||!aW||!aL,onClick:a=>{a.preventDefault(),bb(a,"complete")},children:r?"Saving...":aW&&aL?"Save & Continue →":"🔒 Verify to Complete"})]})]})]})]})]})]})]})}let k=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}

.pp{
  min-height:100vh;padding:20px;
  font-family:'Inter',system-ui,sans-serif;color:#15192d;
  background:#f4f0ff;position:relative;overflow-x:hidden;
}

/* Mesh blobs */
.pp-mesh{position:fixed;inset:0;z-index:0;pointer-events:none;}
.pp-mesh div{position:absolute;border-radius:50%;filter:blur(120px);opacity:.35;animation:ppdrift 16s ease-in-out infinite alternate;}
.pp-m1{width:500px;height:500px;top:-8%;left:-5%;background:#7c3aed;}
.pp-m2{width:400px;height:400px;top:30%;right:-8%;background:#06b6d4;animation-delay:-4s!important;}
.pp-m3{width:350px;height:350px;bottom:-5%;left:40%;background:#22c55e;animation-delay:-8s!important;opacity:.2;}
@keyframes ppdrift{0%{transform:translate(0,0) scale(1);}50%{transform:translate(25px,-20px) scale(1.08);}100%{transform:translate(-15px,20px) scale(.95);}}

.pp-inner{position:relative;z-index:1;max-width:920px;margin:0 auto;}

/* Header */
.pp-head{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:14px;}
.pp-brand{font-weight:800;font-size:1.4rem;color:#15192d;}
.pp-dot{background:linear-gradient(135deg,#7c3aed,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}

/* Progress */
.pp-progress-wrap{margin-bottom:16px;}
.pp-progress-label{font-size:.82rem;font-weight:600;color:#66708a;margin-bottom:6px;text-align:center;}
.pp-progress-track{height:8px;border-radius:8px;background:rgba(124,58,237,0.1);overflow:hidden;}
.pp-progress-bar{height:100%;border-radius:8px;transition:width .4s ease, background .4s ease;}

/* Card */
.pp-card{
  position:relative;border-radius:20px;overflow:hidden;
  background:rgba(255,255,255,0.82);
  border:1px solid rgba(124,58,237,0.12);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  box-shadow:0 8px 40px rgba(124,58,237,0.06),0 1px 3px rgba(0,0,0,0.04);
}
.pp-card-top{height:3px;background:linear-gradient(90deg,#7c3aed,#06b6d4);}

.pp-grid{display:grid;grid-template-columns:260px 1fr;gap:0;}

/* Left panel */
.pp-left{padding:28px 24px;border-right:1px solid rgba(124,58,237,0.08);display:flex;flex-direction:column;align-items:center;gap:12px;}

/* Photo area */
.pp-photo-area{
  width:210px;height:210px;border-radius:18px;overflow:hidden;position:relative;
  border:2px dashed rgba(124,58,237,0.25);
  display:flex;align-items:center;justify-content:center;
  transition:.25s;background:rgba(124,58,237,0.03);
}
.pp-photo-empty{cursor:pointer;}
.pp-photo-empty:hover{border-color:#7c3aed;background:rgba(124,58,237,0.06);}
.pp-photo-img{width:100%;height:100%;object-fit:cover;}
.pp-photo-overlay{
  position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;
  opacity:0;transition:.25s;cursor:pointer;color:#fff;font-weight:600;font-size:.85rem;
}
.pp-photo-area:hover .pp-photo-overlay{opacity:1;}
.pp-photo-text{font-size:.85rem;font-weight:600;color:#7c3aed;margin-top:10px;text-align:center;}
.pp-photo-hint{font-size:.72rem;color:#66708a;margin-top:4px;text-align:center;}
.pp-photo-fallback{font-size:.72rem;color:#7c3aed;margin-top:8px;cursor:pointer;text-decoration:underline;text-align:center;}
.pp-upload-fallback{font-size:.78rem;color:#66708a;cursor:pointer;text-align:center;transition:.2s;}
.pp-upload-fallback:hover{color:#7c3aed;}
.pp-photo-name{font-size:.75rem;color:#66708a;text-align:center;word-break:break-all;}

/* Camera */
.pp-camera-wrap{width:210px;height:260px;border-radius:18px;overflow:hidden;display:flex;flex-direction:column;background:#000;border:2px solid #7c3aed;}
.pp-camera-video{width:100%;flex:1;object-fit:cover;border-radius:16px 16px 0 0;}
.pp-camera-actions{display:flex;gap:4px;padding:6px;}
.pp-cam-btn{flex:1;padding:8px 0;border:none;border-radius:10px;font-weight:700;font-size:.8rem;cursor:pointer;font-family:'Inter',sans-serif;}
.pp-cam-capture{background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;}
.pp-cam-cancel{background:rgba(255,255,255,0.1);color:#fff;}
.pp-cam-capture:hover{opacity:.9;}
.pp-cam-cancel:hover{background:rgba(255,255,255,0.2);}

/* User type buttons */
.pp-usertype-group{display:flex;flex-direction:column;gap:6px;width:100%;}
.pp-usertype-btn{
  width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(124,58,237,0.15);
  background:rgba(255,255,255,0.9);font-size:.82rem;font-weight:600;
  font-family:'Inter',system-ui,sans-serif;color:#15192d;cursor:pointer;
  transition:.2s;text-align:left;
}
.pp-usertype-btn:hover{border-color:#7c3aed;background:rgba(124,58,237,0.04);}
.pp-usertype-active{
  border-color:#7c3aed;background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(6,182,212,0.06));
  color:#7c3aed;box-shadow:0 0 0 2px rgba(124,58,237,0.12);
}

/* Right panel */
.pp-right{padding:24px 28px;display:flex;flex-direction:column;gap:14px;}
.pp-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.pp-field{display:flex;flex-direction:column;gap:4px;}
.pp-label{font-size:.78rem;font-weight:600;color:#66708a;display:flex;align-items:center;gap:6px;}

.pp-input{
  height:40px;border-radius:10px;padding:0 12px;font-size:.88rem;
  font-family:'Inter',system-ui,sans-serif;color:#15192d;outline:none;
  background:rgba(255,255,255,0.9);border:1px solid rgba(124,58,237,0.15);
  transition:.2s;width:100%;
}
.pp-input::placeholder{color:#a0a8c0;}
.pp-input:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
.pp-select{cursor:pointer;appearance:auto;}

/* Verified badge */
.pp-verified-badge{
  display:inline-flex;align-items:center;gap:2px;padding:1px 8px;border-radius:10px;
  font-size:.7rem;font-weight:700;background:rgba(34,197,94,0.12);color:#16a34a;
}

/* OTP verification */
.pp-verify-block{display:flex;flex-direction:column;gap:8px;}
.pp-otp-row{display:flex;gap:6px;align-items:center;}
.pp-otp-input{flex:1;}
.pp-otp-btn{
  height:40px;padding:0 14px;border-radius:10px;border:none;
  background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;
  font-weight:700;font-size:.82rem;cursor:pointer;white-space:nowrap;
  font-family:'Inter',system-ui,sans-serif;transition:.2s;
}
.pp-otp-btn:hover{opacity:.9;transform:translateY(-1px);}
.pp-otp-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}

.pp-otp-verify-section{display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:10px;background:rgba(124,58,237,0.03);border:1px solid rgba(124,58,237,0.08);}
.pp-otp-hint{font-size:.76rem;color:#66708a;font-weight:500;}
.pp-otp-boxes{display:flex;gap:6px;justify-content:center;}
.pp-otp-box{
  width:42px;height:48px;border-radius:10px;text-align:center;font-size:1.3rem;font-weight:800;
  font-family:'Inter',sans-serif;color:#15192d;outline:none;
  background:rgba(255,255,255,0.9);border:2px solid rgba(124,58,237,0.15);transition:.2s;
}
.pp-otp-box:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
.pp-otp-filled{border-color:rgba(124,58,237,0.5);background:rgba(124,58,237,0.04);}
.pp-otp-meta{display:flex;justify-content:space-between;align-items:center;font-size:.74rem;}
.pp-otp-timer{color:#66708a;font-weight:600;}
.pp-otp-expired{color:#ef4444;font-weight:600;}
.pp-otp-resend{color:#7c3aed;font-weight:700;cursor:pointer;}
.pp-otp-resend:hover{text-decoration:underline;}

/* Language chips */
.pp-chips-wrap{
  display:flex;flex-wrap:wrap;gap:6px;padding:6px 10px;min-height:40px;
  border-radius:10px;border:1px solid rgba(124,58,237,0.15);
  background:rgba(255,255,255,0.9);align-items:center;cursor:text;
}
.pp-chip{
  display:inline-flex;align-items:center;gap:4px;
  padding:3px 10px;border-radius:16px;font-size:.78rem;font-weight:600;
  background:linear-gradient(135deg,rgba(124,58,237,0.12),rgba(6,182,212,0.1));
  color:#7c3aed;
}
.pp-chip-x{border:none;background:none;color:#7c3aed;font-size:1rem;cursor:pointer;line-height:1;padding:0 2px;}
.pp-chip-input{border:none;outline:none;background:none;flex:1;min-width:100px;font-size:.85rem;font-family:'Inter',system-ui,sans-serif;color:#15192d;}
.pp-chip-input::placeholder{color:#a0a8c0;}

.pp-lang-drop{
  position:absolute;top:100%;left:0;right:0;z-index:10;
  max-height:180px;overflow-y:auto;margin-top:4px;
  background:#fff;border:1px solid rgba(124,58,237,0.15);
  border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.08);
}
.pp-lang-opt{padding:8px 14px;font-size:.85rem;cursor:pointer;transition:.15s;}
.pp-lang-opt:hover{background:rgba(124,58,237,0.06);}

/* Error / Success */
.pp-error{padding:10px 14px;border-radius:10px;font-size:.84rem;font-weight:500;background:rgba(239,68,68,0.08);color:#dc2626;border:1px solid rgba(239,68,68,0.15);}
.pp-success{padding:10px 14px;border-radius:10px;font-size:.84rem;font-weight:500;background:rgba(34,197,94,0.08);color:#16a34a;border:1px solid rgba(34,197,94,0.15);}

/* Submit */
.pp-submit-row{display:flex;justify-content:flex-end;padding-top:4px;gap:12px;}
/* Save Draft button */
.pp-custom-place-link{
  font-size:.78rem;color:#7c3aed;cursor:pointer;font-weight:600;
  transition:.2s;user-select:none;
}
.pp-custom-place-link:hover{text-decoration:underline;color:#6d28d9;}

.pp-draft-btn{
  height:46px;padding:0 24px;border:2px solid rgba(124,58,237,0.3);border-radius:12px;
  background:transparent;color:#7c3aed;
  font-weight:700;font-size:.88rem;cursor:pointer;
  font-family:'Inter',system-ui,sans-serif;transition:.2s;
}
.pp-draft-btn:hover{background:rgba(124,58,237,0.06);border-color:#7c3aed;}
.pp-draft-btn:disabled{opacity:.4;cursor:not-allowed;}

.pp-submit-btn{
  height:46px;padding:0 36px;border:none;border-radius:12px;
  background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;
  font-weight:700;font-size:.95rem;cursor:pointer;
  font-family:'Inter',system-ui,sans-serif;
  box-shadow:0 6px 20px rgba(124,58,237,0.2);transition:.2s;
}
.pp-submit-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(124,58,237,0.3);}
.pp-submit-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}

/* Responsive */
@media(max-width:720px){
  .pp{padding:12px;}
  .pp-grid{grid-template-columns:1fr;}
  .pp-left{border-right:none;border-bottom:1px solid rgba(124,58,237,0.08);padding:20px;flex-direction:column;gap:12px;align-items:center;}
  .pp-photo-area{width:140px;height:140px;flex:none;}
  .pp-camera-wrap{width:140px;height:200px;}
  .pp-usertype-group{flex-direction:row;flex-wrap:wrap;}
  .pp-usertype-btn{flex:1;min-width:0;text-align:center;padding:8px 6px;font-size:.75rem;}
  .pp-right{padding:18px 16px;}
  .pp-row{grid-template-columns:1fr;}
  .pp-row > .pp-field[style*="grid-column"]{grid-column:span 1!important;}
  .pp-submit-btn{width:100%;}
  .pp-otp-box{width:36px;height:42px;font-size:1.1rem;}
}
`;a.s(["default",()=>j])}];

//# sourceMappingURL=apps_web_src_app_%5Blocale%5D_profile_page_tsx_509b0f89._.js.map