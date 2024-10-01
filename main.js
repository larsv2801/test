if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log('Service Worker geregistreerd:', registration);

        document.getElementById('subscribeBtn').addEventListener('click', function() {
            Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                    subscribeUserToPush(registration);
                }
            });
        });
    }).catch(function(error) {
        console.error('Service Worker registratie mislukt:', error);
    });
} else {
    console.warn('Push notifications worden niet ondersteund door deze browser.');
}

function subscribeUserToPush(registration) {
    registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array('<YOUR_PUBLIC_VAPID_KEY>')
    }).then(function(subscription) {
        console.log('Gebruiker geabonneerd:', JSON.stringify(subscription));
        // Stuur de abonnementsgegevens naar je server om meldingen te kunnen verzenden
        fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }).catch(function(error) {
        console.error('Fout bij het abonneren:', error);
    });
}

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
