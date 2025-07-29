import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authAPI } from "@/lib/auth";
import { motion } from 'framer-motion';
import { useRouter } from "./Router";
import { ArrowRight, LayoutDashboard, CreditCard, HandCoins, Target } from 'lucide-react';
import { apiFetch } from '../lib/backend/client';

interface Goal {
  id: number;
  memberId: number;
  description: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string; // ISO string (LocalDateTime)
  status: "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED";
}

// 예시 데이터 (백엔드 연동 전까지 사용)
const exampleGoals: Goal[] = [
  {
    id: 1,
    memberId: 4,
    description: "비상금 모으기",
    currentAmount: 500000,
    targetAmount: 1000000,
    deadline: "2024-12-31T23:59:59",
    status: "IN_PROGRESS",
  },
  {
    id: 2,
    memberId: 4,
    description: "노트북 구매",
    currentAmount: 800000,
    targetAmount: 1500000,
    deadline: "2024-09-01T23:59:59",
    status: "IN_PROGRESS",
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
    case "NOT_STARTED":
      return "bg-gray-100 text-gray-700 border-gray-300";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "ACHIEVED":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// 상태를 한글로 표시하는 함수
const getStatusDisplay = (status: Goal["status"]) => {
  switch (status) {
    case "NOT_STARTED":
      return "시작 전";
    case "IN_PROGRESS":
      return "진행 중";
    case "ACHIEVED":
      return "달성";
    default:
      return "시작 전";
  }
};

// 목표 API 함수들
const goalAPI = {
  // 목표 리스트 조회
  async getGoals() {
    try {
      console.log("목표 조회 API 호출 시작");
      
      const data = await apiFetch('/api/v1/goals/');
      
      console.log("API 응답 데이터:", data);
      return data;
    } catch (error) {
      console.error("목표 조회 API 에러:", error);
      throw error;
    }
  },
};

export function GoalPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Goal>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useRouter();

  // 인증 상태 확인 및 목표 리스트 조회
  useEffect(() => {
    const checkAuthAndFetchGoals = async () => {
      const isAuth = authAPI.isAuthenticated();
      if (!isAuth) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const goalsData = await goalAPI.getGoals();
        setGoals(goalsData);
      } catch (error) {
        console.error("목표 조회 실패:", error);
        
        // 500 에러인 경우 서버 문제로 간주하고 예시 데이터 사용
        if (error instanceof Error && error.message.includes("500")) {
          setError("서버에 일시적인 문제가 있습니다.");
        } else {
          setError("목표 목록을 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndFetchGoals();
  }, [navigate]);

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
      memberId: 4, // 임시 memberId
      description: "새 목표",
      currentAmount: 0,
      targetAmount: 0,
      deadline: tomorrowISO,
      status: "NOT_STARTED",
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

  if (loading) {
    return (
      <div className="min-h-screen grid grid-cols-[1fr_auto_auto_1fr] gap-x-4">
        <div></div>
        <motion.div className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-r">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">목표 목록을 불러오는 중...</div>
          </div>
        </motion.div>
        <div></div>
        <div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen grid grid-cols-[1fr_auto_auto_1fr] gap-x-4">
        <div></div>
        <motion.div className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-r">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </motion.div>
        <div></div>
        <div></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-[1fr_auto_auto_1fr] gap-x-4">
      <div></div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6 border-r"
      >
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">메뉴</h1>
        </header>

        <section
          onClick={() => navigate('/mypage')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <LayoutDashboard className="text-black-500" />대시 보드
        </section>
        <section
          onClick={() => navigate('/goals')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer bg-gray-100">
          <Target className="text-black-500" />나의 목표
        </section>
        <section
          onClick={() => navigate('/accounts')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <CreditCard className="text-black-500" />계좌 목록
        </section>
        <section
          onClick={() => navigate('/mypage/assets')}
          className="flex items-center p-2 gap-4 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer">
          <HandCoins className="text-black-500" />자산 목록
        </section>
        <section
          onClick={async () => {
            try {
              await authAPI.logout();
              navigate("/");
            } catch (error) {
              console.error("로그아웃 실패:", error);
              navigate("/");
            }
          }}
          className="flex items-center p-2 gap-4 text-red-500 hover:bg-red-50 rounded-md cursor-pointer">
          <ArrowRight className="text-red-500" />로그아웃
        </section>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
      >
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">자산 목표 관리</h1>
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
                          onValueChange={(value: "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED") => handleInputChange("status", value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                                                  <SelectContent>
                          <SelectItem value="NOT_STARTED">시작 전</SelectItem>
                          <SelectItem value="IN_PROGRESS">진행 중</SelectItem>
                          <SelectItem value="ACHIEVED">달성</SelectItem>
                        </SelectContent>
                        </Select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(goal.status)}`}>
                          {getStatusDisplay(goal.status)}
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
      </motion.div>
      <div></div>
      <div></div>
    </div>
  );
}