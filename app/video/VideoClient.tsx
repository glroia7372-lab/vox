'use client';

import { useState } from 'react';
import { Play, Calendar, User, X, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { fetchVideos, YouTubeVideo, videoCategories } from '@/lib/videoApi';

interface VideoClientProps {
    initialVideos: YouTubeVideo[];
    initialCategory: string;
}

export default function VideoClient({ initialVideos, initialCategory }: VideoClientProps) {
    const { showDarkMode, isSubscriber, bookmarks, toggleBookmark } = useApp();
    const router = useRouter();
    const [videos, setVideos] = useState<YouTubeVideo[]>(initialVideos);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

    const handleCategoryChange = async (categoryId: string) => {
        setSelectedCategory(categoryId);
        setLoading(true);
        try {
            const data = await fetchVideos(categoryId);
            setVideos(data);
        } catch (error) {
            console.error('Error loading videos:', error);
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

    const handleToggleBookmark = (e: React.MouseEvent, video: YouTubeVideo) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSubscriber) {
            router.push('/login');
            return;
        }

        toggleBookmark({
            id: video.id,
            type: 'video',
            title: video.title,
            description: video.description,
            imageUrl: video.thumbnail,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            publishedAt: video.publishedAt,
            channelTitle: video.channelTitle
        });
    };

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-6xl md:text-8xl font-serif mb-4">VIDEO</h1>
                    <p className="text-xl text-gray-600">
                        Premium digital films and runway coverage
                    </p>
                </div>

                {/* Categories */}
                <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
                    {videoCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.id)}
                            className={`px-6 py-2 rounded-full whitespace-nowrap transition-all ${selectedCategory === category.id
                                ? 'bg-vox-red text-white'
                                : 'border border-gray-300 hover:border-vox-red'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vox-red"></div>
                    </div>
                ) : (
                    <>
                        {/* Featured Video */}
                        {videos.length > 0 && (
                            <div className="mb-16 group cursor-pointer" onClick={() => setSelectedVideo(videos[0])}>
                                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                                    <img
                                        src={videos[0].thumbnail}
                                        alt={videos[0].title}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200';
                                        }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                        <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                                            <Play className="w-8 h-8 text-vox-red fill-vox-red" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleToggleBookmark(e, videos[0])}
                                        className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-black z-20"
                                    >
                                        <Bookmark
                                            className={`w-6 h-6 ${bookmarks.find(b => b.id === videos[0].id)
                                                ? 'fill-vox-red text-vox-red border-none'
                                                : ''
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="max-w-3xl">
                                    <h2
                                        className="text-4xl md:text-5xl font-serif mb-4 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: videos[0].title }}
                                    ></h2>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{videos[0].description}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {videos[0].channelTitle}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(videos[0].publishedAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Video Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {videos.slice(1).map((video) => (
                                <div key={video.id} className="group cursor-pointer" onClick={() => setSelectedVideo(video)}>
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600';
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-5 h-5 text-vox-red fill-vox-red" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => handleToggleBookmark(e, video)}
                                            className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 text-black z-20"
                                        >
                                            <Bookmark
                                                className={`w-4 h-4 ${bookmarks.find(b => b.id === video.id)
                                                    ? 'fill-vox-red text-vox-red border-none'
                                                    : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    <h3
                                        className="text-xl font-serif mb-3 line-clamp-2 leading-snug group-hover:text-vox-red transition-colors"
                                        dangerouslySetInnerHTML={{ __html: video.title }}
                                    ></h3>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{video.channelTitle}</span>
                                        <span>{formatDate(video.publishedAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90">
                    <button
                        onClick={() => setSelectedVideo(null)}
                        className="absolute top-6 right-6 text-white hover:text-vox-red transition-colors"
                    >
                        <X className="w-10 h-10" />
                    </button>
                    <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                            title={selectedVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
