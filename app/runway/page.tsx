import { fetchRunwayShows } from '@/lib/runwayApi';
import RunwayClient from './RunwayClient';

export default async function RunwayPage() {
    // Initial fetch on server
    const data = await fetchRunwayShows('all');

    return <RunwayClient initialArticles={data.articles} initialCategory="all" />;
}
