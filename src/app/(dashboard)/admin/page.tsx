import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AdminActions from './AdminActions';
import AdminUnlockForm from './AdminUnlockForm';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const cookieStore = await cookies();
  const isUnlocked = cookieStore.has('admin_unlocked');

  if (!isUnlocked) {
    return <AdminUnlockForm />;
  }

  // Fetch all users
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { tasksAssigned: true, projects: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch all projects (needed for assigning tasks to users under specific projects)
  const projects = await prisma.project.findMany({
    select: { id: true, name: true }
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 700 }}>Admin Panel</h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Manage users, assign projects, and delegate tasks.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {users.map(user => (
          <div key={user.id} className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{user.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{user.email}</p>
              </div>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px', 
                fontSize: '0.75rem', 
                fontWeight: 'bold',
                background: user.role === 'ADMIN' ? 'rgba(250, 204, 21, 0.15)' : 'rgba(129, 140, 248, 0.15)',
                color: user.role === 'ADMIN' ? '#facc15' : '#818cf8',
              }}>
                {user.role}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flex: 1 }}>
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' }}>Projects</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e2e8f0' }}>{user._count.projects}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold' }}>Tasks</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e2e8f0' }}>{user._count.tasksAssigned}</p>
              </div>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <AdminActions user={user} projects={projects} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
