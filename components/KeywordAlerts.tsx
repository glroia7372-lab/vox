'use client';

import { useState } from 'react';
import { Bell, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface KeywordAlert {
    id: string;
    keyword: string;
    enabled: boolean;
    matchCount: number;
    lastMatched?: string;
}

export default function KeywordAlerts() {
    const { showDarkMode } = useApp();
    const [keywords, setKeywords] = useState<KeywordAlert[]>([
        { id: '1', keyword: '샤넬', enabled: true, matchCount: 3, lastMatched: '2시간 전' },
        { id: '2', keyword: '데님', enabled: true, matchCount: 7, lastMatched: '30분 전' },
    ]);
    const [newKeyword, setNewKeyword] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const addKeyword = () => {
        if (!newKeyword.trim()) return;

        const newAlert: KeywordAlert = {
            id: Date.now().toString(),
            keyword: newKeyword.trim(),
            enabled: true,
            matchCount: 0,
        };

        setKeywords([...keywords, newAlert]);
        setNewKeyword('');
        setShowAddModal(false);
    };

    const toggleKeyword = (id: string) => {
        setKeywords(keywords.map(k =>
            k.id === id ? { ...k, enabled: !k.enabled } : k
        ));
    };

    const deleteKeyword = (id: string) => {
        if (confirm('이 키워드 알림을 삭제하시겠습니까?')) {
            setKeywords(keywords.filter(k => k.id !== id));
        }
    };

    return (
        <div className={`${showDarkMode ? 'bg-black border border-gray-800' : 'bg-gray-50'} rounded-lg p-8`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl mb-2 font-serif flex items-center gap-2">
                        <Bell className="w-6 h-6 text-vox-red" />
                        키워드 알림
                    </h2>
                    <p className="text-sm text-gray-600">
                        관심 키워드가 실시간 아카이브에 등장하면 즉시 알림을 받아보세요
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-vox-red text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    키워드 추가
                </button>
            </div>

            {/* 알림 설정 안내 */}
            <div className={`${showDarkMode ? 'bg-gray-900' : 'bg-blue-50'} p-4 rounded-lg mb-6 flex items-start gap-3`}>
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <div className="font-medium mb-1">알림 설정 방법</div>
                    <p className="text-gray-600">
                        브라우저 알림을 허용하면 키워드가 매칭될 때 실시간으로 푸시 알림을 받을 수 있습니다.
                        설정 {'>'} 알림에서 브라우저 알림을 활성화해주세요.
                    </p>
                </div>
            </div>

            {/* 키워드 목록 */}
            {keywords.length > 0 ? (
                <div className="space-y-3">
                    {keywords.map(keyword => (
                        <div
                            key={keyword.id}
                            className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 rounded-lg flex items-center justify-between`}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <button
                                    onClick={() => toggleKeyword(keyword.id)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${keyword.enabled ? 'bg-vox-red' : 'bg-gray-300'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${keyword.enabled ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-lg">#{keyword.keyword}</span>
                                        {keyword.enabled && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                                                활성화
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {keyword.matchCount > 0 ? (
                                            <>
                                                <span className="font-medium text-vox-red">{keyword.matchCount}회</span> 매칭
                                                {keyword.lastMatched && ` · 마지막 매칭: ${keyword.lastMatched}`}
                                            </>
                                        ) : (
                                            '아직 매칭된 트렌드가 없습니다'
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteKeyword(keyword.id)}
                                className="p-2 hover:bg-gray-200 rounded transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} p-8 rounded-lg text-center`}>
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-2">등록된 키워드가 없습니다</p>
                    <p className="text-sm text-gray-500">
                        관심 있는 브랜드, 스타일, 아이템 등을 키워드로 등록해보세요
                    </p>
                </div>
            )}

            {/* 최근 매칭 알림 */}
            {keywords.some(k => k.matchCount > 0) && (
                <div className="mt-8">
                    <h3 className="text-lg font-serif mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        최근 매칭된 트렌드
                    </h3>
                    <div className="space-y-2">
                        {keywords
                            .filter(k => k.matchCount > 0)
                            .map(keyword => (
                                <div
                                    key={keyword.id}
                                    className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} p-3 rounded-lg flex items-center justify-between`}
                                >
                                    <div>
                                        <span className="font-medium">#{keyword.keyword}</span>
                                        <span className="text-sm text-gray-600 ml-2">
                                            {keyword.lastMatched}에 발견됨
                                        </span>
                                    </div>
                                    <button className="text-vox-red text-sm hover:underline">
                                        자세히 보기
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* 키워드 추가 모달 */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
                        <h3 className="text-xl font-serif mb-4">키워드 추가</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            브랜드명, 스타일, 아이템 등 관심 있는 키워드를 입력하세요
                        </p>
                        <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="예: 샤넬, 데님, 미니멀"
                            className={`w-full px-4 py-2 border rounded-lg mb-4 ${showDarkMode ? 'bg-black border-gray-700' : 'border-gray-300'
                                }`}
                            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={addKeyword}
                                className="flex-1 py-2 bg-vox-red text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                추가
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewKeyword('');
                                }}
                                className={`flex-1 py-2 border rounded-lg ${showDarkMode ? 'border-gray-700' : 'border-gray-300'
                                    }`}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
