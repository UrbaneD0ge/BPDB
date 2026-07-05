import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files, '/'];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(ASSETS))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.map((key) => (key === CACHE ? undefined : caches.delete(key))))
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);
	const isSameOrigin = url.origin === self.location.origin;
	const isAsset = isSameOrigin && ASSETS.includes(url.pathname);

	if (isAsset) {
		event.respondWith(
			caches.match(event.request).then((response) => response || fetch(event.request))
		);
		return;
	}

	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					const responseClone = response.clone();
					caches.open(CACHE).then((cache) => cache.put(event.request, responseClone));
					return response;
				})
				.catch(async () => {
					const cachedPage = await caches.match(event.request);
					if (cachedPage) return cachedPage;
					return caches.match('/');
				})
		);
	}
});
