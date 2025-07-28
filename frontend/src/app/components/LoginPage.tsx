import { useState } from "react";
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

  const handleLogin = async () => {
    // 입력값 검증
    if (!loginData.email.trim()) {
      setError("아이디를 입력해주세요.");
      return;
    }

    if (!loginData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("로그인 시도:", loginData);
      const response = await authAPI.login(loginData);
      console.log("로그인 응답:", response);

      // API 응답 검증 - accessToken 확인
      if (response.accessToken || response.success || response.status === 200) {
        if (response.accessToken) {
          localStorage.setItem('authToken', response.accessToken);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userEmail', response.email);
        }
        navigate("/mypage");
      } else {
        // 서버에서 에러 응답이 온 경우
        setError(response.message || response.error || "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      setError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
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
          className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
        >
          아직 계정이 없나요?
        </button>
        <button
          onClick={handleForgotPasswordClick}
          className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
        >
          계정을 잊어버리셨나요?
        </button>
      </div>
    </motion.div>
  );
}