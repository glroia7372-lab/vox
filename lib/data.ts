export const styleQuiz = [
    {
        question: "주말 외출 시 선호하는 스타일은?",
        options: [
            { text: "심플한 화이트 티셔츠 + 데님", style: "Minimal", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop" },
            { text: "오버사이즈 후디 + 카고 팬츠", style: "Street", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop" },
            { text: "테일러드 재킷 + 슬랙스", style: "Classic", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop" },
            { text: "빈티지 블라우스 + 플리츠 스커트", style: "Romantic", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop" }
        ]
    },
    {
        question: "한 달 의류 구매 예산은?",
        options: [
            { text: "10만원 이하", budget: "entry" },
            { text: "10-30만원", budget: "mid" },
            { text: "30-50만원", budget: "premium" },
            { text: "50만원 이상", budget: "luxury" }
        ]
    },
    {
        question: "주로 쇼핑하는 시간대는?",
        options: [
            { text: "출근 전 아침", time: "morning" },
            { text: "점심시간", time: "lunch" },
            { text: "퇴근 후 저녁", time: "evening" },
            { text: "주말 낮", time: "weekend" }
        ]
    }
];

export const realtimeTrends = [
    {
        keyword: "#QuietLuxury",
        mentions: 12847,
        growth: "+245%",
        category: "Style",
        time: "1시간 전",
        city: "Paris"
    },
    {
        keyword: "#BarsitiJacket",
        mentions: 8932,
        growth: "+189%",
        category: "Item",
        time: "2시간 전",
        city: "Seoul"
    },
    {
        keyword: "#Y2K",
        mentions: 7651,
        growth: "+156%",
        category: "Style",
        time: "3시간 전",
        city: "New York"
    },
    {
        keyword: "#MaryJaneShoes",
        mentions: 6234,
        growth: "+134%",
        category: "Item",
        time: "4시간 전",
        city: "Tokyo"
    }
];

export const exclusiveContent = [
    {
        title: "2026 S/S 파리 패션위크 백스테이지",
        type: "Behind the Scenes",
        duration: "12:34",
        thumbnail: "https://images.unsplash.com/photo-1558769132-cb1aea9f3dbc?w=600&h=400&fit=crop",
        exclusive: true,
        tags: ['Street', 'High-end']
    },
    {
        title: "럭셔리 브랜드의 지속가능성 전략",
        type: "Industry Report",
        pages: 24,
        thumbnail: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=400&fit=crop",
        exclusive: true,
        tags: ['Minimal', 'Sustainable']
    },
    {
        title: "버질 아블로 아카이브 컬렉션",
        type: "Digital Archive",
        items: 156,
        thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop",
        exclusive: true,
        tags: ['Street', 'Artistic']
    }
];

export const todayLookbook = [
    {
        weather: "맑음 18°C",
        occasion: "출근",
        items: ["라이트 트렌치코트", "화이트 셔츠", "슬림 데님"],
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop"
    },
    {
        weather: "맑음 18°C",
        occasion: "주말 데이트",
        items: ["니트 가디건", "플리츠 스커트", "로퍼"],
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop"
    }
];

export const categoryContents = {
    fashion: [
        {
            id: 1,
            title: "2026 S/S 트렌드 리포트: 미니멀리즘의 귀환",
            description: "화려함을 덜어내고 본질에 집중하는 새로운 미니멀리즘이 온다.",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
            date: "2026.01.15",
            author: "VOX Fashion Team"
        },
        {
            id: 2,
            title: "지금 가장 주목해야 할 신진 디자이너 5인",
            description: "파리와 런던을 기반으로 전개하는 차세대 디자이너들을 만나다.",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop",
            date: "2026.01.14",
            author: "Sarah Kim"
        },
        {
            id: 3,
            title: "빈티지 데님의 매력",
            description: "시간이 지날수록 가치를 더하는 데님 스타일링 가이드.",
            image: "https://images.unsplash.com/photo-1558769132-cb1aea9f3dbc?w=800&h=600&fit=crop",
            date: "2026.01.13",
            author: "VOX Style Team"
        }
    ],
    beauty: [
        {
            id: 1,
            title: "글래스 스킨을 위한 스킨케어 루틴",
            description: "투명하고 맑은 피부를 위한 5단계 수분 케어법.",
            image: "https://images.unsplash.com/photo-1522335789203-abd6523f4364?w=800&h=600&fit=crop",
            date: "2026.01.15",
            author: "Jenna Lee"
        },
        {
            id: 2,
            title: "2026 메이크업 트렌드: 볼드 립",
            description: "마스크를 벗고 다시 돌아온 강렬한 립 컬러의 향연.",
            image: "https://images.unsplash.com/photo-1487412947132-26f2449ddca9?w=800&h=600&fit=crop",
            date: "2026.01.12",
            author: "VOX Beauty Team"
        }
    ],
    culture: [
        {
            id: 1,
            title: "현대 미술과 패션의 조우",
            description: "갤러리에서 런웨이까지, 예술이 된 패션을 말하다.",
            image: "https://images.unsplash.com/photo-1518998053901-5348d39691c2?w=800&h=600&fit=crop",
            date: "2026.01.10",
            author: "Park Ji-sung"
        },
        {
            id: 2,
            title: "서울의 숨겨진 라이프스타일 편집샵",
            description: "취향이 확실한 큐레이터들이 운영하는 공간 탐방.",
            image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop",
            date: "2026.01.08",
            author: "VOX Culture Team"
        }
    ],
    runway: [
        {
            id: 1,
            title: "PRADA 2026 Fall/Winter Collection",
            description: "미우치아 프라다와 라프 시몬스가 제안하는 새로운 유니폼.",
            image: "https://images.unsplash.com/photo-1509631179647-b849389274e9?w=800&h=600&fit=crop",
            date: "2026.01.16",
            author: "Runway Correspondent"
        },
        {
            id: 2,
            title: "Seoul Fashion Week Highlights",
            description: "DDP를 뜨겁게 달군 서울 패션위크의 베스트 모먼트.",
            image: "https://images.unsplash.com/photo-1596461404942-363c59637966?w=800&h=600&fit=crop",
            date: "2026.01.05",
            author: "K-Fashion Reporter"
        }
    ],
    video: [
        {
            id: 1,
            title: "Inside the Atelier: CHANEL",
            description: "샤넬 공방의 장인들을 만나다. (Documentary)",
            image: "https://images.unsplash.com/photo-1574717436401-063d8356cc79?w=800&h=600&fit=crop",
            date: "2026.01.01",
            author: "VOX Video"
        }
    ]
};