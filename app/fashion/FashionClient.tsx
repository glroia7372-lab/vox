'use client';

import { useState } from 'react';
import { Calendar, User, ExternalLink, Grid, List, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { NewsArticle, fetchFashionNews } from '@/lib/fashionApi';

interface FashionClientProps {
    initialArticles: NewsArticle[];
    initialCategory: string;
}

export default function FashionClient({ initialArticles, initialCategory }: FashionClientProps) {
    const { showDarkMode, isSubscriber, bookmarks, toggleBookmark } = useApp();
    const router = useRouter();
    const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

    const categories = [
        { id: 'all', label: 'All', query: 'fashion luxury style' },
        { id: 'runway', label: 'Runway', query: 'fashion runway haute couture' },
        { id: 'streetstyle', label: 'Street Style', query: 'street style fashion' },
        { id: 'luxury', label: 'Luxury', query: 'luxury fashion designer' },
        { id: 'sustainable', label: 'Sustainable', query: 'sustainable fashion eco' },
    ];

    const handleCategoryChange = async (categoryId: string) => {
        if (categoryId === selectedCategory) return;

        setSelectedCategory(categoryId);
        setLoading(true);

        const category = categories.find(c => c.id === categoryId);
        const query = category?.query || 'fashion';

        try {
            const newsData = await fetchFashionNews(query, 12);
            setArticles(newsData);
        } catch (error) {
            console.error('Error loading content:', error);
        } finally {
            setLoading(false);
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

    const handleToggleBookmark = (e: React.MouseEvent, article: NewsArticle) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSubscriber) {
            router.push('/login');
            return;
        }

        toggleBookmark({
            id: article.url,
            type: 'fashion',
            title: article.title,
            description: article.description,
            imageUrl: article.urlToImage,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt
        });
    };

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-serif mb-4">FASHION</h1>
                    <p className="text-xl text-gray-600">
                        The latest in fashion news, trends, and style inspiration
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {categories.map((category) => (
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

                    {/* View Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-vox-red text-white' : 'bg-gray-200'}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-vox-red text-white' : 'bg-gray-200'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-vox-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Updating context...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Featured Article */}
                        {articles.length > 0 && (
                            <div className="mb-16">
                                <a href={articles[0].url} target="_blank" rel="noopener noreferrer" className="relative h-[600px] rounded-lg overflow-hidden group cursor-pointer block">
                                    <img
                                        src={articles[0].urlToImage || 'https://images.unsplash.com/photo-1539109132314-3477524c8d95?w=1200'}
                                        alt={articles[0].title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1539109132314-3477524c8d95?w=1200';
                                        }}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                                    <div className="absolute top-6 right-6 flex gap-3" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => handleToggleBookmark(e, articles[0])}
                                            className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/40 transition-all text-white"
                                            title="Save to Bookmarks"
                                        >
                                            <Bookmark
                                                className={`w-5 h-5 ${bookmarks.find(b => b.id === articles[0].url)
                                                    ? 'fill-white text-white'
                                                    : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                                        <div className="text-xs tracking-widest mb-3 text-gray-300">FEATURED</div>
                                        <h2 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
                                            {articles[0].title}
                                        </h2>
                                        <p className="text-lg mb-4 text-gray-200 max-w-3xl">
                                            {articles[0].description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                {articles[0].author || articles[0].source.name}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(articles[0].publishedAt)}
                                            </span>
                                            <span className="flex items-center gap-2 text-vox-red font-bold">
                                                Read More <ExternalLink className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        )}

                        {/* Articles Grid/List */}
                        {viewMode === 'grid' ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                                {articles.slice(1).map((article, idx) => (
                                    <a
                                        key={idx}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${showDarkMode ? 'bg-black' : 'bg-white'} rounded-lg overflow-hidden hover:shadow-2xl transition-shadow group cursor-pointer block`}
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={article.urlToImage || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600'}
                                                alt={article.title}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600';
                                                }}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                                <button
                                                    onClick={(e) => handleToggleBookmark(e, article)}
                                                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform text-black hover:text-vox-red"
                                                >
                                                    <Bookmark
                                                        className={`w-4 h-4 ${bookmarks.find(b => b.id === article.url)
                                                            ? 'fill-vox-red text-vox-red border-none'
                                                            : ''
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="text-xs tracking-widest mb-2 text-vox-red">
                                                {article.source.name}
                                            </div>
                                            <h3 className="text-xl font-serif mb-3 line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {article.description}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{formatDate(article.publishedAt)}</span>
                                                <span className="flex items-center gap-1 hover:text-vox-red transition-colors">
                                                    Read <ExternalLink className="w-3 h-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6 mb-16">
                                {articles.slice(1).map((article, idx) => (
                                    <a
                                        key={idx}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${showDarkMode ? 'bg-black border border-gray-800' : 'bg-gray-50'} rounded-lg overflow-hidden hover:shadow-lg transition-shadow block`}
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 p-6">
                                            <div className="md:w-1/3 h-48 rounded-lg overflow-hidden relative">
                                                <img
                                                    src={article.urlToImage || 'https://images.unsplash.com/photo-1558769132-cb1aea9f3dbc?w=600'}
                                                    alt={article.title}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558769132-cb1aea9f3dbc?w=600';
                                                    }}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            </div>
                                            <div className="md:w-2/3">
                                                <div className="text-xs tracking-widest mb-2 text-vox-red">
                                                    {article.source.name}
                                                </div>
                                                <h3 className="text-2xl font-serif mb-3">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    {article.description}
                                                </p>
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(article.publishedAt)}
                                                        </span>
                                                        <span className="flex items-center gap-2 text-vox-red font-bold">
                                                            Read Article <ExternalLink className="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleBookmark(e, article); }}
                                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-black"
                                                    >
                                                        <Bookmark
                                                            className={`w-5 h-5 ${bookmarks.find(b => b.id === article.url)
                                                                ? 'fill-black text-black'
                                                                : ''
                                                                }`}
                                                        />
                                                    </button>
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
