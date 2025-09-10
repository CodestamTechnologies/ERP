import { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
import RightStickyPanel from '@/components/layout/RightStickyPanel';
import { DashboardProvider } from '@/context/DashboardContext/DashboardContextProvider';

export const metadata: Metadata = {
  title: 'Dashboard - Codestam ERP',
  description: 'Main dashboard for business overview and analytics',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      <DashboardProvider>
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </DashboardProvider>

      {/* Right Sticky Panel */}
      <RightStickyPanel />
    </div>
  );
}