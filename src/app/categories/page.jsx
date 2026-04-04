"use client";
import React, { useState } from 'react';
import { FiSave, FiMonitor, FiShoppingBag, FiCoffee, FiHome, FiTool, FiActivity, FiCheck, FiX, FiInfo } from 'react-icons/fi';

// Constants for Business Types
const BUSINESS_TYPES = [
  { id: 'restaurant', label: 'Restaurant', icon: FiCoffee },
  { id: 'hotel', label: 'Hotel', icon: FiHome },
  { id: 'manufacturing', label: 'Manufacturing', icon: FiTool },
  { id: 'pharmacy', label: 'Pharmacy', icon: FiActivity },
  { id: 'business', label: 'Business', icon: FiMonitor },
];

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
  'f_business_name', 'f_gst_tax', 'f_address', 'f_contact_details', 'f_currency', 'f_timezone',
  'f_staff', 'f_roles', 'f_permissions',
  'f_name', 'f_price', 'f_tax', 'f_status',
  'f_invoice_number', 'f_payment_method', 'f_payment_status',
  'f_sales_report', 'f_revenue_report', 'f_tax_report',
  'f_stock_quantity', 'f_low_stock_alert'
];

// Mock Default State (Mapping which feature is enabled for which business)
const INITIAL_PERMISSIONS = {
  restaurant: [...CORE_FEATURES],
  hotel: [...CORE_FEATURES, 'f_room_management'],
  manufacturing: [...CORE_FEATURES, 'f_manufacturing_dispatch'],
  pharmacy: [...CORE_FEATURES, 'f_drug_licensing'],
  business: [...CORE_FEATURES]
};

export default function BusinessCategoriesPage() {
  const [activeType, setActiveType] = useState('restaurant');
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [isSaving, setIsSaving] = useState(false);

  // Toggle Checkbox Logic
  const handleToggle = (featureId) => {
    setPermissions(prev => {
      const currentList = prev[activeType] || [];
      const hasFeature = currentList.includes(featureId);
      
      return {
        ...prev,
        [activeType]: hasFeature 
          ? currentList.filter(id => id !== featureId) 
          : [...currentList, featureId]
      };
    });
  };

  const currentFeatures = permissions[activeType] || [];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Feature mapping saved successfully!');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Business Categories & Features</h1>
        <p className="text-gray-500 text-sm mt-1">Define which modules (Feature Flags) are automatically assigned to new Tenants based on their Industry Type.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Business Types List */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-2">Industry Types</h3>
            <div className="space-y-1">
              {BUSINESS_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium
                    ${activeType === type.id 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                    }`}
                >
                  <type.icon size={18} className={activeType === type.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} /> 
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Feature Flags Configuration */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  Configure Features for "{BUSINESS_TYPES.find(t => t.id === activeType)?.label}"
                </h2>
                <p className="text-xs text-gray-500 mt-1">Any Tenant creating an account under this category will get these features enabled by default.</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm active:scale-95 disabled:opacity-70"
              >
                {isSaving ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <FiSave />}
                {isSaving ? 'Saving...' : 'Save Config'}
              </button>
            </div>

            <div className="p-6 space-y-8 animate-fade-in">
              {Object.entries(FEATURES_GROUPS).filter(([groupName]) => {
                if (groupName === 'Room Management') return activeType === 'hotel';
                if (groupName === 'Manufacturing & Vendor') return activeType === 'manufacturing';
                if (groupName === 'Pharmacy & Clinic') return activeType === 'pharmacy';
                if (groupName === 'Inventory') return activeType === 'manufacturing' || activeType === 'pharmacy';
                return true;
              }).map(([groupName, features]) => (
                <div key={groupName}>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                    {groupName} Modules
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature) => (
                        <div 
                          key={feature.id}
                          className="relative flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
                        >
                          <div>
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                              {feature.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {feature.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
