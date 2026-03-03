"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchTenantById, tenantKeys } from "../../../../api/tenantApi";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";

// ═══════════════════════════════════════════════════════════════
// InfoItem — Small reusable component for read-only display
// ═══════════════════════════════════════════════════════════════
function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{value || "N/A"}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// View Tenant Page
// ═══════════════════════════════════════════════════════════════
export default function ViewTenantPage() {
  const params = useParams();
  const router = useRouter();
  const tenantId = params.id;

  const { data: tenant, isLoading, isError, error } = useQuery({
    queryKey: tenantKeys.byId(tenantId),
    queryFn: () => fetchTenantById(tenantId),
    enabled: !!tenantId,
  });

  // ── Loading ───────────────────────────────────────────────
  if (isLoading) {
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

  if (!tenant) return null;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/tenants")} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition">
            <FiArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tenant Details</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tenant.tenantId}</p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/tenants/${tenantId}/edit`)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <FiEdit2 size={16} /> Edit Tenant
        </button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${tenant.tenantStatus === "active"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}>
          {tenant.tenantStatus?.charAt(0).toUpperCase() + tenant.tenantStatus?.slice(1)}
        </span>
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${tenant.subscription?.plan === "Enterprise"
            ? "bg-purple-100 text-purple-800"
            : "bg-blue-100 text-blue-800"
          }`}>
          {tenant.subscription?.plan || "Basic"} Plan
        </span>
      </div>

      {/* Content Cards */}
      <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* 1. Business Information */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-700">
            Business Information
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem label="Business Name" value={tenant.business?.name} />
            <InfoItem label="Business Type" value={tenant.business?.type} />
            <InfoItem label="GST Number" value={tenant.business?.gstNumber} />
            <InfoItem label="PAN" value={tenant.pan} />
          </div>
        </div>

        {/* 2. Owner Details */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-700">
            Owner Details
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Name" value={tenant.owner?.name} />
            <InfoItem label="Email" value={tenant.owner?.email} />
            <InfoItem label="Phone" value={tenant.owner?.phone} />
          </div>
        </div>

        {/* 3. Address */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-700">
            Address
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Street" value={tenant.address?.street} />
            <InfoItem label="City" value={tenant.address?.city} />
            <InfoItem label="State" value={tenant.address?.state} />
            <InfoItem label="Pin Code" value={tenant.address?.pinCode} />
            <InfoItem label="Country" value={tenant.address?.country} />
            <InfoItem label="Currency" value={tenant.currency} />
          </div>
        </div>

        {/* 4. Technical Configuration */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-700">
            Technical Configuration
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoItem label="Subdomain" value={tenant.subdomain} />
            <InfoItem label="MongoDB URI" value={tenant.mongoUri || "Default (Shared)"} />
          </div>
        </div>

        {/* 5. Subscription & Billing */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-700">
            Subscription & Billing
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Plan" value={tenant.subscription?.plan} />
            <InfoItem label="Billing Cycle" value={tenant.subscription?.billingCycle} />
            <InfoItem label="Payment Status" value={tenant.subscription?.paymentStatus} />
            <InfoItem label="Expiry Date" value={tenant.subscription?.expiryDate ? new Date(tenant.subscription.expiryDate).toLocaleDateString() : "N/A"} />
            <InfoItem label="Trial End" value={tenant.subscription?.trialEndDate ? new Date(tenant.subscription.trialEndDate).toLocaleDateString() : "N/A"} />
          </div>
        </div>

        {/* 6. Timestamps */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b pb-2 border-gray-200 dark:border-gray-700">
            Timestamps
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoItem label="Created At" value={tenant.createdAt ? new Date(tenant.createdAt).toLocaleString() : "N/A"} />
            <InfoItem label="Updated At" value={tenant.updatedAt ? new Date(tenant.updatedAt).toLocaleString() : "N/A"} />
          </div>
        </div>
      </div>
    </div>
  );
}
