"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { authAPI } from "@/lib/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/backend/client";
import SideBar from "@/app/components/SideBar";

interface Goal {
  id: number;
  memberId: number;
  description: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string; // ISO string (LocalDateTime)
  status: "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED";
}

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
  // 목표 다건 조회
  async getGoals() {
    try {
      const data = await apiFetch("/api/v1/goals");
      return data;
    } catch (error) {
      console.error("목표 조회 API 에러:", error);
      throw error;
    }
  },

  // 목표 수정
  async updateGoal(
    id: number,
    goalData: {
      description: string;
      currentAmount: number;
      targetAmount: number;
      deadline: string;
      status: "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED";
    }
  ) {
    try {
      const data = await apiFetch(`/api/v1/goals/${id}`, {
        method: "PUT",
        body: JSON.stringify(goalData),
      });
      return data;
    } catch (error) {
      console.error("목표 수정 API 에러:", error);
      throw error;
    }
  },

  // 목표 삭제
  async deleteGoal(id: number) {
    try {
      const data = await apiFetch(`/api/v1/goals/${id}`, {
        method: "DELETE",
      });
      return data;
    } catch (error) {
      console.error("목표 삭제 API 에러:", error);
      throw error;
    }
  },

  // 목표 생성
  async createGoal(goalData: {
    description: string;
    currentAmount: number;
    targetAmount: number;
    deadline: string;
    status: "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED";
  }) {
    try {
      const data = await apiFetch("/api/v1/goals", {
        method: "POST",
        body: JSON.stringify(goalData),
      });
      return data;
    } catch (error) {
      console.error("목표 생성 API 에러:", error);
      throw error;
    }
  },
};

