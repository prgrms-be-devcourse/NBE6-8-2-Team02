export const authAPI = {
  async login(credentials) {
    try {
      console.log("로그인 요청 데이터:", credentials);
      console.log("로그인 요청 데이터 (JSON):", JSON.stringify(credentials));

      const loginUrl = "http://localhost:8080/api/v1/auth/login";
      console.log("로그인 요청 URL:", loginUrl);

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      console.log("로그인 응답 상태:", response.status);
      const data = await response.json();
      console.log("로그인 응답 데이터:", data);
      console.log(
        "로그인 응답 헤더:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        console.error("로그인 실패 상세:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        throw new Error(
          data.msg ||
            data.message ||
            data.error ||
            data.detail ||
            `HTTP error! status: ${response.status}`
        );
      }

      // 토큰 쌍 저장
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        console.log("토큰 쌍 저장 완료");
      }

      return data;
    } catch (error) {
      console.error("Login API error:", error);
      throw error;
    }
  },

  // Refresh Token으로 새로운 Access Token 발급
  async refreshAccessToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }

      console.log("토큰 갱신 요청");

      const response = await fetch(
        "http://localhost:8080/api/v1/auth/refresh",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg || data.message || `HTTP error! status: ${response.status}`
        );
      }

      // 새로운 토큰 쌍 저장
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        console.log("토큰 갱신 성공");
        return data.accessToken;
      }

      throw new Error("Invalid token response");
    } catch (error) {
      console.error("Token refresh error:", error);
      // Refresh token도 만료된 경우 로그아웃 처리
      await this.logout();
      throw error;
    }
  },

  // 토큰이 만료되었는지 확인 (JWT 디코딩)
  isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Token decode error:", error);
      return true;
    }
  },

  // 유효한 Access Token 가져오기 (자동 갱신 포함)
  async getValidAccessToken() {
    let accessToken = localStorage.getItem("authToken");

    if (!accessToken || this.isTokenExpired(accessToken)) {
      console.log("Access token expired, attempting refresh");
      try {
        accessToken = await this.refreshAccessToken();
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return null;
      }
    }

    return accessToken;
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
          data.msg ||
            data.message ||
            data.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("Signup API error:", error);
      throw error;
    }
  },

  // 쿠키에서 JWT 토큰 추출
  getTokenFromCookie() {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    const accessTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("accessToken=")
    );

    if (accessTokenCookie) {
      const token = accessTokenCookie.split("=")[1];
      console.log("쿠키에서 토큰 추출:", token ? "성공" : "실패");
      return token;
    }

    console.log("쿠키에서 accessToken을 찾을 수 없음");
    return null;
  },

  // 페이지 로드 시 토큰 확인 및 자동 로그인
  async checkCookieAndAutoLogin() {
    if (typeof window === "undefined") return false;

    const localStorageToken = localStorage.getItem("authToken");
    if (localStorageToken && !this.isTokenExpired(localStorageToken)) {
      return true;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await this.refreshAccessToken();
        return true;
      } catch (error) {
        console.log("자동 토큰 갱신 실패:", error);
      }
    }

    const cookieToken = this.getTokenFromCookie();
    if (!cookieToken) {
      return false;
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/members/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookieToken}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("authToken", cookieToken);
        localStorage.setItem("userId", userData.id || userData.userId);
        localStorage.setItem("userEmail", userData.email);
        return true;
      } else {
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return false;
      }
    } catch (error) {
      return false;
    }
  },

  // 인증 상태 확인 (localStorage + 쿠키 모두 확인)
  isAuthenticated() {
    if (typeof window === "undefined") return false;

    const localStorageToken = localStorage.getItem("authToken");
    if (localStorageToken && !this.isTokenExpired(localStorageToken)) {
      return true;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      return true;
    }

    const cookieToken = this.getTokenFromCookie();
    if (cookieToken) {
      return true;
    }

    return false;
  },

  // 토큰 검증 (서버에 요청하여 유효성 확인)
  async validateToken() {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.log("토큰 검증 실패: 토큰이 없음");
        return false;
      }

      console.log("토큰 검증 시도");

      const response = await fetch("http://localhost:8080/api/v1/members/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      console.log("토큰 검증 응답:", response.status, response.statusText);

      if (response.ok) {
        console.log("토큰 검증 성공");
        return true;
      } else {
        console.log("토큰 검증 실패:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  // 계정 찾기
  async findAccount(findAccountData) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/find-account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(findAccountData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg || data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("계정 찾기 API 에러:", error);
      throw error;
    }
  },

  // 비밀번호 재설정 (계정 확인)
  async resetPassword(resetPasswordData) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resetPasswordData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg || data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("비밀번호 재설정 API 에러:", error);
      throw error;
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
          data.msg || data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("비밀번호 변경 API 에러:", error);
      throw error;
    }
  },

  // 현재 사용자 정보 가져오기
  async getCurrentUser() {
    try {
      const token = await this.getValidAccessToken();
      
      if (!token) {
        throw new Error("토큰이 없습니다.");
      }

      const response = await fetch("http://localhost:8080/api/v1/members/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
      return null;
    }
  },

  // 로그아웃
  async logout() {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        const response = await fetch(
          "http://localhost:8080/api/v1/auth/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
      }
    } catch (error) {
      console.error("로그아웃 API 에러:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    }
  },
};
