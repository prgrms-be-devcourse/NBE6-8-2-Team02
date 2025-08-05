'use client';

import { AnimatePresence } from "framer-motion";
import { WelcomePage } from "@/app/components/WelcomePage";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <WelcomePage />
      </AnimatePresence>
    </div>
  );
}
