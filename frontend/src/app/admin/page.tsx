'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { authAPI } from "@/lib/auth";
import {
    Users,
    BarChart3,
    Settings,
    Shield,
    Activity,
    AlertTriangle,
    UserCheck,
    UserX,
    TrendingUp,
    Database
} from "lucide-react";

export default function AdminPage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalAssets: 0,
        totalValue: 0,
        recentLogins: 0,
        pendingIssues: 0
    });

    useEffect(() => {
        const checkAdminAuth = () => {
            const authStatus = authAPI.checkAuthStatus();

            console.log('Admin auth check:', authStatus);

            if (!authStatus.isAuthenticated) {
                router.replace('/auth/login');
                return;
            }

            if (authStatus.userRole !== 'ADMIN') {
                router.replace('/mypage');
                return;
            }

            // 통계 데이터 로드 (실제로는 API 호출)
            loadStats();
        };

        checkAdminAuth();
    }, []);

    const loadStats = async () => {
        // 실제로는 API에서 데이터를 가져와야 함
        setStats({
            totalUsers: 1250,
            activeUsers: 890,
            totalAssets: 3450,
            totalValue: 125000000,
            recentLogins: 45,
            pendingIssues: 3
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    };

    const adminMenuItems = [
        {
            title: "사용자 관리",
            description: "전체 사용자 목록 및 관리",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            onClick: () => router.push("/admin/users")
        },
        {
            title: "통계 및 분석",
            description: "서비스 사용 통계 및 분석",
            icon: BarChart3,
            color: "text-green-600",
            bgColor: "bg-green-50",
            onClick: () => router.push("/admin/analytics")
        },
        {
            title: "시스템 설정",
            description: "서비스 설정 및 관리",
            icon: Settings,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            onClick: () => router.push("/admin/settings")
        },
        {
            title: "보안 관리",
            description: "보안 설정 및 모니터링",
            icon: Shield,
            color: "text-red-600",
            bgColor: "bg-red-50",
            onClick: () => router.push("/admin/security")
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
                    <p className="text-gray-600">서비스 관리 및 모니터링</p>
                </motion.div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                활성 사용자: {stats.activeUsers.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">총 자산</CardTitle>
                            <Database className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalAssets.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                총 가치: {formatCurrency(stats.totalValue)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">최근 로그인</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.recentLogins}</div>
                            <p className="text-xs text-muted-foreground">
                                오늘 로그인한 사용자
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">대기 중인 이슈</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingIssues}</div>
                            <p className="text-xs text-muted-foreground">
                                해결이 필요한 문제
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                이번 달 활성 사용자
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">성장률</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">+12.5%</div>
                            <p className="text-xs text-muted-foreground">
                                지난 달 대비 사용자 증가
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 관리 메뉴 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {adminMenuItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                                onClick={item.onClick}
                            >
                                <CardHeader className="pb-3">
                                    <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                                        <item.icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <CardTitle className="text-lg">{item.title}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* 최근 활동 */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>최근 활동</CardTitle>
                            <CardDescription>시스템에서 발생한 최근 활동들</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">새 사용자 가입</p>
                                        <p className="text-xs text-gray-500">user@example.com이 가입했습니다.</p>
                                    </div>
                                    <span className="text-xs text-gray-400">2분 전</span>
                                </div>
                                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">자산 등록</p>
                                        <p className="text-xs text-gray-500">새로운 자산이 등록되었습니다.</p>
                                    </div>
                                    <span className="text-xs text-gray-400">5분 전</span>
                                </div>
                                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">시스템 알림</p>
                                        <p className="text-xs text-gray-500">서버 성능이 정상 범위를 유지하고 있습니다.</p>
                                    </div>
                                    <span className="text-xs text-gray-400">10분 전</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 