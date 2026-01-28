self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icon-192x192.png', // Replace with your logo path
            badge: '/badge-72x72.png', // Replace with your badge path
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2',
                url: data.url || '/'
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Details',
                },
                {
                    action: 'close',
                    title: 'Close',
                },
            ],
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    } else {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});
