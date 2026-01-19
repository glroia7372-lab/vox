'use client';

import { useState } from 'react';
import { Folder, Plus, Trash2, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface SavedTrend {
    id: number;
    keyword: string;
    category: string;
    folderId: string;
}

interface MoodBoardFolder {
    id: string;
    name: string;
    color: string;
    items: SavedTrend[];
}

interface MoodBoardProps {
    bookmarkedTrends: number[];
    allTrends: any[];
}

export default function MoodBoard({ bookmarkedTrends, allTrends }: MoodBoardProps) {
    const { showDarkMode } = useApp();
    const [folders, setFolders] = useState<MoodBoardFolder[]>([
        { id: '1', name: '겨울 스타일', color: 'bg-blue-500', items: [] },
        { id: '2', name: '럭셔리 브랜드', color: 'bg-purple-500', items: [] },
        { id: '3', name: '스트릿 패션', color: 'bg-green-500', items: [] },
    ]);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
    ];

    const createFolder = () => {
        if (!newFolderName.trim()) return;

        const newFolder: MoodBoardFolder = {
            id: Date.now().toString(),
            name: newFolderName,
            color: colors[Math.floor(Math.random() * colors.length)],
            items: []
        };

        setFolders([...folders, newFolder]);
        setNewFolderName('');
        setShowNewFolderModal(false);
    };

    const deleteFolder = (folderId: string) => {
        if (confirm('정말 이 폴더를 삭제하시겠습니까?')) {
            setFolders(folders.filter(f => f.id !== folderId));
            if (selectedFolder === folderId) {
                setSelectedFolder(null);
            }
        }
    };

    const addToFolder = (folderId: string, trendId: number) => {
        const trend = allTrends[trendId];
        if (!trend) return;

        setFolders(folders.map(folder => {
            if (folder.id === folderId) {
                const savedTrend: SavedTrend = {
                    id: trendId,
                    keyword: trend.keyword,
                    category: trend.category,
                    folderId: folderId
                };
                return {
                    ...folder,
                    items: [...folder.items, savedTrend]
                };
            }
            return folder;
        }));
    };

    const removeFromFolder = (folderId: string, trendId: number) => {
        setFolders(folders.map(folder => {
            if (folder.id === folderId) {
                return {
                    ...folder,
                    items: folder.items.filter(item => item.id !== trendId)
                };
            }
            return folder;
        }));
    };

    return (
        <div className={`${showDarkMode ? 'bg-black border border-gray-800' : 'bg-gray-50'} rounded-lg p-8`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl mb-2 font-serif flex items-center gap-2">
                        <FolderOpen className="w-6 h-6 text-vox-red" />
                        나만의 무드보드
                    </h2>
                    <p className="text-sm text-gray-600">
                        북마크한 트렌드를 폴더별로 정리하고 나만의 스타일 컬렉션을 만드세요
                    </p>
                </div>
                <button
                    onClick={() => setShowNewFolderModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-vox-red text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    새 폴더
                </button>
            </div>

            {/* 폴더 목록 */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                {folders.map(folder => (
                    <div
                        key={folder.id}
                        onClick={() => setSelectedFolder(folder.id)}
                        className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow ${selectedFolder === folder.id ? 'ring-2 ring-vox-red' : ''
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`${folder.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                <Folder className="w-6 h-6 text-white" />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFolder(folder.id);
                                }}
                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="font-medium mb-1">{folder.name}</div>
                        <div className="text-sm text-gray-600">{folder.items.length} items</div>
                    </div>
                ))}
            </div>

            {/* 선택된 폴더 내용 */}
            {selectedFolder && (
                <div className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} p-6 rounded-lg`}>
                    <h3 className="text-xl font-serif mb-4">
                        {folders.find(f => f.id === selectedFolder)?.name}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {folders.find(f => f.id === selectedFolder)?.items.map(item => (
                            <div
                                key={item.id}
                                className={`${showDarkMode ? 'bg-black' : 'bg-gray-50'} p-4 rounded-lg`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="font-medium mb-1">{item.keyword}</div>
                                        <div className="text-sm text-gray-600">{item.category}</div>
                                    </div>
                                    <button
                                        onClick={() => removeFromFolder(selectedFolder, item.id)}
                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {folders.find(f => f.id === selectedFolder)?.items.length === 0 && (
                            <div className="col-span-3 text-center py-8 text-gray-500">
                                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>아직 저장된 트렌드가 없습니다</p>
                                <p className="text-sm">북마크한 트렌드를 이 폴더에 추가해보세요</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 북마크된 트렌드 목록 */}
            {bookmarkedTrends.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-serif mb-4">북마크한 트렌드 ({bookmarkedTrends.length})</h3>
                    <div className="space-y-2">
                        {bookmarkedTrends.map(trendId => {
                            const trend = allTrends[trendId];
                            if (!trend) return null;

                            return (
                                <div
                                    key={trendId}
                                    className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 rounded-lg flex items-center justify-between`}
                                >
                                    <div>
                                        <div className="font-medium">{trend.keyword}</div>
                                        <div className="text-sm text-gray-600">{trend.category}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        {folders.map(folder => (
                                            <button
                                                key={folder.id}
                                                onClick={() => addToFolder(folder.id, trendId)}
                                                className={`${folder.color} text-white px-3 py-1 rounded text-sm hover:opacity-80 transition-opacity`}
                                            >
                                                {folder.name}에 추가
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 새 폴더 생성 모달 */}
            {showNewFolderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className={`${showDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 max-w-md w-full`}>
                        <h3 className="text-xl font-serif mb-4">새 폴더 만들기</h3>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="폴더 이름을 입력하세요"
                            className={`w-full px-4 py-2 border rounded-lg mb-4 ${showDarkMode ? 'bg-black border-gray-700' : 'border-gray-300'}`}
                            onKeyPress={(e) => e.key === 'Enter' && createFolder()}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={createFolder}
                                className="flex-1 py-2 bg-vox-red text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                생성
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewFolderModal(false);
                                    setNewFolderName('');
                                }}
                                className={`flex-1 py-2 border rounded-lg ${showDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
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
