import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import TodoTab from './TodoTab';
import ProjectForm from './forms/ProjectForm';

const ProjectManagementTab = ({ projects, clients, isLoading, fetchProjects, setProjects }) => {
  const [currentTab, setCurrentTab] = useState('kanban');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const kanbanColumns = ['Briefing', 'In Progress', 'Revision', 'Completed'];

  const handleSaveProject = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        const { error } = await supabase
          .from('studio_projects')
          .update(formData)
          .eq('id', editingProject.id);

        if (error) throw error;

        setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...formData } : p));
        alert('Data internal proyek berhasil dikonfigurasi ulang.');
        setEditingProject(null);
      } else {
        const { data, error } = await supabase
          .from('studio_projects')
          .insert([formData])
          .select();

        if (error) throw error;

        setProjects([data[0], ...projects]);
        alert('Proyek baru berhasil diluncurkan.');
      }
      setIsFormOpen(false);
    } catch (err) {
      alert('Gagal memproses operasi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatusQuick = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('studio_projects').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert('Gagal memperbarui status: ' + err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Hapus rekaman proyek ini secara permanen?")) return;
    try {
      const { error } = await supabase.from('studio_projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Gagal menghapus proyek: ' + err.message);
    }
  };

  const getStatusBadgeStyle = (statusStr) => {
    switch (statusStr) {
      case 'Briefing': return 'bg-dark/5 text-dark/60 border-dark/10';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Revision': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-dark/5 text-dark';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredBySearch = projects.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function startEditing(project) {
    setEditingProject(project);
    setIsFormOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-dark/10 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-medium tracking-tight uppercase">
            {isFormOpen || editingProject ? 'Project Editor' : 'Project Management'}
          </h2>
          <p className="text-xs text-dark/40 mt-1">
            {isFormOpen || editingProject 
              ? 'Formulir parameters dan integrasi data workspace produksi.' 
              : 'Pantau progress produksi studio dan kelola checklist tugas harian internal.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
          {!(isFormOpen || editingProject) && (
            <div className="flex bg-dark/5 p-1 rounded-full border border-dark/5">
              <button onClick={() => setCurrentTab('kanban')} className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${currentTab === 'kanban' ? 'bg-white text-dark shadow-sm' : 'text-dark/40 hover:text-dark'}`}>
                Kanban Board
              </button>
              <button onClick={() => setCurrentTab('todolist')} className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${currentTab === 'todolist' ? 'bg-white text-dark shadow-sm' : 'text-dark/40 hover:text-dark'}`}>
                To-Do List
              </button>
            </div>
          )}
          <div className="flex gap-2 ms-auto xl:ms-0">
            {currentTab === 'kanban' && (
              <button 
                onClick={() => {
                  if (isFormOpen || editingProject) {
                    setIsFormOpen(false);
                    setEditingProject(null);
                  } else {
                    setIsFormOpen(true);
                  }
                }} 
                className="bg-dark text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:bg-dark/80 whitespace-nowrap"
              >
                {isFormOpen || editingProject ? '← Back to Board' : 'Add Project'}
              </button>
            )}
            {!(isFormOpen || editingProject) && (
              <button onClick={fetchProjects} className="border border-dark/10 hover:border-dark text-dark px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap">
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONDITIONAL LAYOUT SWAP EXECUTED HERE */}
      <AnimatePresence mode="wait">
        {isFormOpen || editingProject ? (
          <motion.div 
            key="form-page-view"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <ProjectForm 
              project={editingProject}
              clients={clients}
              isSubmitting={isSubmitting}
              onSave={handleSaveProject}
              onClose={() => {
                setIsFormOpen(false);
                setEditingProject(null);
              }}
            />
          </motion.div>
        ) : currentTab === 'kanban' ? (
          <motion.div 
            key="kanban-board-view" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="space-y-6"
          >
            {/* SUB-NAV FILTER & SEARCH */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#fafafa] p-3 rounded-2xl border border-dark/5">
              <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {['All', ...kanbanColumns].map((tab) => (
                  <button key={tab} onClick={() => setFilterStatus(tab)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${filterStatus === tab ? 'bg-dark text-white' : 'text-dark/40 hover:text-dark bg-dark/5'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="SEARCH PROJECT OR CLIENT..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-72 bg-white border border-dark/10 focus:border-dark outline-none py-2 px-4 text-[10px] font-bold tracking-widest text-dark rounded-xl uppercase transition-all placeholder:text-dark/20"
              />
            </div>

            {/* KANBAN GRID COLUMNS */}
            {isLoading ? (
              <div className="text-xs font-bold uppercase tracking-widest text-dark/30 py-20 text-center">Synchronizing workflow records...</div>
            ) : (
              <div className={`flex ${filterStatus === 'All' ? 'overflow-x-auto pb-4' : 'justify-center'} gap-6 items-start scrollbar-thin`}>
                {kanbanColumns.map((col) => {
                  if (filterStatus !== 'All' && filterStatus !== col) return null;
                  const columnProjects = filteredBySearch.filter(p => p.status === col);

                  return (
                    <div key={col} className={`bg-[#fafafa] rounded-2xl border border-dark/5 p-4 space-y-4 shrink-0 transition-all ${filterStatus === 'All' ? 'w-[310px]' : 'w-full max-w-2xl'}`}>
                      <div className="flex justify-between items-center border-b border-dark/5 pb-2">
                        <span className="text-[10px] font-bold tracking-widest text-dark/40 uppercase font-mono">{col}</span>
                        <span className="bg-dark/5 text-dark text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">{columnProjects.length}</span>
                      </div>

                      <div className="space-y-4 min-h-[350px]">
                        {columnProjects.length === 0 ? (
                          <div className="text-[10px] font-bold uppercase tracking-wider text-dark/20 text-center py-20 border border-dashed border-dark/5 rounded-xl">No Projects Found</div>
                        ) : (
                          columnProjects.map((project) => (
                            <div key={project.id} className="bg-white p-5 rounded-xl border border-dark/10 hover:border-dark/20 transition-all shadow-sm space-y-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[9px] font-bold text-dark/30 tracking-widest uppercase">{project.category}</span>
                                  <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border ${getStatusBadgeStyle(project.status)}`}>
                                    {project.status}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold tracking-wide text-dark uppercase break-words leading-tight">{project.title}</h4>
                                <p className="text-[11px] text-dark/40 font-medium">Client: <span className="text-dark/70 font-semibold">{project.client_name}</span></p>
                              </div>

                              {project.notes && (
                                <p className="text-[11px] text-dark/60 bg-[#fafafa] p-3 rounded-lg border border-dark/5 whitespace-pre-line leading-relaxed max-h-[90px] overflow-y-auto">
                                  "{project.notes}"
                                </p>
                              )}

                              {project.links && project.links.length > 0 && (
                                <div className="flex flex-wrap gap-1 items-center pt-1">
                                  {project.links.map((link, lIdx) => (
                                    <a key={lIdx} href={link.url} target="_blank" rel="noreferrer" className="text-[9px] bg-dark/5 font-bold uppercase tracking-wider text-dark/80 hover:bg-dark hover:text-white transition-all px-2.5 py-1 rounded border border-dark/5">
                                      {link.category} ↗
                                    </a>
                                  ))}
                                </div>
                              )}

                              <div className="space-y-1 border-t border-dark/5 pt-3 text-[9px] font-bold tracking-wider uppercase text-dark/30">
                                <div className="flex justify-between"><span>Start:</span> <span className="text-dark/60 font-mono">{formatDate(project.start_date)}</span></div>
                                <div className="flex justify-between"><span>Target:</span> <span className="text-dark/60 font-mono">{formatDate(project.deadline)}</span></div>
                                {project.end_date && (
                                  <div className="flex justify-between"><span>Done:</span> <span className="text-dark/60 font-mono">{formatDate(project.end_date)}</span></div>
                                )}
                              </div>

                              <div className="flex items-center justify-between gap-2 pt-3 border-t border-dark/5">
                                <select value={project.status} onChange={(e) => handleUpdateStatusQuick(project.id, e.target.value)} className="bg-white border border-dark/10 p-2 rounded-lg text-[10px] font-bold uppercase tracking-wider outline-none focus:border-dark cursor-pointer">
                                  {kanbanColumns.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                
                                <div className="flex gap-1 shrink-0">
                                  <button onClick={() => startEditing(project)} className="text-[10px] font-bold uppercase tracking-widest border border-dark/10 hover:border-dark text-dark px-2.5 py-1.5 rounded-lg transition-all">
                                    Edit
                                  </button>
                                  <button onClick={() => handleDeleteProject(project.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-600 px-2 py-1.5 transition-all">
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="todo-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TodoTab projects={projects} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectManagementTab;