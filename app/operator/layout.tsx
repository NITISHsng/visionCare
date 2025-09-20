import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Operator Dashboard - Kachakali Vision Care',
  description: 'Operator dashboard for managing appointments and patients',
};

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}