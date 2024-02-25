// install event
self.addEventListener('install', (event) => {
  console.log('####: Service Worker has been installed!')
})

// activated event
self.addEventListener('activate', (event) => {
  console.log('####: Service Worker has been activated!')
})

// fetch event
self.addEventListener('fetch', (event) => {
  console.log('####: fetch', event.request.url)
})
