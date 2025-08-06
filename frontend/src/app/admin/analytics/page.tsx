"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { AdminApiService } from "@/lib/backend/adminApi";

interface AnalyticsData {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    activeRate: number;
    inactiveRate: number;
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
        activeRate: 0,
        inactiveRate: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const stats = await AdminApiService.getDashboardStats();

            const activeRate = stats.totalMembers > 0 ? (stats.activeMembers / stats.totalMembers) * 100 : 0;
            const inactiveRate = stats.totalMembers > 0 ? (stats.inactiveMembers / stats.totalMembers) * 100 : 0;

            setAnalytics({
                ...stats,
                activeRate: Math.round(activeRate * 100) / 100,
                inactiveRate: Math.round(inactiveRate * 100) / 100,
            });
        } catch (error) {
            setError("분석 데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">분석 대시보드</h1>
                <button
                    onClick={loadAnalytics}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    새로고침
                </button>
            </div>

            {/* 주요 지표 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">전체 회원</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalMembers}</div>
                        <p className="text-xs text-muted-foreground">
                            전체 등록된 회원 수
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">활성 회원</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{analytics.activeMembers}</div>
                        <p className="text-xs text-muted-foreground">
                            활성 회원 비율: {analytics.activeRate}%
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">비활성 회원</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{analytics.inactiveMembers}</div>
                        <p className="text-xs text-muted-foreground">
                            비활성 회원 비율: {analytics.inactiveRate}%
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">활성화율</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{analytics.activeRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            전체 대비 활성 회원 비율
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 상세 분석 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>회원 상태 분포</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">활성 회원</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${analytics.activeRate}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600">{analytics.activeMembers}명</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">비활성 회원</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: `${analytics.inactiveRate}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600">{analytics.inactiveMembers}명</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>요약 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">전체 회원 수</span>
                                <span className="font-medium">{analytics.totalMembers}명</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">활성 회원 수</span>
                                <span className="font-medium text-green-600">{analytics.activeMembers}명</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">비활성 회원 수</span>
                                <span className="font-medium text-red-600">{analytics.inactiveMembers}명</span>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">활성화율</span>
                                <span className="font-medium text-blue-600">{analytics.activeRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">비활성화율</span>
                                <span className="font-medium text-orange-600">{analytics.inactiveRate}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 권장사항 */}
            <Card>
                <CardHeader>
                    <CardTitle>관리 권장사항</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.inactiveRate > 50 && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 className="font-medium text-yellow-800 mb-2">⚠️ 주의 필요</h4>
                                <p className="text-sm text-yellow-700">
                                    비활성 회원 비율이 50%를 초과합니다. 회원 활성화 전략을 검토해보세요.
                                </p>
                            </div>
                        )}

                        {analytics.activeRate > 80 && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="font-medium text-green-800 mb-2">✅ 양호한 상태</h4>
                                <p className="text-sm text-green-700">
                                    활성 회원 비율이 80% 이상으로 양호한 상태입니다.
                                </p>
                            </div>
                        )}

                        {analytics.totalMembers === 0 && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-2">📊 데이터 없음</h4>
                                <p className="text-sm text-blue-700">
                                    아직 등록된 회원이 없습니다. 첫 번째 회원이 가입하면 분석 데이터가 표시됩니다.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 