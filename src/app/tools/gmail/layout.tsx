import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gmail Integration - Codestam ERP',
  description: 'Gmail integration for email marketing and communication',
};

export default function GmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}