import { fetchFashionNews } from '@/lib/fashionApi';
import FashionClient from './FashionClient';

export default async function FashionPage() {
    // Initial fetch on server for faster page load
    const initialArticles = await fetchFashionNews('fashion luxury style', 12);

    return <FashionClient initialArticles={initialArticles} initialCategory="all" />;
}
