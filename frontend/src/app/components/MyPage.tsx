'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useRouter } from "./Router";
import { ArrowRight, Wallet, BarChart2, Coins, House, ArrowUpRight, ArrowDownLeft, TrendingUp, Bitcoin, LayoutDashboard, CreditCard, HandCoins} from 'lucide-react';
import { ReactNode } from "react";
import * as React from "react"
import { Card as UICard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";

export const description = "A line chart with a label"

const linearChartData = [
  { month: "January", total: 800000, revenue: 80000, expense: 300000 },
  { month: "February", total: 900000, revenue: 160000, expense: 400000 },
  { month: "March", total: 760000, revenue: 300000, expense: 440000 },
  { month: "April", total: 1100000, revenue: 1100000, expense: 900000 },
  { month: "May", total: 880000, revenue: 200000, expense: 300000 },
  { month: "June", total: 1248000, revenue: 300000, expense: 100000 },
]

const barChartDataRaw = [
  { type: "account", value: 1300000 },
  { type: "deposit", value: 4180000 },
  { type: "real_estate", value: 2000000 },
  { type: "stock", value: 5000000 },
]

const total = barChartDataRaw.reduce((sum, item) => sum + item.value, 0);

const barChartData = barChartDataRaw.map((item) => ({
  ...item,
  value: parseFloat(((item.value / total) * 100).toFixed(2)), // 비율 값
}));

export function MyPage() {
  const { navigate } = useRouter();

  const onLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen grid grid-cols-[1fr_auto_auto_auto_1fr] gap-x-4">
      <div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-r"
      >
        <section 
        onClick={() => navigate('/mypage')}
        className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <LayoutDashboard className="text-black-500"/>대시 보드
        </section>
        <section 
        onClick={() => navigate('/mypage/accounts')}
        className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <CreditCard className="text-black-500"/>계좌 목록
        </section>
        <section 
        onClick={() => navigate('/mypage/assets')}
        className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <HandCoins className="text-black-500"/>자산 목록
        </section>
        <section 
        onClick={() => navigate('/mypage/assets/deposit')}
        className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <Coins className="text-black-500"/>예금/적금
        </section>
        <section 
        onClick={() => navigate('/mypage/assets/real_estate')}
        className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <House className="text-black-500"/>부동산
        </section>
        <section 
        onClick={() => navigate('/mypage/assets/stock')}
        className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <BarChart2 className="text-black-500"/>주식
        </section>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
      >
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">자산 가치</h1>
        </header>

        <section>
          <CardMain
            value ={1248000}
            revenue ={300000}
            expense ={100000}
          />
        </section>

        <section>
          <ChartLineInteractive/>
        </section>

        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">자산 현황</h1>
        </header>


        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            icon={<Coins className="w-6 h-6 text-green-500" />} 
            title="입출금 계좌" 
            value="₩1,300,000" 
            description="2개 계좌 연결됨" 
          />
          <Card icon={<Coins className="w-6 h-6 text-blue-500" />} title="예금/적금" value="₩4,180,000" description="2개 자산 연결됨" onClick={() => navigate('/mypage/assets')} />
          <Card icon={<House className="w-6 h-6 text-orange-500" />} title="부동산" value="₩2,000,000" description="1개 자산 연결됨" onClick={() => navigate('/mypage/assets')} />
          <Card icon={<BarChart2 className="w-6 h-6 text-purple-500" />} title="주식" value="₩5,000,000" description="3개 자산 연결됨" onClick={() => navigate('/mypage/assets')} />
        </section>

        <section>
          <ChartBarHorizontal/>
        </section>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-l"
      >
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">최근 거래</h1>
        </header>

        <section>
          <ActivityList
            activities={[
              {
                icon: <BarChart2 className="text-purple-500 w-6 h-6" />,
                title: "삼성전자 주식 매수",
                date: "2025-07-21",
                amount: 500000,
                type: "income"
              },
              {
                icon: <Coins className="text-green-500 w-6 h-6" />,
                title: "삼성전자 주식 매수",
                date: "2025-07-21",
                amount: 500000,
                type: "expense"
              },
              {
                icon: <Coins className="text-green-500 w-6 h-6" />,
                title: "토스뱅크 계좌 연결",
                date: "2025-07-19",
                amount: 0,
                type: "transfer"
              },
              {
                icon: <Coins className="text-green-500 w-6 h-6" />,
                title: "월급 입금",
                date: "2025-07-15",
                amount: 3000000,
                type: "income"
              },
              {
                icon: <Coins className="text-green-500 w-6 h-6" />,
                title: "카드 사용",
                date: "2025-07-14",
                amount: 12000,
                type: "expense"
              },
              {
                icon: <Coins className="text-green-500 w-6 h-6" />,
                title: "카드 사용",
                date: "2025-07-13",
                amount: 30000,
                type: "expense"
              },
              {
                icon: <Coins className="text-green-500 w-6 h-6" />,
                title: "카드 사용",
                date: "2025-07-12",
                amount: 100000,
                type: "expense"
              },
              {
                icon: <Coins className="text-green-500 w-6 h-6" />,
                title: "카드 사용",
                date: "2025-07-11",
                amount: 80000,
                type: "expense"
              }
            ]}
          />
        </section>

      </motion.div>
      <div>
      </div>
    </div>
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

interface CardMainProps {
  value: number;
  revenue: number;
  expense: number;
}

export function CardMain({ value, revenue, expense}: CardMainProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="rounded-2xl border shadow-sm bg-white p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <section className="flex items-start gap-4">
        <div className="p-2 bg-gray-100 rounded-full"><Coins className="w-6 h-6 text-blue-500"/></div>
        <div>
          <h3 className="text-sm text-gray-500 font-medium">자산 가치</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">₩{value.toLocaleString()}</p>
        </div>
      </section>

      <section className="flex items-start gap-4 ml-auto">
      <div className="p-2 bg-gray-100 rounded-full"><ArrowUpRight className="w-6 h-6 text-green-500"/></div>
        <div>
          <h3 className="text-sm text-gray-500 font-medium">이번 달 수익</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">₩{revenue.toLocaleString()}</p>
        </div>
      </section>

      <section className="flex items-start gap-4 ml-auto">
      <div className="p-2 bg-gray-100 rounded-full"><ArrowDownLeft className="w-6 h-6 text-red-500"/></div>
        <div>
          <h3 className="text-sm text-gray-500 font-medium">이번 달 지출</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">₩{expense.toLocaleString()}</p>
        </div>
      </section>
    </motion.div>
  );
}

interface MonthlyAssetData {
  month: string;     // 예: "2025-01"
  total: number;     // 총 자산 (예: 1200000)
}

interface CardChartProps {
  data: MonthlyAssetData[];
}

const chartConfig = {
  total: {
    label: "자산 가치",
    color: "blue",
  },
  revenue: {
    label: "수익",
    color: "green",
  },
  expense: {
    label: "지출",
    color: "red",
  },

  type: {
    label: "유형",
    color: "red",
  },
  value: {
    label: "가치",
    color: "red",
  },
} satisfies ChartConfig

export function ChartLineInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("total")
    const total = React.useMemo(
      () => {
        const last = linearChartData[linearChartData.length - 1];  // 마지막 항목
        return {
          total: last.total,
          revenue: last.revenue,
          expense: last.expense,
        };
      },
      []
    )
  return (
    <UICard className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>자산 변화 추이</CardTitle>
          <CardDescription>
            최근 6개월 간의 변화
          </CardDescription>
        </div>
        <div className="flex">
          {["total", "revenue", "expense"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                <CardTitle>{chartConfig[chart].label}</CardTitle>
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  ₩{total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={linearChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={1}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </UICard>
  )
}

export function ChartBarHorizontal() {
  return (
    <UICard>
      <CardHeader className='border-b'>
        <CardTitle>자산 비율</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <BarChart
            accessibilityLayer
            data={barChartData}
            layout="vertical"
            margin={{
              left: -10,
            }}
          >
            <XAxis type="number" dataKey="value" hide/>
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={25}
              axisLine={false}
              tick={<TypeIconTick/>}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                />
              }
            />
            <Bar dataKey="value" radius={5} barSize={10}>
            {barChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
            ))}
          </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </UICard>
  )
}

function getBarColor(type: string) {
  switch (type) {
    case 'account':
      return '#4ade80'; // green
    case 'deposit':
      return '#60a5fa'; // blue
    case 'real_estate':
      return 'orange'; // red
    case 'stock':
      return 'purple'; // yellow
    default:
      return '#a3a3a3'; // gray
  }
}

function TypeIconTick({ x, y, payload }: any) {
  const month = payload.value;

  const getIcon = () => {
    switch (month) {
      case "account":
        return <Coins className="w-6 h-6 text-green-500" />;
      case "deposit":
        return <Coins className="w-6 h-6 text-blue-500" />;
      case "real_estate":
        return <House className="w-6 h-6 text-orange-500" />;
      case "stock":
        return <BarChart2 className="w-6 h-6 text-purple-500" />;
      default:
        return <Coins className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <foreignObject x={x - 16} y={y - 16} width={32} height={32}>
      <div
        className="p-1 bg-gray-100 rounded-full flex items-center justify-center w-8 h-8"
      >
        {getIcon()}
      </div>
    </foreignObject>
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
    <div className="flex flex-row gap-4 py-1 border-b border-gray-200">
      <section className="flex items-start gap-4">
        <div className="p-2 bg-gray-100 rounded-full">{icon}</div> {/* 아이콘 */}
        <div className="flex flex-col">
          <span className="font-medium">{title}</span>
          <span className="text-sm text-gray-400 mt-1">{date}</span>
        </div>
      </section>
      <section className="flex items-start gap-4 ml-auto">
      </section>
      <section className="flex items-start gap-4 ml-auto">
        <div className="flex justify-end flex-grow">
          <span className={`${amountColor} font-semibold`}>₩{formattedAmount}</span>
        </div>
      </section>
    </div>
  );
}

interface ActivityListProps {
  activities: ActivityItemProps[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border p-4 space-y-2 w-full">
      {activities.map((activity, index) => (
        <ActivityItem key={index} {...activity} />
      ))}
    </div>
  );
}

