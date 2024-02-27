const staticCacheName = 'static-site-v2'
const dynamicCacheName = 'dynamic-site-v2'

const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/offline.html',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v141/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
]
// install event
self.addEventListener('install', async (event) => {
  const cache = await caches.open(staticCacheName)
  await cache.addAll(ASSETS)
})

// activated event
self.addEventListener('activate', async (event) => {
  // console.log('####: Service Worker has been activated!')
  const cachesKeysArr = await caches.keys()
  await Promise.all(
    cachesKeysArr
      .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
      .map((key) => caches.delete(key))
  )
})

// fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request))
  // // console.log('####: fetch', event.request.url)
  // // console.log('####: fetch', event)
  // event.respondWith(
  //   caches.match(event.request).then((cacheRes) => {
  //     return (
  //       cacheRes ||
  //       fetch(event.request).then((response) => {
  //         return caches.open(dynamicCacheName).then((cache) => {
  //           cache.put(event.request.url, response.clone())
  //           return response
  //         })
  //       })
  //     )
  //   })
  // )
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  // console.log('####: cached', cached)
  try {
    return (
      cached ??
      (await fetch(request).then((response) => {
        return networkFirst(request)
      }))
    )
  } catch (error) {
    // console.log('####: -------> error', error)
    return networkFirst(request)
  }
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (error) {
    console.log('####: error', error)
    const cached = await cache.match(request)
    return cached ?? (await caches.match('/offline.html'))
  }
}
