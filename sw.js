const V='pm-v6';
const CORE=['/','/index.html','/manifest.webmanifest','/icon-192.png','/icon-512.png','/icon-maskable-512.png','/icon-180.png','/icon-32.png','/favicon.ico'];
const EXT=[
 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
];
const HOSTS=['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(V).then(async c=>{
  await Promise.all(CORE.map(u=>c.add(u).catch(()=>{})));
  await Promise.all(EXT.map(u=>fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{})));
 }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data==='skipWaiting')self.skipWaiting()});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 const same=u.origin===location.origin&&!u.pathname.startsWith('/__/');
 if(!same&&!HOSTS.includes(u.hostname))return;
 e.respondWith(caches.open(V).then(async c=>{
  const hit=await c.match(r,{ignoreSearch:true})||(r.mode==='navigate'?await c.match('/index.html'):null);
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>null);
  return hit||(await net)||new Response('Hors ligne',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
 }));
});
