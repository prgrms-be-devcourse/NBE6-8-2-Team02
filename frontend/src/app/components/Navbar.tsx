'use client';

import { useRouter } from "./Router";
import { Megaphone, User, LogOut } from "lucide-react";
import { authAPI } from "../../lib/auth";

export default function Navbar() {
  const { navigate } = useRouter();

  const onLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      try {
        await authAPI.logout();
        navigate("/");
      } catch (error) {
        console.error("로그아웃 실패:", error);
        navigate("/");
      }
    }
  };

  return (
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
          onClick={() => navigate("/mypage/notices")}
        >
          <Megaphone className="w-5 h-5 text-yellow-400" />
          공지사항
        </button>
        <div className="h-6 w-px bg-gray-400 mx-2" />
        <button
          className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
          onClick={() => navigate("/mypage/profile")}
        >
          <User className="w-5 h-5 text-blue-300" />
          마이페이지
        </button>
        <div className="h-6 w-px bg-gray-400 mx-2" />
        <button
          className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 text-red-400" />
          로그아웃
        </button>
      </div>
    </nav>
  );
}
