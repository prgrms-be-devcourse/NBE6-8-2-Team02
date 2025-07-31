import React from "react";
import {
  LayoutDashboard,
  CreditCard,
  HandCoins,
  Target,
} from "lucide-react";

interface SideBarProps {
  navigate: (path: string) => void;
  active?: "mypage" | "goals" | "accounts" | "assets";
}

export const SideBar: React.FC<SideBarProps> = ({ navigate, active }) => {
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
      <section
        onClick={() => navigate("/mypage")}
        className={`flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer ${active === "mypage" ? "bg-gray-100" : ""}`}
      >
        <LayoutDashboard className="text-black-500" />대시 보드
      </section>
      <section
        onClick={() => navigate("/mypage/goals")}
        className={`flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer ${active === "goals" ? "bg-gray-100" : ""}`}
      >
        <Target className="text-black-500" />나의 목표
      </section>
      <section
        onClick={() => navigate("/mypage/accounts")}
        className={`flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer ${active === "accounts" ? "bg-gray-100" : ""}`}
      >
        <CreditCard className="text-black-500" />계좌 목록
      </section>
      <section
        onClick={() => navigate("/mypage/assets")}
        className={`flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer ${active === "assets" ? "bg-gray-100" : ""}`}
      >
        <HandCoins className="text-black-500" />자산 목록
      </section>
    </div>
  );
}; 