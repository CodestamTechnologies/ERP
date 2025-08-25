import { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
import RightStickyPanel from '@/components/layout/RightStickyPanel';

export const metadata: Metadata = {
  title: 'AI Insights - Codestam ERP',
  description: 'Advanced AI-powered business intelligence and predictive analytics',
};

export default function AIInsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Right Sticky Panel */}
      <RightStickyPanel />
    </div>
  );
}