const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export const loginAdmin = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Login failed");
  }

  // Token localStorage mein save karo
  if (typeof window !== "undefined") {
    localStorage.setItem("token", json.token);
    const userData = json.admin || json.role;
    if (userData) {
      localStorage.setItem("admin", JSON.stringify(userData));
    }
  }

  return json;
};

export const logoutAdmin = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  }
};

export const getStoredAdmin = () => {
  if (typeof window !== "undefined") {
    const admin = localStorage.getItem("admin");
    return admin ? JSON.parse(admin) : null;
  }
  return null;
};

export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
};
