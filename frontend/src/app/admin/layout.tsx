"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        checkAdminAuthorization();
    }, []);

    const checkAdminAuthorization = async () => {
        try {
            // 인증 상태 확인
            const authStatus = authAPI.checkAuthStatus();

            if (!authStatus.isAuthenticated) {
                router.push("/auth/login");
                return;
            }

            // 관리자 권한 확인
            if (authStatus.userRole !== "ADMIN") {
                router.push("/");
                return;
            }

            // 토큰 유효성 검증
            const isValid = await authAPI.validateToken();
            if (!isValid) {
                await authAPI.logout();
                router.push("/auth/login");
                return;
            }

            setIsAuthorized(true);
        } catch (error) {
            console.error("관리자 권한 확인 실패:", error);
            router.push("/auth/login");
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">권한 확인 중...</div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-gray-900">관리자 페이지</h1>
                            <button
                                onClick={handleLogoutClick}
                                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                </header>
                <main>{children}</main>
            </div>

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