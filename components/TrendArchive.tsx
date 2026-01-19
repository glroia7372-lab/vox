export default function TrendArchive() {
    return (
        <section className="p-8 lg:p-20 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-baseline mb-24">
                <h4 className="headline-display text-5xl italic">Weekly Index</h4>
                <span className="font-sans text-sm font-bold border-b border-[#E60012] pb-1 cursor-pointer">View All Archive +</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="group cursor-pointer">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-6 relative">
                            <img
                                src={`https://images.unsplash.com/photo-1515886657613-91f3515b0c78?auto=format&fit=crop&w=800&q=80&idx=${i}`}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78?w=800';
                                }}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                alt={`Trend ${i}`}
                            />
                            <div className="absolute inset-0 border-[0px] group-hover:border-[1px] border-[#E60012] transition-all duration-300" />
                        </div>
                        <p className="font-sans text-[9px] font-bold text-gray-400 tracking-[0.2em] mb-2 uppercase">Collection 0{i}</p>
                        <h5 className="font-serif text-xl font-black italic group-hover:text-[#E60012] transition-colors uppercase">Essential Item</h5>
                    </div>
                ))}
            </div>
        </section>
    );
}
