// Makeup API Integration (http://makeup-api.herokuapp.com)
export interface MakeupProduct {
    id: number;
    brand: string;
    name: string;
    price: string;
    price_sign: string | null;
    currency: string | null;
    image_link: string;
    product_link: string;
    website_link: string;
    description: string;
    rating: number | null;
    category: string | null;
    product_type: string;
    tag_list: string[];
    created_at: string;
    updated_at: string;
    product_api_url: string;
    api_featured_image: string;
    product_colors: ProductColor[];
}

export interface ProductColor {
    hex_value: string;
    colour_name: string | null;
}

export interface BeautyCategory {
    id: string;
    label: string;
    type: string;
    icon: string;
}

export const beautyCategories: BeautyCategory[] = [
    { id: 'all', label: 'All Products', type: '', icon: '💄' },
    { id: 'lipstick', label: 'Lipstick', type: 'lipstick', icon: '💋' },
    { id: 'foundation', label: 'Foundation', type: 'foundation', icon: '✨' },
    { id: 'eyeshadow', label: 'Eyeshadow', type: 'eyeshadow', icon: '👁️' },
    { id: 'eyeliner', label: 'Eyeliner', type: 'eyeliner', icon: '✏️' },
    { id: 'mascara', label: 'Mascara', type: 'mascara', icon: '👀' },
    { id: 'blush', label: 'Blush', type: 'blush', icon: '🌸' },
    { id: 'bronzer', label: 'Bronzer', type: 'bronzer', icon: '☀️' },
    { id: 'nail_polish', label: 'Nail Polish', type: 'nail_polish', icon: '💅' },
];

export const beautyBrands = [
    'maybelline',
    'covergirl',
    'nyx',
    'revlon',
    'l\'oreal',
    'essie',
    'clinique',
    'smashbox',
    'benefit',
    'dior',
];

export async function fetchBeautyProducts(
    productType?: string,
    brand?: string,
    limit: number = 80
): Promise<MakeupProduct[]> {
    try {
        let url = 'http://makeup-api.herokuapp.com/api/v1/products.json?';

        const params = new URLSearchParams();
        if (productType) params.append('product_type', productType);
        if (brand) params.append('brand', brand);

        const response = await fetch(url + params.toString(), {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch beauty products');
        }

        const data: MakeupProduct[] = await response.json();

        // Filter out products without images and limit results
        return data
            .filter(product => product.image_link && product.image_link.trim() !== '')
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching beauty products:', error);
        return getMockBeautyProducts();
    }
}

export async function searchBeautyProducts(query: string): Promise<MakeupProduct[]> {
    try {
        // Search by product name or brand
        const allProducts = await fetchBeautyProducts();
        return allProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase())
        );
    } catch (error) {
        console.error('Error searching beauty products:', error);
        return [];
    }
}

export async function getProductsByBrand(brand: string): Promise<MakeupProduct[]> {
    return fetchBeautyProducts(undefined, brand);
}

export async function getFeaturedProducts(): Promise<MakeupProduct[]> {
    try {
        const products = await fetchBeautyProducts();
        // Get products with ratings or random selection
        return products
            .filter(p => p.rating !== null && p.rating > 4)
            .slice(0, 12);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return getMockBeautyProducts().slice(0, 6);
    }
}

