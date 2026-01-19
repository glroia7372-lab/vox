// YouTube Data API Integration
export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    publishedAt: string;
    viewCount?: string;
}

export interface VideoCategory {
    id: string;
    label: string;
    query: string;
    channelId?: string;
}

export const videoCategories: VideoCategory[] = [
    { id: 'all', label: 'All Videos', query: 'fashion runway beauty vogue' },
    { id: 'runway', label: 'Runway', query: 'fashion week runway show', channelId: 'UCA9S6LzTScDgUnmUAn66stA' }, // Vogue Runway
    { id: 'beauty', label: 'Beauty', query: 'beauty makeup tutorial', channelId: 'UCRv76wLBC73jiP7LX4C3l8Q' }, // Vogue Beauty
    { id: 'interviews', label: 'Interviews', query: 'fashion designer interview celebrity', channelId: 'UCh996n_5S-Wv0vjJ2pWd9YQ' }, // Vogue
    { id: 'events', label: 'Events & Parties', query: 'met gala fashion event red carpet' },
];

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function fetchVideos(categoryId: string = 'all'): Promise<YouTubeVideo[]> {
    if (!YOUTUBE_API_KEY) {
        console.warn('YouTube API Key is missing. Using mock data.');
        return getMockVideos(categoryId);
    }

    const category = videoCategories.find(c => c.id === categoryId) || videoCategories[0];

    try {
        let url = `${BASE_URL}/search?part=snippet&maxResults=12&type=video&key=${YOUTUBE_API_KEY}`;

        if (category.channelId) {
            url += `&channelId=${category.channelId}`;
        }

        url += `&q=${encodeURIComponent(category.query)}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('YouTube API request failed');

        const data = await response.json();

        return data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
        }));
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return getMockVideos(categoryId);
    }
}

function getMockVideos(categoryId: string): YouTubeVideo[] {
    const mockVideos = [
        {
            id: 'v_N76-mUAn6', // Just a placeholder ID
            title: 'Inside Chanel\'s Haute Couture Atelier | VOX Original',
            description: 'Discover the incredible craftsmanship behind Chanel\'s latest collection. From embroidery to final fittings.',
            thumbnail: 'https://images.unsplash.com/photo-1558769132-cb1aea1f5d1e?w=800',
            channelTitle: 'VOX Magazine',
            publishedAt: new Date().toISOString(),
        },
        {
            id: 'y_ScDgUnmU',
            title: '7 Days, 7 Looks: Gigi Hadid\'s Fashion Week Wardrobe',
            description: 'Supermodel Gigi Hadid takes us through her busy week at New York Fashion Week.',
            thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
            channelTitle: 'VOX Fashion',
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 'z_LBC73jiP',
            title: 'Beauty Secrets: Modern Rogue Look for Spring 2026',
            description: 'Master the "Modern Rogue" makeup trend that dominated the Milan runways.',
            thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
            channelTitle: 'VOX Beauty',
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
            id: 'a_Wv0vjJ2p',
            title: 'Met Gala 2026: The Best Dressed Celebrities',
            description: 'Relive the most iconic fashion moments from the red carpet of the year.',
            thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
            channelTitle: 'VOX Culture',
            publishedAt: new Date(Date.now() - 259200000).toISOString(),
        },
        {
            id: 'b_DgUnmUAn6',
            title: 'Dior Spring/Summer 2026 Full Runway Show',
            description: 'The complete presentation of Maria Grazia Chiuri\'s latest vision for Dior.',
            thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
            channelTitle: 'VOX Runway',
            publishedAt: new Date(Date.now() - 345600000).toISOString(),
        },
        {
            id: 'c_6LzTScDgU',
            title: 'In the Bag: Fashion Editor\'s Essentials',
            description: 'See what our Senior Fashion Editor carries to the front row during Paris Fashion Week.',
            thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
            channelTitle: 'VOX Magazine',
            publishedAt: new Date(Date.now() - 432000000).toISOString(),
        }
    ];

    if (categoryId === 'all') return mockVideos;
    return mockVideos.filter(v =>
        v.title.toLowerCase().includes(categoryId.toLowerCase()) ||
        v.channelTitle.toLowerCase().includes(categoryId.toLowerCase())
    );
}
