const CACHE_NAME = "P1_cache_PWA_IDGS_v2"; // Cambiar versión en cada actualización

const urlsToCache = [
    './',
    './assets/img/portafolio/BD.png',
    './assets/img/portafolio/FW.jpg',
    './assets/img/portafolio/Inventario.png',
    './assets/img/portafolio/LP.png',
    './assets/img/portafolio/ShopEasy.jpg',
    './assets/img/portafolio/Survival.jpg',
    './assets/img/portafolio/yo.jpg',
    './index.html'
];

// Instalación: almacena los archivos en caché
self.addEventListener('install', e => {
    console.log('[Service Worker] Instalación');
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Cacheando archivos...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[Service Worker] Archivos cacheados correctamente');
                return self.skipWaiting();
            })
            .catch(err => console.error('[Service Worker] Error durante la instalación:', err))
    );
});

// Activación: limpia cachés antiguas
self.addEventListener('activate', e => {
    console.log('[Service Worker] Activación');
    const listaBlancaCache = [CACHE_NAME];
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (!listaBlancaCache.includes(key)) {
                        console.log('[Service Worker] Eliminando caché antigua:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Activación completada');
            return self.clients.claim();
        })
    );
});

// Intercepción de solicitudes
self.addEventListener('fetch', e => {
    console.log('[Service Worker] Interceptando solicitud a:', e.request.url);
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if (res) {
                    console.log('[Service Worker] Archivo encontrado en caché:', e.request.url);
                    return res;
                }
                console.log('[Service Worker] Archivo no encontrado en caché, buscando en red:', e.request.url);
                return fetch(e.request);
            })
            .catch(err => console.error('[Service Worker] Error en fetch:', err))
    );
});
