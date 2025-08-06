import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  HandCoins,
  Target,
} from "lucide-react";

interface SideBarProps {
  active?: "mypage" | "goals" | "accounts" | "assets";
  isAdminMode?: boolean;
}

export default function SideBar({active, isAdminMode = false}: SideBarProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 관리자 권한 확인
    const checkAdminStatus = () => {
      try {
        const userRole = localStorage.getItem("userRole");
        setIsAdmin(userRole === "ADMIN");
      } catch (error) {
        console.error("관리자 권한 확인 실패:", error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  return (
    <div
      className="flex flex-col p-6 space-y-6 border-r bg-white"
      style={{
        position: "fixed",
        left: 0,
        top: 64,
        height: "100vh",
        width: 240,
        zIndex: 30,
        minWidth: 200,
        maxWidth: 320,
      }}
    >
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">메뉴
        </h1>
      </header>
      {!isAdminMode && (
        <>
          <section
            onClick={() => router.push("/mypage")}
            className={`flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer ${active == "mypage" ? "bg-gray-100" : ""}`}
          >
            <LayoutDashboard className="text-black-500" />대시 보드
          </section>
          {!isAdmin && (
            <>
              <section
                onClick={() => router.push("/mypage/goals")}
                className={`flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer ${active == "goals" ? "bg-gray-100" : ""}`}
              >
                <Target className="text-black-500" />나의 목표
              </section>
              <section
                onClick={() => router.push("/mypage/accounts")}
                className={`flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer ${active == "accounts" ? "bg-gray-100" : ""}`}
              >
                <CreditCard className="text-black-500" />계좌 목록
              </section>
              <section
                onClick={() => router.push("/mypage/assets")}
                className={`flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer ${active == "assets" ? "bg-gray-100" : ""}`}
              >
                <HandCoins className="text-black-500" />자산 목록
              </section>
            </>
          )}
        </>
      )}
      {isAdminMode && (
        <section className="flex items-center p-2 gap-4 text-gray-400 bg-gray-50 rounded-md">
          <LayoutDashboard className="text-gray-400" />
          <span className="text-sm">관리자 모드 - 공지사항 관리</span>
        </section>
      )}
    </div>
  );
}; 