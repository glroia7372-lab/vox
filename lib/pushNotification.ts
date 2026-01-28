export async function registerServiceWorker() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered with scope:', registration.scope);
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
}

export async function subscribeToPush(registration: ServiceWorkerRegistration) {
    const publicKey = 'BNk0S5pbR5jE_vWs26oTljCAyz-p_IdfKzutFFB9IUPfrltovgaE9ALg9nZkQN6Ynhi0XA-TjMFzapzlOzuaAQU';

    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

        console.log('Push Subscription successful:', subscription);
        return subscription;
    } catch (error) {
        console.error('Push Subscription failed:', error);
    }
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
