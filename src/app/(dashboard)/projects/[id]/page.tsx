import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TaskBoard from '@/components/TaskBoard';
import CreateTaskModal from '@/components/CreateTaskModal';
import Link from 'next/link';

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true } },
      tasks: {
        include: { assignee: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!project) return notFound();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/projects" style={{ color: '#818cf8', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', marginBottom: '1rem', transition: 'color 0.2s' }}>
          ← Back to Projects
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.name}</h1>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '800px', lineHeight: 1.6 }}>{project.description}</p>
          </div>
          <CreateTaskModal projectId={project.id} role={session.role} />
        </div>
      </div>

      <TaskBoard tasks={project.tasks} role={session.role} />
    </div>
  );
}
