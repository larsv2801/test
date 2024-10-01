self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'Push Melding', body: 'Er is een nieuwe melding!' };

    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'badge.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
