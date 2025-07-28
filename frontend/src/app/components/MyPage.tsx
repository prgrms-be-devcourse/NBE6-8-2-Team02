'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useRouter } from "./Router";
import { ArrowRight, Wallet, BarChart2, Coins, House, ArrowUpRight, ArrowDownLeft, TrendingUp, Bitcoin, LayoutDashboard, CreditCard, HandCoins } from 'lucide-react';
import { useEffect, useState, ReactNode } from "react";
import * as React from "react"
import { Card as UICard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import { apiFetch } from '../lib/backend/client';
import { authAPI } from '@/lib/auth';
import { Asset } from 'next/font/google';
import { error } from 'console';
import { totalmem } from 'os';

export const description = "A line chart with a label"

function formatValue(value: number) {
  return `₩${value.toLocaleString()}`;
}

function formatCount(count: number) {
  return `${count}개 자산 연결됨`;
}

type Asset = {
  id: number;
  memberId: number;
  name: string;
  assetType: string;
  assetValue: number;
  createDate: string;
  modifyDate: string;
};

type Transaction = {
  id: number;
  assetId: number;
  type: string;
  amount: number;
  content: string;
  date: string;
  createDate: string;
  modifyDate: string;
};

type Account = {
  id: number;
  memberId: number;
  name: string;
  accountNumber: string;
  balance: number;
  createDate: string;
  modifyDate: string;
};

interface CardChartProps {
  data: { month: number, total: number }[];
}

interface ChartBarHorizontalProps {
  barChartData: { type: string; value: number }[];
}

export function MyPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [currentExpense, setCurrentExpense] = useState(0);
  const [linearChartData, setLinearChartData] = useState([
    { month: 1, total: 100000 }
  ]);

  const [activities, setActivities] = useState([
    { amount: 500000, type: "ADD", date: "2025-07-21", content: "삼성전자 주식 매수", assetType: "STOCK" },
  ]);

  const [barChartDataRaw, setBarChartData] = useState([
    { type: "account", count: 0, value: 0 },
    { type: "deposit", count: 0, value: 0 },
    { type: "real_estate", count: 0, value: 0 },
    { type: "stock", count: 0, value: 0 },
  ]);

  const [totalAsset, setTotalAsset] = useState(0);

  const total = barChartDataRaw.reduce((sum, item) => sum + item.value, 0);

  const barChartData = barChartDataRaw.map((item) => ({
    ...item,
    value: parseFloat(((item.value / total) * 100).toFixed(2)), // 비율 값
  }));

  const { navigate } = useRouter();

  const onLogout = () => {
    // @ts-ignore - authAPI.logout이 async 함수로 변경됨
    authAPI.logout();
    navigate("/");
  };

  useEffect(() => {
    console.log("MyPage useEffect 실행");
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const memberRes = await apiFetch('/api/v1/members/me');
      const memberId = memberRes.id;

      if (!memberId) throw new Error("잘못된 사용자 정보입니다.");

      // 계좌, 자산 처리.

      const allAccountRes = await apiFetch('/api/v1/accounts');
      const allAssetRes = await apiFetch('/api/v1/assets');

      const myAssets: Asset[] = allAssetRes.data?.filter(
        (asset: Asset) => asset.memberId === memberId
      );

      const myAccounts: Account[] = allAccountRes.data?.filter(
        (account: Account) => account.memberId === memberId
      );

      // 계좌, 자산의 id 추출 후 거래 내역 처리.

      const myAssetIds = myAssets.map((asset) => asset.id);
      const myAccountIds = myAccounts.map((account) => account.id);

      console.log("내 자산 id 정보", myAssetIds);
      console.log("내 거래 id 정보", myAccountIds);

      const allAssetTransactionResList = await Promise.all(
        myAssetIds.map((id) => apiFetch(`/api/v1/transactions/asset/search/${id}`))
      );
      const allAccountTransactionResList = await Promise.all(
        myAccountIds.map((id) => apiFetch(`/api/v1/transactions/account/search/${id}`))
      );

      const allAssetTransactions = allAssetTransactionResList.flatMap((res, index) => {
        const assetId = myAssetIds[index];
        const asset = myAssets.find((a) => a.id === assetId);

        return (res.data ?? []).map((tx: any) => ({
          amount: tx.amount,
          type: tx.type,
          date: tx.date,
          content: tx.content,
          assetType: asset?.assetType ?? "unknown",
        }));
      });

      const allAccountTransactions = allAccountTransactionResList.flatMap((res) => {
        return (res.data ?? []).map((tx: any) => ({
          amount: tx.amount,
          type: tx.type,
          date: tx.date,
          content: tx.content,
          assetType: "ACCOUNT",

        }));
      });

      const mergedTransactions = [...allAssetTransactions, ...allAccountTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      const mySnapShotRes = await apiFetch(`/api/v1/snapshot/${memberId}`);
      const mySnapShot = mySnapShotRes.data;
      setLinearChartData(
        mySnapShot.map((item: { month: number; totalAsset: number }) => ({
          month: item.month,
          total: item.totalAsset,
        }))
      );

      mergedTransactions.forEach((tx) => {
        const txDate = new Date(tx.date);
        const txYear = txDate.getFullYear();
        const txMonth = txDate.getMonth() + 1;

        console.log(txYear);
        console.log(txMonth);

        console.log(currentYear);
        console.log(currentMonth);

        if (txYear === currentYear && txMonth === currentMonth) {
          if (tx.type === "ADD") {
            setCurrentRevenue(prev => prev + tx.amount);
          }
          else {
            setCurrentExpense(prev => prev + tx.amount);
          }
        }
      })

      console.log("자산 추이 데이터", linearChartData);

      console.log("내 자산 정보", myAssets);
      console.log("내 계좌 정보", myAccounts);
      console.log("내 스냅샷", mySnapShot);

      console.log("이번달 수익", currentRevenue);
      console.log("이번달 손해", currentExpense);

      console.log("자산 거래 정보", allAssetTransactions);
      console.log("계좌 거래 정보", allAccountTransactions);
      console.log("통합 거래 내역", mergedTransactions);

      const newBarChartData = [...barChartDataRaw];

      myAssets.forEach(asset => {
        const type = asset.assetType.toLowerCase(); // "DEPOSIT" -> "deposit"
        const target = newBarChartData.find(item => item.type === type);
        if (target) {
          target.value += asset.assetValue;
          setTotalAsset(prev => prev + asset.assetValue);
          target.count++;
        }
      });

      myAccounts.forEach(account => {
        const type = "account" // "DEPOSIT" -> "deposit"
        const target = newBarChartData.find(item => item.type === type);
        if (target) {
          target.value += account.balance;
          setTotalAsset(prev => prev + account.balance);
          target.count++;
        }
      });

      setBarChartData(newBarChartData);
      setActivities(mergedTransactions);

    } catch (error) {
      console.log("유저 정보 조회 실패", error);
    }
  }

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
          <LayoutDashboard className="text-black-500" />대시 보드
        </section>
        <section
          onClick={() => navigate('/mypage/accounts')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <CreditCard className="text-black-500" />계좌 목록
        </section>
        <section
          onClick={() => navigate('/mypage/assets')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <HandCoins className="text-black-500" />자산 목록
        </section>
        <section
          onClick={() => navigate('/mypage/assets/deposit')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <Coins className="text-black-500" />예금/적금
        </section>
        <section
          onClick={() => navigate('/mypage/assets/real_estate')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <House className="text-black-500" />부동산
        </section>
        <section
          onClick={() => navigate('/mypage/assets/stock')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <BarChart2 className="text-black-500" />주식
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
            value={totalAsset}
            revenue={currentRevenue}
            expense={currentExpense}
          />
        </section>

        <section>
          <ChartLineInteractive data={linearChartData} />
        </section>

        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">자산 현황</h1>
        </header>


        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            icon={<Coins className="w-6 h-6 text-green-500" />}
            title="입출금 계좌"
            value={formatValue(barChartDataRaw.find((d) => d.type === "account")?.value ?? 0)}
            description={formatCount(barChartDataRaw.find((d) => d.type === "account")?.count ?? 0)}
          />
          <Card icon={<Coins className="w-6 h-6 text-blue-500" />} title="예금/적금" value={formatValue(barChartDataRaw.find((d) => d.type === "deposit")?.value ?? 0)} description={formatCount(barChartDataRaw.find((d) => d.type === "deposit")?.count ?? 0)} onClick={() => navigate('/mypage/assets')} />
          <Card icon={<House className="w-6 h-6 text-orange-500" />} title="부동산" value={formatValue(barChartDataRaw.find((d) => d.type === "real_estate")?.value ?? 0)} description={formatCount(barChartDataRaw.find((d) => d.type === "real_estate")?.count ?? 0)} onClick={() => navigate('/mypage/assets')} />
          <Card icon={<BarChart2 className="w-6 h-6 text-purple-500" />} title="주식" value={formatValue(barChartDataRaw.find((d) => d.type === "stock")?.value ?? 0)} description={formatCount(barChartDataRaw.find((d) => d.type === "stock")?.count ?? 0)} onClick={() => navigate('/mypage/assets')} />
        </section>

        <section>
          <ChartBarHorizontal barChartData={barChartData} />
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
          <ActivityList activities={activities} />
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

export function CardMain({ value, revenue, expense }: CardMainProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="rounded-2xl border shadow-sm bg-white p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <section className="flex items-start gap-4">
        <div className="p-2 bg-gray-100 rounded-full"><Coins className="w-6 h-6 text-blue-500" /></div>
        <div>
          <h3 className="text-sm text-gray-500 font-medium">자산 가치</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">₩{value.toLocaleString()}</p>
        </div>
      </section>

      <section className="flex items-start gap-4 ml-auto">
        <div className="p-2 bg-gray-100 rounded-full"><ArrowUpRight className="w-6 h-6 text-green-500" /></div>
        <div>
          <h3 className="text-sm text-gray-500 font-medium">이번 달 수익</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">₩{revenue.toLocaleString()}</p>
        </div>
      </section>

      <section className="flex items-start gap-4 ml-auto">
        <div className="p-2 bg-gray-100 rounded-full"><ArrowDownLeft className="w-6 h-6 text-red-500" /></div>
        <div>
          <h3 className="text-sm text-gray-500 font-medium">이번 달 지출</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">₩{expense.toLocaleString()}</p>
        </div>
      </section>
    </motion.div>
  );
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

export const monthMap: Record<string, string> = {
  "1": "Jan",
  "2": "Feb",
  "3": "Mar",
  "4": "Apr",
  "5": "May",
  "6": "Jun",
  "7": "Jul",
  "8": "Aug",
  "9": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

export function ChartLineInteractive({ data }: CardChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("total")
  const total = React.useMemo(
    () => {
      if (!data || data.length === 0) {
        return { total: 0 };
      }
      const last = data[data.length - 1];  // 마지막 항목
      return {
        total: last?.total || 0  // last가 undefined이면 0 반환
      };
    },
    [data]
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
          {["total"].map((key) => {
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
            data={data}
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
              tickFormatter={(value) => monthMap[String(value)]?.slice(0, 3) ?? ""}

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

export function ChartBarHorizontal({ barChartData }: ChartBarHorizontalProps) {
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
            <XAxis type="number" dataKey="value" hide />
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={25}
              axisLine={false}
              tick={<TypeIconTick />}
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
  amount: number;
  type: string;
  date: string;
  content: string;
  assetType: string;
}

function formatDateString(dateStr: string): string {
  const [year, month, day] = dateStr.split("T")[0].split("-");
  return `${year}년 ${month}월 ${day}일`;
}

function ActivityItem({ content, date, amount, type, assetType }: ActivityItemProps) {
  // type에 따른 색상 설정
  const amountColor =
    type === 'ADD' ? 'text-green-600' :
      type === 'REMOVE' ? 'text-red-600' :
        'text-gray-600';

  // 금액 표시 형식, 예: +50,000 or -30,000
  const formattedAmount =
    (type === 'REMOVE' ? '' : '') +
    amount.toLocaleString();

  const assetIcon =
    assetType === 'ACCOUNT' ? <Coins className="w-6 h-6 text-green-500" /> :
      assetType === 'DEPOSIT' ? <Coins className="w-6 h-6 text-blue-500" /> :
        assetType === 'REAL_ESTATE' ? <House className="w-6 h-6 text-orange-500" /> :
          assetType === 'STOCK' ? <BarChart2 className="w-6 h-6 text-purple-500" /> :
            <Coins className="w-6 h-6 text-green-500" />;

  return (
    <div className="flex flex-row gap-4 py-1 border-b border-gray-200">
      <section className="flex items-start gap-4">
        <div className="p-2 bg-gray-100 rounded-full">{assetIcon}</div> {/* 아이콘 */}
        <div className="flex flex-col">
          <span className="font-medium">{content}</span>
          <span className="text-sm text-gray-400 mt-1">{formatDateString(date)}</span>
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

