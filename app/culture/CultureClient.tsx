'use client';

import { useState } from 'react';
import { Calendar, ExternalLink, Bookmark, Share2, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { fetchCultureContent, CultureArticle, cultureCategories } from '@/lib/cultureApi';

interface CultureClientProps {
    initialArticles: CultureArticle[];
    initialCategory: string;
}

export default function CultureClient({ initialArticles, initialCategory }: CultureClientProps) {
    const { showDarkMode, isSubscriber, bookmarks, toggleBookmark } = useApp();
    const router = useRouter();
    const [articles, setArticles] = useState<CultureArticle[]>(initialArticles);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [viewMode, setViewMode] = useState<'featured' | 'list'>('featured');

    const handleCategoryChange = async (categoryId: string) => {
        if (categoryId === selectedCategory) return;
        setSelectedCategory(categoryId);
        setLoading(true);
        try {
            const data = await fetchCultureContent(categoryId);
            setArticles(data);
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBookmark = (e: React.MouseEvent, article: CultureArticle) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSubscriber) {
            router.push('/login');
            return;
        }

        toggleBookmark({
            id: article.id,
            type: 'culture',
            title: article.title,
            description: article.description,
            imageUrl: article.imageUrl,
            url: article.url,
            category: article.category,
            publishedAt: article.publishedAt,
            source: article.source
        });
    };

    const shareArticle = async (article: CultureArticle) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.description,
                    url: article.url,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(article.url);
            alert('Link copied to clipboard!');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Art & Design': 'bg-purple-100 text-purple-800',
            'Music': 'bg-pink-100 text-pink-800',
            'Film & TV': 'bg-blue-100 text-blue-800',
            'Books': 'bg-green-100 text-green-800',
            'Travel': 'bg-yellow-100 text-yellow-800',
            'Food & Dining': 'bg-orange-100 text-orange-800',
            'Fashion': 'bg-red-100 text-red-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-serif mb-4">CULTURE</h1>
                    <p className="text-xl text-gray-600">
                        Art, music, film, books, and the stories that shape our world
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {cultureCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === category.id
                                    ? 'bg-vox-red text-white border-vox-red'
                                    : 'border-gray-300 hover:border-gray-900'
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('featured')}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${viewMode === 'featured'
                                ? 'bg-vox-red text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            Featured
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${viewMode === 'list'
                                ? 'bg-vox-red text-white'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                        >
                            List
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-vox-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Syncing culture feed...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Featured View */}
                        {viewMode === 'featured' && articles.length > 0 && (
                            <>
                                {/* Hero Article */}
                                <div className="mb-16">
                                    <a href={articles[0].url} target="_blank" rel="noopener noreferrer" className="relative h-[600px] rounded-lg overflow-hidden group cursor-pointer block">
                                        <img
                                            src={articles[0].imageUrl || 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1200'}
                                            alt={articles[0].title}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1200';
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                                        <div className="absolute top-6 right-6 flex gap-3" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={(e) => handleToggleBookmark(e, articles[0])}
                                                className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/40 transition-all text-white"
                                                title="Save to Bookmarks"
                                            >
                                                <Bookmark
                                                    className={`w-5 h-5 ${bookmarks.find(b => b.id === articles[0].id)
                                                        ? 'fill-white text-white'
                                                        : ''
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(articles[0].category)}`}>
                                                    {articles[0].category}
                                                </span>
                                                <span className="flex items-center gap-2 text-sm">
                                                    <TrendingUp className="w-4 h-4" />
                                                    Trending
                                                </span>
                                            </div>
                                            <h2 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
                                                {articles[0].title}
                                            </h2>
                                            <p className="text-lg mb-6 text-gray-200 max-w-3xl">
                                                {articles[0].description}
                                            </p>
                                            <div className="flex items-center gap-6">
                                                <span className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(articles[0].publishedAt)}
                                                </span>
                                                <span className="text-sm">{articles[0].source}</span>
                                                <span className="flex items-center gap-2 hover:text-vox-red transition-colors">
                                                    Read More <ExternalLink className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                {/* Featured Grid */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {articles.slice(1).map((article) => (
                                        <a
                                            key={article.id}
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${showDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} rounded-lg overflow-hidden hover:shadow-2xl transition-shadow group block`}
                                        >
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={article.imageUrl || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800'}
                                                    alt={article.title}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800';
                                                    }}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()}>
                                                    <span className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(article.category)}`}>
                                                        {article.category}
                                                    </span>
                                                </div>
                                                <div className="absolute top-3 right-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={(e) => handleToggleBookmark(e, article)}
                                                        className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform text-black"
                                                    >
                                                        <Bookmark
                                                            className={`w-4 h-4 ${bookmarks.find(b => b.id === article.id)
                                                                ? 'fill-vox-red text-vox-red border-none'
                                                                : 'text-gray-600'
                                                                }`}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); shareArticle(article); }}
                                                        className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform text-black"
                                                    >
                                                        <Share2 className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-lg font-serif mb-3 h-14 overflow-hidden group-hover:text-vox-red transition-colors">
                                                    {article.title.length > 70 ? article.title.substring(0, 70) + '...' : article.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 h-16 overflow-hidden">
                                                    {article.description && article.description.length > 120
                                                        ? article.description.substring(0, 120) + '...'
                                                        : article.description || 'Read more to discover the full story...'}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(article.publishedAt)}
                                                    </div>
                                                    <span className="flex items-center gap-1 hover:text-vox-red transition-colors">
                                                        Read <ExternalLink className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* List View */}
                        {viewMode === 'list' && (
                            <div className="space-y-6">
                                {articles.map((article) => (
                                    <a
                                        key={article.id}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${showDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50'} rounded-lg overflow-hidden hover:shadow-lg transition-shadow block`}
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 p-6">
                                            <div className="md:w-1/3">
                                                <div className="relative h-48 rounded-lg overflow-hidden">
                                                    <img
                                                        src={article.imageUrl || 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600'}
                                                        alt={article.title}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600';
                                                        }}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()}>
                                                        <span className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(article.category)}`}>
                                                            {article.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:w-2/3 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="text-2xl font-serif mb-3 group-hover:text-vox-red transition-colors">{article.title}</h3>
                                                    <p className="text-gray-600 mb-4 line-clamp-2">{article.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-6">
                                                        <span className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(article.publishedAt)}
                                                        </span>
                                                        <span className="flex items-center gap-2 text-vox-red font-bold">
                                                            Read Full Story <ExternalLink className="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={(e) => handleToggleBookmark(e, article)}
                                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-black"
                                                        >
                                                            <Bookmark
                                                                className={`w-5 h-5 ${bookmarks.find(b => b.id === article.id)
                                                                    ? 'fill-vox-red text-vox-red border-none'
                                                                    : ''
                                                                    }`}
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); shareArticle(article); }}
                                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-black"
                                                        >
                                                            <Share2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
