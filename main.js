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
        applicationServerKey: urlB64ToUint8Array('BDgfFyCQr6OsGzwUI2rbSdrHfdkjJ2HKoudQITWebJgGQPgPhbjd0d6hk5ES08HeheVGXG_cnVZEUKIl7jrAyJA')
    }).then(function(subscription) {
        console.log('Gebruiker geabonneerd:', JSON.stringify(subscription));

        // Update de URL naar je Glitch-project hier
        fetch('https://shy-pale-cerise.glitch.me/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            if (!response.ok) {
                throw new Error('Netwerkresponse was niet OK');
            }
            console.log('Abonnement verzonden naar de server:', response);
        }).catch(function(error) {
            console.error('Fout bij het verzenden van het abonnement naar de server:', error);
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
function sendNotification(subscription) {
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "endpoint": "https://fcm.googleapis.com/fcm/send/cINT5917OJI:APA91bHzyP-pH4aj8QJ7Y5CXhWeBDjzQ8uIkfJgeP8KrxD8VRcrWYx_zAPcyuevCb3phqtF6Ry3CWfEEEX0XyaorvkicSrL-p_Xv3rCIebckL1O7c2kXo16-kFWbbpCZTJY2wuxjlNus",
  "expirationTime": null,
  "keys": {
    "p256dh": "BK7b8WuxaiNpmFkZRLJ5MGSEbHDMRDDtVpX54uuWSLs_fi3rLGaauFJjdlnx8lxaBeGaHL3yY1_Yayxrui3eouw",
    "auth": "ujnjdqOZzyQT_PuV9jYLVA"
  }
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://shy-pale-cerise.glitch.me/sendNotification", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}
