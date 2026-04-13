import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buchungsbestätigung',
  robots: { index: false, follow: false },
};

export default function BestaetigungLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
