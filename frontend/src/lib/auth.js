export const authAPI = {
  async login(credentials) {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  async signup(userData) {
    const response = await fetch(
      "http://localhost:8080/api/v1/members/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
    return response.json();
  },
};
