"use client";

import { useState, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/auth";

export default function LoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // 입력 필드 refs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = useCallback(async () => {
    // 입력값 검증
    if (!loginData.email.trim()) {
      setError("아이디를 입력해주세요.");
      setTimeout(() => {
        emailInputRef.current?.focus();
        emailInputRef.current?.select();
      }, 100);
      return;
    }

    if (!loginData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      setTimeout(() => {
        passwordInputRef.current?.focus();
        passwordInputRef.current?.select();
      }, 100);
      return;
    }

    // 비밀번호 길이 검증 (6자~20자)
    if (loginData.password.length < 6 || loginData.password.length > 20) {
      setError("비밀번호는 6자~20자 사이여야 합니다.");
      setTimeout(() => {
        passwordInputRef.current?.focus();
        passwordInputRef.current?.select();
      }, 100);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      setTimeout(() => {
        emailInputRef.current?.focus();
        emailInputRef.current?.select();
      }, 100);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authAPI.login(loginData);
      console.log("로그인 성공 응답 전체:", response);
      console.log("응답 데이터 타입:", typeof response);
      console.log("응답 데이터 키들:", Object.keys(response));

      // 응답에서 역할 정보 추출
      const userRole = response.role || response.userRole || response.authorities?.[0]?.authority || 'USER';
      console.log('Login response role:', userRole);
      console.log('Login response 전체 구조:', JSON.stringify(response, null, 2));

      // 토큰 정보 확인
      const accessToken = response.accessToken || response.token || response.access_token;
      const refreshToken = response.refreshToken || response.refresh_token;

      console.log('토큰 정보:', {
        accessToken: accessToken ? '있음' : '없음',
        refreshToken: refreshToken ? '있음' : '없음',
        userRole: userRole
      });

      if (accessToken) {
        // 인증 상태 설정
        const authData = {
          authToken: accessToken,
          userId: response.userId || response.memberId || response.id,
          userEmail: response.email,
          userRole: userRole,
          refreshToken: refreshToken
        };

        console.log('설정할 인증 데이터:', authData);

        const success = authAPI.setAuthStatus(authData);

        if (success) {
          console.log('인증 상태 설정 성공');
          // 역할에 따라 즉시 리다이렉트
          if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
            console.log('관리자로 인식, /admin으로 리다이렉트');
            window.location.replace("/admin");
          } else {
            console.log('일반 사용자로 인식, /mypage로 리다이렉트');
            window.location.replace("/mypage");
          }
        } else {
          console.error('인증 상태 설정 실패');
          setError("로그인 상태 저장에 실패했습니다.");
        }
              } else {
          console.log('Access token이 없음, 쿠키 확인 시도');
          // 쿠키에서 토큰 확인
          const cookies = document.cookie.split(';');
          const accessTokenCookie = cookies.find(cookie =>
            cookie.trim().startsWith('accessToken=')
          );

          if (accessTokenCookie) {
            const token = accessTokenCookie.split('=')[1];
            console.log('쿠키에서 토큰 발견:', token ? '있음' : '없음');

          const authData = {
            authToken: token,
            userId: response.userId || response.memberId || response.id,
            userEmail: response.email,
            userRole: userRole,
            refreshToken: refreshToken
          };

          console.log('쿠키 토큰으로 설정할 인증 데이터:', authData);

          const success = authAPI.setAuthStatus(authData);

          if (success) {
            console.log('쿠키 토큰으로 인증 상태 설정 성공');
            if (userRole === 'ADMIN' || userRole === 'ROLE_ADMIN') {
              window.location.replace("/admin");
            } else {
              window.location.replace("/mypage");
            }
          } else {
            setError("로그인 상태 저장에 실패했습니다.");
          }
        } else {
          console.error('토큰을 찾을 수 없음 - 응답과 쿠키 모두 확인됨');
          setError(response.message || response.error || "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
        }
      }
    } catch (error) {
      console.error("로그인 실패:", error);

      // 에러 타입별 세분화된 처리
      if (error instanceof Error) {
        // 네트워크 에러 체크
        if (
          error.message.includes("fetch") ||
          error.message.includes("network")
        ) {
          setError(
            "네트워크 연결을 확인해주세요. 인터넷 연결 상태를 점검해주세요."
          );
          return;
        }

        // HTTP 상태 코드별 에러 처리
        if (error.message.includes("401")) {
          setError(
            "아이디 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요."
          );
          setTimeout(() => {
            passwordInputRef.current?.focus();
            passwordInputRef.current?.select();
          }, 100);
          return;
        }

        if (error.message.includes("403")) {
          setError("계정이 잠겨있습니다. 관리자에게 문의해주세요.");
          return;
        }

        if (error.message.includes("404")) {
          setError("존재하지 않는 계정입니다. 회원가입을 먼저 진행해주세요.");
          setTimeout(() => {
            emailInputRef.current?.focus();
            emailInputRef.current?.select();
          }, 100);
          return;
        }

        if (error.message.includes("429")) {
          setError("로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.");
          return;
        }

        if (error.message.includes("500")) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          return;
        }

        // 서버에서 반환한 일반적인 에러 메시지
        if (error.message) {
          setError(error.message);
          setTimeout(() => {
            passwordInputRef.current?.focus();
            passwordInputRef.current?.select();
          }, 100);
          return;
        }
      }

      // 기타 예상치 못한 에러
      setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [loginData, router]);

  const handleSignupClick = useCallback(() => {
    router.push("/auth/signup");
  }, [router]);

  const handleForgotPasswordClick = useCallback(() => {
    router.push("/auth/forgot-password");
  }, [router]);

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginData((prev) => ({ ...prev, email: e.target.value }));
      setError(""); // 입력 시 에러 메시지 초기화
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginData((prev) => ({ ...prev, password: e.target.value }));
      setError(""); // 입력 시 에러 메시지 초기화
    },
    []
  );

  const handleEmailKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    },
    [handleLogin]
  );

  const handlePasswordKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLogin();
      }
    },
    [handleLogin]
  );

  const handlePasswordToggle = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        key="login"
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h2 className="text-2xl tracking-tight text-gray-900">로그인</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 text-left">
            <Label htmlFor="id">아이디</Label>
            <Input
              id="id"
              type="text"
              placeholder="아이디(이메일)를 입력하세요"
              value={loginData.email}
              ref={emailInputRef}
              onChange={handleEmailChange}
              onKeyPress={handleEmailKeyPress}
            />
          </div>
          <div className="space-y-2 text-left">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={loginData.password}
                ref={passwordInputRef}
                onChange={handlePasswordChange}
                onKeyPress={handlePasswordKeyPress}
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
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
        </div>

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button
          onClick={handleLogin}
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>

        <div className="text-center space-y-2">
          <button
            onClick={handleSignupClick}
            className="text-sm text-muted-foreground hover:text-primary hover:font-semibold transition-all duration-200 cursor-pointer block w-full py-1 rounded hover:bg-gray-50"
          >
            아직 계정이 없나요?
          </button>
          <button
            onClick={handleForgotPasswordClick}
            className="text-sm text-muted-foreground hover:text-primary hover:font-semibold transition-all duration-200 cursor-pointer block w-full py-1 rounded hover:bg-gray-50"
          >
            계정을 잊어버리셨나요?
          </button>
        </div>
      </motion.div>
    </div>
  );
}
