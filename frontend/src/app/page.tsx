'use client';

export default function Home() {
  const handleStart = () => {
    console.log("시작!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="text-3xl tracking-tight text-gray-900">
            자산관리 서비스
          </h1>
          <p className="text-gray-600 leading-relaxed">
            설명
          </p>
        </div>
        <button 
          onClick={handleStart}
          className="px-8 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          시작하기기
        </button>
      </div>
    </div>
  );
}
