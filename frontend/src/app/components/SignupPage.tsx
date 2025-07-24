import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "./Router";

export function SignupPage() {
  const [signupData, setSignupData] = useState({ 
    id: "", 
    password: "", 
    email: ""
  });
  const { navigate } = useRouter();

  const handleSignup = () => {
    if (signupData.id && signupData.password && signupData.email) {
      console.log("회원가입 완료:", signupData);
      navigate("/login");
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <h2 className="text-2xl tracking-tight text-gray-900">
          회원가입
        </h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <Label htmlFor="signup-email">이메일</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="signup-password">비밀번호</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          />
        </div>
      </div>
      <Button 
        onClick={handleSignup}
        size="lg"
        className="w-full"
      >
        회원가입
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