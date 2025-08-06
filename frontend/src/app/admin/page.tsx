"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { AdminApiService, AdminMemberDto } from "@/lib/backend/adminApi";
import { authAPI } from "@/lib/auth";
import { Megaphone } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardStats {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
}

export default function AdminPage() {
    const router = useRouter();
    const [members, setMembers] = useState<AdminMemberDto[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<AdminMemberDto[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAdminAuth();
        loadData();
    }, []);

    useEffect(() => {
        filterMembers();
    }, [members, searchQuery, statusFilter]);

    const checkAdminAuth = async () => {
        try {
            const authStatus = authAPI.checkAuthStatus();
            if (!authStatus.isAuthenticated) {
                setError("로그인이 필요합니다.");
                return;
            }

            if (authStatus.userRole !== "ADMIN") {
                setError("관리자 권한이 필요합니다.");
                return;
            }
        } catch (error) {
            setError("인증 확인 중 오류가 발생했습니다.");
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null); // 이전 에러 초기화

            const [membersData, statsData] = await Promise.all([
                AdminApiService.getAllMembers(),
                AdminApiService.getDashboardStats(),
            ]);

            setMembers(membersData);
            setStats(statsData);
        } catch (error: any) {
            console.error("관리자 데이터 로드 실패:", error);

            // 403 에러인 경우 권한 문제로 처리
            if (error.message && error.message.includes("403")) {
                setError("관리자 권한이 없습니다. 관리자 계정으로 로그인해주세요.");
            } else {
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const filterMembers = () => {
        let filtered = members;

        // 검색 필터
        if (searchQuery) {
            filtered = filtered.filter(
                (member) =>
                    member.maskedEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.maskedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.maskedPhone.includes(searchQuery)
            );
        }

        // 상태 필터
        if (statusFilter !== "ALL") {
            filtered = filtered.filter((member) => member.status === statusFilter);
        }

        setFilteredMembers(filtered);
    };

    const handleStatusChange = async (memberId: number, newStatus: "ACTIVE" | "INACTIVE") => {
        try {
            let success = false;
            if (newStatus === "ACTIVE") {
                success = await AdminApiService.activateMember(memberId);
            } else {
                success = await AdminApiService.deactivateMember(memberId);
            }

            if (success) {
                // 성공 시 목록 새로고침
                await loadData();
            } else {
                setError("상태 변경에 실패했습니다.");
            }
        } catch (error) {
            setError("상태 변경 중 오류가 발생했습니다.");
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            await loadData();
            return;
        }

        try {
            const searchResults = await AdminApiService.searchMember(searchQuery);
            setMembers(searchResults);
        } catch (error) {
            setError("검색 중 오류가 발생했습니다.");
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
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <div className="text-red-500 text-lg text-center">{error}</div>
                <button
                    onClick={() => window.location.href = "/"}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                >
                    메인 페이지로 이동
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">관리자 대시보드</h1>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => router.push("/mypage/notices")} 
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <Megaphone className="w-4 h-4" />
                        공지사항
                    </Button>
                    <Button onClick={loadData} variant="outline">
                        새로고침
                    </Button>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">전체 회원</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalMembers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">활성 회원</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.activeMembers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">비활성 회원</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.inactiveMembers}</div>
                    </CardContent>
                </Card>
            </div>

            {/* 검색 및 필터 */}
            <Card>
                <CardHeader>
                    <CardTitle>회원 관리</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Label htmlFor="search">검색</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="search"
                                    placeholder="이메일, 이름, 전화번호로 검색"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                />
                                <Button onClick={handleSearch}>검색</Button>
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <Label htmlFor="status">상태 필터</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="상태 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">전체</SelectItem>
                                    <SelectItem value="ACTIVE">활성</SelectItem>
                                    <SelectItem value="INACTIVE">비활성</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 회원 목록 */}
                    <div className="space-y-4">
                        {filteredMembers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                회원이 없습니다.
                            </div>
                        ) : (
                            filteredMembers.map((member) => (
                                <Card key={member.id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="font-medium">{member.maskedName}</div>
                                                <div className="text-sm text-gray-500">{member.maskedEmail}</div>
                                                <div className="text-sm text-gray-500">{member.maskedPhone}</div>
                                                <div className="text-xs text-gray-400">
                                                    가입일: {new Date(member.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === "ACTIVE"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {member.status === "ACTIVE" ? "활성" : "비활성"}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            member.id,
                                                            member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                                                        )
                                                    }
                                                >
                                                    {member.status === "ACTIVE" ? "비활성화" : "활성화"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 