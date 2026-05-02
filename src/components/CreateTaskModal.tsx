"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTaskModal({ projectId, role }: { projectId: string, role: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && role === 'ADMIN' && users.length === 0) {
      fetch('/api/users').then(res => res.json()).then(data => {
        if (Array.isArray(data)) setUsers(data);
      });
    }
  }, [isOpen, role, users.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          projectId, 
          assigneeId: assigneeId || null, 
          dueDate: dueDate || null 
        }),
      });

      if (res.ok) {
        setIsOpen(false);
        setTitle('');
        setDescription('');
        setAssigneeId('');
        setDueDate('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'ADMIN') return null;

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn">
        + New Task
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', animation: 'fadeIn 0.2s ease-out' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Create New Task</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Task Title</label>
                <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input-field" value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Assignee</label>
                  <select className="input-field" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                    <option value="" style={{ color: 'black' }}>Unassigned</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id} style={{ color: 'black' }}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Due Date</label>
                  <input type="date" className="input-field" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ colorScheme: 'dark' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} onClick={() => setIsOpen(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
