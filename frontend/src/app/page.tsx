"use client";

import { AnimatePresence } from "framer-motion";
import { Router, Route, useRouter } from "./components/Router";
import { routes } from "./config/routes";

function AppContent() {
  const { currentPath } = useRouter();

  // 현재 경로에 해당하는 라우트 찾기
  const currentRoute = routes.find((route) => route.path === currentPath);

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
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router initialPath="/">
      <AppContent />
    </Router>
  );
}
