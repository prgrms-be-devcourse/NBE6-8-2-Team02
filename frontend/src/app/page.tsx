'use client';

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WelcomePage } from "./components/WelcomePage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { MyPage } from "./components/MyPage";

type ViewType = "welcome" | "login" | "signup" | "mypage";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("welcome");

  const handleStart = () => {
    setCurrentView("login");
  };

  const handleLogin = (loginData: { id: string; password: string }) => {
    console.log("로그인 시도:", loginData);
    // 간단한 로그인 검증 (실제로는 서버 API 호출)
    if (loginData.id && loginData.password) {
      setCurrentView("mypage");
    }
  };

  const handleSignupClick = () => {
    setCurrentView("signup");
  };

  const handleSignup = (signupData: { id: string; password: string; email: string }) => {
    console.log("회원가입 완료:", signupData);
    // 회원가입 완료 후 로그인 페이지로 이동
    setCurrentView("login");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  const handleLogout = () => {
    setCurrentView("welcome");
  };

  // 마이페이지는 전체 화면을 사용하므로 별도 렌더링
  if (currentView === "mypage") {
    return <MyPage onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {currentView === "welcome" && (
          <WelcomePage onStart={handleStart} />
        )}

        {currentView === "login" && (
          <LoginPage 
            onLogin={handleLogin}
            onSignupClick={handleSignupClick}
          />
        )}

        {currentView === "signup" && (
          <SignupPage 
            onSignup={handleSignup}
            onBackToLogin={handleBackToLogin}
          />
        )}
      </AnimatePresence>
    </div>
  );
}