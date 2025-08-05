'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
    BarChart3,
    TrendingUp,
    Users,
    Database,
    Activity,
    Calendar,
    DollarSign,
    PieChart
} from "lucide-react";

export function AdminAnalyticsPage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        totalUsers: 1250,
        activeUsers: 890,
        newUsersThisMonth: 45,
        totalAssets: 3450,
        totalValue: 125000000,
        averageAssetsPerUser: 2.76,
        growthRate: 12.5
    });

    useEffect(() => {
        // 관리자 권한 확인
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'ADMIN') {
            alert('관리자 권한이 필요합니다.');
            router.push('/auth/login');
            return;
        }
    }, [router]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount);
    };

    const monthlyData = [
        { month: '1월', users: 120, assets: 280, value: 85000000 },
        { month: '2월', users: 150, assets: 320, value: 92000000 },
        { month: '3월', users: 180, assets: 380, value: 98000000 },
        { month: '4월', users: 220, assets: 450, value: 105000000 },
        { month: '5월', users: 280, assets: 520, value: 115000000 },
        { month: '6월', users: 350, assets: 600, value: 125000000 },
    ];

    const assetTypes = [
        { type: '주식', count: 1200, percentage: 35 },
        { type: '부동산', count: 800, percentage: 23 },
        { type: '예금/적금', count: 600, percentage: 17 },
        { type: '펀드', count: 450, percentage: 13 },
        { type: '기타', count: 400, percentage: 12 },
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">통계 및 분석</h1>
                    <p className="text-gray-600">서비스 사용 통계 및 분석 데이터</p>
                </motion.div>

                {/* 주요 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                +{stats.newUsersThisMonth} 이번 달
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% 활성률
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
                                평균 {stats.averageAssetsPerUser}개/사용자
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">총 가치</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
                            <p className="text-xs text-muted-foreground">
                                +{stats.growthRate}% 성장률
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 차트 섹션 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* 월별 성장 차트 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>월별 성장 추이</CardTitle>
                            <CardDescription>사용자 및 자산 증가 추이</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={data.month} className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{data.month}</span>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{data.users}명</div>
                                                <div className="text-xs text-gray-500">사용자</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{data.assets}개</div>
                                                <div className="text-xs text-gray-500">자산</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{formatCurrency(data.value)}</div>
                                                <div className="text-xs text-gray-500">총 가치</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 자산 유형 분포 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>자산 유형 분포</CardTitle>
                            <CardDescription>등록된 자산의 유형별 분포</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {assetTypes.map((asset) => (
                                    <div key={asset.type} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-sm font-medium">{asset.type}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${asset.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{asset.count}개</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 상세 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                성장 지표
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">사용자 증가율</span>
                                    <span className="text-sm font-medium text-green-600">+{stats.growthRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">자산 증가율</span>
                                    <span className="text-sm font-medium text-green-600">+18.2%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">가치 증가율</span>
                                    <span className="text-sm font-medium text-green-600">+15.7%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                이번 달 현황
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">신규 가입</span>
                                    <span className="text-sm font-medium">{stats.newUsersThisMonth}명</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">신규 자산</span>
                                    <span className="text-sm font-medium">156개</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">평균 로그인</span>
                                    <span className="text-sm font-medium">3.2회/주</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-purple-600" />
                                사용자 활동
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm">활성 사용자</span>
                                    <span className="text-sm font-medium">{(stats.activeUsers / stats.totalUsers * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">자산 등록률</span>
                                    <span className="text-sm font-medium">78.5%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">목표 설정률</span>
                                    <span className="text-sm font-medium">45.2%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 