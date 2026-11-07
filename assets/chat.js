(()=>{'use strict';
const api=(path,body)=>fetch(OKC_APP.rest+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(async r=>{const data=await r.json().catch(()=>({}));if(!r.ok)throw Error(data.message||'خطا در ارتباط با سرور');return data;});
const storeKey='okc_ai_session_v1';
let session=null;try{session=JSON.parse(sessionStorage.getItem(storeKey)||'null')}catch(e){}
const origin=new URL(OKC_APP.rest).origin;
function allowedLink(raw, allowExternal=false){try{const url=new URL(raw,origin);return url.protocol==='https:'&&(allowExternal||url.origin===origin)?url.href:null;}catch(e){return null}}
for(const widget of document.querySelectorAll('.okc-ai')){
 const launch=widget.querySelector('.okc-ai-launch'),panel=widget.querySelector('.okc-ai-panel'),close=widget.querySelector('.okc-ai-close'),register=widget.querySelector('.okc-ai-register'),conversation=widget.querySelector('.okc-ai-conversation'),leadForm=widget.querySelector('.okc-ai-leadform'),chatForm=widget.querySelector('.okc-ai-question'),messages=widget.querySelector('.okc-ai-messages'),status=widget.querySelector('.okc-ai-status'),field=chatForm.querySelector('textarea'),submit=chatForm.querySelector('button');
 let sending=false;
 function notify(message){status.textContent=message||''}
 function setRegistered(){register.hidden=true;conversation.hidden=false;notify('')}
 if(session&&/^[a-f0-9]{64}$/.test(session.token))setRegistered();
 launch?.addEventListener('click',()=>{panel.hidden=!panel.hidden;launch.setAttribute('aria-expanded',String(!panel.hidden))});
 close?.addEventListener('click',()=>{if(panel){panel.hidden=true;launch?.setAttribute('aria-expanded','false')}else window.location.href=OKC_APP.landing});
 leadForm.addEventListener('submit',async e=>{e.preventDefault();notify('در حال ثبت اطلاعات...');const b=leadForm.querySelector('button');b.disabled=true;
  try{const f=new FormData(leadForm);const data=await api('register',{full_name:f.get('full_name'),phone:f.get('phone'),website:f.get('website'),consent:f.get('consent')==='on',source:widget.dataset.source||'site'});session={token:data.token,name:data.name};sessionStorage.setItem(storeKey,JSON.stringify(session));setRegistered();}catch(err){notify(err.message)}finally{b.disabled=false}});
 function bubble(value,who){const el=document.createElement('div');el.className='okc-ai-bubble '+who;el.textContent=value;messages.appendChild(el);scrollToEnd();return el}
 function scrollToEnd(){messages.scrollTop=messages.scrollHeight}
 function group(title,className){const node=document.createElement('div');node.className='okc-ai-actions '+className;const caption=document.createElement('strong');caption.className='okc-ai-actions-label';caption.textContent=title;node.append(caption);messages.append(node);return node}
 function linkButton(holder,url,label,allowExternal=false){const safe=allowedLink(url,allowExternal);if(!safe)return;const a=document.createElement('a');a.className='okc-ai-action okc-ai-link-button';a.href=safe;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;holder.append(a)}
 function showLinks(data){const used=new Set(),links=[];
  if(Array.isArray(data.source_links))data.source_links.forEach(item=>{if(item&&typeof item.url==='string'){const url=allowedLink(item.url);if(url&&!used.has(url)){used.add(url);links.push({url,title:String(item.title||'مطالعه بیشتر')})}}});
  else if(Array.isArray(data.sources))data.sources.forEach(url=>{const safe=allowedLink(url);if(safe&&!used.has(safe)){used.add(safe);links.push({url:safe,title:'مطالعه منبع مرتبط'})}});
  if(links.length){const holder=group('صفحات پیشنهادی سایت','okc-ai-links');links.slice(0,4).forEach(l=>linkButton(holder,l.url,'مطالعه: '+l.title));}
  if(data.needs_review&&data.consult){const url=allowedLink(data.consult,true);if(url){const holder=group('راهنمایی اختصاصی','okc-ai-consult-actions');linkButton(holder,url,'دریافت مشاوره رایگان',true);}}
 }
 function showFollowups(data){if(!Array.isArray(data.followups)||!data.followups.length)return;const texts=[];
  data.followups.forEach(q=>{if(typeof q==='string'&&q.length>=8&&q.length<=160&&!texts.includes(q))texts.push(q)});
  if(!texts.length)return;
  const holder=group('سؤالات پیشنهادی برای ادامه گفتگو','okc-ai-followups');
  texts.slice(0,3).forEach(q=>{const b=document.createElement('button');b.type='button';b.className='okc-ai-action okc-ai-followup-button';b.textContent=q;b.addEventListener('click',()=>sendQuestion(q));holder.append(b)});
 }
 async function sendQuestion(raw){const value=String(raw||'').trim();if(!value||sending||!session?.token)return;
  sending=true;submit.disabled=true;field.disabled=true;field.value='';
  messages.querySelectorAll('.okc-ai-followups').forEach(n=>n.remove());
  bubble(value,'user');const loading=bubble('در حال بررسی اطلاعات...','assistant');notify('');
  try{const data=await api('chat',{token:session.token,question:value});loading.textContent=data.answer||'پاسخ قابل نمایش دریافت نشد.';showLinks(data);showFollowups(data);
  }catch(err){loading.textContent='در حال حاضر امکان پاسخ‌گویی وجود ندارد. می‌توانید از مشاوره رایگان استفاده کنید.';
   if(OKC_APP.consult&&allowedLink(OKC_APP.consult,true)){const holder=group('راهنمایی اختصاصی','okc-ai-consult-actions');linkButton(holder,OKC_APP.consult,'دریافت مشاوره رایگان',true)};notify(err.message);
  }finally{sending=false;submit.disabled=false;field.disabled=false;scrollToEnd()}
 }
 chatForm.addEventListener('submit',e=>{e.preventDefault();sendQuestion(field.value)});
 }
})();