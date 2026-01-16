// 스티비 API 연동 함수

export async function subscribeToStibee(email, name, userProfile) {
    const STIBEE_LIST_ID = process.env.NEXT_PUBLIC_STIBEE_LIST_ID;

    if (!STIBEE_LIST_ID) {
        console.error('스티비 주소록 ID가 설정되지 않았습니다.');
        throw new Error('스티비 설정 오류');
    }

    const STIBEE_API_URL = `https://stibee.com/api/v1.0/lists/${STIBEE_LIST_ID}/subscribers`;

    try {
        const response = await fetch(STIBEE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventOccuredBy: 'SUBSCRIBER',
                confirmEmailYN: 'Y', // 이메일 확인 필요
                subscribers: [
                    {
                        email: email,
                        name: name,
                        // 사용자 정의 필드 (스티비 대시보드에서 미리 생성 필요)
                        $style_dna: userProfile?.style || 'Not Set',
                        $preferences: userProfile?.preferences?.join(', ') || '',
                        $budget: userProfile?.budget || '',
                        $subscription_date: new Date().toISOString().split('T')[0]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('스티비 API 오류:', errorData);
            throw new Error('구독 신청 실패');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('구독 처리 중 오류:', error);
        throw error;
    }
}

// 스티비 주소록에서 구독자 정보 조회 (선택사항)
export async function getSubscriberInfo(email) {
    const STIBEE_LIST_ID = process.env.NEXT_PUBLIC_STIBEE_LIST_ID;
    const STIBEE_API_URL = `https://stibee.com/api/v1.0/lists/${STIBEE_LIST_ID}/subscribers/${email}`;

    try {
        const response = await fetch(STIBEE_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('구독자 정보 조회 실패');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('구독자 정보 조회 오류:', error);
        throw error;
    }
}