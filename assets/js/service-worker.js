const initSW = () => {
    navigator.serviceWorker &&
        navigator.serviceWorker
            .register('./service-worker.js')
            .then((registration) => {
            });
};

self.addEventListener('fetch', (event) => {
});