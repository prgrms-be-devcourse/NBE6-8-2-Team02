import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Goal {
  id: number;
  description: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string; // ISO string (LocalDateTime)
  status: "시작 전" | "진행 중" | "달성";
}

// 예시 데이터 (백엔드 연동 전까지 사용)
const exampleGoals: Goal[] = [
  {
    id: 1,
    description: "비상금 모으기",
    currentAmount: 500000,
    targetAmount: 1000000,
    deadline: "2024-12-31T23:59:59",
    status: "진행 중",
  },
  {
    id: 2,
    description: "노트북 구매",
    currentAmount: 800000,
    targetAmount: 1500000,
    deadline: "2024-09-01T23:59:59",
    status: "진행 중",
  },
];

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

// 상태에 따른 스타일과 색상을 반환하는 함수
const getStatusStyle = (status: Goal["status"]) => {
  switch (status) {
    case "시작 전":
      return "bg-gray-100 text-gray-700 border-gray-300";
    case "진행 중":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "달성":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export function GoalPage() {
  const [goals, setGoals] = useState<Goal[]>(exampleGoals);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Goal>>({});

  const handleEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setEditForm({
      description: goal.description,
      currentAmount: goal.currentAmount,
      targetAmount: goal.targetAmount,
      deadline: goal.deadline,
      status: goal.status,
    });
  };

  const handleSave = () => {
    if (editingId && editForm) {
      // 유효성 검사
      if (!editForm.description || editForm.description.trim() === "") {
        alert("목표 제목을 입력해주세요.");
        return;
      }
      
      if (editForm.currentAmount === undefined || editForm.currentAmount < 0) {
        alert("현재 금액은 0 이상이어야 합니다.");
        return;
      }
      
      if (editForm.targetAmount === undefined || editForm.targetAmount <= 0) {
        alert("목표 금액은 0보다 커야 합니다.");
        return;
      }
      
      setGoals(prevGoals =>
        prevGoals.map(goal =>
          goal.id === editingId
            ? { ...goal, ...editForm }
            : goal
        )
      );
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (goalId: number) => {
    if (confirm("삭제하시겠습니까?")) {
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
      // 만약 삭제 중인 목표가 편집 중이었다면 편집 모드 종료
      if (editingId === goalId) {
        setEditingId(null);
        setEditForm({});
      }
    }
  };

  const handleAdd = () => {
    // 새로운 ID 생성 (기존 ID 중 최대값 + 1)
    const newId = Math.max(...goals.map(g => g.id), 0) + 1;
    
    // 내일 날짜를 ISO 문자열로 생성
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString();
    
    // 새 목표 객체 생성
    const newGoal: Goal = {
      id: newId,
      description: "새 목표",
      currentAmount: 0,
      targetAmount: 0,
      deadline: tomorrowISO,
      status: "시작 전",
    };
    
    // 목표 목록에 추가
    setGoals(prevGoals => [...prevGoals, newGoal]);
    
    // 편집 모드로 설정
    setEditingId(newId);
    setEditForm({
      description: newGoal.description,
      currentAmount: newGoal.currentAmount,
      targetAmount: newGoal.targetAmount,
      deadline: newGoal.deadline,
      status: newGoal.status,
    });
  };

  const handleInputChange = (field: keyof Goal, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">자산 목표 관리</h2>
          <p className="text-gray-500 mt-1">내가 세운 자산 목표를 확인하고 관리하세요.</p>
        </div>
        <Button className="h-10 px-6" onClick={handleAdd}>+ 목표 추가</Button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length === 0 && (
          <Card>
            <CardContent>등록된 목표가 없습니다.</CardContent>
          </Card>
        )}
        {goals.map((goal) => {
          const isEditing = editingId === goal.id;
          
          return (
            <Card key={goal.id} className={`flex flex-col ${isEditing ? 'min-h-64' : 'h-64'}`}>
              <CardHeader className="flex flex-row items-start justify-between pb-2 flex-shrink-0">
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <Input
                      value={editForm.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="text-lg font-semibold mb-2"
                    />
                  ) : (
                    <CardTitle className="truncate">{goal.description}</CardTitle>
                  )}
                  <div className="mt-2">
                    {isEditing ? (
                      <Select
                        value={editForm.status || ""}
                        onValueChange={(value: Goal["status"]) => handleInputChange("status", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="시작 전">시작 전</SelectItem>
                          <SelectItem value="진행 중">진행 중</SelectItem>
                          <SelectItem value="달성">달성</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(goal.status)}`}>
                        {goal.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-2 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        완료
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        취소
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(goal)}>
                        편집
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(goal.id)}>
                        삭제
                      </Button>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className={`space-y-2 ${isEditing ? 'flex-1' : 'flex-1 flex flex-col justify-center'}`}>
              <div className="flex justify-between text-sm">
                  <span className="text-gray-500">현재 금액</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.currentAmount || ""}
                      onChange={(e) => handleInputChange("currentAmount", parseInt(e.target.value) || 0)}
                      className="w-24 text-right"
                    />
                  ) : (
                    <span className="font-semibold">{goal.currentAmount.toLocaleString()}원</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">목표 금액</span>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editForm.targetAmount || ""}
                      onChange={(e) => handleInputChange("targetAmount", parseInt(e.target.value) || 0)}
                      className="w-24 text-right"
                    />
                  ) : (
                    <span className="font-semibold">{goal.targetAmount.toLocaleString()}원</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">기한</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editForm.deadline ? formatDate(editForm.deadline) : ""}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        const isoString = date.toISOString();
                        handleInputChange("deadline", isoString);
                      }}
                      className="w-32"
                    />
                  ) : (
                    <span>{formatDate(goal.deadline)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">달성률</span>
                  <span className={goal.currentAmount >= goal.targetAmount ? "text-green-600 font-bold" : "font-semibold"}>
                    {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}