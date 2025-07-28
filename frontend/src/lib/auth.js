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
};
