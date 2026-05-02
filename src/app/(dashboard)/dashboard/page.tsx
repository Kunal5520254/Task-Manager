import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AutoRefresh from '@/components/AutoRefresh';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) return null;

  const tasks = await prisma.task.findMany({
    where: { assigneeId: session.userId },
    include: { project: { select: { name: true } } },
    orderBy: { dueDate: 'asc' }
  });

  const todo = tasks.filter(t => t.status === 'TODO');
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
  const done = tasks.filter(t => t.status === 'DONE');
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');

  return (
    <div>
      <AutoRefresh intervalMs={10000} />
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 700 }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid #818cf8' }}>
          <h3 style={{ color: '#cbd5e1', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>To Do</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#818cf8', marginTop: '0.5rem' }}>{todo.length}</p>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid #facc15' }}>
          <h3 style={{ color: '#cbd5e1', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#facc15', marginTop: '0.5rem' }}>{inProgress.length}</p>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid #4ade80' }}>
          <h3 style={{ color: '#cbd5e1', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Done</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4ade80', marginTop: '0.5rem' }}>{done.length}</p>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ color: '#ef4444', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overdue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ef4444', marginTop: '0.5rem' }}>{overdue.length}</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Your Assigned Tasks</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.length === 0 ? (
          <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            <p>You have no tasks assigned at the moment.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="glass" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.35rem', fontWeight: 600 }}>{task.title}</h4>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  Project: <span style={{ color: '#cbd5e1' }}>{task.project.name}</span> 
                  {task.dueDate && ` • Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <span style={{ 
                  padding: '0.35rem 0.85rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem', 
                  fontWeight: 'bold',
                  background: task.status === 'DONE' ? 'rgba(74, 222, 128, 0.15)' : task.status === 'IN_PROGRESS' ? 'rgba(250, 204, 21, 0.15)' : 'rgba(129, 140, 248, 0.15)',
                  color: task.status === 'DONE' ? '#4ade80' : task.status === 'IN_PROGRESS' ? '#facc15' : '#818cf8',
                  border: `1px solid ${task.status === 'DONE' ? 'rgba(74, 222, 128, 0.3)' : task.status === 'IN_PROGRESS' ? 'rgba(250, 204, 21, 0.3)' : 'rgba(129, 140, 248, 0.3)'}`
                }}>
                  {task.status.replace('_', ' ')}
                </span>
                <Link href={`/projects/${task.projectId}`} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  View Project
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
