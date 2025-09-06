import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatsApp Business - Codestam ERP',
  description: 'WhatsApp Business integration for customer communication',
};

export default function WhatsAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}