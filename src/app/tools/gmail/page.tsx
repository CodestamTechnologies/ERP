'use client';

export default function GmailPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">Gmail Integration</h1>
          </div>
          <p className="text-gray-600">Email marketing and communication management</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819l6.545 4.91 6.545-4.91h3.819A1.636 1.636 0 0 1 24 5.457z"/>
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gmail Integration Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            We're working on integrating Gmail functionality to help you manage your email communications, 
            track email campaigns, and analyze email performance metrics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Email Campaigns</h3>
              <p className="text-sm text-gray-600">Create and manage email marketing campaigns</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Track open rates, click rates, and engagement</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Contact Management</h3>
              <p className="text-sm text-gray-600">Organize and segment your email contacts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}