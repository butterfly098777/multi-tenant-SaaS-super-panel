const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const planKeys = {
  all: ["plans"],
  byId: (id) => ["plans", id],
};

export const createPlan = async (formData) => {
  const payload = {
    planName: formData.planName,
    planPrice: formData.planPrice,
    planCode: formData.planCode,
    billingCycle: formData.billingCycle,
    trialDays: formData.trialDays,
    status: formData.status,
  };
  const response = await fetch(`${API_BASE_URL}/plans/create`, {
    method: "POST",
    headers: getAuthHeaders(),   
    body: JSON.stringify(payload), 
  });
  const json = await response.json(); 
  if (!response.ok) throw new Error(json.message || "Plan create nahi hua");
  return json;
};

// ── FETCH ALL ──────────────────────────────────────────────
export const fetchPlans = async () => {
  const response = await fetch(`${API_BASE_URL}/plans/show`, {
    method: "GET",
    headers: getAuthHeaders(), 
  });
  const json = await response.json(); 
  if (!response.ok) throw new Error(json.message || "Plans fetch nahi hue");
  return json.plan || []; 
};

// ── FETCH BY ID ────────────────────────────────────────────
export const fetchPlanById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Plan nahi mila");
  return json.plan;
};

// ── UPDATE ─────────────────────────────────────────────────
export const updatePlan = async ({ id, formData }) => { 
  const payload = {
    planName: formData.planName,
    planCode: formData.planCode,
    planPrice: formData.planPrice,
    billingCycle: formData.billingCycle,
    trialDays: formData.trialDays,
    status: formData.status,
  };
  const response = await fetch(`${API_BASE_URL}/plans/${id}`, { 
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Plan update nahi hua");
  return json;
};

// ── DELETE ─────────────────────────────────────────────────
export const deletePlan = async (id) => {
  const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.message || "Plan delete nahi hua");
  return json;
};