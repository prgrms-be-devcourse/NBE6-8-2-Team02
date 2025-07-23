import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginPageProps {
  onLogin: (data: { id: string; password: string }) => void;
  onSignupClick: () => void;
}

export function LoginPage({ onLogin, onSignupClick }: LoginPageProps) {
  const [loginData, setLoginData] = useState({ id: "", password: "" });

  const handleLogin = () => {
    onLogin(loginData);
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
            placeholder="아이디를 입력하세요"
            value={loginData.id}
            onChange={(e) => setLoginData({ ...loginData, id: e.target.value })}
          />
        </div>
        <div className="space-y-2 text-left">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
        </div>
      </div>

      <Button 
        onClick={handleLogin}
        size="lg"
        className="w-full"
      >
        로그인
      </Button>

      <div className="text-center">
        <button
          onClick={onSignupClick}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          아직 계정이 없나요?
        </button>
      </div>
    </motion.div>
  );
}