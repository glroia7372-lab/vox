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
const NEWS_BASE_URL = "https://newsapi.org/v2";

export const fashionCategories = [
  { id: "all", label: "All", query: "fashion luxury style" },
  { id: "runway", label: "Runway", query: "fashion runway haute couture" },
  { id: "streetstyle", label: "Street Style", query: "street style fashion" },
  { id: "luxury", label: "Luxury", query: "luxury fashion designer" },
  { id: "sustainable", label: "Sustainable", query: "sustainable fashion eco" },
];

export async function fetchFashionNews(
  query: string = "fashion",
  limit: number = 20
): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) {
    console.warn("News API Key is missing. Using mock data.");
    return getMockFashionArticles();
  }

  try {
    const response = await fetch(
      `${NEWS_BASE_URL}/everything?q=${encodeURIComponent(
        query
      )}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${NEWS_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const data: NewsResponse = await response.json();
    return data.articles.filter((article) => article.urlToImage); // Only articles with images
  } catch (error) {
    console.error("Error fetching fashion news:", error);
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

export async function fetchFashionImages(
  query: string = "fashion",
  perPage: number = 30
): Promise<UnsplashPhoto[]> {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  // Unsplash API keys are typically longer than 32 characters
  // If the key is missing, invalid, or looks like a placeholder, use mock data
  if (
    !accessKey ||
    accessKey.length < 40 ||
    accessKey === "your_unsplash_access_key_here"
  ) {
    console.warn("Unsplash API key not found or invalid. Using mock data.");
    return getMockFashionImages();
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${perPage}&orientation=portrait`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.warn("Unsplash API request failed. Using mock data.");
      return getMockFashionImages();
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.warn("Error fetching fashion images, using mock data:", error);
    return getMockFashionImages();
  }
}

// Mock data for development/fallback
function getMockFashionArticles(): NewsArticle[] {
  return [
    {
      source: { id: null, name: "Vogue" },
      author: "Sarah Jenkins",
      title: "The Return of 90s Minimalism: Why Less is More in 2026",
      description:
        "From clean lines to neutral palettes, discover how the fashion world is embracing simplicity this season.",
      url: "#",
      urlToImage:
        "https://images.unsplash.com/photo-1539109132382-381bb3f1cffb?w=1200",
      publishedAt: new Date().toISOString(),
      content: "Full article content...",
    },
    {
      source: { id: null, name: "Business of Fashion" },
      author: "Michael Chen",
      title: "Sustainability in Luxury: How Top Brands are Adapting",
      description:
        "Major fashion houses are rethinking their supply chains to meet new environmental standards.",
      url: "#",
      urlToImage:
        "https://images.unsplash.com/photo-1558769132-cb1aea1f5d1e?w=1200",
      publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      content: "Full article content...",
    },
    {
      source: { id: null, name: "WWD" },
      author: "Elena Rossi",
      title: "Milan Fashion Week Highlights: Every Standout Look",
      description:
        "Relive the most breathtaking moments from the Italian fashion capital.",
      url: "#",
      urlToImage:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200",
      publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      content: "Full article content...",
    },
    {
      source: { id: null, name: "Elle" },
      author: "Jessica White",
      title: "The Best Street Style from Paris Fashion Week",
      description:
        "See what the world's most fashionable people are wearing on the streets of Paris.",
      url: "#",
      urlToImage:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200",
      publishedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      content: "Full article content...",
    },
  ];
}

function getMockFashionImages(): UnsplashPhoto[] {
  const mockImages = [
    "photo-1490481651871-ab68de25d43d",
    "photo-1483985988355-763728e1935b",
    "photo-1515886657613-9f3515b0c78f",
    "photo-1469334031218-e382a71b716b",
    "photo-1445205170230-053b83016050",
    "photo-1558769132-cb1aea1f5d1e",
    "photo-1509631179647-b849389274e9",
    "photo-1441984904996-e0b6ba687e04",
    "photo-1487222477894-8943e31ef7b2",
    "photo-1496747611176-843222e1e57c",
    "photo-1539109136881-3be0616acf4b",
    "photo-1558618666-fcd25c85cd64",
    "photo-1485968579580-b6d095142e6e",
    "photo-1492707892479-7bc8d5a4ee93",
    "photo-1434389677669-e08b4cac3105",
    "photo-1475180098004-ca77a66827be",
    "photo-1485462537746-965f33f7f6a7",
    "photo-1495385794356-15371f348c31",
    "photo-1512436991641-6745cdb1723f",
    "photo-1529139574466-a303027c1d8b",
  ];

  return mockImages.map((id, index) => ({
    id: `${id}-${index}`,
    created_at: new Date(Date.now() - index * 86400000).toISOString(),
    width: 3000,
    height: 4000,
    color: "#000000",
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
      id: `user${index + 1}`,
      username: "fashionphotographer",
      name: "Fashion Photographer",
      portfolio_url: null,
    },
  }));
}
