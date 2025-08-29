import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HR Documents - Codestam ERP',
  description: 'Generate and manage HR documents including offer letters, employee handbooks, and more',
};

export default function HRDocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}