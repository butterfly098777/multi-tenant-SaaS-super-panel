"use client";
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormInput from '../../components/ui/FormInput';
import CheckPermission from '../../components/ui/CheckPermission';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { fetchRoles, createRole, updateRole, deleteRole, roleKeys } from '../../api/superRolesApi';

const permissionsList = [
  { category: 'Dashboard', actions: ['View'] },
  { category: 'Tenants', actions: ['View', 'Create', 'Edit', 'Delete'] },
  { category: 'Plans', actions: ['View', 'Create', 'Edit'] },
  { category: 'Payments', actions: ['View', 'Configure'] },
  { category: 'Categories', actions: ['View'] },
  { category: 'Analytics', actions: ['View', 'Export'] },
  { category: 'Roles', actions: ['View', 'Edit', 'Delete', 'Create'] },
  { category: 'Notifications', actions: ['View'] },
  { category: 'Audit Logs', actions: ['View', 'Export'] },
  { category: 'Settings', actions: ['View'] }
];

const INITIAL_FORM_STATE = { roleName: '', roleEmail: '', rolePassword: '', description: '', permissions: {} };


export default function RolesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Focus: Query to fetch data
  const { data: roles = [], isLoading, isError } = useQuery({
    queryKey: roleKeys.all,
    queryFn: fetchRoles,
  });

  // Focus: Mutations for CUD operations
  const mutationCreate = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      closeModal();
    }
  });

  const mutationUpdate = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      closeModal();
    }
  });

  const mutationDelete = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    }
  });

  const openCreateModal = () => {
    setFormData(INITIAL_FORM_STATE);
    setIsEditMode(false);
    setEditingRoleId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    // Transform flat array permissions (from backend) to object needed by form if necessary.
    // For simplicity, we assume backend persists whatever we send. If we send an object: { "Dashboard": ["View"] } it stores it.
    let parsedPerms = role.permissions || {};
    // If backend stored it as Array of something else, handle here. Assuming it is stored as object for now based on user's frontend.
    if (Array.isArray(role.permissions) && role.permissions.length > 0 && typeof role.permissions[0] === 'object') {
      parsedPerms = role.permissions[0]; // Just a safety fallback if mongoose stored it as single object in array
    }

    setFormData({
      roleName: role.roleName || '',
      roleEmail: role.roleEmail || '',
      rolePassword: '', // leave empty for edit, user must type new password to update
      description: role.description || '',
      permissions: parsedPerms
    });
    setIsEditMode(true);
    setEditingRoleId(role._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(INITIAL_FORM_STATE);
    setIsEditMode(false);
    setEditingRoleId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (category, action) => {
    setFormData(prev => {
      const currentCategoryPerms = prev.permissions[category] || [];
      const newCategoryPerms = currentCategoryPerms.includes(action)
        ? currentCategoryPerms.filter(a => a !== action)
        : [...currentCategoryPerms, action];

      return {
        ...prev,
        permissions: { ...prev.permissions, [category]: newCategoryPerms }
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Create payload. Only send password if it was typed
      const payload = { id: editingRoleId, ...formData };
      if (!payload.rolePassword) {
        delete payload.rolePassword;
      }
      mutationUpdate.mutate(payload);
    } else {
      mutationCreate.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      mutationDelete.mutate(id);
    }
  };

  const columns = [
    { header: 'Role Name', accessor: 'roleName', render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.roleName}</span> },
    { header: 'Email', accessor: 'roleEmail' },
    { header: 'Description', accessor: 'description' },
    { header: 'Created', accessor: 'createdAt', render: (row) => <span>{new Date(row.createdAt).toLocaleDateString()}</span> },
  ];

  const actions = (row) => (
    <div className="flex gap-2">
      <CheckPermission category="Roles" action="Edit">
        <button onClick={() => openEditModal(row)} className="text-gray-500 hover:text-blue-600"><FiEdit2 size={18} /></button>
      </CheckPermission>
      <CheckPermission category="Roles" action="Delete">
        <button onClick={() => handleDelete(row._id)} className="text-gray-500 hover:text-red-600"><FiTrash2 size={18} /></button>
      </CheckPermission>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500 p-4 font-semibold text-center border mt-10 border-red-200 bg-red-50 rounded-lg">Failed to load roles. Ensure backend is running.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Roles & Permissions</h1>
        <CheckPermission category="Roles" action="Create">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
          >
            <FiPlus /> {isEditMode ? 'Edit Role' : 'Create Role'}
          </button>
        </CheckPermission>
      </div>

      <DataTable columns={columns} data={roles} actions={actions} />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditMode ? "Edit Role" : "Create New Role"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput label="Role Name" name="roleName" value={formData.roleName} required onChange={handleInputChange} />
          <FormInput label="Role Email" name="roleEmail" value={formData.roleEmail} type="email" required onChange={handleInputChange} />
          <FormInput label="Role Password" name="rolePassword" value={formData.rolePassword} required={!isEditMode} placeholder={isEditMode ? "Leave blank to keep current password" : ""} onChange={handleInputChange} />
          <FormInput label="Description" name="description" value={formData.description} onChange={handleInputChange} />

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 max-h-96 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                {permissionsList.map((perm) => (
                  <div key={perm.category} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center border-b last:border-0 border-gray-200 dark:border-gray-700 pb-3 last:pb-0">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{perm.category}</span>
                    <div className="col-span-3 flex flex-wrap gap-4">
                      {perm.actions.map((action) => {
                        // For backwards compatibility and safe-check with structure
                        let isChecked = false;
                        if (formData.permissions && !Array.isArray(formData.permissions) && formData.permissions[perm.category]) {
                          isChecked = formData.permissions[perm.category].includes(action);
                        }

                        return (
                          <label key={action} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                              checked={isChecked}
                              onChange={() => handlePermissionChange(perm.category, action)}
                            />
                            <span>{action}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutationCreate.isPending || mutationUpdate.isPending}
              className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 disabled:opacity-50"
            >
              {mutationCreate.isPending || mutationUpdate.isPending ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
