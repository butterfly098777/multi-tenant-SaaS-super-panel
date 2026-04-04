"use client";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormInput from '../../components/ui/FormInput';
import FormSelect from '../../components/ui/FormSelect';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { createPlan, fetchPlans, deletePlan, planKeys } from '../../api/superPlansApi';

const INITIAL_FORM = {
  planName: "",
  planCode: "",
  planPrice: "",
  billingCycle: "monthly",
  trialDays: "14",
  status: "active",
};

export default function PlansPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  // ── 1. FETCH all plans from backend ──────────────────────
  const { data: plans = [], isLoading, isError } = useQuery({
    queryKey: planKeys.all,
    queryFn: fetchPlans,
  });

  // ── 2. CREATE plan mutation ───────────────────────────────
  const createMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all }); // list refresh karo
      setFormData(INITIAL_FORM); // form reset
      setIsModalOpen(false);
    },
  });

  // ── 3. DELETE plan mutation ───────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all }); // list refresh karo
    },
  });

  // ── Handlers ─────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData); // API call!
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      deleteMutation.mutate(id);
    }
  };

  // ── Table Columns ─────────────────────────────────────────
  const columns = [
    { header: 'Plan Name', accessor: 'planName', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.planName}</span> },
    { header: 'Code', accessor: 'planCode' },
    { header: 'Price', accessor: 'planPrice', render: (row) => `$${row.planPrice}` },
    { header: 'Billing Cycle', accessor: 'billingCycle' },
    { header: 'Trial Days', accessor: 'trialDays' },
    {
      header: 'Status', accessor: 'status', render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
          ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {row.status}
        </span>
      )
    },
  ];

  const actions = (row) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleDelete(row._id)}
        className="text-gray-500 hover:text-red-600 transition-colors"
        title="Delete"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Subscription Plans</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
        >
          <FiPlus /> Create Plan
        </button>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          LOADING...
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : (
        <DataTable columns={columns} data={plans} actions={actions} />
      )}

      {/* Create Plan Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setFormData(INITIAL_FORM); }} title="Create New Plan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput label="Plan Name" name="planName" value={formData.planName} required onChange={handleInputChange} />
          <FormInput label="Plan Code" name="planCode" value={formData.planCode} placeholder="e.g., BASIC_MONTHLY" required onChange={handleInputChange} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Price ($)" name="planPrice" value={formData.planPrice} type="number" required onChange={handleInputChange} />
            <FormSelect
              label="Billing Cycle"
              name="billingCycle"
              value={formData.billingCycle}
              options={[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Trial Days" name="trialDays" value={formData.trialDays} type="number" onChange={handleInputChange} />
            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]}
              onChange={handleInputChange}
            />
          </div>

          {/* Mutation Error */}
          {createMutation.isError && (
            <p className="text-sm text-red-600"> {createMutation.error?.message}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setFormData(INITIAL_FORM); }}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              {createMutation.isPending ? 'Saving...' : 'Save Plan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
