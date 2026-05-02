"use client";

import { useRouter } from 'next/navigation';

export default function TaskBoard({ tasks, role }: { tasks: any[], role: string }) {
  const router = useRouter();

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    router.refresh();
  };

  const columns = [
    { id: 'TODO', title: 'To Do', color: '#818cf8' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: '#facc15' },
    { id: 'DONE', title: 'Done', color: '#4ade80' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
      {columns.map(col => (
        <div key={col.id} className="glass" style={{ padding: '1.5rem', borderTop: `4px solid ${col.color}` }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
            {col.title}
            <span style={{ fontSize: '0.875rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
              {tasks.filter(t => t.status === col.id).length}
            </span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.filter(t => t.status === col.id).map(task => (
              <div key={task.id} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '1.1rem' }}>{task.title}</h4>
                {task.description && <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.75rem', lineHeight: 1.5 }}>{task.description}</p>}
                
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span>Assignee: <strong style={{ color: 'white' }}>{task.assignee ? task.assignee.name : 'Unassigned'}</strong></span>
                  {task.dueDate && <span>Due: <strong style={{ color: 'white' }}>{new Date(task.dueDate).toLocaleDateString()}</strong></span>}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {col.id !== 'TODO' && (
                    <button onClick={() => handleStatusChange(task.id, col.id === 'DONE' ? 'IN_PROGRESS' : 'TODO')} style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}>
                      ← Move Back
                    </button>
                  )}
                  {col.id !== 'DONE' && (
                    <button onClick={() => handleStatusChange(task.id, col.id === 'TODO' ? 'IN_PROGRESS' : 'DONE')} style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', background: col.color, border: 'none', color: '#0f172a', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', transition: 'filter 0.2s' }}>
                      Move Next →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status === col.id).length === 0 && (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '1rem', fontSize: '0.875rem' }}>
                No tasks in this column.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
