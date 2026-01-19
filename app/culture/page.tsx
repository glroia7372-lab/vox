import { fetchCultureContent } from '@/lib/cultureApi';
import CultureClient from './CultureClient';

export default async function CulturePage() {
    // Initial fetch on server
    const initialArticles = await fetchCultureContent('all');

    return <CultureClient initialArticles={initialArticles} initialCategory="all" />;
}
