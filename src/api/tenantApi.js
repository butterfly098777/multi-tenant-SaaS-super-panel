const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export const tenantKeys = {
  all: ["tenants"],
  byId: (id) => ["tenants", id],
};

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const fetchTenants = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || "Failed to fetch tenants");
    }
    return json.data || [];
  } catch (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }
};

export const fetchTenantById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || "Failed to fetch tenant");
    }
    return json.data;
  } catch (error) {
    console.error("Error fetching tenant:", error);
    throw error;
  }
};

export const createTenant = async (formData) => {
  // Transform flat formData to nested payload required by SuperTenantSchema
  const payload = {
    business: {
      name: formData.businessName,
      type: formData.businessType,
      gstNumber: formData.gst,
    },
    pan: formData.pan,
    owner: {
      name: formData.ownerName,
      email: formData.ownerEmail,
      phone: formData.ownerPhone,
    },
    address: {
      street: formData.address,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pincode,
      country: formData.country,
    },
    currency: formData.currency,
    subdomain: formData.subdomain,
    mongoUri: formData.mongoUri || null,
    subscription: {
      plan: formData.plan,
      billingCycle: formData.billingCycle,
      paymentStatus: formData.paymentStatus
        ? formData.paymentStatus.charAt(0).toUpperCase() + formData.paymentStatus.slice(1)
        : "Pending",
      expiryDate: formData.expiry || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      trialEndDate: formData.trialEnd || null,
    },
    tenantStatus: formData.status.toLowerCase(),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || "Failed to create tenant");
    }
    return json;
  } catch (error) {
    console.error("Error creating tenant:", error);
    throw error;
  }
};

export const updateTenant = async (id, formData) => {
  // Transform flat formData to nested payload (same as createTenant)
  const payload = {
    business: {
      name: formData.businessName,
      type: formData.businessType,
      gstNumber: formData.gst,
    },
    pan: formData.pan,
    owner: {
      name: formData.ownerName,
      email: formData.ownerEmail,
      phone: formData.ownerPhone,
    },
    address: {
      street: formData.address,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pincode,
      country: formData.country,
    },
    currency: formData.currency,
    subdomain: formData.subdomain,
    mongoUri: formData.mongoUri || null,
    subscription: {
      plan: formData.plan,
      billingCycle: formData.billingCycle,
      paymentStatus: formData.paymentStatus
        ? formData.paymentStatus.charAt(0).toUpperCase() + formData.paymentStatus.slice(1)
        : "Pending",
      expiryDate: formData.expiry || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      trialEndDate: formData.trialEnd || null,
    },
    tenantStatus: formData.status.toLowerCase(),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || "Failed to update tenant");
    }
    return json;
  } catch (error) {
    console.error("Error updating tenant:", error);
    throw error;
  }
};