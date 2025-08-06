"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";


export default function SettingsPage() {
    const [settings, setSettings] = useState({
        siteName: "관리자 대시보드",
        maintenanceMode: false,
        emailNotifications: true,
        autoBackup: true,
        backupFrequency: "daily",
        maxLoginAttempts: 5,
        sessionTimeout: 30,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSettingChange = (key: string, value: string | number | boolean) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        setMessage(null);

        try {
            // 실제로는 API 호출을 통해 설정을 저장
            await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션

            setMessage({
                type: "success",
                text: "설정이 성공적으로 저장되었습니다."
            });
        } catch (error) {
            setMessage({
                type: "error",
                text: "설정 저장 중 오류가 발생했습니다."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetSettings = () => {
        setSettings({
            siteName: "관리자 대시보드",
            maintenanceMode: false,
            emailNotifications: true,
            autoBackup: true,
            backupFrequency: "daily",
            maxLoginAttempts: 5,
            sessionTimeout: 30,
        });
        setMessage({
            type: "success",
            text: "설정이 기본값으로 초기화되었습니다."
        });
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">시스템 설정</h1>
                <div className="flex gap-2">
                    <Button onClick={handleResetSettings} variant="outline">
                        기본값으로 초기화
                    </Button>
                    <Button onClick={handleSaveSettings} disabled={loading}>
                        {loading ? "저장 중..." : "설정 저장"}
                    </Button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 기본 설정 */}
                <Card>
                    <CardHeader>
                        <CardTitle>기본 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="siteName">사이트 이름</Label>
                            <Input
                                id="siteName"
                                value={settings.siteName}
                                onChange={(e) => handleSettingChange("siteName", e.target.value)}
                                placeholder="사이트 이름을 입력하세요"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="maintenanceMode">유지보수 모드</Label>
                                <p className="text-sm text-gray-500">
                                    유지보수 모드 활성화 시 일반 사용자의 접근이 제한됩니다.
                                </p>
                            </div>
                            <input
                                id="maintenanceMode"
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => handleSettingChange("maintenanceMode", e.target.checked)}
                                className="h-4 w-4"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="emailNotifications">이메일 알림</Label>
                                <p className="text-sm text-gray-500">
                                    관리자에게 이메일 알림을 보냅니다.
                                </p>
                            </div>
                            <input
                                id="emailNotifications"
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                                className="h-4 w-4"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 보안 설정 */}
                <Card>
                    <CardHeader>
                        <CardTitle>보안 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="maxLoginAttempts">최대 로그인 시도 횟수</Label>
                            <Input
                                id="maxLoginAttempts"
                                type="number"
                                min="1"
                                max="10"
                                value={settings.maxLoginAttempts}
                                onChange={(e) => handleSettingChange("maxLoginAttempts", parseInt(e.target.value))}
                            />
                            <p className="text-sm text-gray-500">
                                지정된 횟수 초과 시 계정이 잠깁니다.
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="sessionTimeout">세션 타임아웃 (분)</Label>
                            <Input
                                id="sessionTimeout"
                                type="number"
                                min="5"
                                max="480"
                                value={settings.sessionTimeout}
                                onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                            />
                            <p className="text-sm text-gray-500">
                                사용자가 비활성 상태일 때 자동 로그아웃되는 시간입니다.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* 백업 설정 */}
                <Card>
                    <CardHeader>
                        <CardTitle>백업 설정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="autoBackup">자동 백업</Label>
                                <p className="text-sm text-gray-500">
                                    정기적으로 시스템 데이터를 자동으로 백업합니다.
                                </p>
                            </div>
                            <input
                                id="autoBackup"
                                type="checkbox"
                                checked={settings.autoBackup}
                                onChange={(e) => handleSettingChange("autoBackup", e.target.checked)}
                                className="h-4 w-4"
                            />
                        </div>

                        <div>
                            <Label htmlFor="backupFrequency">백업 빈도</Label>
                            <Select
                                value={settings.backupFrequency}
                                onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="백업 빈도를 선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hourly">매시간</SelectItem>
                                    <SelectItem value="daily">매일</SelectItem>
                                    <SelectItem value="weekly">매주</SelectItem>
                                    <SelectItem value="monthly">매월</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* 시스템 정보 */}
                <Card>
                    <CardHeader>
                        <CardTitle>시스템 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">버전</span>
                                <span className="text-sm font-medium">1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">최종 업데이트</span>
                                <span className="text-sm font-medium">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">데이터베이스 상태</span>
                                <span className="text-sm font-medium text-green-600">정상</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">서버 상태</span>
                                <span className="text-sm font-medium text-green-600">정상</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <Button variant="outline" className="w-full">
                                시스템 상태 확인
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 위험 구역 */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-600">위험 구역</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">⚠️ 주의</h4>
                        <p className="text-sm text-red-700 mb-4">
                            아래 작업들은 되돌릴 수 없으며 시스템에 심각한 영향을 줄 수 있습니다.
                        </p>

                        <div className="space-y-2">
                            <Button variant="destructive" size="sm">
                                모든 데이터 삭제
                            </Button>
                            <Button variant="destructive" size="sm">
                                시스템 초기화
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 