// Runway API Integration (Fashion News API + Unsplash)

import { NewsArticle, fetchFashionNews } from './fashionApi';
import { UnsplashPhoto, fetchFashionImages } from './fashionApi';

// Runway-specific types
export interface RunwayShow {
    id: string;
    designer: string;
    collection: string;
    season: string;
    location: string;
    date: string;
    imageUrl: string;
    description: string;
    highlights: string[];
}

export interface RunwayArticle extends NewsArticle {
    designer?: string;
    collection?: string;
}

export const runwayCategories = [
    { id: 'all', label: 'All Shows', query: 'runway fashion week haute couture' },
    { id: 'paris', label: 'Paris Fashion Week', query: 'paris fashion week runway' },
    { id: 'milan', label: 'Milan Fashion Week', query: 'milan fashion week runway' },
    { id: 'newyork', label: 'New York Fashion Week', query: 'new york fashion week runway' },
    { id: 'london', label: 'London Fashion Week', query: 'london fashion week runway' },
    { id: 'hautecouture', label: 'Haute Couture', query: 'haute couture fashion show' },
    { id: 'designers', label: 'Designer Spotlights', query: 'fashion designer collection' },
];

export const topDesigners = [
    'Chanel',
    'Dior',
    'Gucci',
    'Prada',
    'Louis Vuitton',
    'Versace',
    'Balenciaga',
    'Saint Laurent',
    'Valentino',
    'Givenchy',
];

// Fetch runway news
export async function fetchRunwayNews(query: string = 'runway fashion week'): Promise<RunwayArticle[]> {
    try {
        const articles = await fetchFashionNews(query, 20);
        return articles.map(article => ({
            ...article,
            designer: extractDesigner(article.title),
            collection: extractCollection(article.title),
        }));
    } catch (error) {
        console.error('Error fetching runway news:', error);
        return getMockRunwayArticles();
    }
}

// Fetch runway images from Unsplash
export async function fetchRunwayImages(query: string = 'fashion runway'): Promise<UnsplashPhoto[]> {
    try {
        return await fetchFashionImages(query, 30);
    } catch (error) {
        console.error('Error fetching runway images:', error);
        return [];
    }
}

// Fetch runway shows (combined data)
export async function fetchRunwayShows(categoryId: string = 'all'): Promise<{
    articles: RunwayArticle[];
    images: UnsplashPhoto[];
}> {
    const category = runwayCategories.find(c => c.id === categoryId);
    const query = category?.query || 'runway fashion week';

    try {
        const [articles, images] = await Promise.all([
            fetchRunwayNews(query),
            fetchRunwayImages(query)
        ]);

        return { articles, images };
    } catch (error) {
        console.error('Error fetching runway shows:', error);
        return {
            articles: getMockRunwayArticles(),
            images: []
        };
    }
}

// Helper functions
function extractDesigner(title: string): string | undefined {
    const designer = topDesigners.find(d =>
        title.toLowerCase().includes(d.toLowerCase())
    );
    return designer;
}

function extractCollection(title: string): string | undefined {
    const seasonPattern = /(Spring|Summer|Fall|Winter|Autumn)\s*(\/\s*)?(Summer|Winter)?\s*20\d{2}/i;
    const match = title.match(seasonPattern);
    return match ? match[0] : undefined;
}

// Mock data for development/fallback
function getMockRunwayArticles(): RunwayArticle[] {
    return [
        {
            source: { id: null, name: 'Vogue Runway' },
            author: 'Fashion Editor',
            title: 'Chanel Spring/Summer 2026: A Return to Parisian Elegance',
            description: 'Virginie Viard presents a stunning collection that pays homage to Coco Chanel\'s timeless vision while embracing modern femininity.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1558769132-cb1aea1f5d1e?w=1200',
            publishedAt: new Date().toISOString(),
            content: 'Full article content...',
            designer: 'Chanel',
            collection: 'Spring/Summer 2026'
        },
        {
            source: { id: null, name: 'WWD' },
            author: 'Runway Reporter',
            title: 'Dior Haute Couture Fall 2026: Maria Grazia Chiuri\'s Masterpiece',
            description: 'The latest haute couture collection from Dior showcases exquisite craftsmanship and romantic silhouettes.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            content: 'Full article content...',
            designer: 'Dior',
            collection: 'Fall 2026 Haute Couture'
        },
        {
            source: { id: null, name: 'Harper\'s Bazaar' },
            author: 'Fashion Correspondent',
            title: 'Gucci Spring 2026: Sabato De Sarno\'s Bold New Direction',
            description: 'The creative director unveils a collection that balances heritage with contemporary edge.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
            content: 'Full article content...',
            designer: 'Gucci',
            collection: 'Spring 2026'
        },
        {
            source: { id: null, name: 'Elle' },
            author: 'Runway Analyst',
            title: 'Paris Fashion Week Highlights: The Best Shows of the Season',
            description: 'From Chanel to Saint Laurent, discover the standout moments from Paris Fashion Week.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200',
            publishedAt: new Date(Date.now() - 259200000).toISOString(),
            content: 'Full article content...',
        },
        {
            source: { id: null, name: 'Business of Fashion' },
            author: 'Industry Expert',
            title: 'Prada Fall 2026: Miuccia Prada and Raf Simons Continue Their Creative Dialogue',
            description: 'The design duo presents a thought-provoking collection that challenges fashion conventions.',
            url: 'https://example.com/prada-fw26',
            urlToImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200',
            publishedAt: new Date(Date.now() - 345600000).toISOString(),
            content: 'Full article content...',
            designer: 'Prada',
            collection: 'Fall 2026'
        },
        {
            source: { id: null, name: 'Vogue' },
            author: 'Fashion Writer',
            title: 'Valentino Spring 2026: Pierpaolo Piccioli\'s Ode to Romance',
            description: 'Flowing fabrics and dreamy silhouettes define this ethereal collection.',
            url: 'https://example.com/valentino-ss26',
            urlToImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200',
            publishedAt: new Date(Date.now() - 432000000).toISOString(),
            content: 'Full article content...',
            designer: 'Valentino',
            collection: 'Spring 2026'
        },
    ];
}

// Featured runway shows
export const featuredShows: RunwayShow[] = [
    {
        id: '1',
        designer: 'Chanel',
        collection: 'Spring/Summer 2026',
        season: 'SS26',
        location: 'Paris',
        date: '2026-01-15',
        imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea1f5d1e?w=1200',
        description: 'Virginie Viard\'s latest collection for Chanel celebrates the maison\'s heritage with a modern twist.',
        highlights: [
            'Tweed suits in pastel hues',
            'Pearl-embellished accessories',
            'Iconic quilted handbags reimagined'
        ]
    },
    {
        id: '2',
        designer: 'Dior',
        collection: 'Haute Couture Fall 2026',
        season: 'FW26 HC',
        location: 'Paris',
        date: '2026-01-10',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
        description: 'Maria Grazia Chiuri presents a masterclass in haute couture craftsmanship.',
        highlights: [
            'Hand-embroidered gowns',
            'Architectural silhouettes',
            'Romantic tulle creations'
        ]
    },
    {
        id: '3',
        designer: 'Gucci',
        collection: 'Spring 2026',
        season: 'SS26',
        location: 'Milan',
        date: '2026-01-08',
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
        description: 'Sabato De Sarno continues to redefine Gucci with bold colors and innovative designs.',
        highlights: [
            'Vibrant color blocking',
            'Oversized tailoring',
            'Statement accessories'
        ]
    },
];
