'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Star, ShoppingCart, Bookmark, Filter, Plus, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
    fetchBeautyProducts,
    searchBeautyProducts,
    MakeupProduct,
    beautyCategories,
    beautyBrands,
} from '@/lib/beautyApi';

interface BeautyClientProps {
    initialProducts: MakeupProduct[];
    initialFeatured: MakeupProduct[];
}

const ITEMS_PER_PAGE = 12;

export default function BeautyClient({ initialProducts, initialFeatured }: BeautyClientProps) {
    const { showDarkMode, addToCart, bookmarks, toggleBookmark, isSubscriber } = useApp();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [products, setProducts] = useState<MakeupProduct[]>(initialProducts);
    const [featuredProducts] = useState<MakeupProduct[]>(initialFeatured);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const handleFilterChange = async (categoryId: string, brand: string) => {
        setSelectedCategory(categoryId);
        setSelectedBrand(brand);
        setLoading(true);
        setVisibleCount(ITEMS_PER_PAGE);

        try {
            const category = beautyCategories.find(c => c.id === categoryId);
            const productType = category?.type || undefined;
            const data = await fetchBeautyProducts(productType, brand || undefined);
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            handleFilterChange(selectedCategory, selectedBrand);
            return;
        }

        setLoading(true);
        setVisibleCount(ITEMS_PER_PAGE);

        // Clear other filters when performing a fresh search to avoid confusion
        setSelectedCategory('all');
        setSelectedBrand('');

        try {
            const results = await searchBeautyProducts(searchQuery);
            setProducts(results);
        } catch (error) {
            console.error('Error searching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (e: React.MouseEvent, product: MakeupProduct) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSubscriber) {
            router.push('/login');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            price_sign: product.price_sign,
            image_link: product.image_link
        });

        // Show subtle feedback instead of hard redirect
        // For now keep the flow but could be optimized
        router.push('/cart');
    };

    const renderStars = (rating: number | null) => {
        if (!rating) return null;
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="text-[10px] text-gray-400 ml-1">{rating.toFixed(1)}</span>
            </div>
        );
    };

    const handleToggleBookmark = (e: React.MouseEvent, product: MakeupProduct) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSubscriber) {
            router.push('/login');
            return;
        }

        toggleBookmark({
            id: product.id.toString(),
            type: 'beauty',
            title: product.name,
            description: product.description || `${product.brand} - ${product.name}`,
            imageUrl: product.image_link,
            url: product.product_link,
            price: product.price,
            brand: product.brand,
            publishedAt: new Date().toISOString()
        });
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen transition-colors duration-500 ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-serif mb-4 tracking-tighter">BEAUTY</h1>
                    <p className={`text-xl ${showDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Discover the latest in beauty products, trends, and expert tips
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-12">
                    <div className="relative max-w-2xl group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search for products, brands, or categories..."
                            className={`w-full px-8 py-5 pr-14 rounded-2xl border-2 transition-all duration-300 ${showDarkMode
                                ? 'bg-gray-900/50 border-gray-800 text-white focus:bg-gray-900 focus:border-vox-red'
                                : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-vox-red'
                                } focus:outline-none shadow-sm focus:shadow-xl`}
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-vox-red hover:scale-110 transition-transform p-2"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-12">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl mb-4 lg:hidden border transition-all ${showDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
                            }`}
                    >
                        <Filter className="w-5 h-5 text-vox-red" />
                        <span className="font-medium">Filters</span>
                    </button>

                    <div className={`${showFilters ? 'block animate-in fade-in slide-in-from-top-4 duration-300' : 'hidden'} lg:block space-y-6`}>
                        {/* Category Filter */}
                        <div>
                            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50 mb-4">CATEGORIES</h3>
                            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                                {beautyCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleFilterChange(category.id, selectedBrand)}
                                        className={`px-5 py-2.5 border rounded-xl text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id
                                            ? 'bg-vox-red text-white border-vox-red shadow-lg shadow-vox-red/20 scale-105'
                                            : showDarkMode
                                                ? 'bg-gray-900 border-gray-800 hover:border-vox-red'
                                                : 'bg-white border-gray-200 hover:border-vox-red'
                                            }`}
                                    >
                                        <span>{category.icon}</span>
                                        <span className="font-medium">{category.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brand Filter */}
                        <div>
                            <h3 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50 mb-4">CURATED BRANDS</h3>
                            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                                <button
                                    onClick={() => handleFilterChange(selectedCategory, '')}
                                    className={`px-5 py-2.5 border rounded-xl text-sm whitespace-nowrap transition-all duration-300 ${selectedBrand === ''
                                        ? 'bg-vox-red text-white border-vox-red shadow-lg shadow-vox-red/20 scale-105'
                                        : showDarkMode
                                            ? 'bg-gray-900 border-gray-800 hover:border-vox-red'
                                            : 'bg-white border-gray-200 hover:border-vox-red'
                                        }`}
                                >
                                    All Brands
                                </button>
                                {beautyBrands.map((brand) => (
                                    <button
                                        key={brand}
                                        onClick={() => handleFilterChange(selectedCategory, brand)}
                                        className={`px-5 py-2.5 border rounded-xl text-sm whitespace-nowrap transition-all duration-300 capitalize font-medium ${selectedBrand === brand
                                            ? 'bg-vox-red text-white border-vox-red shadow-lg shadow-vox-red/20 scale-105'
                                            : showDarkMode
                                                ? 'bg-gray-900 border-gray-800 hover:border-vox-red'
                                                : 'bg-white border-gray-200 hover:border-vox-red'
                                            }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Products */}
                {!loading && featuredProducts.length > 0 && selectedCategory === 'all' && !selectedBrand && !searchQuery && (
                    <div className="mb-20 animate-in fade-in duration-700">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-serif">Cult Favorites</h2>
                            <div className="h-[1px] flex-grow mx-8 bg-current opacity-10"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {featuredProducts.slice(0, 6).map((product) => (
                                <a
                                    key={product.id}
                                    href={product.product_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group relative block ${showDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-50'} rounded-2xl p-4 transition-all duration-500`}
                                >
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-white mb-4 border border-transparent group-hover:border-vox-red/20 group-hover:shadow-2xl transition-all duration-500">
                                        <img
                                            src={product.image_link}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>

                                    <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
                                        <button
                                            onClick={(e) => handleToggleBookmark(e, product)}
                                            className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-xl opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hover:bg-vox-red hover:text-white text-black"
                                        >
                                            <Bookmark
                                                className={`w-4 h-4 ${bookmarks.find(b => b.id === product.id.toString())
                                                    ? 'fill-current'
                                                    : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="text-[9px] font-black text-vox-red mb-1 uppercase tracking-[0.15em]">{product.brand}</div>
                                    <h3 className="text-sm font-medium mb-2 line-clamp-1 group-hover:text-vox-red transition-colors">
                                        {product.name}
                                    </h3>
                                    {renderStars(product.rating)}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className={`aspect-square rounded-3xl mb-4 ${showDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}></div>
                                <div className={`h-3 w-1/4 rounded-full mb-2 ${showDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}></div>
                                <div className={`h-5 w-3/4 rounded-full mb-2 ${showDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}></div>
                                <div className={`h-4 w-1/2 rounded-full ${showDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}></div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-serif">
                                {searchQuery ? `Search Results (${products.length})` : 'Catalog'}
                            </h2>
                            <span className="text-xs font-medium opacity-40 uppercase tracking-widest">{products.length} products</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {products.slice(0, visibleCount).map((product) => (
                                <div
                                    key={product.id}
                                    className="group relative flex flex-col"
                                >
                                    <a
                                        href={product.product_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative aspect-square bg-[#f8f8f8] rounded-3xl overflow-hidden mb-5 group-hover:shadow-2xl transition-all duration-700 border border-transparent hover:border-vox-red/10"
                                    >
                                        <img
                                            src={product.image_link}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-8 transition-transform duration-1000 group-hover:scale-110"
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </a>

                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={(e) => handleToggleBookmark(e, product)}
                                            className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all text-black hover:text-vox-red"
                                        >
                                            <Bookmark
                                                className={`w-5 h-5 ${bookmarks.find(b => b.id === product.id.toString())
                                                    ? 'fill-vox-red text-vox-red border-none'
                                                    : 'text-current'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="flex flex-col flex-grow">
                                        <div className="text-[10px] font-black text-vox-red mb-1 uppercase tracking-[0.2em] leading-none">
                                            {product.brand}
                                        </div>
                                        <h3 className="text-lg font-serif mb-2 line-clamp-1 group-hover:text-vox-red transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            {renderStars(product.rating)}
                                        </div>
                                        <div className="mt-auto flex items-center justify-between border-t border-current/5 pt-4">
                                            <div className="text-xl font-bold tracking-tight">
                                                <span className="text-xs mr-1 opacity-50">{product.price_sign || '$'}</span>
                                                {product.price}
                                            </div>
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="flex items-center gap-2 px-4 py-2 bg-vox-red text-white text-xs font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-vox-red/20"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                <span>ADD</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {visibleCount < products.length && (
                            <div className="mt-20 flex justify-center">
                                <button
                                    onClick={loadMore}
                                    className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 ${showDarkMode
                                        ? 'bg-white text-black hover:bg-vox-red hover:text-white'
                                        : 'bg-black text-white hover:bg-vox-red'
                                        }`}
                                >
                                    <span>EXPLORE MORE</span>
                                    <ChevronDown className="w-5 h-5 animate-bounce" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-40 animate-in fade-in zoom-in duration-500">
                        <div className="text-6xl mb-6">🏜️</div>
                        <p className="text-xl opacity-50 font-serif">We couldn't find any products matching your selection.</p>
                        <button
                            onClick={() => handleFilterChange('all', '')}
                            className="mt-8 text-vox-red font-bold hover:underline"
                        >
                            Reset all filters
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