export default function GoalPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Goal>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 인증 상태 확인 및 목표 리스트 조회
  useEffect(() => {
    const checkAuthAndFetchGoals = async () => {
      const isAuth = authAPI.isAuthenticated();
      if (!isAuth) {
        router.push("/");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const goalsData = await goalAPI.getGoals();

        // 목표 데이터의 ID를 숫자로 변환하여 설정
        const processedGoals = Array.isArray(goalsData)
          ? goalsData.map((goal: any) => ({
              ...goal,
              id: Number(goal.id),
            }))
          : Array.isArray(goalsData.data)
          ? goalsData.data.map((goal: any) => ({
              ...goal,
              id: Number(goal.id),
            }))
          : [];

        setGoals(processedGoals);
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
  }, [router]);

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

  const handleSave = async () => {
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

      if (editForm.targetAmount < editForm.currentAmount) {
        alert("목표 금액은 현재 금액보다 많아야 합니다.");
        return;
      }

      try {
        const goalData = {
          description: editForm.description!,
          currentAmount: editForm.currentAmount!,
          targetAmount: editForm.targetAmount!,
          deadline: editForm.deadline!,
          status: editForm.status!,
        };

        // 임시 목표인지 확인 (음수 ID)
        if (editingId < 0) {
          // 생성 API 호출
          const createdGoal = await goalAPI.createGoal(goalData);

          // 백엔드에서 반환된 데이터 구조 확인 및 처리
          let newGoal = createdGoal.data;

          // ID를 숫자로 확실히 변환
          const newId = Number(newGoal.id || newGoal.goalId || Date.now());

          // 임시 목표를 실제 목표로 교체
          setGoals((prevGoals) =>
            prevGoals.map((goal) =>
              Number(goal.id) === Number(editingId)
                ? { ...newGoal, id: newId }
                : goal
            )
          );
        } else {
          // 수정 API 호출 (ID를 숫자로 변환)
          await goalAPI.updateGoal(Number(editingId), goalData);

          // 성공 시 로컬 상태 업데이트
          setGoals((prevGoals) =>
            prevGoals.map((goal) =>
              Number(goal.id) === Number(editingId)
                ? { ...goal, ...editForm }
                : goal
            )
          );
        }

        setEditingId(null);
        setEditForm({});
      } catch (error) {
        console.error("목표 저장 실패:", error);
        alert("목표 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      console.log("조건 불만족:", { editingId, editForm });
    }
  };

  const handleCancel = () => {
    // 임시 목표인 경우 목록에서 제거
    if (editingId && editingId < 0) {
      setGoals((prevGoals) =>
        prevGoals.filter((goal) => goal.id !== editingId)
      );
    }
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = async (goalId: number) => {
    if (confirm("삭제하시겠습니까?")) {
      try {
        // 백엔드 API 호출
        await goalAPI.deleteGoal(Number(goalId));

        // 성공 시 로컬 상태 업데이트
        setGoals((prevGoals) =>
          prevGoals.filter((goal) => Number(goal.id) !== Number(goalId))
        );
        // 만약 삭제 중인 목표가 편집 중이었다면 편집 모드 종료
        if (editingId && Number(editingId) === Number(goalId)) {
          setEditingId(null);
          setEditForm({});
        }
      } catch (error) {
        console.error("목표 삭제 실패:", error);
        alert("목표 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleAdd = () => {
    // 내일 날짜를 ISO 문자열로 생성
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString();

    // 임시 ID 생성 (음수로 하여 실제 ID와 구분)
    const tempId = -Date.now();

    // 임시 목표 객체 생성
    const tempGoal: Goal = {
      id: tempId,
      memberId: 0, // 임시값
      description: "새 목표",
      currentAmount: 0,
      targetAmount: 0,
      deadline: tomorrowISO,
      status: "NOT_STARTED",
    };

    // 목표 목록에 임시 목표 추가
    setGoals((prevGoals) => [...prevGoals, tempGoal]);

    // 편집 모드로 설정
    setEditingId(tempId);
    setEditForm({
      description: "새 목표",
      currentAmount: 0,
      targetAmount: 0,
      deadline: tomorrowISO,
      status: "NOT_STARTED",
    });
  };

  const handleInputChange = (field: keyof Goal, value: string | number) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pl-[240px] pt-[64px] grid grid-cols-[1fr_auto_auto_1fr] gap-x-4">
        <SideBar active="goals" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">목표 목록을 불러오는 중...</div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pl-[240px] pt-[64px] grid grid-cols-[1fr_auto_auto_1fr] gap-x-4">
        <SideBar active="goals" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
        >
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pl-[240px] pt-[64px] grid grid-cols-[1fr_auto_auto_1fr] gap-x-4">
      <SideBar active="goals" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
      >
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">자산 목표 관리</h1>
          <Button className="h-7 px-4" onClick={handleAdd}>
            + 목표 추가
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6">
          {goals.length === 0 && (
            <Card key="empty-state">
              <CardContent>등록된 목표가 없습니다.</CardContent>
            </Card>
          )}
          {goals.map((goal, index) => {
            const isEditing =
              editingId !== null && Number(editingId) === Number(goal.id);

            return (
              <Card
                key={goal.id || `goal-${index}`}
                className={`flex flex-col min-w-80 ${
                  isEditing ? "min-h-64" : "h-64"
                }`}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2 flex-shrink-0">
                  <div className="flex-1 min-w-0 mr-4">
                    {isEditing ? (
                      <Input
                        value={editForm.description || ""}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="text-lg font-semibold mb-2"
                      />
                    ) : (
                      <CardTitle className="truncate">
                        {goal.description}
                      </CardTitle>
                    )}
                    <div className="mt-2">
                      {isEditing ? (
                        <Select
                          value={editForm.status || ""}
                          onValueChange={(
                            value: "NOT_STARTED" | "IN_PROGRESS" | "ACHIEVED"
                          ) => handleInputChange("status", value)}
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
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusStyle(
                            goal.status
                          )}`}
                        >
                          {getStatusDisplay(goal.status)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          완료
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          취소
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(goal)}
                        >
                          편집
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(goal.id)}
                        >
                          삭제
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent
                  className={`space-y-2 ${
                    isEditing ? "flex-1" : "flex-1 flex flex-col justify-center"
                  }`}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">현재 금액</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editForm.currentAmount || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "currentAmount",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-32 text-right"
                      />
                    ) : (
                      <span className="font-semibold text-lg">
                        {(goal.currentAmount || 0).toLocaleString()}원
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">목표 금액</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editForm.targetAmount || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "targetAmount",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-32 text-right"
                      />
                    ) : (
                      <span className="font-semibold text-lg">
                        {(goal.targetAmount || 0).toLocaleString()}원
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">기한</span>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={
                          editForm.deadline ? formatDate(editForm.deadline) : ""
                        }
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          const isoString = date.toISOString();
                          handleInputChange("deadline", isoString);
                        }}
                        className="w-36"
                      />
                    ) : (
                      <span className="font-medium">
                        {formatDate(goal.deadline)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">달성률</span>
                    <span
                      className={
                        (goal.currentAmount || 0) >= (goal.targetAmount || 1)
                          ? "text-green-600 font-bold text-lg"
                          : "font-semibold text-lg"
                      }
                    >
                      {(
                        ((goal.currentAmount || 0) / (goal.targetAmount || 1)) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
