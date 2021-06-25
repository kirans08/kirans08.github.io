

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  'styles.css',
  'plugin.js',
  'controller.js'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// const notify = (event, state) => {

//     const client = await clients.get(event.clientId);
//     // Exit early if we don't get the client.
//     // Eg, if it closed.
//     if (!client) return;

//     client.postMessage({state});

// }
const decorateResponse = (response, prefix) => {

    if (!response.headers.get('content-type').includes('application/json')) {
        return response.clone();
    }

    return response.text()
    .then(text => new Response(prefix + text, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
    }))

}

const getCachedResponse = (request) => {

    return caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return decorateResponse(cachedResponse, "Cached Data - ");;
        }
        var init = { "status" : 200  };
        return new Response("No Cache Error",init);

    });

}

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
 
    // notify('fetch', event)



    event.respondWith(

        caches.open(RUNTIME).then(cache => {

            if (navigator.onLine) {

                return fetch(event.request)
                .then(response => {
                  return cache.put(event.request, response.clone()).then(() => {
                    return decorateResponse(response, "New Data - ");
                  });
                })
                .catch(error => getCachedResponse(event.request))
            }
            else {

                return getCachedResponse(event.request);

            }

          })


    )
    
});