'use client';

import { SettingsIcon } from '@/components/Icons';

export default function SettingsPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <SettingsIcon size={32} className="text-gray-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">System configuration and user preferences</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <SettingsIcon size={32} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings Panel Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We&apos;re building a comprehensive settings panel where you can configure system preferences, 
            manage user accounts, set up integrations, and customize your ERP experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">System Configuration</h3>
              <p className="text-sm text-gray-600">Configure system-wide settings and preferences</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Integrations</h3>
              <p className="text-sm text-gray-600">Set up third-party integrations and APIs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}