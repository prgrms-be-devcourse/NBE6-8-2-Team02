import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "./Router";
import { authAPI } from "@/lib/auth";

export function AccountRecoveryPage() {
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
    const { navigate } = useRouter();

    const handleFindAccount = async () => {
        if (!findAccountData.name.trim()) {
            setError("이름을 입력해주세요.");
            return;
        }

        if (!findAccountData.phoneNumber.trim()) {
            setError("전화번호를 입력해주세요.");
            return;
        }

        // 전화번호 형식 검증 (010-1234-5678 형식)
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(findAccountData.phoneNumber)) {
            setError("올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            console.log("계정 찾기 시도:", findAccountData);
            const response = await authAPI.findAccount(findAccountData);
            console.log("계정 찾기 응답:", response);

            setFoundAccount({
                email: response.email,
                name: response.name
            });
            setSuccess("계정을 찾았습니다!");
            setIsLoading(false);
        } catch (error) {
            console.error("계정 찾기 실패:", error);
            setError(error instanceof Error ? error.message : "계정을 찾을 수 없습니다. 입력 정보를 확인해주세요.");
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
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

        // 전화번호 형식 검증 (010-1234-5678 형식)
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(resetPasswordData.phoneNumber)) {
            setError("올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)");
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            console.log("비밀번호 재설정 시도:", resetPasswordData);
            const response = await authAPI.resetPassword(resetPasswordData);
            console.log("비밀번호 재설정 응답:", response);

            setIsPasswordResetMode(true);
            setSuccess("계정을 확인했습니다. 새 비밀번호를 입력해주세요.");
            setIsLoading(false);
        } catch (error) {
            console.error("비밀번호 재설정 실패:", error);
            setError(error instanceof Error ? error.message : "계정 정보가 일치하지 않습니다. 입력 정보를 확인해주세요.");
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async () => {
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

        // 비밀번호 길이 검증 (8-16자)
        if (newPassword.length < 8 || newPassword.length > 16) {
            setError("비밀번호는 8자 이상 16자 이하여야 합니다.");
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
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("비밀번호 재설정 실패:", error);
            setError(error instanceof Error ? error.message : "비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    const handleResetForm = () => {
        setFoundAccount(null);
        setIsPasswordResetMode(false);
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
    };

    return (
        <motion.div
            key="forgot-password"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-center space-y-6 max-w-md w-full"
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
                                                placeholder="가입한 전화번호를 입력하세요 (010-1234-5678)"
                                                value={findAccountData.phoneNumber}
                                                onChange={(e) => {
                                                    setFindAccountData({ ...findAccountData, phoneNumber: e.target.value });
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
                                                placeholder="가입한 전화번호를 입력하세요 (010-1234-5678)"
                                                value={resetPasswordData.phoneNumber}
                                                onChange={(e) => {
                                                    setResetPasswordData({ ...resetPasswordData, phoneNumber: e.target.value });
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
                                            <Input
                                                id="new-password"
                                                type="password"
                                                placeholder="새 비밀번호를 입력하세요 (8-16자)"
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
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
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
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    로그인으로 돌아가기
                </button>
            </div>
        </motion.div>
    );
} 