'use client';

import { useRouter, useParams } from "next/navigation";
import { Bell, ArrowLeft, Eye, Calendar, User, SquarePen, SquareXIcon } from 'lucide-react';
import { useEffect, useState } from "react";
import SideBar from "@/app/components/SideBar";
import { apiFetch } from "@/lib/backend/client";
import { motion } from 'framer-motion';
import { EditNoticeModal } from "../EditNoticeModal";


type Notice = {
  id: number;
  title: string;
  content: string;
  views: number;
  fileUrl?: string;
  writerName: string;
  createDate: string;
  modifyDate: string;
};

export default function NoticeDetailPage() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const params = useParams();
  const noticeId = Number(params.noticeId);

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

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      if (!noticeId) return;
      
      try {
        setIsLoading(true);
        const response = await apiFetch(`/api/v1/notices/${noticeId}`);
        setNotice(response.data);
      } catch (error) {
        console.log("공지사항 상세 조회 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (noticeId) {
      fetchNoticeDetail();
    }
  }, [noticeId, reloadTrigger]);



  const handleDelete = async () => {
    if (!notice || !confirm('정말로 이 공지사항을 삭제하시겠습니까?')) return;

    try {
      await apiFetch(`/api/v1/notices/${notice.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: notice.id }),
      });
      router.push('/mypage/notices');
    } catch (error) {
      console.error('공지사항 삭제 실패:', error);
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

  if (!notice) {
    return (
          <div className="min-h-screen pt-[64px] grid grid-cols-[1fr_auto_1fr]">
      <div></div>
      <SideBar active="mypage" isAdminMode={isAdmin} />
      <div className="flex flex-col min-h-screen p-6 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">공지사항을 찾을 수 없습니다.</div>
        </div>
      </div>
      <div></div>
    </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-[64px] grid grid-cols-[1fr_auto_1fr]">
        <div></div>
        <SideBar active="mypage" isAdminMode={isAdmin} />
        <div className="flex flex-col min-h-screen p-6 mx-auto">
          <div className='flex flex-row mr-auto gap-2 mb-6'>
            <button
              onClick={() => router.push('/mypage/notices')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              목록으로 돌아가기
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto w-full"
          >
            <div className="bg-white rounded-2xl border shadow-sm p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Bell className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{notice.title}</h1>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{notice.writerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(notice.createDate).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>조회수 {notice.views}</span>
                      </div>
                    </div>
                  </div>
                                 </div>
                 {isAdmin && (
                   <div className="flex gap-2">
                     <button
                       onClick={() => setEditModalOpen(true)}
                       className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                       aria-label="수정"
                       type="button"
                     >
                       <SquarePen className="w-5 h-5" />
                     </button>
                     <button
                       onClick={handleDelete}
                       className="text-red-600 hover:text-red-800 transition-colors duration-200"
                       aria-label="삭제"
                       type="button"
                     >
                       <SquareXIcon className="w-5 h-5" />
                     </button>
                   </div>
                 )}
              </div>

              <div className="border-t pt-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {notice.content}
                  </div>
                </div>
              </div>

              {notice.fileUrl && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">첨부파일</h3>
                  <a
                    href={notice.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    첨부파일 다운로드
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        <div></div>
      </div>
      {notice && (
        <EditNoticeModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSuccess={() => setReloadTrigger(prev => prev + 1)}
          noticeId={notice.id}
          initialData={{
            title: notice.title,
            content: notice.content,
          }}
        />
      )}
    </>
  );
 } 