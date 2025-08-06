'use client';

import { useRouter } from "next/navigation";
import { Megaphone, User, LogOut } from "lucide-react";
import { authAPI } from "@/lib/auth";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 사용자 역할 확인
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const isAdmin = userRole === 'ADMIN';

  const onLogout = async () => {
    try {
      // 로그아웃 시 페이지 제목 변경
      document.title = "자산관리 서비스";
      await authAPI.logout();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      router.push("/");
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
      <nav
        className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          zIndex: 50, // 사이드바보다 높게
        }}
      >
        <div className="text-xl font-bold">자산관리 서비스</div>
        <div className="space-x-4 flex items-center">
          <button
            className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
            onClick={() => router.push("/mypage/notices")}
          >
            <Megaphone className="w-5 h-5 text-yellow-400" />
            공지사항
          </button>
          <div className="h-6 w-px bg-gray-400 mx-2" />
          {!isAdmin && (
            <>
              <button
                className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
                onClick={() => router.push("/mypage/profile")}
              >
                <User className="w-5 h-5 text-blue-300" />
                마이페이지
              </button>
              <div className="h-6 w-px bg-gray-400 mx-2" />
            </>
          )}
          <button
            className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
            onClick={handleLogoutClick}
          >
            <LogOut className="w-5 h-5 text-red-400" />
            로그아웃
          </button>
        </div>
      </nav>

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">자산관리 서비스</h3>
            </div>
            <p className="text-gray-600 mb-6">로그아웃 하시겠습니까?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
