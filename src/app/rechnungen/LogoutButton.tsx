'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/session', { method: 'DELETE' });
    try {
      await signOut(getFirebaseAuth());
    } catch {
      /* ignore */
    }
    router.push('/admin-login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md px-3 py-1.5 text-sm text-text-muted hover:bg-secondary"
    >
      Abmelden
    </button>
  );
}
