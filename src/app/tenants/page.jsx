"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import FormSelect from "../../components/ui/FormSelect";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCheck } from "react-icons/fi";
import { fetchTenants, createTenant, tenantKeys } from "../../api/tenantApi";
import { fetchPlans } from "../../api/superPlansApi";

const FEATURES_GROUPS = {
  "Business Basics": [
    { id: 'f_business_name', label: 'Business Info', desc: 'Core identifying name , GST / Tax ID , Address , Contact Details , Currency , Timezone' },
  ],
  "User Management": [
    { id: 'f_user_management', label: 'User Management', desc: 'Add or remove employees , Define roles , Permissions' },
  ],
  "Product / Service": [
    { id: 'f_product_management', label: 'Product Management', desc: 'Product or service title, price, tax, status' },
  ],
  "Billing / Invoice": [
    { id: 'f_billing_management', label: 'Invoice Number', desc: 'payments, status, invoice/bill' },
  ],
  "Reports": [
    { id: 'f_reports_analytics', label: 'Sales Report', desc: 'Periodic sales analytics, financial revenue, taxation records' },
  ],
  "Inventory": [
    { id: 'f_stock_quantity', label: 'Stock Quantity', desc: 'Track available inventory amounts, low stock alert, notification for reordering' },
  ],
  "Room Management": [
    { id: 'f_room_management', label: 'Room Management', desc: 'Room Number, Room Type, Check-in/out Date, Guest ID, Booking Status, Room Availability, Extra Services' }
  ],
  "Manufacturing & Vendor": [
    { id: 'f_manufacturing_dispatch', label: 'Manufacturing & Dispatch', desc: 'Raw Material Inventory, Production Batch, Mfg Date, Quality Check, Dispatch Tracking, Bulk Orders' }
  ],
  "Pharmacy & Clinic": [
    { id: 'f_drug_licensing', label: 'Drug & Licensing', desc: 'Drug License Number, Batch Number, Expiry Date, Prescription Required' }
  ]
};

const CORE_FEATURES = [
  'f_business_name', 'f_user_management', 'f_product_management', 'f_billing_management', 'f_reports_analytics', 'f_stock_quantity'
];

const INITIAL_PERMISSIONS = {
  restaurant: [...CORE_FEATURES],
  hotel: [...CORE_FEATURES, 'f_room_management'],
  manufacturing: [...CORE_FEATURES, 'f_manufacturing_dispatch'],
  pharmacy: [...CORE_FEATURES, 'f_drug_licensing'],
  business: [...CORE_FEATURES]
};

