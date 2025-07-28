export const authAPI = {
  async login(credentials) {
    try {
      console.log("로그인 요청 데이터:", credentials);

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

  // 페이지 로드 시 쿠키에서 토큰 확인 및 자동 로그인
  async checkCookieAndAutoLogin() {
    if (typeof window === "undefined") return false;

    const localStorageToken = localStorage.getItem("authToken");
    if (localStorageToken) {
      return true;
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
    if (localStorageToken) {
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
      // localStorage에서 토큰 확인
      let token = localStorage.getItem("authToken");

      // localStorage에 없으면 쿠키에서 확인
      if (!token) {
        const cookies = document.cookie.split(";");
        const accessTokenCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("accessToken=")
        );

        if (accessTokenCookie) {
          token = accessTokenCookie.split("=")[1];
        }
      }

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
          data.message || `HTTP error! status: ${response.status}`
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
          data.message || `HTTP error! status: ${response.status}`
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
      let token = localStorage.getItem("authToken");

      if (!token) {
        const cookies = document.cookie.split(";");
        const accessTokenCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("accessToken=")
        );

        if (accessTokenCookie) {
          token = accessTokenCookie.split("=")[1];
        }
      }

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
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    }
  },
};
