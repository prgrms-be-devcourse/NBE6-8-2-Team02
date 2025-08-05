import { motion } from 'framer-motion';
import { BarChart2, Coins, House, ArrowUpRight, ArrowDownLeft, SquareXIcon} from 'lucide-react';
import { ReactNode } from "react";
import * as React from "react"
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle, } from "@/app/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart"
import { Bar, BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

interface CardProps {
    icon: ReactNode;
    title: string;
    value: string;
    description: string;
    chartData?: any[]; // optional
    onClick?: () => void;
}

interface CardAssetProps {
    icon: ReactNode;
    title: string;
    value: number;
    onClick?: () => void;
}

interface CardAssetPropsDelete {
    id: number;
    icon: ReactNode;
    title: string;
    value: number;
    onDelete?: (id: number) => void;
}

interface CardAssetPropsCreate {
    icon: ReactNode;
    title: string;
    value: number;
}
  
export function Card({ icon, title, value, description, onClick }: CardProps) {
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

export function CardAsset({ icon, title, value, onClick }: CardAssetProps) {
    return (
      <motion.div
        whileHover={{ scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-[400px] rounded-2xl border shadow-sm bg-white p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={onClick} // 🔹 클릭 이벤트 추가
      >
        <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
        <div>
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">₩{value.toLocaleString()}</p>
        </div>
      </motion.div>
    );
}

export function CardAssetCreate({ icon, title, value}: CardAssetPropsCreate) {
    return (
      <div className="w-[400px] rounded-2xl border shadow-sm bg-white p-5 flex items-start gap-4 transition-shadow">
        <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
        <div>
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">₩{value.toLocaleString()}</p>
        </div>
      </div>
    );
}

export function CardAssetDetail({ id, icon, title, value, onDelete }: CardAssetPropsDelete) {
    return (
      <div className="w-[600px] rounded-2xl border shadow-sm bg-white p-5 flex items-start gap-4 transition-shadow">
        <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
        <div>
          <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
          <p className="text-xl font-semibold text-gray-800 mt-1">₩{value.toLocaleString()}</p>
        </div>
        <div className="flex ml-auto">
            <button
                onClick={() => onDelete?.(id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                aria-label="삭제"
                type="button"
            >
              <SquareXIcon></SquareXIcon>
            </button>
        </div>
      </div>
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
    const total = React.useMemo(() => {
      if (!data || data.length === 0) {
        return { total: 0, changeRate: 0 };
      }
    
      const last = data[data.length - 1];
      const prev = data[data.length - 2];
    
      const lastTotal = last?.total || 0;
      const prevTotal = prev?.total || 0;
    
      const changeRate = prevTotal > 0 ? ((lastTotal - prevTotal) / prevTotal) * 100 : 0;
    
      return {
        total: lastTotal,
        changeRate,
      };
    }, [data])
    return (
      <UICard className="py-4 sm:py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
            <CardTitle>자산 변화 추이</CardTitle>
            <CardDescription>
              최근 6개월 간의 변화
            </CardDescription>
          </div>
          {/* 💡 증감률 블럭 추가 */}
          <div className={`flex items-center border-l`}>
            <div className={`${total.changeRate >= 0 ? 'text-green-700' : 'text-red-700'} flex flex-1 flex-col sm:px-8 sm:py-6 gap-1 text-left px-6 py-4 justify-center`}>
              <CardTitle className='text-muted-foreground text-xs'>
                이전 월 대비
              </CardTitle>
              <section className='text-lg leading-none font-bold sm:text-3xl'>
                {total.changeRate >= 0 ? '▲' : '▼'} {Math.abs(total.changeRate).toFixed(1)}%
              </section>
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

export function formatDateString(dateStr: string): string {
    const [year, month, day] = dateStr.split("T")[0].split("-");
    return `${year}년 ${month}월 ${day}일`;
}
  
interface ActivityItemProps {
    amount: number;
    type: string;
    date: string;
    content: string;
    assetType: string;
}

interface ActivityItemPropsEditable {
    id: number;  // id 추가
    amount: number;
    type: string;
    date: string;
    content: string;
    assetType: string;
    onDelete?: (id: number) => void;
}
  
export function ActivityItem({ content, date, amount, type, assetType }: ActivityItemProps) {
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

export function ActivityItemEditable({ id, content, date, amount, type, assetType, onDelete }: ActivityItemPropsEditable) {
    const amountColor =
      type === 'ADD' ? 'text-green-600' :
      type === 'REMOVE' ? 'text-red-600' :
      'text-gray-600';
  
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
      <div className="flex flex-row gap-4 py-1 border-b border-gray-200 items-center">
        <section className="flex items-start gap-4 flex-grow">
          <div className="p-2 bg-gray-100 rounded-full">{assetIcon}</div>
          <div className="flex flex-col">
            <span className="font-medium">{content}</span>
            <span className="text-sm text-gray-400 mt-1">{formatDateString(date)}</span>
          </div>
        </section>
  
        <section className="flex items-center gap-2">
          <span className={`${amountColor} font-semibold`}>₩{formattedAmount}</span>
        </section>
        <section className="flex mb-auto">
            <button
                onClick={() => onDelete?.(id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                aria-label="삭제"
                type="button"
            >
              <SquareXIcon></SquareXIcon>
            </button>
        </section>
      </div>
    );
  }
  
  
interface ActivityListProps {
    activities: ActivityItemProps[];
}

interface ActivityListPropsEditable {
    activities: ActivityItemPropsEditable[];
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

export function ActivityListEditable({ activities }: ActivityListPropsEditable) {
    return (
      <div className="bg-white rounded-2xl shadow-md border p-4 space-y-2 w-full">
        {activities.map((activity, index) => (
          <ActivityItemEditable key={index} {...activity} />
        ))}
      </div>
    );
}

interface CardChartProps {
    data: { month: number, total: number }[];
}
  
interface ChartBarHorizontalProps {
    barChartData: { type: string; value: number }[];
}

export function formatValue(value: number) {
    return `₩${value.toLocaleString()}`;
}
  
export function formatCount(count: number) {
    return `${count}개 자산 연결됨`;
}

export function formatIcon(type: string) {
    switch(type){
        case "DEPOSIT":
            return <Coins className="w-6 h-6 text-blue-500" />;
        case "REAL_ESTATE":
            return <House className="w-6 h-6 text-orange-500" />;
        case "STOCK":
            return <BarChart2 className="w-6 h-6 text-purple-500" />;
        default:
            return null; // 기본 아이콘이 필요하면 여기에 지정
    }
}