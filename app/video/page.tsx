import { fetchVideos } from '@/lib/videoApi';
import VideoClient from './VideoClient';

export default async function VideoPage() {
    // Initial fetch on server
    const initialVideos = await fetchVideos('all');

    return <VideoClient initialVideos={initialVideos} initialCategory="all" />;
}
