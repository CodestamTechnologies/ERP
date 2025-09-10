import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hub Track Pro - Codestam ERP',
  description: 'Advanced hub management and shipment tracking system',
};

export default function HubTrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}