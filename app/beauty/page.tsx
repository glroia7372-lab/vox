import { fetchBeautyProducts, getFeaturedProducts } from '@/lib/beautyApi';
import BeautyClient from './BeautyClient';

export default async function BeautyPage() {
    // Initial fetch on server to eliminate client-side loading wait
    // We fetch a standard set of products and featured items
    const [initialProducts, initialFeatured] = await Promise.all([
        fetchBeautyProducts(),
        getFeaturedProducts()
    ]);

    return (
        <BeautyClient
            initialProducts={initialProducts}
            initialFeatured={initialFeatured}
        />
    );
}