// ─── Initial form state ───────────────────────────────────────
const INITIAL_FORM = {
  businessName: "",
  businessType: "restaurant",
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
  features: INITIAL_PERMISSIONS['restaurant']
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
  { label: "Restaurant", value: "restaurant" },
  { label: "Hotel", value: "hotel" },
  { label: "Pharmacy", value: "pharmacy" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Business", value: "business" },
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

  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const planOptions = plans.map((p) => ({
    label: p.planName,
    value: p.planName,
  }));

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
    
    // Automatically update the features checklist when businessType changes
    if (name === "businessType") {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        features: INITIAL_PERMISSIONS[value] || []
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => {
      const hasFeature = prev.features.includes(featureId);
      return {
        ...prev,
        features: hasFeature 
          ? prev.features.filter(id => id !== featureId)
          : [...prev.features, featureId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

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
        size="2xl"
      >
        <TenantForm 
          formData={formData} 
          setFormData={setFormData}
          handleInputChange={handleInputChange} 
          handleFeatureToggle={handleFeatureToggle}
          handleSubmit={handleSubmit}
          createMutation={createMutation}
          setIsModalOpen={setIsModalOpen}
          planOptions={planOptions}
        />
      </Modal>
    </div>
  );
}

// Sub-component to handle the tabbed form state cleanly
function TenantForm({ formData, setFormData, handleInputChange, handleFeatureToggle, handleSubmit, createMutation, setIsModalOpen, planOptions }) {
  const [activeTab, setActiveTab] = useState('info');

  const tabs = [
    { id: 'info', label: '1. Business Info' },
    { id: 'modules', label: '2. Modules' },
    { id: 'tech', label: '3. Technical' },
    { id: 'billing', label: '4. Billing' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-2 min-h-[320px]">
        {/* ── 1. Business Information ──────────────── */}
        {activeTab === 'info' && (
          <div className="animate-fade-in space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormInput label="Business Name" name="businessName" value={formData.businessName} required onChange={handleInputChange} />
              <FormSelect label="Business Type" name="businessType" value={formData.businessType} options={BUSINESS_TYPES} onChange={handleInputChange} />
              <FormInput label="Owner Name" name="ownerName" value={formData.ownerName} required onChange={handleInputChange} />
              <FormInput label="Owner Email" name="ownerEmail" value={formData.ownerEmail} type="email" required onChange={handleInputChange} />
              <FormInput label="Owner Phone" name="ownerPhone" value={formData.ownerPhone} type="tel" onChange={handleInputChange} />
              <FormInput label="GST Number" name="gst" value={formData.gst} onChange={handleInputChange} />
              <FormInput label="PAN" name="pan" value={formData.pan} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormInput label="Address" name="address" value={formData.address} className="lg:col-span-4" onChange={handleInputChange} />
              <FormInput label="Country" name="country" value={formData.country} onChange={handleInputChange} />
              <FormInput label="State" name="state" value={formData.state} onChange={handleInputChange} />
              <FormInput label="City" name="city" value={formData.city} onChange={handleInputChange} />
              <FormInput label="Pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} />
              <FormSelect label="Timezone" name="timezone" value={formData.timezone} options={TIMEZONES} onChange={handleInputChange} />
              <FormSelect label="Currency" name="currency" value={formData.currency} options={CURRENCIES} onChange={handleInputChange} />
            </div>
          </div>
        )}

        {/* ── 2. Feature Configuration ────────────── */}
        {activeTab === 'modules' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex flex-col gap-4">
              {Object.entries(FEATURES_GROUPS).filter(([groupName]) => {
                if (groupName === 'Room Management') return formData.businessType === 'hotel';
                if (groupName === 'Manufacturing & Vendor') return formData.businessType === 'manufacturing';
                if (groupName === 'Pharmacy & Clinic') return formData.businessType === 'pharmacy';
                if (groupName === 'Inventory') return formData.businessType === 'manufacturing' || formData.businessType === 'pharmacy';
                return true;
              }).map(([groupName, features]) => (
                <div key={groupName} className="space-y-1.5">
                  <h5 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{groupName}</h5>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => {
                      const isEnabled = formData.features.includes(feature.id);
                      return (
                        <div 
                          key={feature.id}
                          onClick={() => handleFeatureToggle(feature.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200 select-none
                            ${isEnabled 
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-500' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                          <div className={`shrink-0 w-3.5 h-3.5 rounded-sm flex items-center justify-center transition-colors
                            ${isEnabled ? 'bg-indigo-600 text-white' : 'bg-transparent border border-gray-300 dark:border-gray-600'}
                          `}>
                            {isEnabled && <FiCheck size={10} strokeWidth={4} />}
                          </div>
                          <span className="text-xs font-semibold">{feature.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 italic">* Click on any module to toggle it ON/OFF for this tenant.</p>
          </div>
        )}

        {/* ── 3. Technical Configuration ────────────── */}
        {activeTab === 'tech' && (
          <div className="animate-fade-in space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput label="Subdomain" name="subdomain" value={formData.subdomain} placeholder="example.app.com" required onChange={handleInputChange} />
              <FormInput label="Custom Domain (Optional)" name="customDomain" value={formData.customDomain} placeholder="www.example.com" onChange={handleInputChange} />
              <FormInput label="Custom MongoDB URI (Optional)" name="mongoUri" value={formData.mongoUri} placeholder="mongodb+srv://..." className="sm:col-span-2" onChange={handleInputChange} />
            </div>
          </div>
        )}

        {/* ── 4. Subscription & Billing ─────────────── */}
        {activeTab === 'billing' && (
          <div className="animate-fade-in space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormSelect label="Plan" name="plan" value={formData.plan} options={planOptions} required onChange={handleInputChange} />
              <FormSelect label="Billing Cycle" name="billingCycle" value={formData.billingCycle} options={BILLING_CYCLES} onChange={handleInputChange} />
              <FormInput label="Trial End Date" name="trialEnd" value={formData.trialEnd} type="date" onChange={handleInputChange} />
              <FormInput label="Expiry Date" name="expiry" value={formData.expiry} type="date" onChange={handleInputChange} />
              <FormSelect label="Payment Status" name="paymentStatus" value={formData.paymentStatus} options={PAYMENT_STATUSES} onChange={handleInputChange} />
              <FormSelect label="Tenant Status" name="status" value={formData.status} options={TENANT_STATUSES} onChange={handleInputChange} />
            </div>
          </div>
        )}
      </div>

      {/* ── Mutation error feedback ───────────────── */}
      {createMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {createMutation.error?.message || "Failed to create tenant."}
        </div>
      )}

      {/* ── Footer actions ───────────────────────── */}
      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
           {/* Previous tab button logic if we want, or left empty */}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            Cancel
          </button>
          {activeTab !== 'billing' ? (
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'info') setActiveTab('modules');
                else if (activeTab === 'modules') setActiveTab('tech');
                else if (activeTab === 'tech') setActiveTab('billing');
              }}
              className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-indigo-700 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            >
              {createMutation.isPending ? "Creating…" : "Confirm & Create"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
