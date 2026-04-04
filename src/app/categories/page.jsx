"use client";
import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import DataTable from '../../components/ui/DataTable';

const MOCK_CATEGORIES = [
  { id: 1, name: 'Burger', code: 'CAT_BURGER', parent: 'Fast Food', users: 145, status: 'active' },
  { id: 2, name: 'Pizza', code: 'CAT_PIZZA', parent: 'Fast Food', users: 120, status: 'active' },
  { id: 3, name: 'Beverages', code: 'CAT_BEV', parent: 'None', users: 340, status: 'active' },
  { id: 4, name: 'North Indian', code: 'CAT_NIND', parent: 'Main Course', users: 89, status: 'inactive' },
  { id: 5, name: 'Desserts', code: 'CAT_DSRT', parent: 'None', users: 210, status: 'active' },
];

export default function GlobalCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { 
      header: 'Category Name', 
      accessor: 'name', 
      render: (row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.name}</p>
          <p className="text-xs text-gray-500">{row.code}</p>
        </div>
      ) 
    },
    { 
      header: 'Parent Category', 
      accessor: 'parent',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {row.parent}
        </span>
      )
    },
    { header: 'Tenants Using It', accessor: 'users', render: (row) => <span className="font-medium text-indigo-600">{row.users}</span> },
    {
      header: 'Status', accessor: 'status', render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize
          ${row.status === 'active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {row.status}
        </span>
      )
    },
  ];

  const actions = (row) => (
    <div className="flex items-center justify-end gap-3">
      <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Edit">
        <FiEdit2 size={16} />
      </button>
      <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
        <FiTrash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Global Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage master taxonomy lists for all tenants.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none">
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            <FiFilter /> Filter
          </button>
        </div>

        <DataTable columns={columns} data={MOCK_CATEGORIES} actions={actions} />
      </div>
    </div>
  );
}
