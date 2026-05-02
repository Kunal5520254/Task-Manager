import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import CreateProjectModal from '@/components/CreateProjectModal';

export default async function Projects() {
  const session = await getSession();
  if (!session) return null;

  const projects = await prisma.project.findMany({
    include: {
      owner: { select: { name: true } },
      _count: { select: { tasks: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Projects</h1>
        {session.role === 'ADMIN' && <CreateProjectModal />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map(project => (
          <Link href={`/projects/${project.id}`} key={project.id} style={{ display: 'block' }}>
            <div className="glass" style={{ padding: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer', height: '100%' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#f8fafc' }}>{project.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {project.description || 'No description provided.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#cbd5e1' }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>{project._count.tasks} Tasks</span>
                <span>Owner: {project.owner.name}</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <p style={{ color: '#94a3b8', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
            No projects available.
          </p>
        )}
      </div>
    </div>
  );
}
