export const authAPI = {
  async login(credentials) {
    try {
      const loginUrl = "http://localhost:8080/api/v1/auth/login";

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg ||
            data.message ||
            data.error ||
            data.detail ||
            `HTTP error! status: ${response.status}`
        );
      }

      // 백엔드 응답 구조에 따른 토큰 추출
      let accessToken = null;
      let refreshToken = null;
      let userRole = null;

      // 다양한 응답 구조 지원
      if (data.accessToken) {
        accessToken = data.accessToken;
      } else if (data.token) {
        accessToken = data.token;
      } else if (data.access_token) {
        accessToken = data.access_token;
      } else if (data.access) {
        accessToken = data.access;
      } else if (data.jwt) {
        accessToken = data.jwt;
      } else if (data.jwtToken) {
        accessToken = data.jwtToken;
      }

      if (data.refreshToken) {
        refreshToken = data.refreshToken;
      } else if (data.refresh_token) {
        refreshToken = data.refresh_token;
      } else if (data.refreshTokenValue) {
        refreshToken = data.refreshTokenValue;
      } else if (data.refresh) {
        refreshToken = data.refresh;
      } else if (data.refreshJwt) {
        refreshToken = data.refreshJwt;
      } else if (data.refreshJwtToken) {
        refreshToken = data.refreshJwtToken;
      }

      // 역할 정보 추출
      if (data.role) {
        userRole = data.role;
      } else if (data.userRole) {
        userRole = data.userRole;
      } else if (
        data.authorities &&
        data.authorities[0] &&
        data.authorities[0].authority
      ) {
        userRole = data.authorities[0].authority;
      }

      // 토큰 저장
      if (accessToken) {
        localStorage.setItem("authToken", accessToken);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // 토큰이 응답에 없으면 쿠키에서 확인
      if (!accessToken) {
        const cookieToken = this.getTokenFromCookie();
        if (cookieToken) {
          localStorage.setItem("authToken", cookieToken);
          accessToken = cookieToken;
        }
      }

      // 사용자 정보 저장
      if (data.id || data.userId || data.memberId) {
        const userId = data.id || data.userId || data.memberId;
        localStorage.setItem("userId", userId.toString());
      }

      if (data.email) {
        localStorage.setItem("userEmail", data.email);
      }

      if (userRole) {
        localStorage.setItem("userRole", userRole);
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
        // Refresh token이 없는 경우, 현재 access token이 유효한지 확인
        const currentToken = localStorage.getItem("authToken");
        if (currentToken && !this.isTokenExpired(currentToken)) {
          return currentToken;
        } else {
          throw new Error("No valid tokens available - re-login required");
        }
      }

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
        return data.accessToken;
      } else if (data.accessToken) {
        // 새로운 access token만 제공된 경우
        localStorage.setItem("authToken", data.accessToken);
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
      const response = await fetch(
        "http://localhost:8080/api/v1/members/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

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
      return token;
    }

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
        localStorage.removeItem("userRole");
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    }
  },

  // 회원 탈퇴
  async withdrawAccount(memberId) {
    try {
      const token = await this.getValidAccessToken();
      if (!token) {
        throw new Error("유효한 토큰이 없습니다.");
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/members/${memberId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg || data.message || `HTTP error! status: ${response.status}`
        );
      }

      // 회원 탈퇴 성공 시 로그아웃 처리
      await this.logout();

      return data;
    } catch (error) {
      console.error("회원 탈퇴 API 에러:", error);
      throw error;
    }
  },

  // 인증 상태를 더 안정적으로 확인하는 함수
  checkAuthStatus() {
    try {
      const authToken = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");
      const userId = localStorage.getItem("userId");

      return {
        isAuthenticated: !!(authToken && userRole && userId),
        authToken,
        userRole,
        userId,
      };
    } catch (error) {
      console.error("Auth status check failed:", error);
      return {
        isAuthenticated: false,
        authToken: null,
        userRole: null,
        userId: null,
      };
    }
  },

  // 로그인 상태를 강제로 설정하는 함수
  setAuthStatus(authData) {
    try {
      if (authData.authToken) {
        localStorage.setItem("authToken", authData.authToken);
      }
      if (authData.userRole) {
        localStorage.setItem("userRole", authData.userRole);
      }
      if (authData.userId) {
        localStorage.setItem("userId", authData.userId);
      }
      if (authData.userEmail) {
        localStorage.setItem("userEmail", authData.userEmail);
      }
      if (authData.refreshToken) {
        localStorage.setItem("refreshToken", authData.refreshToken);
      }

      return true;
    } catch (error) {
      console.error("Failed to set auth status:", error);
      return false;
    }
  },
};
