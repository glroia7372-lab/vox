import React from 'react';

const ProductSkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
);

const BeautySkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto pt-24 px-6">
            {/* Header Skeleton */}
            <div className="mb-12">
                <div className="h-20 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>

            {/* Search Skeleton */}
            <div className="mb-8">
                <div className="h-14 bg-gray-200 rounded-full w-full max-w-2xl"></div>
            </div>

            {/* Filters Skeleton */}
            <div className="mb-8 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                <div className="flex gap-2 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-200 rounded-full w-24 flex-shrink-0"></div>
                    ))}
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};

export default BeautySkeleton;
