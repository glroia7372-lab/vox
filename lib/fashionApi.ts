// News API Integration
export interface NewsArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
}

export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_BASE_URL = 'https://newsapi.org/v2';

export const fashionCategories = [
    { id: 'all', label: 'All', query: 'fashion luxury style' },
    { id: 'runway', label: 'Runway', query: 'fashion runway haute couture' },
    { id: 'streetstyle', label: 'Street Style', query: 'street style fashion' },
    { id: 'luxury', label: 'Luxury', query: 'luxury fashion designer' },
    { id: 'sustainable', label: 'Sustainable', query: 'sustainable fashion eco' },
];

export async function fetchFashionNews(query: string = 'fashion', limit: number = 20): Promise<NewsArticle[]> {
    if (!NEWS_API_KEY) {
        console.warn('News API Key is missing. Using mock data.');
        return getMockFashionArticles();
    }

    try {
        const response = await fetch(
            `${NEWS_BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${NEWS_API_KEY}`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }

        const data: NewsResponse = await response.json();
        return data.articles.filter(article => article.urlToImage); // Only articles with images
    } catch (error) {
        console.error('Error fetching fashion news:', error);
        return getMockFashionArticles();
    }
}

// Unsplash API Integration
export interface UnsplashPhoto {
    id: string;
    created_at: string;
    width: number;
    height: number;
    color: string;
    description: string | null;
    alt_description: string | null;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    links: {
        self: string;
        html: string;
        download: string;
    };
    user: {
        id: string;
        username: string;
        name: string;
        portfolio_url: string | null;
    };
}

export async function fetchFashionImages(query: string = 'fashion', perPage: number = 30): Promise<UnsplashPhoto[]> {
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
        console.warn('Unsplash API key not found. Using mock data.');
        return getMockFashionImages();
    }

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait`,
            {
                headers: {
                    'Authorization': `Client-ID ${accessKey}`
                },
                next: { revalidate: 3600 } // Cache for 1 hour
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching fashion images:', error);
        return getMockFashionImages();
    }
}

// Mock data for development/fallback
function getMockFashionArticles(): NewsArticle[] {
    return [
        {
            source: { id: null, name: 'Vogue' },
            author: 'Sarah Jenkins',
            title: 'The Return of 90s Minimalism: Why Less is More in 2026',
            description: 'From clean lines to neutral palettes, discover how the fashion world is embracing simplicity this season.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1539109132382-381bb3f1cffb?w=1200',
            publishedAt: new Date().toISOString(),
            content: 'Full article content...'
        },
        {
            source: { id: null, name: 'Business of Fashion' },
            author: 'Michael Chen',
            title: 'Sustainability in Luxury: How Top Brands are Adapting',
            description: 'Major fashion houses are rethinking their supply chains to meet new environmental standards.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1558769132-cb1aea1f5d1e?w=1200',
            publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            content: 'Full article content...'
        },
        {
            source: { id: null, name: 'WWD' },
            author: 'Elena Rossi',
            title: 'Milan Fashion Week Highlights: Every Standout Look',
            description: 'Relive the most breathtaking moments from the Italian fashion capital.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200',
            publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            content: 'Full article content...'
        },
        {
            source: { id: null, name: 'Elle' },
            author: 'Jessica White',
            title: 'The Best Street Style from Paris Fashion Week',
            description: 'See what the world\'s most fashionable people are wearing on the streets of Paris.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200',
            publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            content: 'Full article content...'
        }
    ];
}

function getMockFashionImages(): UnsplashPhoto[] {
    const mockImages = [
        'photo-1490481651871-ab68de25d43d',
        'photo-1483985988355-763728e1935b',
        'photo-1515886657613-9f3515b0c78f',
        'photo-1469334031218-e382a71b716b',
        'photo-1445205170230-053b83016050',
    ];

    return mockImages.map((id, index) => ({
        id: id,
        created_at: new Date().toISOString(),
        width: 3000,
        height: 4000,
        color: '#000000',
        description: `Fashion photo ${index + 1}`,
        alt_description: `Fashion and style image ${index + 1}`,
        urls: {
            raw: `https://images.unsplash.com/${id}?w=3000`,
            full: `https://images.unsplash.com/${id}?w=2000`,
            regular: `https://images.unsplash.com/${id}?w=1080`,
            small: `https://images.unsplash.com/${id}?w=400`,
            thumb: `https://images.unsplash.com/${id}?w=200`,
        },
        links: {
            self: `https://api.unsplash.com/photos/${id}`,
            html: `https://unsplash.com/photos/${id}`,
            download: `https://unsplash.com/photos/${id}/download`,
        },
        user: {
            id: 'user1',
            username: 'fashionphotographer',
            name: 'Fashion Photographer',
            portfolio_url: null,
        },
    }));
}
