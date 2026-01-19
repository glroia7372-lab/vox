'use client';

import { useApp } from '@/context/AppContext';
import StyleQuiz from '@/components/StyleQuiz';
import SubscribeModal from '@/components/SubscribeModal';

export default function GlobalModals() {
    const { showStyleQuiz, showSubscribeModal } = useApp();

    return (
        <>
            {showStyleQuiz && <StyleQuiz />}
            {showSubscribeModal && <SubscribeModal />}
        </>
    );
}
