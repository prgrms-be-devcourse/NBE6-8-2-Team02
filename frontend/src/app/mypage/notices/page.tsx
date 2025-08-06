'use client';

import { useRouter } from "next/navigation";
import { Bell, Plus, Search, Calendar, Eye, User } from 'lucide-react';
import { useEffect, useState } from "react";
import SideBar from "@/app/components/SideBar";
import { apiFetch } from '@/lib/backend/client';
import { motion } from 'framer-motion';
import { CreateNoticeModal } from "./CreateNoticeModal";


type Notice = {
  id: number;
  title: string;
  content: string;
  views: number;
  writerName: string;
  createDate: string;
  modifyDate: string;
};

type PaginationInfo = {
  content: Notice[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

// 백엔드에서 데이터를 가져오므로 하드코딩된 데이터 제거

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();



  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await fetch('http://localhost:8080/api/v1/members/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }).then(res => res.json());
        if (userData) {
          setCurrentUser(userData);
          const isAdminUser = userData.role === 'ADMIN';
          setIsAdmin(isAdminUser);
        }
      } catch (error) {
        console.log("사용자 정보 가져오기 실패:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // 디바운스된 검색어 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms 지연

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API 호출 (디바운스된 검색어 사용)
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        // 검색어와 페이지 파라미터 추가
        const searchParam = debouncedSearchTerm ? `&search=${encodeURIComponent(debouncedSearchTerm)}` : '';
        const response = await apiFetch(`/api/v1/notices?page=${currentPage}&size=5${searchParam}`);
        if (response && response.data) {
          setNotices(response.data.content);
          setPaginationInfo(response.data);
        } else {
          setNotices([]);
          setPaginationInfo(null);
        }
      } catch (error) {
        console.log("공지사항 목록 조회 실패", error);
        setNotices([]);
        setPaginationInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [debouncedSearchTerm, currentPage]); // debouncedSearchTerm과 currentPage가 변경될 때 실행



  // Backend에서 검색하므로 Frontend 필터링 제거
  // const filteredNotices = notices.filter(...) 제거

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    // 새 공지사항이 생성되면 목록을 새로고침
    setCurrentPage(0); // 첫 페이지로 이동
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < paginationInfo!.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-[64px] grid grid-cols-[1fr_auto_1fr]">
        <div></div>
        <SideBar active="mypage" isAdminMode={isAdmin} />
        <div className="flex flex-col min-h-screen p-6 mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        </div>
        <div></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[64px] grid grid-cols-[1fr_auto_1fr]">
      <div></div>
      <SideBar active="mypage" />
      <div className="flex flex-col min-h-screen p-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl w-full"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">공지사항</h1>
            </div>
              {isAdmin && (
               <button
                 onClick={() => setCreateModalOpen(true)}
                 className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
               >
                 <Plus className="w-4 h-4" />
                 <span>새 공지사항</span>
               </button>
             )}
          </div>

          {/* 검색바 */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="공지사항 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 공지사항 목록 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {notices.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {debouncedSearchTerm ? '검색 결과가 없습니다.' : '등록된 공지사항이 없습니다.'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notices.map((notice, index) => (
                  <motion.div
                    key={notice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/mypage/notices/${notice.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          {notice.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {notice.content}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{notice.writerName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(notice.createDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>조회 {notice.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* 페이징 UI */}
          {paginationInfo && paginationInfo.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                {/* 이전 페이지 버튼 */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage > 0
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  이전
                </button>

                {/* 페이지 번호들 (그룹 단위 이동) */}
                {(() => {
                  // 현재 페이지가 속한 그룹 계산
                  const groupSize = 3; // 한 그룹당 3개 페이지
                  const currentGroup = Math.floor(currentPage / groupSize);
                  const startPage = currentGroup * groupSize;
                  const endPage = Math.min(startPage + groupSize - 1, paginationInfo.totalPages - 1);
                  
                  const pages = [];
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }
                  
                  return pages.map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pageNum === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  ));
                })()}

                {/* 다음 페이지 버튼 */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= paginationInfo.totalPages - 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage < paginationInfo.totalPages - 1
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <div></div>

      {/* 공지사항 작성 모달 */}
      <CreateNoticeModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
} 