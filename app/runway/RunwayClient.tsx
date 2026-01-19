'use client';

import { useState } from 'react';
import { Calendar, User, ExternalLink, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
    fetchRunwayShows,
    RunwayArticle,
    runwayCategories,
    topDesigners
} from '@/lib/runwayApi';

interface RunwayClientProps {
    initialArticles: RunwayArticle[];
    initialCategory: string;
}

export default function RunwayClient({ initialArticles, initialCategory }: RunwayClientProps) {
    const { showDarkMode, isSubscriber, bookmarks, toggleBookmark } = useApp();
    const router = useRouter();
    const [articles, setArticles] = useState<RunwayArticle[]>(initialArticles);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedDesigner, setSelectedDesigner] = useState<string | null>(null);

    const handleCategoryChange = async (categoryId: string) => {
        setSelectedCategory(categoryId);
        setSelectedDesigner(null);
        setLoading(true);
        try {
            const data = await fetchRunwayShows(categoryId);
            setArticles(data.articles);
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

    const handleToggleBookmark = (e: React.MouseEvent, article: RunwayArticle) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSubscriber) {
            router.push('/login');
            return;
        }

        toggleBookmark({
            id: article.url,
            type: 'runway',
            title: article.title,
            description: article.description,
            imageUrl: article.urlToImage,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt
        });
    };

    const filteredArticles = selectedDesigner
        ? articles.filter(a => a.designer === selectedDesigner)
        : articles;

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-serif mb-4">RUNWAY</h1>
                    <p className="text-xl text-gray-600">
                        The latest from the world's most prestigious fashion weeks and designer collections
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-8">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {runwayCategories.map((category) => (
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
                </div>

                {/* Designer Filter */}
                <div className="mb-12">
                    <h3 className="text-sm font-bold tracking-widest mb-3">DESIGNERS</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setSelectedDesigner(null)}
                            className={`px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${selectedDesigner === null
                                ? 'bg-vox-red text-white border-vox-red'
                                : 'border-gray-300 hover:border-gray-900'
                                }`}
                        >
                            All Designers
                        </button>
                        {topDesigners.map((designer) => (
                            <button
                                key={designer}
                                onClick={() => setSelectedDesigner(designer)}
                                className={`px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${selectedDesigner === designer
                                    ? 'bg-vox-red text-white border-vox-red'
                                    : 'border-gray-300 hover:border-gray-900'
                                    }`}
                            >
                                {designer}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-vox-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Fetching Runway archives...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Runway Articles */}
                        {filteredArticles.length > 0 && (
                            <div className="mb-16">
                                <h2 className="text-3xl font-serif mb-8">
                                    {selectedDesigner ? `${selectedDesigner} Collections` : 'Latest Runway News'}
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {filteredArticles.map((article, idx) => (
                                        <a
                                            key={idx}
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg overflow-hidden hover:shadow-2xl transition-shadow group block no-underline text-inherit`}
                                        >
                                            <div className="relative h-72 overflow-hidden">
                                                <img
                                                    src={article.urlToImage || 'https://images.unsplash.com/photo-1558769132-cb1aea1f5d1e?w=800'}
                                                    alt={article.title}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558769132-cb1aea1f5d1e?w=800';
                                                    }}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {article.designer && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className="px-3 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                                                            {article.designer}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={(e) => handleToggleBookmark(e, article)}
                                                        className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/30 transition-all text-white"
                                                    >
                                                        <Bookmark
                                                            className={`w-4 h-4 ${bookmarks.find(b => b.id === article.url)
                                                                ? 'fill-white text-white'
                                                                : ''
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="text-xs text-vox-red mb-2 tracking-wider">
                                                    {article.source.name}
                                                </div>
                                                <h3 className="text-xl font-serif mb-3 h-14 overflow-hidden group-hover:text-vox-red transition-colors">
                                                    {article.title.length > 70 ? article.title.substring(0, 70) + '...' : article.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 h-16 overflow-hidden">
                                                    {article.description && article.description.length > 120
                                                        ? article.description.substring(0, 120) + '...'
                                                        : article.description || 'Discover the latest from the runway...'}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(article.publishedAt)}
                                                    </div>
                                                    <span className="flex items-center gap-2 text-sm text-vox-red font-bold">
                                                        Read More <ExternalLink className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
