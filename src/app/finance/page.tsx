'use client';

import { FinanceIcon } from '@/components/Icons';

export default function FinancePage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FinanceIcon size={32} className="text-green-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
          </div>
          <p className="text-gray-600">Financial planning, budgeting, and expense tracking</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FinanceIcon size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Finance Module Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We&apos;re developing comprehensive financial management tools to help you track expenses, 
            manage budgets, generate financial reports, and monitor cash flow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Budget Management</h3>
              <p className="text-sm text-gray-600">Create and monitor departmental budgets</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Expense Tracking</h3>
              <p className="text-sm text-gray-600">Track and categorize business expenses</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Financial Reports</h3>
              <p className="text-sm text-gray-600">Generate P&L, balance sheets, and cash flow reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}