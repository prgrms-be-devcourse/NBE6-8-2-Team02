import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI } from "@/lib/auth";

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a Router");
  }
  return context;
}

interface RouterProps {
  children: ReactNode;
  initialPath?: string;
}

export function Router({ children, initialPath = "/" }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(() => {
    // 초기 로드 시 현재 URL을 읽어옴
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return initialPath;
  });

  const [isLoading, setIsLoading] = useState(true);

  const navigate = (path: string) => {
    setCurrentPath(path);
    // URL 히스토리 관리
    window.history.pushState({}, "", path);
  };

  // 인증 상태 확인 및 보호된 경로 처리
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      // 보호된 경로 목록
      const protectedPaths = ['/mypage', '/accounts', '/asset', '/goal'];
      const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path));

      if (isProtectedPath) {
        // 인증 상태 확인
        const isAuth = authAPI.isAuthenticated();

        if (!isAuth) {
          // 로그인되지 않은 경우 홈으로 리다이렉트
          console.log("인증되지 않은 사용자, 홈으로 리다이렉트");
          navigate("/");
          setIsLoading(false);
          return;
        }

        // 토큰 유효성 검증 (선택적)
        try {
          const isValid = await authAPI.validateToken();
          if (!isValid) {
            console.log("토큰이 유효하지 않음, 로그아웃 처리");
            authAPI.logout();
            navigate("/");
          }
        } catch (error) {
          console.log("토큰 검증 실패, 로그아웃 처리");
          authAPI.logout();
          navigate("/");
        }
      }

      setIsLoading(false);
    };

    checkAuthAndRedirect();
  }, [currentPath]);

  // 브라우저 뒤로가기/앞으로가기 버튼 지원
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

interface RouteProps {
  path: string;
  children: ReactNode;
}

export function Route({ path, children }: RouteProps) {
  const { currentPath } = useRouter();

  if (currentPath === path) {
    return <>{children}</>;
  }

  return null;
}