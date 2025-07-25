'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useRouter } from "./Router";
import { ArrowRight, Wallet, BarChart2, Coins, House } from 'lucide-react';
import { ReactNode } from "react";
import { Card as UICard, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const assetChartData = [
  { name: "1월", total: 5500000},
  { name: "2월", total: 7500000},
  { name: "3월", total: 11200000},
  { name: "4월", total: 10000000},
  { name: "5월", total: 8700000},
  { name: "6월", total: 12480000},
];


export function AssetPage() {
  const { navigate } = useRouter();

  const onLogout = () => {
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-6xl mx-auto space-y-6"
    >
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">마이페이지</h1>
        <Button onClick={onLogout}>로그아웃</Button>
      </header>

      <section className="mt-8">
        {/* 총 자산산 예제 데이터 */}
      <CardWithChart
          icon={<Wallet className="w-6 h-6 text-blue-500" />}
          title="총 자산"
          value="₩12,480,000"
          description="전월 대비 +5.4%"
          chartData={assetChartData}
        />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 자산 목록 예제 데이터 */}
        <Card
          icon={<Coins className="w-6 h-6 text-green-500" />}
          title="입출금 계좌"
          value="₩1,300,000"
          description="2개 계좌 연결됨"
        />
        <Card
          icon={<Coins className="w-6 h-6 text-blue-500" />}
          title="예금/적금"
          value="₩4,180,000"
          description="2개 자산 연결됨"
          onClick={() => navigate("/mypage/assets")}
        />
        <Card
          icon={<House className="w-6 h-6 text-orange-500" />}
          title="부동산"
          value="₩2,000,000"
          description="1개 자산 연결됨"
          onClick={() => navigate("/mypage/assets")}
        />
        <Card
          icon={<BarChart2 className="w-6 h-6 text-purple-500" />}
          title="주식"
          value="₩5,000,000"
          description="3개 자산 연결됨"
          onClick={() => navigate("/mypage/assets")}
        />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">최근 활동</h2>
        <div className="bg-white rounded-2xl shadow-md border p-4 space-y-2">
          {/* 거래 기록 예제 데이터 */}
        <ActivityItem
          icon={<BarChart2 className="w-6 h-6 text-purple-500" />}
          title="삼성전자 주식 매수"
          date="2025-07-21"
          amount={500000}
          type="income"
        />
        <ActivityItem
          icon={<Coins className="w-6 h-6 text-green-500" />}
          title="삼성전자 주식 매수"
          date="2025-07-21"
          amount={500000}
          type="expense"
        />
        <ActivityItem
          icon={<Coins className="w-6 h-6 text-green-500" />}
          title="토스뱅크 계좌 연결"
          date="2025-07-19"
          amount={0}
          type="transfer"
        />
        <ActivityItem
          icon={<Coins className="w-6 h-6 text-green-500" />}
          title="월급 입금"
          date="2025-07-15"
          amount={3000000}
          type="income"
        />
        <ActivityItem
          icon={<Coins className="w-6 h-6 text-green-500" />}
          title="카드 사용"
          date="2025-07-14"
          amount={12000}
          type="expense"
        />
        <ActivityItem
          icon={<Coins className="w-6 h-6 text-green-500" />}
          title="카드 사용"
          date="2025-07-13"
          amount={30000}
          type="expense"
        />
        <ActivityItem
          icon={<Coins className="w-6 h-6 text-green-500" />}
          title="카드 사용"
          date="2025-07-12"
          amount={100000}
          type="expense"
        />
        <ActivityItem
          icon={<Coins className="w-6 h-6 text-green-500" />}
          title="카드 사용"
          date="2025-07-11"
          amount={80000}
          type="expense"
        />
        </div>
      </section>
    </motion.div>
  );
}

interface CardProps {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
  chartData?: any[]; // optional
  onClick?: () => void;
}

function Card({ icon, title, value, description, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="rounded-2xl border shadow-sm bg-white p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick} // 🔹 클릭 이벤트 추가
    >
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        <p className="text-xl font-semibold text-gray-800 mt-1">{value}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
    </motion.div>
  );
}

export function CardWithChart({ icon, title, value, description, chartData }: CardProps) {
  return (
    <UICard className="p-1">
      <CardContent className="flex flex-row justify-between items-center gap-4">
        {/* 텍스트 영역 */}
        <div className="flex items-start gap-4 space-y-2 w-1/5">
          <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
          <div>
            <div className="text-sm font-medium text-gray-500">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
        </div>

        {/* 차트 영역 */}
        {chartData && (
          <div className="w-4/5 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis hide dataKey="name" />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" name="총 자산" dataKey="total" stroke="#3b82f6" strokeWidth={1} dot={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </UICard>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  date: string;
  amount: number;           // 금액 (예: 50000)
  type: 'income' | 'expense' | 'transfer';  // 거래 유형 예시
}

function ActivityItem({ icon, title, date, amount, type }: ActivityItemProps) {
  // type에 따른 색상 설정
  const amountColor =
    type === 'income' ? 'text-green-600' :
    type === 'expense' ? 'text-red-600' :
    'text-gray-600';

  // 금액 표시 형식, 예: +50,000 or -30,000
  const formattedAmount =
    (type === 'expense' ? '' : '') +
    amount.toLocaleString();

  return (
    <div className="flex items-center gap-2 text-sm py-1 border-b border-gray-200">
      <div className="p-2 bg-gray-100 rounded-full">{icon}</div> {/* 아이콘 */}
      <div className="flex flex-col">
        <span className="font-medium">{title}</span>
        <span className="text-gray-400">{date}</span>
      </div>
      <div className="flex justify-end flex-grow">
        <span className={`${amountColor} font-semibold`}>₩{formattedAmount}</span>
      </div>
    </div>
  );
}
