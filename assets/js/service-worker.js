const initSW = () => {
    navigator.serviceWorker &&
        navigator.serviceWorker
            .register('assets/js/service-worker.js')
            .then((registration) => {
            });
};

self.addEventListener('fetch', (event) => {
});