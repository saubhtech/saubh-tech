(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,20570,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"warnOnce",{enumerable:!0,get:function(){return a}});let a=e=>{}},91376,(e,r,i)=>{"use strict";function a({widthInt:e,heightInt:r,blurWidth:i,blurHeight:a,blurDataURL:s,objectFit:t}){let n=i?40*i:e,l=a?40*a:r,d=n&&l?`viewBox='0 0 ${n} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${d}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${d?"none":"contain"===t?"xMidYMid":"cover"===t?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${s}'/%3E%3C/svg%3E`}Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"getImageBlurSvg",{enumerable:!0,get:function(){return a}})},63977,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var a={VALID_LOADERS:function(){return t},imageConfigDefault:function(){return n}};for(var s in a)Object.defineProperty(i,s,{enumerable:!0,get:a[s]});let t=["default","imgix","cloudinary","akamai","custom"],n={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumRedirects:3,maximumResponseBody:5e7,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1}},9698,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"getImgProps",{enumerable:!0,get:function(){return o}}),e.r(20570);let a=e.r(19210),s=e.r(91376),t=e.r(63977),n=["-moz-initial","fill","none","scale-down",void 0];function l(e){return void 0!==e.default}function d(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function o({src:e,sizes:r,unoptimized:i=!1,priority:o=!1,preload:c=!1,loading:p,className:x,quality:f,width:u,height:g,fill:b=!1,style:h,overrideSrc:m,onLoad:v,onLoadingComplete:j,placeholder:y="empty",blurDataURL:N,fetchPriority:w,decoding:k="async",layout:S,objectFit:P,objectPosition:_,lazyBoundary:O,lazyRoot:C,...z},E){var q;let R,D,M,{imgConf:I,showAltText:A,blurComplete:$,defaultLoader:T}=E,F=I||t.imageConfigDefault;if("allSizes"in F)R=F;else{let e=[...F.deviceSizes,...F.imageSizes].sort((e,r)=>e-r),r=F.deviceSizes.sort((e,r)=>e-r),i=F.qualities?.sort((e,r)=>e-r);R={...F,allSizes:e,deviceSizes:r,qualities:i}}if(void 0===T)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let B=z.loader||T;delete z.loader,delete z.srcSet;let L="__next_img_default"in B;if(L){if("custom"===R.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=B;B=r=>{let{config:i,...a}=r;return e(a)}}if(S){"fill"===S&&(b=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[S];e&&(h={...h,...e});let i={responsive:"100vw",fill:"100vw"}[S];i&&!r&&(r=i)}let V="",G=d(u),W=d(g);if((q=e)&&"object"==typeof q&&(l(q)||void 0!==q.src)){let r=l(e)?e.default:e;if(!r.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(r)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!r.height||!r.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(r)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(D=r.blurWidth,M=r.blurHeight,N=N||r.blurDataURL,V=r.src,!b)if(G||W){if(G&&!W){let e=G/r.width;W=Math.round(r.height*e)}else if(!G&&W){let e=W/r.height;G=Math.round(r.width*e)}}else G=r.width,W=r.height}let U=!o&&!c&&("lazy"===p||void 0===p);(!(e="string"==typeof e?e:V)||e.startsWith("data:")||e.startsWith("blob:"))&&(i=!0,U=!1),R.unoptimized&&(i=!0),L&&!R.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(i=!0);let H=d(f),X=Object.assign(b?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:P,objectPosition:_}:{},A?{}:{color:"transparent"},h),K=$||"empty"===y?null:"blur"===y?`url("data:image/svg+xml;charset=utf-8,${(0,s.getImageBlurSvg)({widthInt:G,heightInt:W,blurWidth:D,blurHeight:M,blurDataURL:N||"",objectFit:X.objectFit})}")`:`url("${y}")`,J=n.includes(X.objectFit)?"fill"===X.objectFit?"100% 100%":"cover":X.objectFit,Y=K?{backgroundSize:J,backgroundPosition:X.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:K}:{},Q=function({config:e,src:r,unoptimized:i,width:s,quality:t,sizes:n,loader:l}){if(i){let e=(0,a.getDeploymentId)();if(r.startsWith("/")&&!r.startsWith("//")&&e){let i=r.includes("?")?"&":"?";r=`${r}${i}dpl=${e}`}return{src:r,srcSet:void 0,sizes:void 0}}let{widths:d,kind:o}=function({deviceSizes:e,allSizes:r},i,a){if(a){let i=/(^|\s)(1?\d?\d)vw/g,s=[];for(let e;e=i.exec(a);)s.push(parseInt(e[2]));if(s.length){let i=.01*Math.min(...s);return{widths:r.filter(r=>r>=e[0]*i),kind:"w"}}return{widths:r,kind:"w"}}return"number"!=typeof i?{widths:e,kind:"w"}:{widths:[...new Set([i,2*i].map(e=>r.find(r=>r>=e)||r[r.length-1]))],kind:"x"}}(e,s,n),c=d.length-1;return{sizes:n||"w"!==o?n:"100vw",srcSet:d.map((i,a)=>`${l({config:e,src:r,quality:t,width:i})} ${"w"===o?i:a+1}${o}`).join(", "),src:l({config:e,src:r,quality:t,width:d[c]})}}({config:R,src:e,unoptimized:i,width:G,quality:H,sizes:r,loader:B}),Z=U?"lazy":p;return{props:{...z,loading:Z,fetchPriority:w,width:G,height:W,decoding:k,className:x,style:{...X,...Y},sizes:Q.sizes,srcSet:Q.srcSet,src:m||Q.src},meta:{unoptimized:i,preload:c||o,placeholder:y,fill:b}}}},44246,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"default",{enumerable:!0,get:function(){return l}});let a=e.r(5034),s="u"<typeof window,t=s?()=>{}:a.useLayoutEffect,n=s?()=>{}:a.useEffect;function l(e){let{headManager:r,reduceComponentsToState:i}=e;function l(){if(r&&r.mountedInstances){let e=a.Children.toArray(Array.from(r.mountedInstances).filter(Boolean));r.updateHead(i(e))}}return s&&(r?.mountedInstances?.add(e.children),l()),t(()=>(r?.mountedInstances?.add(e.children),()=>{r?.mountedInstances?.delete(e.children)})),t(()=>(r&&(r._pendingUpdate=l),()=>{r&&(r._pendingUpdate=l)})),n(()=>(r&&r._pendingUpdate&&(r._pendingUpdate(),r._pendingUpdate=null),()=>{r&&r._pendingUpdate&&(r._pendingUpdate(),r._pendingUpdate=null)})),null}},71281,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var a={default:function(){return g},defaultHead:function(){return p}};for(var s in a)Object.defineProperty(i,s,{enumerable:!0,get:a[s]});let t=e.r(81258),n=e.r(44066),l=e.r(14270),d=n._(e.r(5034)),o=t._(e.r(44246)),c=e.r(62402);function p(){return[(0,l.jsx)("meta",{charSet:"utf-8"},"charset"),(0,l.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function x(e,r){return"string"==typeof r||"number"==typeof r?e:r.type===d.default.Fragment?e.concat(d.default.Children.toArray(r.props.children).reduce((e,r)=>"string"==typeof r||"number"==typeof r?e:e.concat(r),[])):e.concat(r)}e.r(20570);let f=["name","httpEquiv","charSet","itemProp"];function u(e){let r,i,a,s;return e.reduce(x,[]).reverse().concat(p().reverse()).filter((r=new Set,i=new Set,a=new Set,s={},e=>{let t=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;let i=e.key.slice(e.key.indexOf("$")+1);r.has(i)?t=!1:r.add(i)}switch(e.type){case"title":case"base":i.has(e.type)?t=!1:i.add(e.type);break;case"meta":for(let r=0,i=f.length;r<i;r++){let i=f[r];if(e.props.hasOwnProperty(i))if("charSet"===i)a.has(i)?t=!1:a.add(i);else{let r=e.props[i],a=s[i]||new Set;("name"!==i||!n)&&a.has(r)?t=!1:(a.add(r),s[i]=a)}}}return t})).reverse().map((e,r)=>{let i=e.key||r;return d.default.cloneElement(e,{key:i})})}let g=function({children:e}){let r=(0,d.useContext)(c.HeadManagerContext);return(0,l.jsx)(o.default,{reduceComponentsToState:u,headManager:r,children:e})};("function"==typeof i.default||"object"==typeof i.default&&null!==i.default)&&void 0===i.default.__esModule&&(Object.defineProperty(i.default,"__esModule",{value:!0}),Object.assign(i.default,i),r.exports=i.default)},48741,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"ImageConfigContext",{enumerable:!0,get:function(){return t}});let a=e.r(81258)._(e.r(5034)),s=e.r(63977),t=a.default.createContext(s.imageConfigDefault)},3565,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"RouterContext",{enumerable:!0,get:function(){return a}});let a=e.r(81258)._(e.r(5034)).default.createContext(null)},6747,(e,r,i)=>{"use strict";function a(e,r){let i=e||75;return r?.qualities?.length?r.qualities.reduce((e,r)=>Math.abs(r-i)<Math.abs(e-i)?r:e,0):i}Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"findClosestQuality",{enumerable:!0,get:function(){return a}})},31565,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"default",{enumerable:!0,get:function(){return n}});let a=e.r(6747),s=e.r(19210);function t({config:e,src:r,width:i,quality:t}){if(r.startsWith("/")&&r.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${r}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let n=(0,a.findClosestQuality)(t,e),l=(0,s.getDeploymentId)();return`${e.path}?url=${encodeURIComponent(r)}&w=${i}&q=${n}${r.startsWith("/")&&l?`&dpl=${l}`:""}`}t.__next_img_default=!0;let n=t},27929,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"useMergedRef",{enumerable:!0,get:function(){return s}});let a=e.r(5034);function s(e,r){let i=(0,a.useRef)(null),s=(0,a.useRef)(null);return(0,a.useCallback)(a=>{if(null===a){let e=i.current;e&&(i.current=null,e());let r=s.current;r&&(s.current=null,r())}else e&&(i.current=t(e,a)),r&&(s.current=t(r,a))},[e,r])}function t(e,r){if("function"!=typeof e)return e.current=r,()=>{e.current=null};{let i=e(r);return"function"==typeof i?i:()=>e(null)}}("function"==typeof i.default||"object"==typeof i.default&&null!==i.default)&&void 0===i.default.__esModule&&(Object.defineProperty(i.default,"__esModule",{value:!0}),Object.assign(i.default,i),r.exports=i.default)},49439,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0}),Object.defineProperty(i,"Image",{enumerable:!0,get:function(){return j}});let a=e.r(81258),s=e.r(44066),t=e.r(14270),n=s._(e.r(5034)),l=a._(e.r(81409)),d=a._(e.r(71281)),o=e.r(9698),c=e.r(63977),p=e.r(48741);e.r(20570);let x=e.r(3565),f=a._(e.r(31565)),u=e.r(27929),g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function b(e,r,i,a,s,t,n){let l=e?.src;e&&e["data-loaded-src"]!==l&&(e["data-loaded-src"]=l,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==r&&s(!0),i?.current){let r=new Event("load");Object.defineProperty(r,"target",{writable:!1,value:e});let a=!1,s=!1;i.current({...r,nativeEvent:r,currentTarget:e,target:e,isDefaultPrevented:()=>a,isPropagationStopped:()=>s,persist:()=>{},preventDefault:()=>{a=!0,r.preventDefault()},stopPropagation:()=>{s=!0,r.stopPropagation()}})}a?.current&&a.current(e)}}))}function h(e){return n.use?{fetchPriority:e}:{fetchpriority:e}}"u"<typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let m=(0,n.forwardRef)(({src:e,srcSet:r,sizes:i,height:a,width:s,decoding:l,className:d,style:o,fetchPriority:c,placeholder:p,loading:x,unoptimized:f,fill:g,onLoadRef:m,onLoadingCompleteRef:v,setBlurComplete:j,setShowAltText:y,sizesInput:N,onLoad:w,onError:k,...S},P)=>{let _=(0,n.useCallback)(e=>{e&&(k&&(e.src=e.src),e.complete&&b(e,p,m,v,j,f,N))},[e,p,m,v,j,k,f,N]),O=(0,u.useMergedRef)(P,_);return(0,t.jsx)("img",{...S,...h(c),loading:x,width:s,height:a,decoding:l,"data-nimg":g?"fill":"1",className:d,style:o,sizes:i,srcSet:r,src:e,ref:O,onLoad:e=>{b(e.currentTarget,p,m,v,j,f,N)},onError:e=>{y(!0),"empty"!==p&&j(!0),k&&k(e)}})});function v({isAppRouter:e,imgAttributes:r}){let i={as:"image",imageSrcSet:r.srcSet,imageSizes:r.sizes,crossOrigin:r.crossOrigin,referrerPolicy:r.referrerPolicy,...h(r.fetchPriority)};return e&&l.default.preload?(l.default.preload(r.src,i),null):(0,t.jsx)(d.default,{children:(0,t.jsx)("link",{rel:"preload",href:r.srcSet?void 0:r.src,...i},"__nimg-"+r.src+r.srcSet+r.sizes)})}let j=(0,n.forwardRef)((e,r)=>{let i=(0,n.useContext)(x.RouterContext),a=(0,n.useContext)(p.ImageConfigContext),s=(0,n.useMemo)(()=>{let e=g||a||c.imageConfigDefault,r=[...e.deviceSizes,...e.imageSizes].sort((e,r)=>e-r),i=e.deviceSizes.sort((e,r)=>e-r),s=e.qualities?.sort((e,r)=>e-r);return{...e,allSizes:r,deviceSizes:i,qualities:s,localPatterns:"u"<typeof window?a?.localPatterns:e.localPatterns}},[a]),{onLoad:l,onLoadingComplete:d}=e,u=(0,n.useRef)(l);(0,n.useEffect)(()=>{u.current=l},[l]);let b=(0,n.useRef)(d);(0,n.useEffect)(()=>{b.current=d},[d]);let[h,j]=(0,n.useState)(!1),[y,N]=(0,n.useState)(!1),{props:w,meta:k}=(0,o.getImgProps)(e,{defaultLoader:f.default,imgConf:s,blurComplete:h,showAltText:y});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(m,{...w,unoptimized:k.unoptimized,placeholder:k.placeholder,fill:k.fill,onLoadRef:u,onLoadingCompleteRef:b,setBlurComplete:j,setShowAltText:N,sizesInput:e.sizes,ref:r}),k.preload?(0,t.jsx)(v,{isAppRouter:!i,imgAttributes:w}):null]})});("function"==typeof i.default||"object"==typeof i.default&&null!==i.default)&&void 0===i.default.__esModule&&(Object.defineProperty(i.default,"__esModule",{value:!0}),Object.assign(i.default,i),r.exports=i.default)},48098,(e,r,i)=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});var a={default:function(){return c},getImageProps:function(){return o}};for(var s in a)Object.defineProperty(i,s,{enumerable:!0,get:a[s]});let t=e.r(81258),n=e.r(9698),l=e.r(49439),d=t._(e.r(31565));function o(e){let{props:r}=(0,n.getImgProps)(e,{defaultLoader:d.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,i]of Object.entries(r))void 0===i&&delete r[e];return{props:r}}let c=l.Image},62253,(e,r,i)=>{r.exports=e.r(48098)},39665,e=>{"use strict";var r=e.i(14270),i=e.i(5034),a=e.i(88473),s=e.i(62253);function t(e){let r=document.cookie.match(RegExp(`(?:^|; )${e}=([^;]*)`));return r?decodeURIComponent(r[1]):null}function n(e){document.cookie=`${e}=; path=/; max-age=0; SameSite=Lax`}function l(){let{locale:e}=(0,a.useParams)(),l=(0,a.useRouter)(),[d,o]=(0,i.useState)(null),[c,p]=(0,i.useState)(!0),[x,f]=(0,i.useState)("requirements"),[u,g]=(0,i.useState)(!0);return((0,i.useEffect)(()=>{let r=t("saubh_token"),i=t("saubh_user");if(!r||!i)return void l.replace(`/${e}/login`);try{o(JSON.parse(i))}catch{l.replace(`/${e}/login`);return}p(!1)},[e,l]),c||!d)?(0,r.jsx)("div",{style:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#05070d",color:"#fff"},children:(0,r.jsx)("div",{className:"db-spinner"})}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("style",{children:`
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
      `}),(0,r.jsxs)("div",{className:"db",children:[(0,r.jsx)("div",{className:"db-side-overlay",style:{display:"none"},onClick:()=>g(!1)}),(0,r.jsxs)("aside",{className:`db-side${u?" open":""}`,children:[(0,r.jsxs)("div",{className:"db-brand",children:[(0,r.jsx)(s.default,{src:"/logo.jpg",alt:"Saubh.Tech",width:36,height:36,className:"db-brand-icon"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h1",{children:"Saubh.Tech"}),(0,r.jsx)("small",{children:"Gig Marketplace"})]})]}),(0,r.jsxs)("div",{className:"db-user-card",children:[(0,r.jsx)("div",{className:"db-user-av",children:d.fname.charAt(0).toUpperCase()}),(0,r.jsxs)("div",{children:[(0,r.jsx)("div",{className:"db-user-name",children:d.fname}),(0,r.jsx)("div",{className:"db-user-type",children:"BO"===d.usertype?"Business Owner":"CL"===d.usertype?"Client":"Gig Worker"})]}),(0,r.jsx)("button",{className:"db-user-logout",onClick:()=>{n("saubh_token"),n("saubh_user"),l.replace(`/${e}/login`)},title:"Logout",children:"⏻"})]}),(0,r.jsxs)("div",{className:"db-seg",children:[(0,r.jsx)("button",{className:"requirements"===x?"active":"",onClick:()=>f("requirements"),children:"📋 Requirements"}),(0,r.jsx)("button",{className:"offerings"===x?"active":"",onClick:()=>f("offerings"),children:"🧰 Offerings"})]}),(0,r.jsxs)("div",{className:"db-block",children:[(0,r.jsx)("p",{className:"db-block-title",children:"🔎 Filter"}),(0,r.jsxs)("div",{className:"db-filters",children:[(0,r.jsxs)("div",{className:"db-fchip",children:[(0,r.jsxs)("label",{children:[(0,r.jsx)("span",{children:"🏷️"}),(0,r.jsx)("span",{children:"Sector"})]}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Sector"})})]}),(0,r.jsxs)("div",{className:"db-fchip",children:[(0,r.jsxs)("label",{children:[(0,r.jsx)("span",{children:"🧩"}),(0,r.jsx)("span",{children:"Field"})]}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Field"})})]}),(0,r.jsxs)("div",{className:"db-fchip",children:[(0,r.jsxs)("label",{children:[(0,r.jsx)("span",{children:"📦"}),(0,r.jsx)("span",{children:"Product"})]}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Product"})})]}),(0,r.jsxs)("div",{className:"db-fchip",children:[(0,r.jsxs)("label",{children:[(0,r.jsx)("span",{children:"🧰"}),(0,r.jsx)("span",{children:"Service"})]}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Service"})})]}),(0,r.jsxs)("div",{className:"db-fchip",children:[(0,r.jsxs)("label",{children:[(0,r.jsx)("span",{children:"🌍"}),(0,r.jsx)("span",{children:"Country"})]}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Country"})})]}),(0,r.jsxs)("div",{className:"db-fchip",children:[(0,r.jsxs)("label",{children:[(0,r.jsx)("span",{children:"🗺️"}),(0,r.jsx)("span",{children:"State"})]}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" State"})})]}),(0,r.jsxs)("div",{className:"db-fchip",children:[(0,r.jsxs)("label",{children:[(0,r.jsx)("span",{children:"📍"}),(0,r.jsx)("span",{children:"District"})]}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" District"})})]}),(0,r.jsxs)("div",{className:"db-fchip",children:[(0,r.jsxs)("label",{children:[(0,r.jsx)("span",{children:"🏤"}),(0,r.jsx)("span",{children:"Post code"})]}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Post code"})})]}),(0,r.jsxs)("div",{className:"db-fchip",children:[(0,r.jsxs)("label",{children:[(0,r.jsx)("span",{children:"📌"}),(0,r.jsx)("span",{children:"Place"})]}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Place"})})]}),(0,r.jsxs)("div",{className:"db-checks",children:[(0,r.jsxs)("label",{className:"db-check",children:[(0,r.jsx)("input",{type:"checkbox",defaultChecked:!0})," ✅ Verified"]}),(0,r.jsxs)("label",{className:"db-check",children:[(0,r.jsx)("input",{type:"checkbox"})," ⭐ Top Rated"]})]}),(0,r.jsxs)("div",{className:"db-range",children:[(0,r.jsx)("label",{style:{fontSize:"10px",color:"var(--muted)",display:"block",marginBottom:"4px"},children:"💰 Budget Range"}),(0,r.jsx)("div",{style:{fontSize:"11px",color:"#e5e7eb"},children:"₹1.00 to ₹999K"}),(0,r.jsx)("div",{className:"db-range-bar","aria-label":"Bar Slide"}),(0,r.jsx)("div",{style:{fontSize:"10px",color:"var(--muted)"},children:"Bar Slide."})]})]})]}),(0,r.jsx)("div",{className:"db-block",children:(0,r.jsxs)("div",{className:"db-minilinks",children:[(0,r.jsx)("button",{className:"db-minilink",onClick:()=>l.push(`/${e}/gig`),children:"🚀 Gig"}),(0,r.jsx)("button",{className:"db-minilink",children:"💸 Income"}),(0,r.jsx)("button",{className:"db-minilink",children:"🧾 My Bids"}),(0,r.jsx)("button",{className:"db-minilink",children:"🛡️ Escrow Money"})]})})]}),(0,r.jsxs)("main",{className:"db-main",children:[(0,r.jsxs)("div",{className:"db-topbar",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("button",{className:"db-menu-toggle",onClick:()=>g(!u),children:"☰"}),(0,r.jsx)("h2",{className:"db-top-h2",children:"🚀 Gig Marketplace"}),(0,r.jsx)("p",{className:"db-top-sub",children:"|| Real Clients || Verified Providers || Secured Payments ||"})]}),(0,r.jsxs)("div",{className:"db-top-pills",children:[(0,r.jsx)("div",{className:"db-pill",style:{cursor:"pointer"},onClick:()=>l.push(`/${e}/gig`),children:"🚀 Gig"}),(0,r.jsx)("div",{className:"db-pill",children:"💸 Income"}),(0,r.jsx)("div",{className:"db-pill",children:"🧾 My Bids"}),(0,r.jsx)("div",{className:"db-pill",children:"🛡️ Escrow Money"})]})]}),(0,r.jsxs)("section",{className:"db-hero",children:[(0,r.jsxs)("div",{className:"db-hero-tabs",children:[(0,r.jsx)("button",{className:`db-htab${"requirements"===x?" active":""}`,onClick:()=>f("requirements"),children:"📋 Requirements"}),(0,r.jsx)("button",{className:`db-htab${"offerings"===x?" active":""}`,onClick:()=>f("offerings"),children:"🧰 Offerings"})]}),(0,r.jsxs)("div",{className:"db-search",children:[(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"🏷️ Sector"}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Sector"})})]}),(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"🧩 Field"}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Field"})})]}),(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"📦 Product"}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Product"})})]}),(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"🧰 Service"}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Service"})})]}),(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"🌍 Country"}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Country"})})]}),(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"🗺️ State"}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" State"})})]}),(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"📍 District"}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" District"})})]}),(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"🏤 Post Code"}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Post Code"})})]}),(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"📌 Place"}),(0,r.jsx)("select",{children:(0,r.jsx)("option",{children:" Place"})})]}),(0,r.jsxs)("div",{className:"ctrl",children:[(0,r.jsx)("label",{children:"🔑 Search"}),(0,r.jsx)("input",{defaultValue:"Key Word"})]}),(0,r.jsx)("button",{className:"db-search-btn",children:"🔍 Search"}),(0,r.jsxs)("div",{className:"db-hero-label",children:["🪄 ","requirements"===x?"Requirements":"Offerings"]})]})]}),(0,r.jsxs)("section",{className:"db-content",children:["requirements"===x&&(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)("article",{className:"req-card",children:[(0,r.jsx)("div",{className:"req-head",children:(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{className:"req-rating",children:["⭐ 4.8 ",(0,r.jsx)("span",{style:{color:"var(--muted)",fontWeight:600},children:"(56)"})]}),(0,r.jsxs)("div",{className:"req-provider",children:[(0,r.jsx)("div",{className:"req-av",children:"CN"}),(0,r.jsx)("div",{className:"req-cname",children:"👤 Client Name"}),(0,r.jsxs)("div",{className:"req-badges",children:[(0,r.jsx)("span",{className:"badge badge-dv",children:"🛡️ DV"}),(0,r.jsx)("span",{className:"badge badge-pv",children:"✅ PV"})]})]})]})}),(0,r.jsx)("div",{className:"req-title",children:"Required Web Developer"}),(0,r.jsxs)("div",{className:"req-meta",children:[(0,r.jsx)("span",{className:"meta-pill",children:"🧰 Service"}),(0,r.jsx)("span",{className:"meta-pill",children:"📄 read"}),(0,r.jsx)("span",{className:"meta-pill",children:"🎬 view"})]}),(0,r.jsx)("div",{className:"req-subtitle",children:"E-Commerce Website for Fashion Brand"}),(0,r.jsxs)("p",{className:"req-desc",children:["Need experienced developer for Shopify custom e-commerce with …",(0,r.jsx)("a",{href:"#",className:"view-more",children:"<view more>"})]}),(0,r.jsxs)("div",{className:"req-grid",children:[(0,r.jsxs)("div",{className:"req-col",children:[(0,r.jsx)("h5",{children:"🚚 Delivery"}),(0,r.jsxs)("div",{className:"req-col-stack",children:[(0,r.jsx)("div",{children:"🏢 Physical"}),(0,r.jsx)("div",{children:"💻 Digital"})]})]}),(0,r.jsxs)("div",{className:"req-col",children:[(0,r.jsx)("h5",{children:"📍 Location"}),(0,r.jsxs)("div",{className:"req-col-stack",children:[(0,r.jsx)("div",{children:"Country"}),(0,r.jsx)("div",{children:"State"}),(0,r.jsx)("div",{children:"District"}),(0,r.jsx)("div",{children:"Postal code"}),(0,r.jsx)("div",{children:"Place"})]})]}),(0,r.jsxs)("div",{className:"req-col",children:[(0,r.jsx)("h5",{children:"✅ Eligibility"}),(0,r.jsxs)("div",{className:"req-col-stack",children:[(0,r.jsx)("div",{children:"Experience >1 yr"}),(0,r.jsx)("div",{className:"muted",children:"Must be resident"}),(0,r.jsx)("div",{className:"muted",children:"of"}),(0,r.jsx)("div",{children:"Patna"})]})]}),(0,r.jsxs)("div",{className:"req-col",children:[(0,r.jsx)("h5",{children:"💰 Budget"}),(0,r.jsxs)("div",{className:"req-col-stack",children:[(0,r.jsx)("div",{children:"₹50K approx."}),(0,r.jsx)("div",{children:"Escrow"}),(0,r.jsx)("div",{children:"₹20K paid"}),(0,r.jsx)("div",{children:"Deadline"}),(0,r.jsx)("div",{children:"26.02.2026"})]})]}),(0,r.jsxs)("div",{className:"req-col",children:[(0,r.jsx)("h5",{children:"🧾 Bids"}),(0,r.jsxs)("div",{className:"req-col-stack",children:[(0,r.jsx)("div",{children:"Total"}),(0,r.jsx)("div",{style:{fontSize:"18px",lineHeight:1},children:"12"}),(0,r.jsx)("button",{className:"bid-btn",children:"<Bid now>"})]})]})]}),(0,r.jsxs)("div",{className:"actions-row",children:[(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"📞 Call"}),(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"💬 Chat"}),(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"🎥 Video"}),(0,r.jsxs)("span",{className:"live-badge live-on",children:[(0,r.jsx)("span",{className:"blink"}),"Live"]})]})]})}),"offerings"===x&&(0,r.jsxs)("div",{className:"off-grid",children:[(0,r.jsxs)("article",{className:"off-card",children:[(0,r.jsxs)("div",{className:"off-provider",children:[(0,r.jsx)("div",{className:"off-av",style:{background:"linear-gradient(135deg,#f472b6,#60a5fa)"},children:"AS"}),(0,r.jsxs)("div",{className:"off-meta",children:[(0,r.jsxs)("div",{className:"req-rating",children:["⭐ 4.8 ",(0,r.jsx)("span",{style:{color:"var(--muted)",fontWeight:600},children:"(156)"})]}),(0,r.jsx)("div",{className:"off-name",children:"👤 Ananya Sharma"}),(0,r.jsxs)("div",{className:"req-badges",children:[(0,r.jsx)("span",{className:"badge badge-dv",children:"🛡️ DV"}),(0,r.jsx)("span",{className:"badge badge-pv",children:"✅ PV"})]}),(0,r.jsx)("div",{className:"off-sub",children:"Full-Stack Developer"})]})]}),(0,r.jsxs)("div",{className:"req-meta",children:[(0,r.jsx)("span",{className:"meta-pill",children:"🧰 Service"}),(0,r.jsx)("span",{className:"meta-pill",children:"📄 read"}),(0,r.jsx)("span",{className:"meta-pill",children:"🎬 view"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h4",{className:"off-title",children:"Offered Custom Web App & SaaS Development"}),(0,r.jsxs)("p",{className:"off-desc",children:["Full-stack web applications using Next.js, React, Node.js.",(0,r.jsx)("a",{href:"#",className:"view-more",children:"<more...>"})]})]}),(0,r.jsxs)("div",{className:"mode-row",children:[(0,r.jsx)("span",{className:"meta-pill",children:"🚚 Delivery:"}),(0,r.jsx)("span",{className:"meta-pill",children:"🏢 Physical"}),(0,r.jsx)("span",{className:"meta-pill",children:"💻 Digital"})]}),(0,r.jsxs)("div",{className:"actions-row",children:[(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"📞 Call"}),(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"💬 Chat"}),(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"🎥 Video"}),(0,r.jsxs)("span",{className:"live-badge live-on",children:[(0,r.jsx)("span",{className:"blink"}),"Live"]})]})]}),(0,r.jsxs)("article",{className:"off-card",children:[(0,r.jsxs)("div",{className:"off-provider",children:[(0,r.jsx)("div",{className:"off-av",style:{background:"linear-gradient(135deg,#34d399,#3b82f6)"},children:"AK"}),(0,r.jsxs)("div",{className:"off-meta",children:[(0,r.jsxs)("div",{className:"req-rating",children:["⭐ 4.8 ",(0,r.jsx)("span",{style:{color:"var(--muted)",fontWeight:600},children:"(156)"})]}),(0,r.jsx)("div",{className:"off-name",children:"👤 Ananya Sharma"}),(0,r.jsxs)("div",{className:"req-badges",children:[(0,r.jsx)("span",{className:"badge badge-dv",children:"🛡️ DV"}),(0,r.jsx)("span",{className:"badge badge-pv",children:"✅ PV"})]}),(0,r.jsx)("div",{className:"off-sub",children:"Full-Stack Developer"})]})]}),(0,r.jsxs)("div",{className:"req-meta",children:[(0,r.jsx)("span",{className:"meta-pill",children:"🧰 Service"}),(0,r.jsx)("span",{className:"meta-pill",children:"📄 read"}),(0,r.jsx)("span",{className:"meta-pill",children:"🎬 view"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h4",{className:"off-title",children:"Offered Custom Web App & SaaS Development"}),(0,r.jsxs)("p",{className:"off-desc",children:["Full-stack web applications using Next.js, React, Node.js.",(0,r.jsx)("a",{href:"#",className:"view-more",children:"<more...>"})]})]}),(0,r.jsxs)("div",{className:"mode-row",children:[(0,r.jsx)("span",{className:"meta-pill",children:"🚚 Delivery:"}),(0,r.jsx)("span",{className:"meta-pill",children:"🏢 Physical"}),(0,r.jsx)("span",{className:"meta-pill",children:"💻 Digital"})]}),(0,r.jsxs)("div",{className:"actions-row",children:[(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"📞 Call"}),(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"💬 Chat"}),(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"🎥 Video"}),(0,r.jsx)("span",{className:"live-badge live-off",children:"🔴 Off/Away"})]})]}),(0,r.jsxs)("article",{className:"off-card",children:[(0,r.jsxs)("div",{className:"off-provider",children:[(0,r.jsx)("div",{className:"off-av",style:{background:"linear-gradient(135deg,#f59e0b,#ef4444)"},children:"NS"}),(0,r.jsxs)("div",{className:"off-meta",children:[(0,r.jsxs)("div",{className:"req-rating",children:["⭐ 4.8 ",(0,r.jsx)("span",{style:{color:"var(--muted)",fontWeight:600},children:"(156)"})]}),(0,r.jsx)("div",{className:"off-name",children:"👤 Ananya Sharma"}),(0,r.jsxs)("div",{className:"req-badges",children:[(0,r.jsx)("span",{className:"badge badge-dv",children:"🛡️ DV"}),(0,r.jsx)("span",{className:"badge badge-pv",children:"✅ PV"})]}),(0,r.jsx)("div",{className:"off-sub",children:"Full-Stack Developer"})]})]}),(0,r.jsxs)("div",{className:"req-meta",children:[(0,r.jsx)("span",{className:"meta-pill",children:"🧰 Service"}),(0,r.jsx)("span",{className:"meta-pill",children:"📄 read"}),(0,r.jsx)("span",{className:"meta-pill",children:"🎬 view"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("h4",{className:"off-title",children:"Offered Custom Web App & SaaS Development"}),(0,r.jsxs)("p",{className:"off-desc",children:["Full-stack web applications using Next.js, React, Node.js.",(0,r.jsx)("a",{href:"#",className:"view-more",children:"<more...>"})]})]}),(0,r.jsxs)("div",{className:"mode-row",children:[(0,r.jsx)("span",{className:"meta-pill",children:"🚚 Delivery:"}),(0,r.jsx)("span",{className:"meta-pill",children:"🏢 Physical"}),(0,r.jsx)("span",{className:"meta-pill",children:"💻 Digital"})]}),(0,r.jsxs)("div",{className:"actions-row",children:[(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"📞 Call"}),(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"💬 Chat"}),(0,r.jsx)("button",{className:"icon-btn icon-btn-pri",children:"🎥 Video"}),(0,r.jsxs)("span",{className:"live-badge live-on",children:[(0,r.jsx)("span",{className:"blink"}),"Live"]})]})]})]}),(0,r.jsx)("div",{className:"db-pagination",children:(0,r.jsx)("div",{className:"db-page-chip",children:"<Pagination>"})}),(0,r.jsxs)("div",{className:"db-legend",children:[(0,r.jsx)("div",{className:"db-tag",children:"📦 Product"}),(0,r.jsx)("div",{className:"db-tag",children:"🧰 Service"}),(0,r.jsx)("div",{className:"db-tag",children:"🏢 Physical"}),(0,r.jsx)("div",{className:"db-tag",children:"💻 Digital"}),(0,r.jsx)("div",{className:"db-tag",children:"🔀 Phygital"}),(0,r.jsx)("div",{className:"db-tag",children:"✅ Digital Verified"}),(0,r.jsx)("div",{className:"db-tag",children:"✅ Physical Verified"}),(0,r.jsxs)("div",{className:"db-tag",children:[(0,r.jsx)("span",{className:"dot dot-live"}),"Live"]}),(0,r.jsxs)("div",{className:"db-tag",children:[(0,r.jsx)("span",{className:"dot dot-away"}),"Off/Away"]})]}),(0,r.jsx)("div",{className:"db-messages",children:"💬 Messages"})]})]})]})]})}e.s(["default",()=>l])}]);