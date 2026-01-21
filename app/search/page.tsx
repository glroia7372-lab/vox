"use client";

import { useApp } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { categoryContents } from "@/lib/data";
import { useState, useEffect, Suspense } from "react";

function SearchContent() {
  const { showDarkMode } = useApp();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate search across all categories
    const allContent = Object.values(categoryContents).flat();
    const filtered = allContent.filter(
      (item: any) =>
        item.title.toLowerCase().includes(query?.toLowerCase() || "") ||
        item.description.toLowerCase().includes(query?.toLowerCase() || "")
    );

    // Mock delay for premium feel
    const timer = setTimeout(() => {
      setResults(filtered);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div
      className={`pt-32 px-6 pb-20 min-h-screen ${
        showDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <Search className="w-6 h-6 text-vox-red" />
            <h1 className="text-sm font-black tracking-[0.4em] uppercase opacity-50">
              Search Results
            </h1>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif">
            Results for <span className="italic">"{query}"</span>
          </h2>
          <p className="mt-4 text-gray-400 font-light">
            {results.length}개의 매치되는 결과를 찾았습니다.
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-vox-red" />
            <p className="text-xs tracking-[0.3em] uppercase opacity-40">
              Scanning Global Archives...
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {results.map((item, idx) => (
              <article key={idx} className="group cursor-pointer flex flex-col">
                <div className="aspect-[4/5] overflow-hidden mb-6 bg-gray-200 relative">
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1558769132-cb1aea9f3dbc?w=600"
                    }
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1558769132-cb1aea9f3dbc?w=600";
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="space-y-3">
                  <div
                    className={`text-[10px] font-black tracking-widest uppercase ${
                      showDarkMode ? "text-vox-red" : "text-gray-500"
                    }`}
                  >
                    {item.date} — {item.author}
                  </div>
                  <h3 className="text-2xl font-serif leading-tight group-hover:text-vox-red transition-colors">
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      showDarkMode ? "text-gray-400" : "text-gray-600"
                    } line-clamp-2 font-light`}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 space-y-6">
            <p className="text-2xl font-serif italic opacity-40">
              No records found matching your voice.
            </p>
            <p className="text-sm text-gray-500">
              다른 키워드로 검색하거나 트렌드 아카이브를 확인해 보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchFallback() {
  return (
    <div className="pt-32 px-6 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-vox-red" />
          <p className="text-xs tracking-[0.3em] uppercase opacity-40">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchContent />
    </Suspense>
  );
}
