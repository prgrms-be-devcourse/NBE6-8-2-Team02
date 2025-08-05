'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
    Settings,
    Bell,
    Shield,
    Database,
    Globe,
    Mail,
    Save,
    RefreshCw
} from "lucide-react";

export function AdminSettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        siteName: "자산관리 서비스",
        siteDescription: "효율적이고 편리한 자산관리 서비스",
        contactEmail: "admin@example.com",
        maxFileSize: 10,
        sessionTimeout: 30,
        enableNotifications: true,
        enableEmailAlerts: true,
        enableMaintenance: false,
        enableDebugMode: false
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // 관리자 권한 확인
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'ADMIN') {
            alert('관리자 권한이 필요합니다.');
            router.push('/auth/login');
            return;
        }

        loadSettings();
    }, [router]);

    const loadSettings = async () => {
        // 실제로는 API에서 설정을 가져와야 함
        setIsLoading(false);
    };

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = async () => {
        setIsLoading(true);
        try {
            // 실제로는 API 호출
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('설정이 저장되었습니다.');
        } catch (error) {
            alert('설정 저장에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSettings = () => {
        if (confirm('설정을 기본값으로 초기화하시겠습니까?')) {
            setSettings({
                siteName: "자산관리 서비스",
                siteDescription: "효율적이고 편리한 자산관리 서비스",
                contactEmail: "admin@example.com",
                maxFileSize: 10,
                sessionTimeout: 30,
                enableNotifications: true,
                enableEmailAlerts: true,
                enableMaintenance: false,
                enableDebugMode: false
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">시스템 설정</h1>
                    <p className="text-gray-600">서비스 설정 및 관리</p>
                </motion.div>

                {/* 기본 설정 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-600" />
                            기본 설정
                        </CardTitle>
                        <CardDescription>서비스의 기본 정보를 설정합니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    사이트 이름
                                </label>
                                <Input
                                    value={settings.siteName}
                                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                                    placeholder="사이트 이름을 입력하세요"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    연락처 이메일
                                </label>
                                <Input
                                    value={settings.contactEmail}
                                    onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                                    placeholder="admin@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                사이트 설명
                            </label>
                            <Input
                                value={settings.siteDescription}
                                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                                placeholder="사이트에 대한 설명을 입력하세요"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 시스템 설정 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-green-600" />
                            시스템 설정
                        </CardTitle>
                        <CardDescription>시스템 성능 및 보안 관련 설정</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    최대 파일 크기 (MB)
                                </label>
                                <Input
                                    type="number"
                                    value={settings.maxFileSize}
                                    onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                                    min="1"
                                    max="100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    세션 타임아웃 (분)
                                </label>
                                <Input
                                    type="number"
                                    value={settings.sessionTimeout}
                                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                                    min="5"
                                    max="120"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 알림 설정 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-600" />
                            알림 설정
                        </CardTitle>
                        <CardDescription>사용자 알림 및 이메일 설정</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">푸시 알림 활성화</label>
                                    <p className="text-xs text-gray-500">사용자에게 푸시 알림을 보냅니다</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.enableNotifications}
                                    onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">이메일 알림 활성화</label>
                                    <p className="text-xs text-gray-500">중요한 이벤트에 대해 이메일을 보냅니다</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.enableEmailAlerts}
                                    onChange={(e) => handleSettingChange('enableEmailAlerts', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 유지보수 설정 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-600" />
                            유지보수 설정
                        </CardTitle>
                        <CardDescription>시스템 유지보수 및 디버그 모드 설정</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">유지보수 모드</label>
                                    <p className="text-xs text-gray-500">시스템 유지보수 중 사용자 접근을 제한합니다</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.enableMaintenance}
                                    onChange={(e) => handleSettingChange('enableMaintenance', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">디버그 모드</label>
                                    <p className="text-xs text-gray-500">개발자용 디버그 정보를 활성화합니다</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.enableDebugMode}
                                    onChange={(e) => handleSettingChange('enableDebugMode', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 작업 버튼 */}
                <div className="flex justify-end space-x-4">
                    <Button
                        variant="outline"
                        onClick={handleResetSettings}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        초기화
                    </Button>
                    <Button
                        onClick={handleSaveSettings}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isLoading ? "저장 중..." : "설정 저장"}
                    </Button>
                </div>
            </div>
        </div>
    );
} 