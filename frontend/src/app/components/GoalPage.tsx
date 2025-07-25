import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Goal {
  description: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string; // ISO string (LocalDateTime)
}

// 예시 데이터 (백엔드 연동 전까지 사용)
const exampleGoals: Goal[] = [
  {
    description: "비상금 모으기",
    currentAmount: 500000,
    targetAmount: 1000000,
    deadline: "2024-12-31T23:59:59",
  },
  {
    description: "노트북 구매",
    currentAmount: 800000,
    targetAmount: 1500000,
    deadline: "2024-09-01T23:59:59",
  },
];

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

export function GoalPage() {
  const goals = exampleGoals;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">자산 목표 관리</h2>
          <p className="text-gray-500 mt-1">내가 세운 자산 목표를 한눈에 확인하세요.</p>
        </div>
        <Button className="h-10 px-6">+ 목표 추가</Button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 && (
          <Card>
            <CardContent>등록된 목표가 없습니다.</CardContent>
          </Card>
        )}
        {goals.map((goal, idx) => (
          <Card key={idx} className="flex flex-col justify-between h-full relative">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle>{goal.description}</CardTitle>
              <Button size="sm" variant="outline" className="ml-2">편집</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">목표 금액</span>
                <span className="font-semibold">{goal.targetAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">현재 금액</span>
                <span className="font-semibold">{goal.currentAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">달성률</span>
                <span className={goal.currentAmount >= goal.targetAmount ? "text-green-600 font-bold" : "font-semibold"}>
                  {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                  {goal.currentAmount >= goal.targetAmount && (
                    <span className="ml-2">(달성!)</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">기한</span>
                <span>{formatDate(goal.deadline)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}