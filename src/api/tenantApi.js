/**
 * Tenant API Layer
 * ─────────────────
 * Centralised data-access functions for the Tenants resource.
 * All network calls live here — components never call fetch() directly.
 *
 * Uses NEXT_PUBLIC_BACKEND_URL so the value is inlined at build time by Next.js.
 */

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ────────────────────────────────────────────
// Query keys — single source of truth
// ────────────────────────────────────────────
export const tenantKeys = {
  all: ["tenants"],
  // Extend later:  detail: (id) => ["tenants", id],
};

// ────────────────────────────────────────────
// GET  /api/v1/tenants
// ────────────────────────────────────────────
export const fetchTenants = async () => {
  const res = await fetch(`${BASE_URL}/api/v1/tenants`);

  if (!res.ok) {
    throw new Error(`Failed to fetch tenants (${res.status})`);
  }

  return res.json();
};

// ────────────────────────────────────────────
// POST /api/v1/tenants
// ────────────────────────────────────────────

/**
 * Transforms flat formData into the nested backend payload:
 *   { business, owner, address, subscription }
 */
const buildTenantPayload = (formData) => ({
  business: {
    name: formData.businessName,
    type: formData.businessType,
    gst: formData.gst || undefined,
    pan: formData.pan || undefined,
    subdomain: formData.subdomain,
    customDomain: formData.customDomain || undefined,
    mongoUri: formData.mongoUri || undefined,
    timezone: formData.timezone || undefined,
    currency: formData.currency || undefined,
  },
  owner: {
    name: formData.ownerName,
    email: formData.ownerEmail,
    phone: formData.ownerPhone || undefined,
  },
  address: {
    line: formData.address || undefined,
    country: formData.country || undefined,
    state: formData.state || undefined,
    city: formData.city || undefined,
    pincode: formData.pincode || undefined,
  },
  subscription: {
    plan: formData.plan || "Basic",
    billingCycle: formData.billingCycle || undefined,
    trialEnd: formData.trialEnd || undefined,
    expiry: formData.expiry || undefined,
    paymentStatus: formData.paymentStatus || undefined,
    status: formData.status || "Active",
  },
});

export const createTenant = async (formData) => {
  const payload = buildTenantPayload(formData);

  const res = await fetch(`${BASE_URL}/api/v1/tenants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(
      errorBody?.message || `Failed to create tenant (${res.status})`
    );
  }

  return res.json();
};
