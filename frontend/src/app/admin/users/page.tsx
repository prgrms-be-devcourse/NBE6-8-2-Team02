"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { AdminApiService, AdminMemberDto } from "@/lib/backend/adminApi";

export default function UsersPage() {
    const [members, setMembers] = useState<AdminMemberDto[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<AdminMemberDto[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMembers();
    }, []);

    useEffect(() => {
        filterMembers();
    }, [members, searchQuery, statusFilter]);

    const loadMembers = async () => {
        try {
            setLoading(true);
            const membersData = await AdminApiService.getAllMembers();
            setMembers(membersData);
        } catch (error) {
            setError("회원 목록을 불러오는 중 오류가 발생했습니다.");
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
                await loadMembers();
            } else {
                setError("상태 변경에 실패했습니다.");
            }
        } catch (error) {
            setError("상태 변경 중 오류가 발생했습니다.");
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            await loadMembers();
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
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">사용자 관리</h1>
                <Button onClick={loadMembers} variant="outline">
                    새로고침
                </Button>
            </div>

            {/* 검색 및 필터 */}
            <Card>
                <CardHeader>
                    <CardTitle>검색 및 필터</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
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
                </CardContent>
            </Card>

            {/* 회원 목록 */}
            <Card>
                <CardHeader>
                    <CardTitle>회원 목록 ({filteredMembers.length}명)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredMembers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                회원이 없습니다.
                            </div>
                        ) : (
                            filteredMembers.map((member) => (
                                <Card key={member.id} className="border-l-4 border-l-blue-500">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="font-medium text-lg">{member.maskedName}</div>
                                                <div className="text-sm text-gray-600">{member.maskedEmail}</div>
                                                <div className="text-sm text-gray-600">{member.maskedPhone}</div>
                                                <div className="text-xs text-gray-400">
                                                    가입일: {new Date(member.createdAt).toLocaleDateString()}
                                                    {member.updatedAt !== member.createdAt && (
                                                        <span className="ml-2">
                                                            | 수정일: {new Date(member.updatedAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${member.status === "ACTIVE"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {member.status === "ACTIVE" ? "활성" : "비활성"}
                                                </span>
                                                <Button
                                                    variant={member.status === "ACTIVE" ? "destructive" : "default"}
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