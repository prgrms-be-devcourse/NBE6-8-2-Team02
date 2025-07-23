import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface MyPageProps {
  onLogout: () => void;
}

export function MyPage({ onLogout }: MyPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4"
    >
      <div className="text-center space-y-8">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-10 h-10 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl text-gray-900">Hello World</h1>
          <p className="text-gray-600">마이페이지 입니다!</p>
        </div>

        <Button 
          onClick={onLogout}
          variant="outline"
          size="lg"
        >
          로그아웃
        </Button>
      </div>
    </motion.div>
  );
}