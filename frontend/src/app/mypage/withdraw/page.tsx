'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authAPI } from '@/lib/auth';
import SideBar from "@/app/components/SideBar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { AlertTriangle, Trash2, ArrowLeft, Shield, UserX, Database, AlertCircle } from 'lucide-react';

interface UserInfo {
    id: number;
    email: string;
    name: string;
}

export default function WithdrawPage() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 회원 탈퇴 상태
    const [withdrawConfirmation, setWithdrawConfirmation] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const isAuth = authAPI.isAuthenticated();
        if (!isAuth) {
            router.push("/");
            return;
        }

        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            setIsLoading(true);

            const token = await authAPI.getValidAccessToken();
            if (!token) {
                throw new Error("유효한 토큰이 없습니다.");
            }

            const response = await fetch("http://localhost:8080/api/v1/members/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            setUserInfo(userData);
        } catch (error) {
            console.error("사용자 정보 조회 실패:", error);
            setError("사용자 정보를 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleWithdrawAccount = async () => {
        try {
            if (withdrawConfirmation !== '회원탈퇴') {
                alert("정확히 '회원탈퇴'를 입력해주세요.");
                return;
            }

            if (!userInfo) return;

            const confirmed = window.confirm(
                "정말로 회원 탈퇴를 하시겠습니까?\n\n" +
                "• 모든 개인정보가 삭제됩니다\n" +
                "• 등록된 자산 및 거래 내역이 모두 삭제됩니다\n" +
                "• 복구가 불가능합니다\n" +
                "• 이 작업은 되돌릴 수 없습니다\n\n" +
                "마지막 확인: 정말 탈퇴하시겠습니까?"
            );

            if (!confirmed) return;

            setIsProcessing(true);
            await authAPI.withdrawAccount(userInfo.id);

            alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
            router.push("/");
        } catch (error) {
            console.error("회원 탈퇴 실패:", error);
            alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pl-[240px] pt-[64px] flex items-center justify-center">
                <div className="text-lg">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pl-[240px] pt-[64px] flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pl-[240px] pt-[64px]">
            <SideBar active="mypage" />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* 헤더 */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/mypage/profile")}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            돌아가기
                        </Button>
                    </div>
                </header>

                {/* 간단한 안내 */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h2 className="text-base font-medium text-red-800 mb-1">
                                회원 탈퇴 전 확인사항
                            </h2>
                            <p className="text-sm text-red-700">
                                탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                            </p>
                        </div>
                    </div>
                </div>

                {userInfo && (
                    <div className="grid gap-6">
                        {/* 삭제될 정보 카드 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserX className="w-5 h-5" />
                                    삭제될 정보
                                </CardTitle>
                                <CardDescription>
                                    회원 탈퇴 시 다음 정보들이 영구적으로 삭제됩니다.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            개인정보
                                        </h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• 이름: {userInfo.name || '-'}</li>
                                            <li>• 이메일: {userInfo.email}</li>
                                            <li>• 전화번호, 생년월일</li>
                                        </ul>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <Database className="w-4 h-4" />
                                            서비스 데이터
                                        </h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• 등록된 모든 자산 정보</li>
                                            <li>• 모든 거래 내역</li>
                                            <li>• 계좌 정보 및 설정</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 주의사항 카드 */}
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-700">
                                    <AlertCircle className="w-5 h-5" />
                                    주의사항
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-red-700 space-y-1">
                                    <li>• 탈퇴 후 동일한 이메일로 재가입이 제한될 수 있습니다</li>
                                    <li>• 삭제된 데이터는 복구가 불가능합니다</li>
                                    <li>• 탈퇴 완료 후 즉시 로그아웃됩니다</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* 최종 확인 카드 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trash2 className="w-5 h-5" />
                                    최종 확인
                                </CardTitle>
                                <CardDescription>
                                    위 내용을 모두 확인하셨다면, 아래에 <span className="text-red-600 font-medium">"회원탈퇴"</span>를 정확히 입력해주세요.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="font-medium">
                                        확인 문구 입력
                                    </Label>
                                    <Input
                                        value={withdrawConfirmation}
                                        onChange={(e) => setWithdrawConfirmation(e.target.value)}
                                        placeholder="회원탈퇴"
                                        className="text-center text-lg font-medium"
                                    />
                                    <p className="text-sm text-gray-500">
                                        정확히 "회원탈퇴"를 입력해야 버튼이 활성화됩니다.
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={handleWithdrawAccount}
                                        variant="destructive"
                                        className="flex items-center gap-2 flex-1"
                                        disabled={withdrawConfirmation !== '회원탈퇴' || isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                처리 중...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                회원 탈퇴
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push("/mypage/profile")}
                                        className="flex items-center gap-2"
                                        disabled={isProcessing}
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        취소
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
} 