import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "./Router";
import { authAPI } from "@/lib/auth";

export function SignupPage() {
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { navigate } = useRouter();

  const handleSignup = async () => {
    // 입력값 검증
    if (!signupData.email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!signupData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    if (!signupData.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    // 비밀번호 길이 검증 (8-16자)
    if (signupData.password.length < 8 || signupData.password.length > 16) {
      setError("비밀번호는 8자 이상 16자 이하여야 합니다.");
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
      console.log("회원가입 시도:", signupData);
      const response = await authAPI.signup(signupData);
      console.log("회원가입 응답:", response);

      // API 응답 검증 - 201 CREATED 상태 코드 확인
      if (response && (response.id || response.email || response.userId)) {
        console.log("회원가입 성공:", response);
        navigate("/login");
      } else {
        // 서버에서 에러 응답이 온 경우
        setError(response.message || response.error || "회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      setError("서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
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
          회원가입
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="signup-name">이름</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="이름을 입력하세요 (2-20자)"
            value={signupData.name}
            onChange={(e) => {
              setSignupData({ ...signupData, name: e.target.value });
              setError(""); // 입력 시 에러 메시지 초기화
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
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
              if (e.key === 'Enter') {
                handleSignup();
              }
            }}
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="signup-password">비밀번호</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="비밀번호를 입력하세요 (8-16자)"
            value={signupData.password}
            onChange={(e) => {
              setSignupData({ ...signupData, password: e.target.value });
              setError(""); // 입력 시 에러 메시지 초기화
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSignup();
              }
            }}
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
          <Input
            id="signup-confirm-password"
            type="password"
            placeholder="비밀번호를 재입력하세요"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(""); // 입력 시 에러 메시지 초기화
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSignup();
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
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          이미 계정이 있나요?
        </button>
      </div>
    </motion.div>
  );
}