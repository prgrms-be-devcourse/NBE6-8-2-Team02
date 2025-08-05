'use client';

import { useRouter } from "next/navigation";
import {
    Megaphone,
    User,
    LogOut,
    Shield,
    BarChart3,
    Settings,
    Home,
    Users,
    Database
} from "lucide-react";
import { authAPI } from "../../lib/auth";

export default function AdminNavbar() {
    const router = useRouter();

    const onLogout = async () => {
        if (confirm("로그아웃 하시겠습니까?")) {
            try {
                await authAPI.logout();
                router.push("/");
            } catch (error) {
                console.error("로그아웃 실패:", error);
                router.push("/");
            }
        }
    };

    return (
        <nav
            className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center"
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "100vw",
                zIndex: 50,
            }}
        >
            <div className="flex items-center space-x-4">
                <div className="text-xl font-bold">관리자 대시보드</div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Shield className="w-4 h-4" />
                    <span>관리자 모드</span>
                </div>
            </div>

            <div className="space-x-4 flex items-center">
                <button
                    className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
                    onClick={() => router.push("/admin")}
                >
                    <Home className="w-5 h-5 text-blue-300" />
                    대시보드
                </button>
                <div className="h-6 w-px bg-gray-400 mx-2" />
                <button
                    className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
                    onClick={() => router.push("/admin/users")}
                >
                    <Users className="w-5 h-5 text-green-300" />
                    사용자 관리
                </button>
                <div className="h-6 w-px bg-gray-400 mx-2" />
                <button
                    className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
                    onClick={() => router.push("/admin/analytics")}
                >
                    <BarChart3 className="w-5 h-5 text-yellow-300" />
                    통계
                </button>
                <div className="h-6 w-px bg-gray-400 mx-2" />
                <button
                    className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
                    onClick={() => router.push("/admin/settings")}
                >
                    <Settings className="w-5 h-5 text-purple-300" />
                    설정
                </button>
                <div className="h-6 w-px bg-gray-400 mx-2" />
                <button
                    className="flex items-center gap-2 hover:underline bg-transparent border-none outline-none cursor-pointer text-white px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-700"
                    onClick={() => router.push("/admin/security")}
                >
                    <Shield className="w-5 h-5 text-red-300" />
                    보안
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