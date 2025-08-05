'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
    Search,
    Filter,
    UserPlus,
    UserCheck,
    UserX,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal
} from "lucide-react";

interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    createdAt: string;
    lastLoginAt: string;
    totalAssets: number;
}

export function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 관리자 권한 확인
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'ADMIN') {
            alert('관리자 권한이 필요합니다.');
            router.push('/auth/login');
            return;
        }

        loadUsers();
    }, [router]);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, statusFilter, roleFilter]);

    const loadUsers = async () => {
        // 실제로는 API에서 데이터를 가져와야 함
        const mockUsers: User[] = [
            {
                id: "1",
                email: "user1@example.com",
                name: "김철수",
                role: "USER",
                status: "ACTIVE",
                createdAt: "2024-01-15",
                lastLoginAt: "2024-01-20",
                totalAssets: 5
            },
            {
                id: "2",
                email: "user2@example.com",
                name: "이영희",
                role: "USER",
                status: "ACTIVE",
                createdAt: "2024-01-10",
                lastLoginAt: "2024-01-19",
                totalAssets: 3
            },
            {
                id: "3",
                email: "admin@example.com",
                name: "관리자",
                role: "ADMIN",
                status: "ACTIVE",
                createdAt: "2024-01-01",
                lastLoginAt: "2024-01-20",
                totalAssets: 0
            },
            {
                id: "4",
                email: "user3@example.com",
                name: "박민수",
                role: "USER",
                status: "INACTIVE",
                createdAt: "2024-01-05",
                lastLoginAt: "2024-01-10",
                totalAssets: 1
            }
        ];

        setUsers(mockUsers);
        setIsLoading(false);
    };

    const filterUsers = () => {
        let filtered = users;

        // 검색 필터
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 상태 필터
        if (statusFilter !== "all") {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        // 역할 필터
        if (roleFilter !== "all") {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const handleStatusChange = async (userId: string, newStatus: string) => {
        // 실제로는 API 호출
        setUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, status: newStatus as User['status'] } : user
        ));
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        // 실제로는 API 호출
        setUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, role: newRole as User['role'] } : user
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'text-green-600 bg-green-100';
            case 'INACTIVE': return 'text-gray-600 bg-gray-100';
            case 'SUSPENDED': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'text-purple-600 bg-purple-100';
            case 'USER': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <div className="text-lg">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">사용자 관리</h1>
                    <p className="text-gray-600">전체 사용자 목록 및 관리</p>
                </motion.div>

                {/* 필터 및 검색 */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="사용자 검색..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">모든 상태</option>
                                    <option value="ACTIVE">활성</option>
                                    <option value="INACTIVE">비활성</option>
                                    <option value="SUSPENDED">정지</option>
                                </select>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">모든 역할</option>
                                    <option value="USER">사용자</option>
                                    <option value="ADMIN">관리자</option>
                                </select>
                                <Button className="flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    새 사용자
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                            <div className="text-sm text-gray-600">총 사용자</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {users.filter(u => u.status === 'ACTIVE').length}
                            </div>
                            <div className="text-sm text-gray-600">활성 사용자</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-purple-600">
                                {users.filter(u => u.role === 'ADMIN').length}
                            </div>
                            <div className="text-sm text-gray-600">관리자</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-orange-600">
                                {users.reduce((sum, user) => sum + user.totalAssets, 0)}
                            </div>
                            <div className="text-sm text-gray-600">총 자산 수</div>
                        </CardContent>
                    </Card>
                </div>

                {/* 사용자 목록 */}
                <Card>
                    <CardHeader>
                        <CardTitle>사용자 목록</CardTitle>
                        <CardDescription>
                            총 {filteredUsers.length}명의 사용자가 있습니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">사용자</th>
                                        <th className="text-left py-3 px-4">역할</th>
                                        <th className="text-left py-3 px-4">상태</th>
                                        <th className="text-left py-3 px-4">가입일</th>
                                        <th className="text-left py-3 px-4">마지막 로그인</th>
                                        <th className="text-left py-3 px-4">자산 수</th>
                                        <th className="text-left py-3 px-4">작업</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                    {user.role === 'ADMIN' ? '관리자' : '사용자'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                    {user.status === 'ACTIVE' ? '활성' :
                                                        user.status === 'INACTIVE' ? '비활성' : '정지'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(user.lastLoginAt).toLocaleDateString('ko-KR')}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm font-medium">{user.totalAssets}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
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