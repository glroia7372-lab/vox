import { Suspense } from 'react';
import { fetchBeautyProducts, getFeaturedProducts } from '@/lib/beautyApi';
import BeautyClient from './BeautyClient';
import BeautySkeleton from './BeautySkeleton';

// Separate component to handle the async data fetching
async function BeautyContent() {
    // Reduced limit for faster initial server-side fetch
    const [initialProducts, initialFeatured] = await Promise.all([
        fetchBeautyProducts(undefined, undefined, 24),
        getFeaturedProducts()
    ]);

    return (
        <BeautyClient
            initialProducts={initialProducts}
            initialFeatured={initialFeatured}
        />
    );
}

export default function BeautyPage() {
    return (
        // Now navigation will happen immediately, showing the Skeleton first
        <Suspense fallback={<BeautySkeleton />}>
            <BeautyContent />
        </Suspense>
    );
}
