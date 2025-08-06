import { apiFetch } from "./client";

export interface AdminMemberDto {
  id: number;
  maskedEmail: string;
  maskedName: string;
  maskedPhone: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface MemberResponseDto {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class AdminApiService {
  // 모든 멤버 조회
  static async getAllMembers(): Promise<AdminMemberDto[]> {
    try {
      const response = await apiFetch("/api/v1/admin/members");
      return response.data || response || [];
    } catch (error) {
      console.error("모든 멤버 조회 실패:", error);
      // 에러를 다시 던져서 호출자가 처리할 수 있도록 함
      throw error;
    }
  }

  // 특정 멤버 조회
  static async getMember(memberId: number): Promise<AdminMemberDto | null> {
    try {
      const response = await apiFetch(`/api/v1/admin/members/${memberId}`);
      return response.data || response || null;
    } catch (error) {
      console.error(`멤버 ${memberId} 조회 실패:`, error);
      return null;
    }
  }

  // 멤버 활성화
  static async activateMember(memberId: number): Promise<boolean> {
    try {
      const response = await apiFetch(
        `/api/v1/admin/members/${memberId}/activate`,
        {
          method: "PATCH",
        }
      );
      return true;
    } catch (error) {
      console.error(`멤버 ${memberId} 활성화 실패:`, error);
      return false;
    }
  }

  // 멤버 비활성화
  static async deactivateMember(memberId: number): Promise<boolean> {
    try {
      const response = await apiFetch(
        `/api/v1/admin/members/${memberId}/deactivate`,
        {
          method: "PATCH",
        }
      );
      return true;
    } catch (error) {
      console.error(`멤버 ${memberId} 비활성화 실패:`, error);
      return false;
    }
  }

  // 활성 멤버만 조회
  static async getActiveMembers(): Promise<AdminMemberDto[]> {
    try {
      const response = await apiFetch("/api/v1/admin/members/active");
      return response.data || response || [];
    } catch (error) {
      console.error("활성 멤버 조회 실패:", error);
      return [];
    }
  }

  // 멤버 검색
  static async searchMember(query: string): Promise<AdminMemberDto[]> {
    try {
      const response = await apiFetch(
        `/api/v1/admin/members/search?q=${encodeURIComponent(query)}`
      );
      return response.data || response || [];
    } catch (error) {
      console.error("멤버 검색 실패:", error);
      return [];
    }
  }

  // 대시보드 통계
  static async getDashboardStats(): Promise<{
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
  }> {
    try {
      // 모든 멤버와 활성 멤버를 병렬로 조회
      const [allMembers, activeMembers] = await Promise.all([
        this.getAllMembers(),
        this.getActiveMembers(),
      ]);

      const totalMembers = allMembers.length;
      const activeMembersCount = activeMembers.length;
      const inactiveMembers = totalMembers - activeMembersCount;

      const stats = {
        totalMembers,
        activeMembers: activeMembersCount,
        inactiveMembers,
      };

      return stats;
    } catch (error) {
      console.error("대시보드 통계 계산 실패:", error);
      return {
        totalMembers: 0,
        activeMembers: 0,
        inactiveMembers: 0,
      };
    }
  }
}
