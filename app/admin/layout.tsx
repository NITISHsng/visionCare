import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Kachakali Vision Care',
  description: 'Administrative dashboard for managing clinic operations',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}