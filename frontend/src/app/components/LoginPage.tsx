import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "./Router";
import { authAPI } from "@/lib/auth";

export function LoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { navigate } = useRouter();

  // 입력 필드 refs
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
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

      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('userId', response.userId || response.memberId || response.id);
        localStorage.setItem('userEmail', response.email);
        navigate("/mypage");
      } else {
        const cookies = document.cookie.split(';');
        const accessTokenCookie = cookies.find(cookie =>
          cookie.trim().startsWith('accessToken=')
        );

        if (accessTokenCookie) {
          const token = accessTokenCookie.split('=')[1];
          localStorage.setItem('authToken', token);
          localStorage.setItem('userId', response.userId || response.memberId || response.id);
          localStorage.setItem('userEmail', response.email);
          navigate("/mypage");
        } else {
          setError(response.message || response.error || "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
        }
      }
    } catch (error) {
      console.error("로그인 실패:", error);

      // 에러 타입별 세분화된 처리
      if (error instanceof Error) {
        // 네트워크 에러 체크
        if (error.message.includes('fetch') || error.message.includes('network')) {
          setError("네트워크 연결을 확인해주세요. 인터넷 연결 상태를 점검해주세요.");
          return;
        }

        // HTTP 상태 코드별 에러 처리
        if (error.message.includes('401')) {
          setError("아이디 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.");
          setTimeout(() => {
            passwordInputRef.current?.focus();
            passwordInputRef.current?.select();
          }, 100);
          return;
        }

        if (error.message.includes('403')) {
          setError("계정이 잠겨있습니다. 관리자에게 문의해주세요.");
          return;
        }

        if (error.message.includes('404')) {
          setError("존재하지 않는 계정입니다. 회원가입을 먼저 진행해주세요.");
          setTimeout(() => {
            emailInputRef.current?.focus();
            emailInputRef.current?.select();
          }, 100);
          return;
        }

        if (error.message.includes('429')) {
          setError("로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.");
          return;
        }

        if (error.message.includes('500')) {
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
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="text-center space-y-6 max-w-sm w-full"
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
        <h2 className="text-2xl tracking-tight text-gray-900">
          로그인
        </h2>
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
            onChange={(e) => {
              setLoginData({ ...loginData, email: e.target.value });
              setError(""); // 입력 시 에러 메시지 초기화
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={loginData.password}
            ref={passwordInputRef}
            onChange={(e) => {
              setLoginData({ ...loginData, password: e.target.value });
              setError(""); // 입력 시 에러 메시지 초기화
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLogin();
              }
            }}
          />
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
  );
}