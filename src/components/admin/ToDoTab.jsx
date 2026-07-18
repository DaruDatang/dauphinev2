import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const TodoTab = ({ projects }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
    fetchTasks();
  }, [projects]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('studio_tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      alert('Gagal memuat check-list tugas: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !selectedProjectId) return;

    try {
      const { data, error } = await supabase
        .from('studio_tasks')
        .insert([{
          project_id: selectedProjectId,
          text: newTaskText,
          completed: false
        }])
        .select();

      if (error) throw error;
      setTasks([...tasks, data[0]]);
      setNewTaskText('');
    } catch (err) {
      alert('Gagal menambah tugas: ' + err.message);
    }
  };

  const handleToggleTask = async (taskId, currentCompletedStatus) => {
    try {
      const { error } = await supabase
        .from('studio_tasks')
        .update({ completed: !currentCompletedStatus })
        .eq('id', taskId);

      if (error) throw error;
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !currentCompletedStatus } : t));
    } catch (err) {
      alert('Gagal memperbarui status tugas: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('studio_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      alert('Gagal menghapus tugas: ' + err.message);
    }
  };

  const inputClass = "w-full bg-white border border-dark/10 focus:border-dark outline-none p-3.5 text-dark text-sm rounded-xl transition-all placeholder:text-dark/20";
  const labelClass = "text-[10px] font-bold uppercase tracking-widest text-dark/40 block mb-1.5 ms-1";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1 bg-[#fafafa] rounded-2xl border border-dark/5 p-6 space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-dark">Add New Task</h3>
          <p className="text-[11px] text-dark/40 mt-0.5">Sematkan tugas baru ke dalam sub-proyek produksi aktif.</p>
        </div>

        {projects.length === 0 ? (
          <p className="text-xs font-medium text-dark/40 italic">Buat proyek terlebih dahulu sebelum menambahkan tugas.</p>
        ) : (
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="space-y-1">
              <label className={labelClass}>Select Project Reference</label>
              <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className={inputClass}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title} ({p.client_name})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Task Action Plan</label>
              <input 
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="e.g. Export assets to SVG format"
                required
                className={inputClass}
              />
            </div>

            <button type="submit" className="w-full bg-dark text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-dark/90 transition-all">
              Add To Checklist
            </button>
          </form>
        )}
      </div>

      <div className="lg:col-span-2 space-y-6">
        {isLoading ? (
          <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Assembling checklist framework...</div>
        ) : projects.length === 0 ? (
          <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">No active workspace deployment detected.</div>
        ) : (
          projects.map(project => {
            const projectTasks = tasks.filter(t => t.project_id === project.id);
            const completedCount = projectTasks.filter(t => t.completed).length;
            const percentage = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;

            return (
              <div key={project.id} className="bg-white rounded-2xl border border-dark/10 p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark/5 pb-3">
                  <div>
                    <span className="text-[9px] font-mono font-bold bg-dark text-white px-2 py-0.5 rounded uppercase tracking-widest">{project.category}</span>
                    <h3 className="text-sm font-bold text-dark uppercase tracking-wide mt-1.5">{project.title}</h3>
                    <p className="text-[11px] text-dark/40">Client: {project.client_name}</p>
                  </div>
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 min-w-[80px]">
                    <span className="text-[10px] font-mono text-dark/40 font-bold uppercase tracking-wider">{project.status}</span>
                    <span className="text-[10px] font-mono font-bold text-dark">{completedCount}/{projectTasks.length} Done ({percentage}%)</span>
                  </div>
                </div>

                <div className="w-full bg-dark/5 h-1 rounded-full overflow-hidden">
                  <div className="bg-dark h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                </div>

                <div className="divide-y divide-dark/5">
                  {projectTasks.length === 0 ? (
                    <p className="text-[11px] font-medium text-dark/30 py-3 italic">Belum ada rincian tugas untuk proyek produksi ini.</p>
                  ) : (
                    projectTasks.map(task => (
                      <div key={task.id} className="flex justify-between items-center py-3.5 group">
                        <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                          <input 
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id, task.completed)}
                            className="w-4 h-4 rounded border-dark/20 text-dark focus:ring-transparent accent-dark cursor-pointer"
                          />
                          <span className={`text-xs font-medium transition-all ${task.completed ? 'line-through text-dark/30' : 'text-dark/80'}`}>
                            {task.text}
                          </span>
                        </label>
                        
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all pl-2"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodoTab;