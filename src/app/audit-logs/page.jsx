"use client";
import React from 'react';
import { FiActivity, FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const MOCK_LOGS = [
  { id: 'AL-1029', admin: 'Neha Sharma', role: 'Super Admin', action: 'TENANT_SUSPENDED', target: 'Zudio Retail', ip: '192.168.1.45', time: '10:45 AM, Today', risk: 'high' },
  { id: 'AL-1028', admin: 'Rahul Dev', role: 'Support Staff', action: 'PLAN_UPDATED', target: 'Plan: Pro Limit', ip: '10.0.0.12', time: '09:12 AM, Today', risk: 'medium' },
  { id: 'AL-1027', admin: 'System', role: 'Automated Bot', action: 'DB_CREATED', target: 'Tenant: XYZ Corp', ip: 'localhost', time: '02:00 AM, Today', risk: 'low' },
  { id: 'AL-1026', admin: 'Neha Sharma', role: 'Super Admin', action: 'ROLE_MODIFIED', target: 'Platform Roles', ip: '192.168.1.45', time: 'Yesterday', risk: 'high' },
  { id: 'AL-1025', admin: 'Finance Mgr', role: 'Finance', action: 'INVOICE_GENERATED', target: 'All Active Tenants', ip: '192.168.1.110', time: 'Yesterday', risk: 'low' },
];

export default function AuditLogsPage() {
  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'high': return <FiAlertTriangle className="text-red-500" />;
      case 'medium': return <FiShield className="text-yellow-500" />;
      default: return <FiCheckCircle className="text-green-500" />;
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FiActivity className="text-indigo-600" /> Platform Audit Logs
          </h1>
          <p className="text-gray-500 text-sm mt-1">Immutable record of all administrative actions taken on the platform.</p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Export as CSV
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 grid grid-cols-12 gap-4 uppercase">
          <div className="col-span-3">User / Admin</div>
          <div className="col-span-3">Action Completed</div>
          <div className="col-span-3">Target Details</div>
          <div className="col-span-2">IP Address</div>
          <div className="col-span-1 text-right">Time</div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {MOCK_LOGS.map((log) => (
            <div key={log.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                  {log.admin.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{log.admin}</p>
                  <p className="text-xs text-gray-500">{log.role}</p>
                </div>
              </div>
              
              <div className="col-span-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${getRiskColor(log.risk)}`}>
                  {getRiskIcon(log.risk)}
                  {log.action}
                </span>
              </div>

              <div className="col-span-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                {log.target}
              </div>

              <div className="col-span-2 text-xs font-mono text-gray-500 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded w-fit">
                {log.ip}
              </div>

              <div className="col-span-1 text-right text-xs text-gray-400 whitespace-nowrap">
                {log.time}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <button className="text-indigo-600 font-medium text-sm hover:underline">Load More Logs...</button>
        </div>
      </div>
    </div>
  );
}
