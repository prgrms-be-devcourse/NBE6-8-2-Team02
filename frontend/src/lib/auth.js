export const authAPI = {
  async login(credentials) {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  async signup(userData) {
    try {
      console.log("회원가입 요청 데이터:", userData);
      console.log(
        "회원가입 요청 URL:",
        "http://localhost:8080/api/v1/members/signup"
      );

      const response = await fetch(
        "http://localhost:8080/api/v1/members/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      console.log("회원가입 응답 상태:", response.status);
      console.log("회원가입 응답 헤더:", response.headers);

      const data = await response.json();
      console.log("회원가입 응답 데이터:", data);

      // 200 OK 또는 201 CREATED 모두 성공으로 처리
      if (!response.ok && response.status !== 201) {
        throw new Error(
          data.message || data.error || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("Signup API error:", error);
      throw error;
    }
  },

  // 인증 상태 확인
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("authToken");
    return !!token;
  },

  // 토큰 검증 (서버에 요청하여 유효성 확인)
  async validateToken() {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return false;
      }

      const response = await fetch("http://localhost:8080/api/v1/members/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      return response.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  // 비밀번호 변경
  async changePassword(memberId, newPassword) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8080/api/v1/members/${memberId}/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("비밀번호 변경 API 에러:", error);
      throw error;
    }
  },

  // 로그아웃
  async logout() {
    try {
      // TODO: 서버 로그아웃 API가 준비되면 활성화
      // const response = await fetch("http://localhost:8080/api/v1/auth/logout", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${localStorage.getItem('authToken')}`
      //   },
      //   credentials: "include",
      // });
      // if (response.ok) {
      //   console.log("서버 로그아웃 성공");
      // }
    } catch (error) {
      console.error("로그아웃 API 에러:", error);
    } finally {
      // 클라이언트 측 정리 (항상 실행)
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
      }
    }
  },
};
