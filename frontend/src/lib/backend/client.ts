const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 토큰이 만료되었는지 확인 (JWT 디코딩)
const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Token decode error:", error);
    return true;
  }
};

async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.log("Refresh token not found in localStorage");
      // Check if current access token is still valid
      const currentToken = localStorage.getItem("authToken");
      if (currentToken && !isTokenExpired(currentToken)) {
        console.log("Current access token is still valid - no refresh needed");
        return currentToken;
      } else {
        console.log("No valid tokens available - re-login required");
        return null; // Indicate re-login is needed
      }
    }

    console.log("Token refresh request starting");

    const response = await fetch("http://localhost:8080/api/v1/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      credentials: "include",
    });

    console.log("Token refresh response status:", response.status);

    const data = await response.json();
    console.log("Token refresh response data:", data);

    if (!response.ok) {
      console.log("Token refresh failed:", response.status, data);
      throw new Error(
        data.msg || data.message || `HTTP error! status: ${response.status}`
      );
    }

    // Store new tokens
    if (data.accessToken) {
      localStorage.setItem("authToken", data.accessToken);
      console.log("New access token stored");
    }

    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log("New refresh token stored");
    }

    return data.accessToken || localStorage.getItem("authToken");
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
}

// 유효한 Access Token 가져오기 (만료 시 자동 갱신)
const getValidAccessToken = async (): Promise<string | null> => {
  let accessToken = localStorage.getItem("authToken");

  if (!accessToken || isTokenExpired(accessToken)) {
    console.log("Access token expired, attempting refresh");
    try {
      accessToken = await refreshAccessToken();
      if (accessToken === null) {
        console.log("Token refresh returned null - re-login required");
        return null;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  }

  return accessToken;
};

export const apiFetch = async (url: string, options?: RequestInit) => {
  options = options || {};
  options.credentials = "include";

  // Authorization 헤더가 필요한 경우 토큰 추가
  if (!options.headers) {
    options.headers = {};
  }

  const headers = new Headers(options.headers);

  // Authorization 헤더가 없고 인증이 필요한 요청인 경우
  if (!headers.has("Authorization")) {
    try {
      const token = await getValidAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("토큰 추가됨:", token.substring(0, 20) + "...");
      } else {
        console.log("유효한 토큰이 없음 - 재로그인 필요");
        // No valid token available - throw an error to indicate re-login is needed
        throw new Error(
          "No valid authentication token available - re-login required"
        );
      }
    } catch (error) {
      console.error("Failed to get valid token:", error);
      // 토큰 갱신 실패 시 에러를 그대로 전달
      throw error;
    }
  }

  if (options.body) {
    // body가 FormData 인지 체크
    const isFormData = options.body instanceof FormData;

    if (!headers.has("Content-Type") && !isFormData) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }
  }

  options.headers = headers;

  return fetch(`${NEXT_PUBLIC_API_BASE_URL}${url}`, options).then(
    async (res) => {
      if (!res.ok) {
        // 401 또는 403 에러 시 자동 갱신 시도
        if (res.status === 401 || res.status === 403) {
          console.log(`${res.status} 에러 발생, 토큰 갱신 시도`);
          try {
            const newToken = await refreshAccessToken();
            if (newToken) {
              // 새로운 토큰으로 원래 요청 재시도
              headers.set("Authorization", `Bearer ${newToken}`);
              options.headers = headers;

              const retryResponse = await fetch(
                `${NEXT_PUBLIC_API_BASE_URL}${url}`,
                options
              );

              if (retryResponse.ok) {
                const responseText = await retryResponse.text();
                return responseText ? JSON.parse(responseText) : {};
              } else {
                console.log("토큰 갱신 후 재시도 실패:", retryResponse.status);
                // 권한 오류인 경우 에러를 던져서 호출자가 처리하도록 함
                const errorText = await retryResponse.text();
                const errorData = errorText
                  ? JSON.parse(errorText)
                  : { message: `HTTP error! status: ${retryResponse.status}` };
                throw errorData;
              }
            } else {
              console.log("토큰 갱신 실패, 원본 에러 처리");
              // 토큰 갱신 실패 시 원본 에러 처리
              const responseText = await res.text();
              const errorData = responseText
                ? JSON.parse(responseText)
                : { message: `HTTP error! status: ${res.status}` };
              throw errorData;
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // 토큰 갱신 실패 시 원본 에러 처리
            const responseText = await res.text();
            const errorData = responseText
              ? JSON.parse(responseText)
              : { message: `HTTP error! status: ${res.status}` };
            throw errorData;
          }
        }

        // 에러 응답 처리 개선
        try {
          const responseText = await res.text();
          const errorData = responseText
            ? JSON.parse(responseText)
            : {
                message: `HTTP error! status: ${res.status}`,
              };
          throw errorData;
        } catch (parseError) {
          throw {
            message: `HTTP error! status: ${res.status}. Failed to parse response.`,
          };
        }
      }

      // 성공 응답 처리 개선
      const responseText = await res.text();
      return responseText ? JSON.parse(responseText) : {};
    }
  );
};
