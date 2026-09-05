const BUILD_VERSION=__BUILD_VERSION__;
const PRECACHE_URLS=__PRECACHE_URLS__;
const SHELL_CACHE=`colorado-trip-shell-${BUILD_VERSION}`;
const DATA_CACHE='colorado-trip-shared-data-v1';
const RUNTIME_CACHE='colorado-trip-runtime-v1';
const OFFLINE_DATA_URLS=[
  '/.netlify/functions/trip-state','/.netlify/functions/chat',
  '/.netlify/functions/flight-status?journey=outbound',
  '/.netlify/functions/flight-status?journey=return'
];

const cacheSuccessful=async(cacheName,key,response)=>{
  if(response?.ok){
    const cache=await caches.open(cacheName);
    await cache.put(key,response.clone());
  }
  return response;
};

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(SHELL_CACHE);
    await Promise.allSettled(PRECACHE_URLS.map(async url=>{
      const response=await fetch(new Request(url,{cache:'reload'}));
      if(response.ok)await cache.put(url,response);
    }));
    const dataCache=await caches.open(DATA_CACHE);
    await Promise.allSettled(OFFLINE_DATA_URLS.map(async url=>{
      const response=await fetch(new Request(url,{cache:'no-store'}));
      if(response.ok)await dataCache.put(dataCacheKey(new URL(url,self.location.origin)),response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('colorado-trip-shell-')&&key!==SHELL_CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

const dataCacheKey=url=>{
  const key=new URL(url.origin+url.pathname);
  if(url.pathname.endsWith('/flight-status'))key.searchParams.set('journey',url.searchParams.get('journey')==='return'?'return':'outbound');
  return new Request(key.toString());
};

const networkFirst=async(request,cacheName,key=request)=>{
  try{return await cacheSuccessful(cacheName,key,await fetch(request))}
  catch{
    const cached=await caches.match(key);
    if(cached)return cached;
    throw new Error('Offline and no saved response is available.');
  }
};

const cacheFirst=async request=>{
  const cached=await caches.match(request);
  if(cached)return cached;
  return cacheSuccessful(RUNTIME_CACHE,request,await fetch(request));
};

self.addEventListener('fetch',event=>{
  const {request}=event;
  if(request.method!=='GET')return;
  const url=new URL(request.url);

  if(url.origin===self.location.origin&&(url.pathname==='/sw.js'||url.pathname==='/version.json')){
    event.respondWith(fetch(request));
    return;
  }

  if(url.origin===self.location.origin&&url.pathname.startsWith('/.netlify/functions/')){
    if(['/.netlify/functions/trip-state','/.netlify/functions/chat','/.netlify/functions/flight-status'].includes(url.pathname)){
      event.respondWith(networkFirst(request,DATA_CACHE,dataCacheKey(url)));
    }
    return;
  }

  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request,SHELL_CACHE,'/index.html').catch(()=>caches.match('/index.html')));
    return;
  }

  event.respondWith(cacheFirst(request));
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
});
