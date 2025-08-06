"use client";

import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";
import { validatePhoneNumber, formatPhoneNumberForDisplay } from "@/lib/utils";

export default function SignupPage() {
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSignup = useCallback(async () => {
    // 입력값 검증
    if (!signupData.email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!signupData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("비밀번호 확인을 입력해주세요.");
      return;
    }

    if (signupData.password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!signupData.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!signupData.phoneNumber.trim()) {
      setError("전화번호를 입력해주세요.");
      return;
    }

    // 전화번호 형식 검증 (숫자만)
    if (!validatePhoneNumber(signupData.phoneNumber)) {
      setError("올바른 전화번호 형식을 입력해주세요. (11자리 숫자, 010으로 시작)");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 비밀번호 길이 검증 (6-20자)
    if (signupData.password.length < 6 || signupData.password.length > 20) {
      setError("비밀번호는 6자 이상 20자 이하여야 합니다.");
      return;
    }

    // 이름 길이 검증 (2-20자)
    if (signupData.name.length < 2 || signupData.name.length > 20) {
      setError("이름은 2자 이상 20자 이하여야 합니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 전화번호를 하이픈이 있는 형식으로 변환 (직접 구현)
      const phoneNumber = signupData.phoneNumber.replace(/[^0-9]/g, "");
      let formattedPhone;

      if (phoneNumber.length === 11 && phoneNumber.startsWith("010")) {
        formattedPhone = phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      } else {
        formattedPhone = phoneNumber; // 형식이 맞지 않으면 원본 사용
      }

      const signupDataWithFormattedPhone = {
        ...signupData,
        phoneNumber: formattedPhone
      };

      console.log("원본 전화번호:", signupData.phoneNumber);
      console.log("정리된 전화번호:", phoneNumber);
      console.log("변환된 전화번호:", formattedPhone);
      console.log("회원가입 시도:", signupDataWithFormattedPhone);
      const response = await authAPI.signup(signupDataWithFormattedPhone);
      console.log("회원가입 응답:", response);

      // API 응답 검증 - 201 CREATED 상태 코드 확인
      if (response && (response.id || response.email || response.userId)) {
        console.log("회원가입 성공:", response);
        router.push("/auth/login");
      } else {
        // 서버에서 에러 응답이 온 경우
        setError(
          response.message ||
          response.error ||
          "회원가입에 실패했습니다. 다시 시도해주세요."
        );
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      setError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [signupData, confirmPassword, router]);

  const handleBackToLogin = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignupData((prev) => ({ ...prev, email: e.target.value }));
      setError("");
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignupData((prev) => ({ ...prev, password: e.target.value }));
      setError("");
    },
    []
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignupData((prev) => ({ ...prev, name: e.target.value }));
      setError("");
    },
    []
  );

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSignupData((prev) => ({ ...prev, phoneNumber: e.target.value }));
      setError("");
    },
    []
  );

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
      setError("");
    },
    []
  );

  const handlePasswordToggle = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleConfirmPasswordToggle = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        key="signup"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h2 className="text-2xl tracking-tight text-gray-900">회원가입</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="signup-name">이름</Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="이름을 입력하세요 (2-20자)"
              value={signupData.name}
              onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                setSignupData((prev) => ({ ...prev, name: e.target.value }));
                setError(""); // 입력 시 에러 메시지 초기화
              }, [])}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSignup();
                }
              }}
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="signup-email">이메일</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={signupData.email}
              onChange={(e) => {
                setSignupData({ ...signupData, email: e.target.value });
                setError(""); // 입력 시 에러 메시지 초기화
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSignup();
                }
              }}
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="signup-phone">전화번호</Label>
            <Input
              id="signup-phone"
              type="tel"
              placeholder="전화번호를 입력하세요 (11자리 숫자)"
              value={signupData.phoneNumber}
              onChange={(e) => {
                // 숫자만 입력 허용
                const value = e.target.value.replace(/[^0-9]/g, "");
                setSignupData({ ...signupData, phoneNumber: value });
                setError(""); // 입력 시 에러 메시지 초기화
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSignup();
                }
              }}
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="signup-password">비밀번호</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요 (6-20자)"
                value={signupData.password}
                onChange={(e) => {
                  setSignupData({ ...signupData, password: e.target.value });
                  setError(""); // 입력 시 에러 메시지 초기화
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSignup();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
            <div className="relative">
              <Input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호를 재입력하세요"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError(""); // 입력 시 에러 메시지 초기화
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSignup();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* 에러 메시지 표시 */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button
          onClick={handleSignup}
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "회원가입 중..." : "회원가입"}
        </Button>

        <div className="text-center">
          <button
            onClick={handleBackToLogin}
            className="text-sm text-muted-foreground hover:text-primary hover:font-semibold transition-all duration-200 cursor-pointer py-1 px-2 rounded hover:bg-gray-50"
          >
            이미 계정이 있나요?
          </button>
        </div>
      </motion.div>
    </div>
  );
}
