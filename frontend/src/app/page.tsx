'use client';

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WelcomePage } from "./components/WelcomePage";
import { LoginPage } from "./components/LoginPage";

export default function Home() {
  const [currentView, setCurrentView] = useState<"welcome" | "login">("welcome");

  const handleStart = () => {
    setCurrentView("login");
  };

  const handleLogin = (loginData: { id: string; password: string }) => {
    console.log("로그인 시도:", loginData);
    // 로그인 로직 구현
  };

  const handleSignupClick = () => {
    console.log("회원가입 페이지로 이동");
    // 회원가입 페이지 로직 구현
  };
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
      </AnimatePresence>
    </div>
  );
}
