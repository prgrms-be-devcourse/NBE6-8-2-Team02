'use client'

import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";
import { validatePhoneNumber } from "@/lib/utils";

export default function ForgotPasswordPage() {
    const [findAccountData, setFindAccountData] = useState({
        name: "",
        phoneNumber: ""
    });
    const [resetPasswordData, setResetPasswordData] = useState({
        email: "",
        name: "",
        phoneNumber: ""
    });
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"find-account" | "reset-password">("find-account");
    const [foundAccount, setFoundAccount] = useState<{ email: string, name: string } | null>(null);
    const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleFindAccount = useCallback(async () => {
        if (!findAccountData.name.trim()) {
            setError("이름을 입력해주세요.");
            return;
        }

        if (!findAccountData.phoneNumber.trim()) {
            setError("전화번호를 입력해주세요.");
            return;
        }

        // 전화번호 형식 검증 (숫자만)
        if (!validatePhoneNumber(findAccountData.phoneNumber)) {
            setError("올바른 전화번호 형식을 입력해주세요. (예: 01012345678)");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await authAPI.findAccount(findAccountData);

            setFoundAccount({
                email: response.email,
                name: response.name
            });
            setSuccess("계정을 찾았습니다!");
            setIsLoading(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : "계정을 찾을 수 없습니다. 입력 정보를 확인해주세요.");
            setIsLoading(false);
        }
    }, [findAccountData]);

    const handleResetPassword = useCallback(async () => {
        if (!resetPasswordData.email.trim()) {
            setError("이메일을 입력해주세요.");
            return;
        }

        if (!resetPasswordData.name.trim()) {
            setError("이름을 입력해주세요.");
            return;
        }

        if (!resetPasswordData.phoneNumber.trim()) {
            setError("전화번호를 입력해주세요.");
            return;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(resetPasswordData.email)) {
            setError("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        // 전화번호 형식 검증 (숫자만)
        if (!validatePhoneNumber(resetPasswordData.phoneNumber)) {
            setError("올바른 전화번호 형식을 입력해주세요. (예: 01012345678)");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await authAPI.resetPassword(resetPasswordData);

            setIsPasswordResetMode(true);
            setSuccess("계정을 확인했습니다. 새 비밀번호를 입력해주세요.");
            setIsLoading(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : "계정 정보가 일치하지 않습니다. 입력 정보를 확인해주세요.");
            setIsLoading(false);
        }
    }, [resetPasswordData]);

    const handlePasswordReset = useCallback(async () => {
        if (!newPassword.trim()) {
            setError("새 비밀번호를 입력해주세요.");
            return;
        }

        if (!confirmPassword.trim()) {
            setError("비밀번호 확인을 입력해주세요.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 비밀번호 길이 검증 (6-20자)
        if (newPassword.length < 6 || newPassword.length > 20) {
            setError("비밀번호는 6자 이상 20자 이하여야 합니다.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // 실제 API 호출
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
                setIsLoading(false);
                return;
            }

            console.log("비밀번호 변경 시도:", { userId, newPassword });
            const response = await authAPI.changePassword(parseInt(userId), newPassword);
            console.log("비밀번호 변경 응답:", response);

            setSuccess("비밀번호가 성공적으로 변경되었습니다!");
            setIsLoading(false);
            // 2초 후 로그인 페이지로 이동
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (error) {
            console.error("비밀번호 재설정 실패:", error);
            setError(error instanceof Error ? error.message : "비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
            setIsLoading(false);
        }
    }, [newPassword, confirmPassword, router]);

    const handleBackToLogin = useCallback(() => {
        router.push("/auth/login");
    }, [router]);

    const handleResetForm = useCallback(() => {
        setFoundAccount(null);
        setIsPasswordResetMode(false);
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                key="forgot-password"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-center space-y-6 max-w-sm w-full bg-white p-8 rounded-lg shadow-lg"
            >
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                        <svg
                            className="w-6 h-6 text-primary-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl tracking-tight text-gray-900">
                        계정 찾기
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        계정을 찾거나 비밀번호를 재설정하세요
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">계정 복구</CardTitle>
                        <CardDescription>
                            아래 탭에서 원하는 옵션을 선택하세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* 탭 버튼 */}
                            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab("find-account")}
                                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === "find-account"
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    계정 찾기
                                </button>
                                <button
                                    onClick={() => setActiveTab("reset-password")}
                                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === "reset-password"
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    비밀번호 재설정
                                </button>
                            </div>

                            {/* 계정 찾기 탭 */}
                            {activeTab === "find-account" && (
                                <div className="space-y-4">
                                    {!foundAccount ? (
                                        <>
                                            <div className="space-y-2 text-left">
                                                <Label htmlFor="find-name">이름</Label>
                                                <Input
                                                    id="find-name"
                                                    type="text"
                                                    placeholder="가입한 이름을 입력하세요"
                                                    value={findAccountData.name}
                                                    onChange={(e) => {
                                                        setFindAccountData({ ...findAccountData, name: e.target.value });
                                                        setError("");
                                                        setSuccess("");
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleFindAccount();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <Label htmlFor="find-phone">전화번호</Label>
                                                <Input
                                                    id="find-phone"
                                                    type="tel"
                                                    placeholder="가입한 전화번호를 입력하세요 (01012345678)"
                                                    value={findAccountData.phoneNumber}
                                                    onChange={(e) => {
                                                        // 숫자만 입력 허용
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        setFindAccountData({ ...findAccountData, phoneNumber: value });
                                                        setError("");
                                                        setSuccess("");
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleFindAccount();
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <Button
                                                onClick={handleFindAccount}
                                                size="lg"
                                                className="w-full"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "처리 중..." : "계정 찾기"}
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <h3 className="font-medium text-green-800 mb-2">계정을 찾았습니다!</h3>
                                                <div className="text-sm text-green-700 space-y-1">
                                                    <p><strong>이름:</strong> {foundAccount.name}</p>
                                                    <p><strong>이메일:</strong> {foundAccount.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={handleResetForm}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    다시 찾기
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setResetPasswordData({
                                                            email: foundAccount.email,
                                                            name: foundAccount.name,
                                                            phoneNumber: findAccountData.phoneNumber
                                                        });
                                                        setActiveTab("reset-password");
                                                        setFoundAccount(null);
                                                    }}
                                                    className="flex-1"
                                                >
                                                    비밀번호 재설정
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 비밀번호 재설정 탭 */}
                            {activeTab === "reset-password" && (
                                <div className="space-y-4">
                                    {!isPasswordResetMode ? (
                                        <>
                                            <div className="space-y-2 text-left">
                                                <Label htmlFor="reset-email">이메일 주소</Label>
                                                <Input
                                                    id="reset-email"
                                                    type="email"
                                                    placeholder="가입한 이메일을 입력하세요"
                                                    value={resetPasswordData.email}
                                                    onChange={(e) => {
                                                        setResetPasswordData({ ...resetPasswordData, email: e.target.value });
                                                        setError("");
                                                        setSuccess("");
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleResetPassword();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <Label htmlFor="reset-name">이름</Label>
                                                <Input
                                                    id="reset-name"
                                                    type="text"
                                                    placeholder="가입한 이름을 입력하세요"
                                                    value={resetPasswordData.name}
                                                    onChange={(e) => {
                                                        setResetPasswordData({ ...resetPasswordData, name: e.target.value });
                                                        setError("");
                                                        setSuccess("");
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleResetPassword();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <Label htmlFor="reset-phone">전화번호</Label>
                                                <Input
                                                    id="reset-phone"
                                                    type="tel"
                                                    placeholder="가입한 전화번호를 입력하세요 (01012345678)"
                                                    value={resetPasswordData.phoneNumber}
                                                    onChange={(e) => {
                                                        // 숫자만 입력 허용
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        setResetPasswordData({ ...resetPasswordData, phoneNumber: value });
                                                        setError("");
                                                        setSuccess("");
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleResetPassword();
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <Button
                                                onClick={handleResetPassword}
                                                size="lg"
                                                className="w-full"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "처리 중..." : "계정 확인"}
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h3 className="font-medium text-blue-800 mb-2">계정 확인 완료</h3>
                                                <div className="text-sm text-blue-700 space-y-1">
                                                    <p><strong>이름:</strong> {resetPasswordData.name}</p>
                                                    <p><strong>이메일:</strong> {resetPasswordData.email}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-left">
                                                <Label htmlFor="new-password">새 비밀번호</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="new-password"
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="새 비밀번호를 입력하세요 (6-20자)"
                                                        value={newPassword}
                                                        onChange={(e) => {
                                                            setNewPassword(e.target.value);
                                                            setError("");
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handlePasswordReset();
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                    >
                                                        {showNewPassword ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-left">
                                                <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="confirm-password"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="새 비밀번호를 재입력하세요"
                                                        value={confirmPassword}
                                                        onChange={(e) => {
                                                            setConfirmPassword(e.target.value);
                                                            setError("");
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handlePasswordReset();
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={() => {
                                                        setIsPasswordResetMode(false);
                                                        setNewPassword("");
                                                        setConfirmPassword("");
                                                        setError("");
                                                        setSuccess("");
                                                    }}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    뒤로가기
                                                </Button>
                                                <Button
                                                    onClick={handlePasswordReset}
                                                    className="flex-1"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? "처리 중..." : "비밀번호 변경"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 에러 메시지 표시 */}
                {error && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                        {error}
                    </div>
                )}

                {/* 성공 메시지 표시 */}
                {success && (
                    <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                        {success}
                        {success === "비밀번호가 성공적으로 변경되었습니다!" && (
                            <p className="text-xs mt-1">잠시 후 로그인 페이지로 이동합니다...</p>
                        )}
                    </div>
                )}

                <div className="text-center">
                    <button
                        onClick={handleBackToLogin}
                        className="text-sm text-muted-foreground hover:text-primary hover:font-semibold transition-all duration-200 cursor-pointer py-1 px-2 rounded hover:bg-gray-50"
                    >
                        로그인으로 돌아가기
                    </button>
                </div>
            </motion.div>
        </div>
    );
}