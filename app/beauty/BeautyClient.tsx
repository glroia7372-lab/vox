'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Star, ShoppingCart, Bookmark, Filter, Plus } from 'lucide-react';
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

export default function BeautyClient({ initialProducts, initialFeatured }: BeautyClientProps) {
    const { showDarkMode, addToCart, bookmarks, toggleBookmark, isSubscriber } = useApp();
    const router = useRouter();
    const [products, setProducts] = useState<MakeupProduct[]>(initialProducts);
    const [featuredProducts, setFeaturedProducts] = useState<MakeupProduct[]>(initialFeatured);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = async (categoryId: string, brand: string) => {
        setSelectedCategory(categoryId);
        setSelectedBrand(brand);
        setLoading(true);

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
        router.push('/cart');
    };

    const renderStars = (rating: number | null) => {
        if (!rating) return null;
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
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

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-serif mb-4">BEAUTY</h1>
                    <p className="text-xl text-gray-600">
                        Discover the latest in beauty products, trends, and expert tips
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-2xl">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search for products, brands, or categories..."
                            className={`w-full px-6 py-4 pr-12 rounded-full border-2 ${showDarkMode
                                ? 'bg-gray-900 border-gray-700 text-white'
                                : 'bg-white border-gray-300'
                                } focus:outline-none focus:border-vox-red transition-colors`}
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-vox-red"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg mb-4 lg:hidden"
                    >
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>

                    <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
                        {/* Category Filter */}
                        <div>
                            <h3 className="text-sm font-bold tracking-widest mb-3">CATEGORY</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {beautyCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleFilterChange(category.id, selectedBrand)}
                                        className={`px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === category.id
                                            ? 'bg-vox-red text-white border-vox-red'
                                            : 'border-gray-300 hover:border-gray-900'
                                            }`}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Brand Filter */}
                        <div>
                            <h3 className="text-sm font-bold tracking-widest mb-3">BRAND</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <button
                                    onClick={() => handleFilterChange(selectedCategory, '')}
                                    className={`px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${selectedBrand === ''
                                        ? 'bg-vox-red text-white border-vox-red'
                                        : 'border-gray-300 hover:border-gray-900'
                                        }`}
                                >
                                    All Brands
                                </button>
                                {beautyBrands.map((brand) => (
                                    <button
                                        key={brand}
                                        onClick={() => handleFilterChange(selectedCategory, brand)}
                                        className={`px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors capitalize ${selectedBrand === brand
                                            ? 'bg-vox-red text-white border-vox-red'
                                            : 'border-gray-300 hover:border-gray-900'
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
                {featuredProducts.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-serif mb-6">Featured Products</h2>
                        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {featuredProducts.map((product) => (
                                <a
                                    key={product.id}
                                    href={product.product_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${showDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border rounded-lg p-4 hover:shadow-xl transition-all duration-300 group relative block`}
                                >
                                    <div className="relative aspect-square rounded-lg overflow-hidden bg-white mb-3">
                                        <img
                                            src={product.image_link}
                                            alt={product.name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522335789203-abd6523f4364?w=400';
                                            }}
                                            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="absolute top-4 right-4 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => handleToggleBookmark(e, product)}
                                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-black"
                                            title="Save to Bookmarks"
                                        >
                                            <Bookmark
                                                className={`w-4 h-4 ${bookmarks.find(b => b.id === product.id.toString())
                                                    ? 'fill-vox-red text-vox-red border-none'
                                                    : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e, product); }}
                                        className="absolute bottom-20 right-6 p-2 bg-vox-red text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                        title="Add to Cart"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>

                                    <div className="text-[10px] font-bold text-vox-red mb-1 uppercase tracking-widest">{product.brand}</div>
                                    <h3 className="text-sm font-serif mb-2 line-clamp-2 h-10 group-hover:text-vox-red transition-colors">
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
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-vox-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Updating inventory...</p>
                        </div>
                    </div>
                ) : products.length > 0 ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-serif">
                                {searchQuery ? `Search Results (${products.length})` : 'All Products'}
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <a
                                    key={product.id}
                                    href={product.product_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg overflow-hidden hover:shadow-2xl transition-shadow group relative block text-inherit no-underline`}
                                >
                                    <div className="bg-white relative aspect-square">
                                        <img
                                            src={product.image_link}
                                            alt={product.name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400';
                                            }}
                                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => handleToggleBookmark(e, product)}
                                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all text-black hover:text-vox-red"
                                        >
                                            <Bookmark
                                                className={`w-5 h-5 ${bookmarks.find(b => b.id === product.id.toString())
                                                    ? 'fill-vox-red text-vox-red border-none'
                                                    : 'text-current'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <div className="text-[10px] font-bold text-vox-red mb-1 uppercase tracking-widest leading-none">
                                            {product.brand}
                                        </div>
                                        <h3 className="text-sm font-serif mb-2 line-clamp-2 h-10 group-hover:text-vox-red transition-colors">
                                            {product.name}
                                        </h3>
                                        {renderStars(product.rating)}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="text-lg font-bold">
                                                {product.price_sign}{product.price}
                                            </div>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className="p-2 text-vox-red hover:bg-vox-red hover:text-white rounded-full transition-all"
                                                >
                                                    <ShoppingCart className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600 mb-4">No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
