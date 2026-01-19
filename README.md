# VOX Fashion Magazine

A modern, data-driven fashion magazine platform built with Next.js, featuring real-time trend analysis and personalized content curation.

## 🚀 Features

- **Real-time Trend Archive**: Live fashion trends from around the world
- **Personalized Style Quiz**: AI-powered style DNA analysis
- **Premium Subscriber Features**:
  - Detailed trend reports with TOP 5 analytics
  - Personal mood board for organizing trends
  - Keyword alerts for real-time notifications
- **Fashion Section**: Latest fashion news and style inspiration from News API + Unsplash
- **Beauty Section**: Comprehensive beauty product database with Makeup API
- **Culture Section**: Art, music, film, and lifestyle content from NewsData.io + Guardian API
- **Video Section**: Exclusive fashion films and runway highlights integrated via YouTube Data API.
- **Runway Section**: Fashion week coverage and designer collections
- **Dark Mode**: Elegant dark theme support

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- API Keys (all free):
  - [News API](https://newsapi.org) - For fashion news articles
  - [Unsplash API](https://unsplash.com/developers) - For high-quality fashion images
  - [NewsData.io API](https://newsdata.io) - For culture and lifestyle news
  - **YouTube Data API**: For the Video section content. Get at [Google Cloud Console](https://console.cloud.google.com/).
  - [Guardian API](https://open-platform.theguardian.com) - For culture content

## 🔑 API Setup

### 1. News API (newsapi.org)
1. Visit [https://newsapi.org](https://newsapi.org)
2. Click "Get API Key" and sign up for a free account
3. Copy your API key from the dashboard
4. **Free Plan**: Development use, limited requests

### 2. Unsplash API (unsplash.com)
1. Visit [https://unsplash.com/developers](https://unsplash.com/developers)
2. Click "Register as a developer"
3. Create a new application
4. Copy your "Access Key"
5. **Free Plan**: 50 requests/hour

### 3. NewsData.io API (newsdata.io)
1. Visit [https://newsdata.io](https://newsdata.io)
2. Sign up for a free account
3. Copy your API key
4. **Free Plan**: 200 requests/day

### 4. Guardian API (open-platform.theguardian.com)
1. Visit [https://open-platform.theguardian.com](https://open-platform.theguardian.com)
2. Register for a developer key
3. Copy your API key
4. **Free Plan**: 5,000 requests/day

### 5. YouTube Data API (console.cloud.google.com)
1. Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create a new project or select an existing one.
3. Enable the "YouTube Data API v3" for your project.
4. Go to "Credentials" and create an API key.
5. Copy your API key.
6. **Free Plan**: 10,000 units/day (sufficient for most uses)

### 6. Environment Variables
Create a `.env.local` file in the root directory:

```bash
# News API (https://newsapi.org)
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here

# Unsplash API (https://unsplash.com/developers)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here

# NewsData.io API (https://newsdata.io)
NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key_here

# Guardian API (https://open-platform.theguardian.com)
NEXT_PUBLIC_GUARDIAN_API_KEY=your_guardian_api_key_here

# YouTube Data API (https://console.cloud.google.com/)
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

**Note**: Replace the placeholder values with your actual API keys.

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Pages

- **Home** (`/`) - Landing page with service introduction and style quiz
- **Fashion** (`/fashion`) - Latest fashion news and trends with News API + Unsplash
- **Beauty** (`/beauty`) - Beauty products database with Makeup API
- **Culture** (`/culture`) - Art, music, film, and lifestyle content
- **Runway** (`/runway`) - Fashion week coverage and designer collections
- **Archive** (`/archive`) - Real-time trend archive with premium features
- **Dashboard** (`/dashboard`) - Subscriber dashboard (requires subscription)

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **APIs**: 
  - News API (Fashion news)
  - Unsplash API (Fashion images)

## 🔒 Development Mode

For testing premium features without subscribing:
1. Open the hamburger menu
2. Scroll to the bottom
3. Click `[DEV] 구독자 모드 ON`

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.
