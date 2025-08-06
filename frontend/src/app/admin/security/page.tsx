"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface SecurityLog {
    id: string;
    timestamp: string;
    event: string;
    user: string;
    ip: string;
    status: "SUCCESS" | "FAILED" | "WARNING";
}

export default function SecurityPage() {
    const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<SecurityLog[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 샘플 보안 로그 데이터
    const sampleLogs: SecurityLog[] = [
        {
            id: "1",
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            event: "로그인 시도",
            user: "admin@example.com",
            ip: "192.168.1.100",
            status: "SUCCESS"
        },
        {
            id: "2",
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            event: "로그인 시도",
            user: "unknown@example.com",
            ip: "192.168.1.101",
            status: "FAILED"
        },
        {
            id: "3",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            event: "권한 변경",
            user: "admin@example.com",
            ip: "192.168.1.100",
            status: "SUCCESS"
        },
        {
            id: "4",
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            event: "비정상 접근 시도",
            user: "unknown",
            ip: "192.168.1.102",
            status: "WARNING"
        }
    ];

    useEffect(() => {
        loadSecurityLogs();
    }, []);

    useEffect(() => {
        filterLogs();
    }, [securityLogs, statusFilter]);

    const loadSecurityLogs = async () => {
        try {
            setLoading(true);
            // 실제로는 API에서 보안 로그를 가져옴
            await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션
            setSecurityLogs(sampleLogs);
        } catch (error) {
            setError("보안 로그를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const filterLogs = () => {
        let filtered = securityLogs;

        if (statusFilter !== "ALL") {
            filtered = filtered.filter(log => log.status === statusFilter);
        }

        setFilteredLogs(filtered);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SUCCESS":
                return "text-green-600 bg-green-100";
            case "FAILED":
                return "text-red-600 bg-red-100";
            case "WARNING":
                return "text-yellow-600 bg-yellow-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "SUCCESS":
                return "성공";
            case "FAILED":
                return "실패";
            case "WARNING":
                return "경고";
            default:
                return "알 수 없음";
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
                <h1 className="text-3xl font-bold">보안 모니터링</h1>
                <Button onClick={loadSecurityLogs} variant="outline">
                    새로고침
                </Button>
            </div>

            {/* 보안 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">전체 이벤트</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{securityLogs.length}</div>
                        <p className="text-xs text-muted-foreground">
                            최근 24시간
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">성공</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {securityLogs.filter(log => log.status === "SUCCESS").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            정상 처리된 이벤트
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">실패</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {securityLogs.filter(log => log.status === "FAILED").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            실패한 이벤트
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">경고</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {securityLogs.filter(log => log.status === "WARNING").length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            주의가 필요한 이벤트
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 보안 로그 */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>보안 로그</CardTitle>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="상태" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">전체</SelectItem>
                                    <SelectItem value="SUCCESS">성공</SelectItem>
                                    <SelectItem value="FAILED">실패</SelectItem>
                                    <SelectItem value="WARNING">경고</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredLogs.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                보안 로그가 없습니다.
                            </div>
                        ) : (
                            filteredLogs.map((log) => (
                                <Card key={log.id} className="border-l-4 border-l-blue-500">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="font-medium">{log.event}</div>
                                                <div className="text-sm text-gray-600">
                                                    사용자: {log.user} | IP: {log.ip}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}
                                                >
                                                    {getStatusText(log.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 보안 권장사항 */}
            <Card>
                <CardHeader>
                    <CardTitle>보안 권장사항</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">🔒 보안 강화</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• 정기적인 비밀번호 변경을 권장합니다.</li>
                                <li>• 2단계 인증을 활성화하세요.</li>
                                <li>• 의심스러운 로그인 시도를 모니터링하세요.</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-medium text-yellow-800 mb-2">⚠️ 주의사항</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• 실패한 로그인 시도가 많으면 IP 차단을 고려하세요.</li>
                                <li>• 정기적으로 보안 로그를 검토하세요.</li>
                                <li>• 시스템 업데이트를 최신 상태로 유지하세요.</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 