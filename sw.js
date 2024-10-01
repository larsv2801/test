self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'Lees!', body: 'Het is tijd om een boek te lezen.' };

    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/8832/8832880.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/8832/8832880.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
