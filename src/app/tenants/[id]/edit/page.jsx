"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTenantById, updateTenant, tenantKeys } from "../../../../api/tenantApi";
import FormInput from "../../../../components/ui/FormInput";
import FormSelect from "../../../../components/ui/FormSelect";
import { FiArrowLeft, FiSave } from "react-icons/fi";

// ─── Select options ───────────────────────────────────────────
const BUSINESS_TYPES = [
  { label: "Retail", value: "retail" },
  { label: "Restaurant", value: "Restaurant" },
  { label: "Hotel", value: "Hotel" },
  { label: "Pharmacy", value: "Pharmacy" },
  { label: "Manufacturing", value: "Manufacturing" },
];
const TIMEZONES = [
  { label: "UTC", value: "UTC" },
  { label: "IST", value: "IST" },
];
const CURRENCIES = [
  { label: "USD", value: "USD" },
  { label: "INR", value: "INR" },
];
const PLANS = [
  { label: "Basic", value: "Basic" },
  { label: "Pro", value: "Pro" },
  { label: "Enterprise", value: "Enterprise" },
];
const BILLING_CYCLES = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];
const PAYMENT_STATUSES = [
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
];
const TENANT_STATUSES = [
  { label: "Active", value: "Active" },
  { label: "Suspended", value: "Suspended" },
];

// ─── Helper: Convert nested DB tenant → flat form ────────────
const tenantToFormData = (tenant) => ({
  businessName: tenant.business?.name || "",
  businessType: tenant.business?.type || "retail",
  ownerName: tenant.owner?.name || "",
  ownerEmail: tenant.owner?.email || "",
  ownerPhone: tenant.owner?.phone || "",
  gst: tenant.business?.gstNumber || "",
  pan: tenant.pan || "",
  address: tenant.address?.street || "",
  country: tenant.address?.country || "",
  state: tenant.address?.state || "",
  city: tenant.address?.city || "",
  pincode: tenant.address?.pinCode || "",
  timezone: "IST",
  currency: tenant.currency || "INR",
  subdomain: tenant.subdomain || "",
  mongoUri: tenant.mongoUri || "",
  plan: tenant.subscription?.plan || "Basic",
  billingCycle: tenant.subscription?.billingCycle || "monthly",
  trialEnd: tenant.subscription?.trialEndDate
    ? new Date(tenant.subscription.trialEndDate).toISOString().split("T")[0]
    : "",
  expiry: tenant.subscription?.expiryDate
    ? new Date(tenant.subscription.expiryDate).toISOString().split("T")[0]
    : "",
  paymentStatus: tenant.subscription?.paymentStatus?.toLowerCase() || "pending",
  status: tenant.tenantStatus === "active" ? "Active" : "Suspended",
});

// ═══════════════════════════════════════════════════════════════
// Edit Tenant Page
// ═══════════════════════════════════════════════════════════════
export default function EditTenantPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const tenantId = params.id;

  const [formData, setFormData] = useState(null);

  const { data: tenant, isLoading, isError, error } = useQuery({
    queryKey: tenantKeys.byId(tenantId),
    queryFn: () => fetchTenantById(tenantId),
    enabled: !!tenantId,
  });

  // ── Update Mutation ───────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (payload) => updateTenant(tenantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      queryClient.invalidateQueries({ queryKey: tenantKeys.byId(tenantId) });
      router.push("/tenants");
    },
  });

  // Pre-fill form when tenant data loads
  useEffect(() => {
    if (tenant) {
      setFormData(tenantToFormData(tenant));
    }
  }, [tenant]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // updateTenant internally calls formDataToPayload()
    updateMutation.mutate(formData);
  };

  // ── Loading ───────────────────────────────────────────────
  if (isLoading || !formData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Unable to load tenant</h2>
        <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error?.message}</p>
        <button onClick={() => router.back()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition">
          Go Back
        </button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition">
            <FiArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Tenant</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tenant?.tenantId}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Business Information */}
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
              1. Business Information
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormInput label="Business Name" name="businessName" value={formData.businessName} required onChange={handleInputChange} />
              <FormSelect label="Business Type" name="businessType" value={formData.businessType} options={BUSINESS_TYPES} onChange={handleInputChange} />
              <FormInput label="Owner Name" name="ownerName" value={formData.ownerName} required onChange={handleInputChange} />
              <FormInput label="Owner Email" name="ownerEmail" value={formData.ownerEmail} type="email" required onChange={handleInputChange} />
              <FormInput label="Owner Phone" name="ownerPhone" value={formData.ownerPhone} type="tel" onChange={handleInputChange} />
              <FormInput label="GST Number" name="gst" value={formData.gst} onChange={handleInputChange} />
              <FormInput label="PAN" name="pan" value={formData.pan} onChange={handleInputChange} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormInput label="Address" name="address" value={formData.address} className="lg:col-span-4" onChange={handleInputChange} />
              <FormInput label="Country" name="country" value={formData.country} onChange={handleInputChange} />
              <FormInput label="State" name="state" value={formData.state} onChange={handleInputChange} />
              <FormInput label="City" name="city" value={formData.city} onChange={handleInputChange} />
              <FormInput label="Pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} />
              <FormSelect label="Timezone" name="timezone" value={formData.timezone} options={TIMEZONES} onChange={handleInputChange} />
              <FormSelect label="Currency" name="currency" value={formData.currency} options={CURRENCIES} onChange={handleInputChange} />
            </div>
          </div>

          {/* 2. Technical Configuration */}
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
              2. Technical Configuration
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormInput label="Subdomain" name="subdomain" value={formData.subdomain} placeholder="example.app.com" required onChange={handleInputChange} />
              <FormInput label="Custom MongoDB URI (Optional)" name="mongoUri" value={formData.mongoUri} placeholder="mongodb+srv://..." onChange={handleInputChange} />
            </div>
          </div>

          {/* 3. Subscription & Billing */}
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
              3. Subscription &amp; Billing
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormSelect label="Plan" name="plan" value={formData.plan} options={PLANS} required onChange={handleInputChange} />
              <FormSelect label="Billing Cycle" name="billingCycle" value={formData.billingCycle} options={BILLING_CYCLES} onChange={handleInputChange} />
              <FormInput label="Trial End Date" name="trialEnd" value={formData.trialEnd} type="date" onChange={handleInputChange} />
              <FormInput label="Expiry Date" name="expiry" value={formData.expiry} type="date" onChange={handleInputChange} />
              <FormSelect label="Payment Status" name="paymentStatus" value={formData.paymentStatus} options={PAYMENT_STATUSES} onChange={handleInputChange} />
              <FormSelect label="Tenant Status" name="status" value={formData.status} options={TENANT_STATUSES} onChange={handleInputChange} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <FiSave size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