// Mock data for development/fallback
function getMockBeautyProducts(): MakeupProduct[] {
    return [
        {
            id: 1,
            brand: 'maybelline',
            name: 'Maybelline Fit Me Matte + Poreless Foundation',
            price: '7.99',
            price_sign: '$',
            currency: 'USD',
            image_link: 'https://d3t32hsnjxo7q6.cloudfront.net/i/991799d3e70b8856686979f8ff6dcfe0_ra,w158,h184_pa,w158,h184.png',
            product_link: 'https://well.ca/products/maybelline-fit-me-matte-poreless_88837.html',
            website_link: 'https://well.ca',
            description: 'Maybelline Fit Me Matte + Poreless Foundation fits skin tone and texture.',
            rating: 4.5,
            category: 'powder',
            product_type: 'foundation',
            tag_list: ['vegan', 'gluten free'],
            created_at: '2016-10-01T18:36:15.012Z',
            updated_at: '2017-12-23T21:08:50.624Z',
            product_api_url: 'http://makeup-api.herokuapp.com/api/v1/products/1.json',
            api_featured_image: 'https://d3t32hsnjxo7q6.cloudfront.net/i/991799d3e70b8856686979f8ff6dcfe0_ra,w158,h184_pa,w158,h184.png',
            product_colors: [
                { hex_value: '#F4C6A6', colour_name: 'Classic Ivory' },
                { hex_value: '#E9C8A8', colour_name: 'Natural Beige' }
            ]
        },
        {
            id: 2,
            brand: 'nyx',
            name: 'NYX Soft Matte Lip Cream',
            price: '6.00',
            price_sign: '$',
            currency: 'USD',
            image_link: 'https://d3t32hsnjxo7q6.cloudfront.net/i/d84489c8e05bb1a34b0db6d0e9e1d21a_ra,w158,h184_pa,w158,h184.png',
            product_link: 'https://well.ca/products/nyx-soft-matte-lip-cream_99123.html',
            website_link: 'https://well.ca',
            description: 'NYX Soft Matte Lip Cream is a liquid lipstick that dries to a matte finish.',
            rating: 4.8,
            category: null,
            product_type: 'lipstick',
            tag_list: ['vegan'],
            created_at: '2016-10-01T18:36:32.235Z',
            updated_at: '2017-12-23T21:08:47.102Z',
            product_api_url: 'http://makeup-api.herokuapp.com/api/v1/products/2.json',
            api_featured_image: 'https://d3t32hsnjxo7q6.cloudfront.net/i/d84489c8e05bb1a34b0db6d0e9e1d21a_ra,w158,h184_pa,w158,h184.png',
            product_colors: [
                { hex_value: '#8B1A1A', colour_name: 'Amsterdam' },
                { hex_value: '#C45B5B', colour_name: 'Stockholm' }
            ]
        },
        {
            id: 3,
            brand: 'l\'oreal',
            name: 'L\'Oréal Infallible Pro-Matte Foundation',
            price: '12.99',
            price_sign: '$',
            currency: 'USD',
            image_link: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
            product_link: 'https://example.com',
            website_link: 'https://example.com',
            description: 'Long-wear foundation with a matte finish.',
            rating: 4.3,
            category: 'foundation',
            product_type: 'foundation',
            tag_list: [],
            created_at: '2016-10-01T18:36:32.235Z',
            updated_at: '2017-12-23T21:08:47.102Z',
            product_api_url: 'http://makeup-api.herokuapp.com/api/v1/products/3.json',
            api_featured_image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
            product_colors: []
        },
        {
            id: 4,
            brand: 'clinique',
            name: 'Clinique Almost Lipstick - Black Honey',
            price: '22.00',
            price_sign: '$',
            currency: 'USD',
            image_link: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
            product_link: 'https://example.com',
            website_link: 'https://example.com',
            description: 'The cult-classic transparent lipstick that looks good on everyone.',
            rating: 4.9,
            category: 'lipstick',
            product_type: 'lipstick',
            tag_list: ['hypoallergenic'],
            created_at: '2016-10-01T18:36:32.235Z',
            updated_at: '2017-12-23T21:08:47.102Z',
            product_api_url: 'http://makeup-api.herokuapp.com/api/v1/products/4.json',
            api_featured_image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
            product_colors: []
        },
        {
            id: 5,
            brand: 'dior',
            name: 'Dior Addict Lip Glow',
            price: '38.00',
            price_sign: '$',
            currency: 'USD',
            image_link: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=400',
            product_link: 'https://example.com',
            website_link: 'https://example.com',
            description: 'The first Dior lip balm formulated with 97% natural-origin ingredients.',
            rating: 4.7,
            category: 'lip_balm',
            product_type: 'lip_balm',
            tag_list: ['luxury'],
            created_at: '2016-10-01T18:36:32.235Z',
            updated_at: '2017-12-23T21:08:47.102Z',
            product_api_url: 'http://makeup-api.herokuapp.com/api/v1/products/5.json',
            api_featured_image: 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=400',
            product_colors: []
        },
        {
            id: 6,
            brand: 'essie',
            name: 'Essie Nail Polish - Ballet Slippers',
            price: '9.00',
            price_sign: '$',
            currency: 'USD',
            image_link: 'https://images.unsplash.com/photo-1636019281327-49363381318a?w=400',
            product_link: 'https://example.com',
            website_link: 'https://example.com',
            description: 'The iconic sheer pink nail polish.',
            rating: 4.6,
            category: 'nail_polish',
            product_type: 'nail_polish',
            tag_list: [],
            created_at: '2016-10-01T18:36:32.235Z',
            updated_at: '2017-12-23T21:08:47.102Z',
            product_api_url: 'http://makeup-api.herokuapp.com/api/v1/products/6.json',
            api_featured_image: 'https://images.unsplash.com/photo-1636019281327-49363381318a?w=400',
            product_colors: []
        }
    ];
}

// Beauty trends and tips (static content)
export interface BeautyTrend {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
}

export const beautyTrends: BeautyTrend[] = [
    {
        id: '1',
        title: 'Clean Beauty Revolution',
        description: 'Discover the latest in sustainable and eco-friendly beauty products that are good for you and the planet.',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
        category: 'Trend'
    },
    {
        id: '2',
        title: 'K-Beauty Skincare Routine',
        description: 'Master the 10-step Korean skincare routine for glowing, healthy skin.',
        image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
        category: 'Skincare'
    },
    {
        id: '3',
        title: 'Bold Lip Colors for 2026',
        description: 'From deep berries to vibrant corals, explore the hottest lip colors of the season.',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
        category: 'Makeup'
    },
    {
        id: '4',
        title: 'Natural Glow Makeup',
        description: 'Achieve a radiant, natural look with these expert makeup tips and product recommendations.',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
        category: 'Tutorial'
    },
];
