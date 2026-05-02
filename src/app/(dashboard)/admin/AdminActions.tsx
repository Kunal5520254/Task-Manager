"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
};

type Project = {
  id: string;
  name: string;
};

type AdminActionsProps = {
  user: User;
  projects: Project[];
};

export default function AdminActions({ user, projects }: AdminActionsProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<'NONE' | 'TASK' | 'PROJECT'>('NONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProjectId, setTaskProjectId] = useState(projects[0]?.id || '');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Project form state
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const close = () => {
    setActiveModal('NONE');
    setError('');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskProjectId) {
      setError('Please select a project first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDesc,
          projectId: taskProjectId,
          assigneeId: user.id,
          dueDate: taskDueDate || null
        })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      close();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          description: projectDesc,
          ownerId: user.id
        })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      close();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button 
          onClick={() => setActiveModal('TASK')} 
          className="btn" 
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(129, 140, 248, 0.2)', border: '1px solid rgba(129, 140, 248, 0.5)' }}
        >
          Assign Task
        </button>
        <button 
          onClick={() => setActiveModal('PROJECT')} 
          className="btn" 
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(74, 222, 128, 0.2)', border: '1px solid rgba(74, 222, 128, 0.5)' }}
        >
          Assign Project
        </button>
      </div>

      {activeModal === 'TASK' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold' }}>Assign Task to {user.name}</h2>
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Task Title</label>
                <input required type="text" className="input-field" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
              </div>
              <div>
                <label className="label">Project</label>
                <select required className="input-field" value={taskProjectId} onChange={e => setTaskProjectId(e.target.value)}>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  {projects.length === 0 && <option value="" disabled>No projects exist. Please assign a project first.</option>}
                </select>
              </div>
              <div>
                <label className="label">Description (optional)</label>
                <textarea className="input-field" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
              </div>
              <div>
                <label className="label">Due Date (optional)</label>
                <input type="date" className="input-field" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn" disabled={loading || projects.length === 0}>
                  {loading ? 'Assigning...' : 'Assign Task'}
                </button>
                <button type="button" className="btn" onClick={close} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'PROJECT' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 'bold' }}>Assign Project to {user.name}</h2>
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Project Name</label>
                <input required type="text" className="input-field" value={projectName} onChange={e => setProjectName(e.target.value)} />
              </div>
              <div>
                <label className="label">Description (optional)</label>
                <textarea className="input-field" value={projectDesc} onChange={e => setProjectDesc(e.target.value)} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Assigning...' : 'Assign Project'}
                </button>
                <button type="button" className="btn" onClick={close} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
