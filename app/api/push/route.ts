import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

const publicKey = 'BNk0S5pbR5jE_vWs26oTljCAyz-p_IdfKzutFFB9IUPfrltovgaE9ALg9nZkQN6Ynhi0XA-TjMFzapzlOzuaAQU';
const privateKey = 'tYxXuilW6WGiY5g_xcXQHwt5t6faCucQBkbHF71_VK4';

webpush.setVapidDetails(
    'mailto:support@vox-magazine.com',
    publicKey,
    privateKey
);

export async function POST(req: NextRequest) {
    try {
        const { subscription, title, body, url } = await req.json();

        if (!subscription || !title || !body) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const payload = JSON.stringify({
            title,
            body,
            url: url || '/'
        });

        await webpush.sendNotification(subscription, payload);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error sending push notification:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
