"use client";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import { FiCreditCard, FiMail, FiUser, FiClock, FiShield } from 'react-icons/fi';
import { createSuperPayment, getSuperPayments, paymentsKeys } from '../../api/superPaymentApi'; 

const GATEWAY_COLORS = {
  Razorpay: 'bg-blue-100 text-blue-700',
  Stripe:   'bg-violet-100 text-violet-700',
  PayPal:   'bg-yellow-100 text-yellow-700',
  RAZORPAY: 'bg-blue-100 text-blue-700',
  STRIPE:   'bg-violet-100 text-violet-700',
  PAYPAL:   'bg-yellow-100 text-yellow-700',
};

const INITIAL_FORM = {
  gatewayName: 'Razorpay',
  tenantName: '',
  tenantEmail: '',
};

export default function PaymentGatewaysPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(INITIAL_FORM);

  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: paymentsKeys.all,
    queryFn: getSuperPayments,  
  });

  const createMutation = useMutation({
    mutationFn: createSuperPayment, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all });
      setFormData(INITIAL_FORM);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData); 
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Payment Gateway Configuration</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage payment gateway configurations for all tenants
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="flex gap-6 items-start">

        {/* ── LEFT: Configurations List (scrollable) ── */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800 overflow-hidden">
            {/* List Header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-white">
                Active Configurations
              </h2>
              <span className="text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full px-2.5 py-1">
                {payments.length} total
              </span>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-10">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
              </div>
            )}

            {/* Error State */}
            {isError && (
              <p className="px-5 py-4 text-sm text-red-500">No Payments Found</p>
            )}

            {/* Scrollable List */}
            {!isLoading && !isError && (
              <div className="divide-y divide-gray-50 dark:divide-gray-700/50 overflow-y-auto max-h-[calc(100vh-260px)]">
                {payments.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-gray-400">No configurations yet.</p>
                ) : (
                  payments.map((config) => (   
                    <div
                      key={config._id}         
                      className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiShield size={14} className="text-gray-400" />
                          <span className="font-medium text-sm text-gray-900 dark:text-white">
                            {config.tenantName}  
                          </span>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${GATEWAY_COLORS[config.gatewayName] || 'bg-gray-100 text-gray-700'}`}>
                          {config.gatewayName}   
                        </span>
                      </div>

                      {/* Detail chips */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiMail size={11} /> {config.tenantEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={11} />
                          {config.createdAt ? new Date(config.createdAt).toLocaleString() : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiUser size={11} />
                       
                          {config.createdBy?.role + "•" + config.createdBy?.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-80 shrink-0 sticky top-6">
          <div className="rounded-xl bg-white shadow-sm dark:bg-gray-800">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
              <FiCreditCard size={16} className="text-indigo-500" />
              <h2 className="font-semibold text-gray-800 dark:text-white text-sm">
                Add Configuration
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <FormSelect
                label="Gateway Name"
                name="gatewayName"
                value={formData.gatewayName}
                options={[
                  { label: 'Razorpay', value: 'Razorpay' },
                  { label: 'Stripe',   value: 'Stripe'   },
                  { label: 'PayPal',   value: 'Paypal'   },
                ]}
                onChange={handleInputChange}
              />
              <FormInput
                label="Tenant Name"
                name="tenantName"
                placeholder="Enter tenant name"
                value={formData.tenantName}
                required
                onChange={handleInputChange}
              />
              <FormInput
                label="Tenant Email"
                name="tenantEmail"
                type="email"
                placeholder="tenant@example.com"
                value={formData.tenantEmail}
                required
                onChange={handleInputChange}
              />

              {createMutation.isError && (
                <p className="text-sm text-red-500">{createMutation.error?.message}</p>
              )}

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-60"
              >
                {createMutation.isPending ? 'Saving...' : 'Save Configuration'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
