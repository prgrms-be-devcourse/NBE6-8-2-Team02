"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authAPI } from "@/lib/auth";
import SideBar from "@/app/components/SideBar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatPhoneNumberForDisplay } from "@/lib/utils";

interface UserInfo {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  birthDate?: string;
  createDate: string;
  modifyDate: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 편집용 상태
  const [editForm, setEditForm] = useState({
    name: "",
    phoneNumber: "",
    birthDate: "",
  });

  // 비밀번호 변경 상태
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const isAuth = authAPI.isAuthenticated();
    if (!isAuth) {
      router.push("/");
      return;
    }

    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);

      // auth.js와 동일한 방식으로 직접 fetch 사용
      const token = await authAPI.getValidAccessToken();
      if (!token) {
        throw new Error("유효한 토큰이 없습니다.");
      }

      const response = await fetch("http://localhost:8080/api/v1/members/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      console.log("사용자 데이터:", userData);

      if (!userData) {
        throw new Error("사용자 데이터가 없습니다.");
      }

      // 필수 필드 확인
      if (!userData.id || !userData.email) {
        console.error("사용자 데이터 구조:", userData);
        throw new Error("필수 사용자 정보가 누락되었습니다.");
      }

      setUserInfo(userData);
      setEditForm({
        name: userData.name || "",
        phoneNumber: userData.phoneNumber || "",
        birthDate: userData.birthDate || "",
      });
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      setError("사용자 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 원래 데이터로 복원
    if (userInfo) {
      setEditForm({
        name: userInfo.name || "",
        phoneNumber: userInfo.phoneNumber || "",
        birthDate: userInfo.birthDate || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!userInfo) return;

      const updateData = {
        name: editForm.name,
        phoneNumber: editForm.phoneNumber
          ? editForm.phoneNumber.replace(/[^0-9]/g, "")
          : "",
        birthDate: editForm.birthDate,
      };

      const token = await authAPI.getValidAccessToken();
      if (!token) {
        throw new Error("유효한 토큰이 없습니다.");
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/members/${userInfo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 업데이트된 정보로 상태 갱신
      setUserInfo((prev) => (prev ? { ...prev, ...updateData } : null));
      setIsEditing(false);
      alert("정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("정보 수정 실패:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert("새 비밀번호가 일치하지 않습니다.");
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        alert("새 비밀번호는 6자 이상이어야 합니다.");
        return;
      }

      if (!userInfo) return;

      await authAPI.changePassword(userInfo.id, passwordForm.newPassword);

      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pl-[240px] pt-[64px] flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pl-[240px] pt-[64px] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pl-[240px] pt-[64px]">
      <SideBar active="mypage" />
      <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen p-6 max-w-6xl mx-auto space-y-6"
      >
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">내 정보</h1>
          {!isEditing && (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              정보 수정
            </Button>
          )}
        </header>

        {userInfo && (
          <div className="grid gap-6">
            {/* 기본 정보 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  기본 정보
                </CardTitle>
                <CardDescription>
                  회원가입 시 입력한 기본 정보입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      이메일
                    </Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {userInfo.email}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      이름
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="이름을 입력하세요"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        {userInfo.name || "-"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      전화번호
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editForm.phoneNumber}
                        onChange={(e) => {
                          // 숫자만 입력 허용
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          setEditForm((prev) => ({
                            ...prev,
                            phoneNumber: value,
                          }));
                        }}
                        placeholder="전화번호를 입력하세요 (01012345678)"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        {userInfo.phoneNumber
                          ? formatPhoneNumberForDisplay(userInfo.phoneNumber)
                          : "-"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      생년월일
                    </Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editForm.birthDate}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            birthDate: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">
                        {formatDate(userInfo.birthDate || "")}
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSave}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      저장
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      취소
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 계정 정보 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  계정 정보
                </CardTitle>
                <CardDescription>계정 보안 관련 정보입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>가입일</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {formatDate(userInfo.createDate)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>최근 수정일</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {formatDate(userInfo.modifyDate)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <Button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    비밀번호 변경
                  </Button>
                  <Button
                    onClick={() => router.push("/mypage/withdraw")}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    회원 탈퇴
                  </Button>
                </div>

                {isChangingPassword && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-medium">비밀번호 변경</h4>

                    <div className="space-y-2">
                      <Label>현재 비밀번호</Label>
                      <div className="relative">
                        <Input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          placeholder="현재 비밀번호를 입력하세요"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              current: !prev.current,
                            }))
                          }
                        >
                          {showPasswords.current ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>새 비밀번호</Label>
                      <div className="relative">
                        <Input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="새 비밀번호를 입력하세요 (6자 이상)"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              new: !prev.new,
                            }))
                          }
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>새 비밀번호 확인</Label>
                      <div className="relative">
                        <Input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          placeholder="새 비밀번호를 다시 입력하세요"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handlePasswordChange}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        비밀번호 변경
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordForm({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        취소
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      </motion.div>
    </div>
  );
}
