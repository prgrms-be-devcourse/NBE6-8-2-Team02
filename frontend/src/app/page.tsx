"use client";

import { AnimatePresence } from "framer-motion";
import { Router, Route, useRouter } from "./components/Router";
import { routes } from "./config/routes";

<<<<<<< HEAD
function AppContent() {
  const { currentPath } = useRouter();

  // 현재 경로에 해당하는 라우트 찾기
  const currentRoute = routes.find(route => route.path === currentPath);
  
  if (!currentRoute) {
    // 404 처리 (기본적으로 홈으로 리다이렉트)
    return <div>페이지를 찾을 수 없습니다.</div>;
  }

  const Component = currentRoute.component;
  
  // 레이아웃에 따라 다른 래퍼 적용
  if (currentRoute.layout === "full") {
    return <Component />;
  }

  // 기본 auth 레이아웃 (중앙 정렬)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <Component />
=======
import { SignupPage } from "./components/SignupPage";
import { MyPage } from "./components/MyPage";
import { AccountProvider } from "@/context/AccountContext";

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

  const handleSignup = (signupData: {
    id: string;
    password: string;
    email: string;
  }) => {
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
        {currentView === "welcome" && <WelcomePage onStart={handleStart} />}

        {currentView === "login" && (
          <LoginPage onLogin={handleLogin} onSignupClick={handleSignupClick} />
        )}

        {currentView === "signup" && (
          <SignupPage
            onSignup={handleSignup}
            onBackToLogin={handleBackToLogin}
          />
        )}
>>>>>>> 9eb41d4 (Account List + Account Transaction List Page)
      </AnimatePresence>
    </div>
  );
}
<<<<<<< HEAD

export default function App() {
  return (
    <Router initialPath="/">
      <AppContent />
    </Router>
  );
}

//새로운 페이지 추가할 땐 config/routes.tsx 에서 설정 해주시면 됩니다.
=======
>>>>>>> 9eb41d4 (Account List + Account Transaction List Page)
