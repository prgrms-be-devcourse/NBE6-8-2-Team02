'use client'

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export function WelcomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/auth/login");
  };

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="text-center space-y-8 max-w-md"
    >
      <div className="space-y-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-primary-foreground"
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
        <h1 className="text-3xl tracking-tight text-gray-900">
          자산관리 서비스
        </h1>
        <p className="text-gray-600 leading-relaxed">
          효율적이고 편리하게 자산관리를 시작해보세요
        </p>
      </div>
      <Button
        onClick={handleStart}
        size="lg"
        className="px-8 py-3"
      >
        시작하기
      </Button>
    </motion.div>
  );
}