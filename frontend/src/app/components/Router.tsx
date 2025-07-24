import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  const [currentPath, setCurrentPath] = useState(initialPath);

  const navigate = (path: string) => {
    setCurrentPath(path);
    // URL 히스토리 관리 (선택사항)
    window.history.pushState({}, "", path);
  };

  // 브라우저 뒤로가기/앞으로가기 버튼 지원
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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