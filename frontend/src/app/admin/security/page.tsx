'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
    Shield,
    AlertTriangle,
    Lock,
    Eye,
    Activity,
    Clock,
    MapPin,
    User,
    CheckCircle,
    XCircle
} from "lucide-react";

interface SecurityLog {
    id: string;
    userId: string;
    userEmail: string;
    action: string;
    ipAddress: string;
    location: string;
    timestamp: string;
    status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
    userAgent: string;
}

export function AdminSecurityPage() {
    const router = useRouter();
    const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
    const [securityStats, setSecurityStats] = useState({
        totalLogins: 0,
        failedLogins: 0,
        blockedAttempts: 0,
        suspiciousActivities: 0
    });

    useEffect(() => {
        // 관리자 권한 확인
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'ADMIN') {
            alert('관리자 권한이 필요합니다.');
            router.push('/auth/login');
            return;
        }

        loadSecurityData();
    }, [router]);

    const loadSecurityData = async () => {
        // 실제로는 API에서 데이터를 가져와야 함
        const mockLogs: SecurityLog[] = [
            {
                id: "1",
                userId: "user1",
                userEmail: "user1@example.com",
                action: "로그인",
                ipAddress: "192.168.1.100",
                location: "서울, 대한민국",
                timestamp: "2024-01-20T10:30:00Z",
                status: "SUCCESS",
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            {
                id: "2",
                userId: "user2",
                userEmail: "user2@example.com",
                action: "로그인",
                ipAddress: "203.241.50.200",
                location: "부산, 대한민국",
                timestamp: "2024-01-20T09:15:00Z",
                status: "SUCCESS",
                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
            },
            {
                id: "3",
                userId: "unknown",
                userEmail: "hacker@example.com",
                action: "로그인 시도",
                ipAddress: "45.67.89.123",
                location: "해외",
                timestamp: "2024-01-20T08:45:00Z",
                status: "BLOCKED",
                userAgent: "Unknown User Agent"
            },
            {
                id: "4",
                userId: "user3",
                userEmail: "user3@example.com",
                action: "비밀번호 변경",
                ipAddress: "192.168.1.150",
                location: "서울, 대한민국",
                timestamp: "2024-01-20T07:20:00Z",
                status: "SUCCESS",
                userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15"
            }
        ];

        setSecurityLogs(mockLogs);
        setSecurityStats({
            totalLogins: 156,
            failedLogins: 12,
            blockedAttempts: 3,
            suspiciousActivities: 1
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUCCESS': return 'text-green-600 bg-green-100';
            case 'FAILED': return 'text-red-600 bg-red-100';
            case 'BLOCKED': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'FAILED': return <XCircle className="w-4 h-4 text-red-600" />;
            case 'BLOCKED': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
            default: return <Activity className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">보안 관리</h1>
                    <p className="text-gray-600">보안 설정 및 모니터링</p>
                </motion.div>

                {/* 보안 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">총 로그인</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{securityStats.totalLogins}</div>
                            <p className="text-xs text-muted-foreground">
                                오늘 로그인 시도
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">실패한 로그인</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{securityStats.failedLogins}</div>
                            <p className="text-xs text-muted-foreground">
                                비밀번호 오류 등
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">차단된 시도</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{securityStats.blockedAttempts}</div>
                            <p className="text-xs text-muted-foreground">
                                의심스러운 활동
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">의심스러운 활동</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{securityStats.suspiciousActivities}</div>
                            <p className="text-xs text-muted-foreground">
                                추가 조사 필요
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 보안 설정 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="w-5 h-5 text-blue-600" />
                                보안 설정
                            </CardTitle>
                            <CardDescription>계정 보안 및 접근 제어 설정</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">2단계 인증</label>
                                        <p className="text-xs text-gray-500">모든 사용자에게 2단계 인증 적용</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">IP 화이트리스트</label>
                                        <p className="text-xs text-gray-500">특정 IP에서만 접근 허용</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">세션 타임아웃</label>
                                        <p className="text-xs text-gray-500">30분 후 자동 로그아웃</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">로그인 시도 제한</label>
                                        <p className="text-xs text-gray-500">5회 실패 시 계정 잠금</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5 text-green-600" />
                                모니터링 설정
                            </CardTitle>
                            <CardDescription>보안 이벤트 모니터링 및 알림</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">실시간 모니터링</label>
                                        <p className="text-xs text-gray-500">의심스러운 활동 실시간 감지</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">이메일 알림</label>
                                        <p className="text-xs text-gray-500">보안 이벤트 발생 시 이메일 발송</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">로그 보관</label>
                                        <p className="text-xs text-gray-500">보안 로그 90일 보관</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">자동 차단</label>
                                        <p className="text-xs text-gray-500">의심스러운 IP 자동 차단</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 보안 로그 */}
                <Card>
                    <CardHeader>
                        <CardTitle>보안 로그</CardTitle>
                        <CardDescription>최근 보안 이벤트 및 로그인 기록</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">사용자</th>
                                        <th className="text-left py-3 px-4">활동</th>
                                        <th className="text-left py-3 px-4">IP 주소</th>
                                        <th className="text-left py-3 px-4">위치</th>
                                        <th className="text-left py-3 px-4">시간</th>
                                        <th className="text-left py-3 px-4">상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {securityLogs.map((log) => (
                                        <tr key={log.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="font-medium">{log.userEmail}</div>
                                                    <div className="text-sm text-gray-500">ID: {log.userId}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm font-medium">{log.action}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-600">{log.ipAddress}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-gray-400" />
                                                    <span className="text-sm text-gray-600">{log.location}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(log.timestamp).toLocaleString('ko-KR')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(log.status)}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                                                        {log.status === 'SUCCESS' ? '성공' :
                                                            log.status === 'FAILED' ? '실패' : '차단'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 