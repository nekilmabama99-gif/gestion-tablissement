// Service worker de l'application "Gestion d'établissement".
// Rôle : mettre en cache l'application (l'unique fichier index.html + les icônes)
// au premier chargement, pour qu'elle continue de fonctionner ensuite même sans
// connexion internet / réseau. Les données de l'établissement, elles, restent
// stockées en local sur l'appareil (localStorage) et ne transitent jamais par
// un serveur : rien à voir avec ce cache, qui ne concerne que le "code" de l'appli.

const CACHE_NAME = 'gestion-etablissement-v2';
const FICHIERS_A_METTRE_EN_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

// Installation : on télécharge et on stocke tous les fichiers de l'appli.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FICHIERS_A_METTRE_EN_CACHE))
  );
  self.skipWaiting();
});

// Activation : on supprime les anciennes versions du cache si une mise à jour a eu lieu.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((noms) =>
      Promise.all(noms.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Chaque requête : on sert d'abord le cache (rapide, fonctionne hors-ligne),
// et on essaie de rafraîchir le cache en tâche de fond si le réseau est disponible.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((reponseEnCache) => {
      const fetchPromise = fetch(event.request)
        .then((reponseReseau) => {
          if (reponseReseau && reponseReseau.status === 200) {
            const clone = reponseReseau.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return reponseReseau;
        })
        .catch(() => reponseEnCache);
      return reponseEnCache || fetchPromise;
    })
  );
});
