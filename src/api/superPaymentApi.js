const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
export const paymentsKeys = {
  all: ["payments"],
  byId: (id) => ["payments", id],
};
export const createSuperPayment = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Payment config not created");
  return json;
};

export const getSuperPayments = async () => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "No Payments fetch ");
  return json.data || [];
};