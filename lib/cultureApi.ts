// Culture News API Integration (NewsData.io + Guardian API)

// NewsData.io Types
export interface NewsDataArticle {
    article_id: string;
    title: string;
    link: string;
    keywords: string[] | null;
    creator: string[] | null;
    video_url: string | null;
    description: string;
    content: string;
    pubDate: string;
    image_url: string | null;
    source_id: string;
    source_priority: number;
    country: string[];
    category: string[];
    language: string;
}

export interface NewsDataResponse {
    status: string;
    totalResults: number;
    results: NewsDataArticle[];
    nextPage?: string;
}

// Guardian API Types
export interface GuardianArticle {
    id: string;
    type: string;
    sectionId: string;
    sectionName: string;
    webPublicationDate: string;
    webTitle: string;
    webUrl: string;
    apiUrl: string;
    fields?: {
        headline: string;
        trailText: string;
        thumbnail?: string;
        bodyText?: string;
    };
}

export interface GuardianResponse {
    response: {
        status: string;
        userTier: string;
        total: number;
        startIndex: number;
        pageSize: number;
        currentPage: number;
        pages: number;
        results: GuardianArticle[];
    };
}

// Unified Culture Article Type
export interface CultureArticle {
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl: string | null;
    publishedAt: string;
    source: string;
    category: string;
    author?: string;
    viewCount?: string; // Added for mock data
}

export const cultureCategories = [
    { id: 'all', label: 'All', query: 'culture lifestyle' },
    { id: 'art', label: 'Art & Design', query: 'art design exhibition' },
    { id: 'music', label: 'Music', query: 'music concert album' },
    { id: 'film', label: 'Film & TV', query: 'film movie television' },
    { id: 'books', label: 'Books', query: 'books literature author' },
    { id: 'travel', label: 'Travel', query: 'travel destination tourism' },
    { id: 'food', label: 'Food & Dining', query: 'food restaurant culinary' },
    { id: 'fashion', label: 'Fashion', query: 'fashion culture style' },
];

// Fetch from NewsData.io
export async function fetchNewsDataArticles(
    query: string = 'culture',
    category: string = 'lifestyle'
): Promise<CultureArticle[]> {
    const apiKey = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY;

    if (!apiKey || apiKey === 'your_newsdata_api_key_here') {
        console.warn('NewsData.io API key not found. Using mock data.');
        return getMockCultureArticles().slice(0, 10);
    }

    try {
        const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&category=${category}&language=en`;

        const response = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from NewsData.io');
        }

        const data: NewsDataResponse = await response.json();

        return data.results.map(article => ({
            id: article.article_id,
            title: article.title,
            description: article.description || '',
            url: article.link,
            imageUrl: article.image_url,
            publishedAt: article.pubDate,
            source: article.source_id,
            category: article.category[0] || 'culture',
            author: article.creator?.[0],
        }));
    } catch (error) {
        console.error('Error fetching from NewsData.io:', error);
        return getMockCultureArticles().slice(0, 10);
    }
}

// Fetch from Guardian API
export async function fetchGuardianArticles(
    query: string = 'culture',
    section: string = 'culture'
): Promise<CultureArticle[]> {
    const apiKey = process.env.NEXT_PUBLIC_GUARDIAN_API_KEY;

    if (!apiKey || apiKey === 'your_guardian_api_key_here') {
        console.warn('Guardian API key not found. Using mock data.');
        return getMockCultureArticles().slice(10, 20);
    }

    try {
        const url = `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&section=${section}&show-fields=headline,trailText,thumbnail,bodyText&api-key=${apiKey}`;

        const response = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from Guardian API');
        }

        const data: GuardianResponse = await response.json();

        return data.response.results.map(article => ({
            id: article.id,
            title: article.fields?.headline || article.webTitle,
            description: article.fields?.trailText || '',
            url: article.webUrl,
            imageUrl: article.fields?.thumbnail || null,
            publishedAt: article.webPublicationDate,
            source: 'The Guardian',
            category: article.sectionName,
        }));
    } catch (error) {
        console.error('Error fetching from Guardian API:', error);
        return getMockCultureArticles().slice(10, 20);
    }
}

// Fetch combined culture content
export async function fetchCultureContent(categoryId: string = 'all'): Promise<CultureArticle[]> {
    const category = cultureCategories.find(c => c.id === categoryId);
    const query = category?.query || 'culture lifestyle';

    try {
        // Fetch from both sources in parallel
        const [newsDataArticles, guardianArticles] = await Promise.all([
            fetchNewsDataArticles(query, 'lifestyle'),
            fetchGuardianArticles(query, 'culture')
        ]);

        // Combine and sort by date
        const combined = [...newsDataArticles, ...guardianArticles];
        return combined.sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    } catch (error) {
        console.error('Error fetching culture content:', error);
        return getMockCultureArticles();
    }
}

// Mock data for development/fallback
function getMockCultureArticles(): CultureArticle[] {
    return [
        {
            id: '1',
            title: 'The Rise of Digital Art: NFTs and the Future of Creativity',
            description: 'Exploring how blockchain technology is revolutionizing the art world and creating new opportunities for artists.',
            url: '#',
            imageUrl: 'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=800',
            publishedAt: new Date().toISOString(),
            source: 'Culture Magazine',
            category: 'Art & Design',
        },
        {
            id: '2',
            title: 'Sustainable Fashion Meets High Culture',
            description: 'How luxury brands are embracing sustainability without compromising on style and elegance.',
            url: '#',
            imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea1f5d1e?w=800',
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            source: 'The Guardian',
            category: 'Fashion',
        },
        {
            id: '3',
            title: 'Jazz Renaissance: New Voices in Contemporary Music',
            description: 'A new generation of jazz musicians is bringing fresh perspectives to this timeless genre.',
            url: '#',
            imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
            source: 'Music Today',
            category: 'Music',
        },
        {
            id: '4',
            title: 'The Golden Age of Television: Streaming Wars and Quality Content',
            description: 'How streaming platforms are competing to produce the most compelling original content.',
            url: '#',
            imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800',
            publishedAt: new Date(Date.now() - 259200000).toISOString(),
            source: 'Entertainment Weekly',
            category: 'Film & TV',
        },
        {
            id: '5',
            title: 'Literary Trends 2026: What We\'re Reading This Year',
            description: 'From climate fiction to historical novels, discover the books shaping contemporary literature.',
            url: '#',
            imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
            publishedAt: new Date(Date.now() - 345600000).toISOString(),
            source: 'Book Review',
            category: 'Books',
        },
        {
            id: '6',
            title: 'Hidden Gems: Undiscovered Travel Destinations for 2026',
            description: 'Escape the crowds and explore these lesser-known but equally stunning destinations.',
            url: '#',
            imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
            publishedAt: new Date(Date.now() - 432000000).toISOString(),
            source: 'Travel & Leisure',
            category: 'Travel',
        },
        {
            id: '7',
            title: 'Farm to Table: The Future of Fine Dining',
            description: 'How restaurants are reimagining luxury dining with locally sourced, sustainable ingredients.',
            url: '#',
            imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
            publishedAt: new Date(Date.now() - 518400000).toISOString(),
            source: 'Culinary Arts',
            category: 'Food & Dining',
        },
        {
            id: '8',
            title: 'Museum Exhibitions You Can\'t Miss This Season',
            description: 'From contemporary installations to classical retrospectives, here are the must-see exhibitions.',
            url: '#',
            imageUrl: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800',
            publishedAt: new Date(Date.now() - 604800000).toISOString(),
            source: 'Art Review',
            category: 'Art & Design',
        },
    ];
}
