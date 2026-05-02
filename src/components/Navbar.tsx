"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
      <Link href="/dashboard" style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Team Task Manager
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ fontWeight: 500, color: '#cbd5e1' }}>Dashboard</Link>
        <Link href="/projects" style={{ fontWeight: 500, color: '#cbd5e1' }}>Projects</Link>
        <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Logout</button>
      </div>
    </nav>
  );
}
