"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import FormSelect from "../../components/ui/FormSelect";
import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { fetchTenants, createTenant, tenantKeys } from "../../api/tenantApi";
import { fetchPlans } from "../../api/superPlansApi";

// ─── Initial form state ───────────────────────────────────────
const INITIAL_FORM = {
  businessName: "",
  businessType: "retail",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  gst: "",
  pan: "",
  address: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  timezone: "IST",
  currency: "INR",
  subdomain: "",
  customDomain: "",
  mongoUri: "",
  plan: "Basic",
  billingCycle: "monthly",
  trialEnd: "",
  expiry: "",
  paymentStatus: "pending",
  status: "Active",
};

// ─── Table column definitions ─────────────────────────────────
const columns = [
  { header: "Tenant ID", accessor: "tenantId" },
  {
    header: "Business Name",
    accessor: "business",
    render: (row) => (
      <span className="font-medium text-gray-900 dark:text-white">
        {row.business?.name || "N/A"}
      </span>
    ),
  },
  {
    header: "Owner Email",
    accessor: "owner",
    render: (row) => <span>{row.owner?.email || "N/A"}</span>
  },
  {
    header: "Plan",
    accessor: "subscription",
    render: (row) => {
      const planName = row.subscription?.plan || "Basic";
      return (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${planName === "Enterprise"
            ? "bg-purple-100 text-purple-800"
            : "bg-blue-100 text-blue-800"
            }`}
        >
          {planName}
        </span>
      );
    },
  },
  {
    header: "Status",
    accessor: "tenantStatus",
    render: (row) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.tenantStatus === "active"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
          }`}
      >
        {row.tenantStatus?.charAt(0).toUpperCase() + row.tenantStatus?.slice(1) || "Unknown"}
      </span>
    ),
  },
  {
    header: "Expiry",
    accessor: "subscription",
    render: (row) => <span>{row.subscription?.expiryDate ? new Date(row.subscription.expiryDate).toLocaleDateString() : "N/A"}</span>
  },
  {
    header: "Created Date",
    accessor: "createdAt",
    render: (row) => <span>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}</span>
  },
];

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

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════
export default function TenantsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const {
    data: tenants = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: tenantKeys.all,
    queryFn: fetchTenants,
  });

  // ── Fetch plans from backend ──────────────────────────────
  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });
/** Teen cheezein hain yahan:

queryKey: ["plans"]

React Query ka cache ka naam hai — ek identity tag Agar kisi aur component ne bhi ["plans"] key use ki → same cache use hoga, double API call nahi hogi

queryFn: fetchPlans

Yeh wo function hai jo actual API call karta hai (superPlansApi.js mein likha) React Query khud call karega ise — hum manually nahi bulate

data: plans = []

data = jo response aaya API se → hum usse plans naam de rahe hain = [] = default value — jab tak API response nahi aata, plans empty array rahega (not undefined → no crash!) */

  // Backend se aaye plans ko { label, value } format mein convert karo
  const planOptions = plans.map((p) => ({
    label: p.planName,
    value: p.planName,
  }));

  /** .map() kya karta hai?

Har ek plan pe ghoomta hai aur ek naya object banata hai sirf label aur value ke saath — baaki saari fields chod deta hai */
  const createMutation = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      setIsModalOpen(false);
      setFormData(INITIAL_FORM);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  // ── Row actions (navigate to separate pages) ─────────────
  const actions = (row) => (
    <>
      <button onClick={() => router.push(`/tenants/${row._id}/view`)} className="text-gray-500 hover:text-indigo-600" title="View">
        <FiEye size={18} />
      </button>
      <button onClick={() => router.push(`/tenants/${row._id}/edit`)} className="text-gray-500 hover:text-blue-600" title="Edit">
        <FiEdit2 size={18} />
      </button>
      <button className="text-gray-500 hover:text-red-600" title="Delete">
        <FiTrash2 size={18} />
      </button>
    </>
  );

  // ── Loading state ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (isError) {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-red-600 dark:text-red-300">
          {error?.message || "Unable to load tenants. Please try again later."}
        </p>
        <button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: tenantKeys.all })
          }
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Tenant Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
        >
          <FiPlus /> Create Tenant
        </button>
      </div>

      {/* Empty state */}
      {tenants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16 dark:border-gray-700">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No tenants found
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Create your first tenant to get started.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 transition"
          >
            <FiPlus /> Create Tenant
          </button>
        </div>
      ) : (
        <DataTable columns={columns} data={tenants} actions={actions} />
      )}

      {/* Create Tenant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Tenant"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── 1. Business Information ──────────────── */}
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

          {/* ── 2. Technical Configuration ────────────── */}
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
              2. Technical Configuration
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormInput label="Subdomain" name="subdomain" value={formData.subdomain} placeholder="example.app.com" required onChange={handleInputChange} />
              <FormInput label="Custom MongoDB URI (Optional)" name="mongoUri" value={formData.mongoUri} placeholder="mongodb+srv://..." onChange={handleInputChange} />
            </div>
          </div>

          {/* ── 3. Subscription & Billing ─────────────── */}
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
              3. Subscription &amp; Billing
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormSelect label="Plan" name="plan" value={formData.plan} options={planOptions} required onChange={handleInputChange} />
              <FormSelect label="Billing Cycle" name="billingCycle" value={formData.billingCycle} options={BILLING_CYCLES} onChange={handleInputChange} />
              <FormInput label="Trial End Date" name="trialEnd" value={formData.trialEnd} type="date" onChange={handleInputChange} />
              <FormInput label="Expiry Date" name="expiry" value={formData.expiry} type="date" onChange={handleInputChange} />
              <FormSelect label="Payment Status" name="paymentStatus" value={formData.paymentStatus} options={PAYMENT_STATUSES} onChange={handleInputChange} />
              <FormSelect label="Tenant Status" name="status" value={formData.status} options={TENANT_STATUSES} onChange={handleInputChange} />
            </div>
          </div>

          {/* ── Mutation error feedback ───────────────── */}
          {createMutation.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {createMutation.error?.message || "Failed to create tenant."}
            </div>
          )}

          {/* ── Footer actions ───────────────────────── */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            >
              {createMutation.isPending ? "Creating…" : "Create Tenant"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

