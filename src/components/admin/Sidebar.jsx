import React, { useState } from 'react';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  unreadCount, 
  feedbackCount, 
  projectCount, 
  proposalCount = 0,
  handleSignOut 
}) => {
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(
    activeTab === 'web-performance' || activeTab === 'performance'
  );
  const [isProjectsOpen, setIsProjectsOpen] = useState(
    activeTab === 'projects' || activeTab === 'clients' || activeTab === 'leads'
  );
  const [isMessagesOpen, setIsMessagesOpen] = useState(
    activeTab === 'email' || activeTab === 'proposals'
  );

  const mainBtnClass = "w-full text-left px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex justify-between items-center outline-none";
  const subBtnClass = "w-full text-left px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex justify-between items-center outline-none";

  return (
    <div className="w-64 md:w-80 border-r border-dark/10 min-h-screen p-8 flex flex-col justify-between bg-white fixed left-0 top-0 h-full z-10 overflow-y-auto scrollbar-none">
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-medium tracking-tighter uppercase">Dauphiné Admin</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-dark/40 mt-1">Management Hub</p>
        </div>

        <nav className="flex flex-col space-y-1.5">
          
          <div>
            <button
              onClick={() => setIsPerformanceOpen(!isPerformanceOpen)}
              className={`${mainBtnClass} ${
                activeTab === 'web-performance' || activeTab === 'performance'
                  ? 'text-dark bg-dark/5'
                  : 'text-dark/50 hover:text-dark hover:bg-dark/5'
              }`}
            >
              <span>Performance</span>
              <span className={`text-[8px] transition-transform duration-200 ${isPerformanceOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isPerformanceOpen && (
              <div className="mt-1 ml-4 border-l border-dark/10 pl-2 space-y-1">
                <button
                  onClick={() => setActiveTab('web-performance')}
                  className={`${subBtnClass} ${activeTab === 'web-performance' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
                >
                  Website Performance
                </button>
                <button
                  onClick={() => setActiveTab('performance')}
                  className={`${subBtnClass} ${activeTab === 'performance' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
                >
                  Client Performance
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className={`${mainBtnClass} ${
                activeTab === 'projects' || activeTab === 'clients' || activeTab === 'leads'
                  ? 'text-dark bg-dark/5'
                  : 'text-dark/50 hover:text-dark hover:bg-dark/5'
              }`}
            >
              <span>Projects</span>
              <span className={`text-[8px] transition-transform duration-200 ${isProjectsOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isProjectsOpen && (
              <div className="mt-1 ml-4 border-l border-dark/10 pl-2 space-y-1">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`${subBtnClass} ${activeTab === 'projects' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
                >
                  <span>Project Management</span>
                  {projectCount > 0 && (
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${activeTab === 'projects' ? 'bg-white text-dark' : 'bg-dark/5 text-dark'}`}>{projectCount}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('clients')}
                  className={`${subBtnClass} ${activeTab === 'clients' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
                >
                  Clients Data
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`${subBtnClass} ${activeTab === 'leads' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
                >
                  Leads Data
                </button>
              </div>
            )}
          </div>

          {/* CLUSTER BARU: MESSAGES DROPDOWN */}
          <div>
            <button
              onClick={() => setIsMessagesOpen(!isMessagesOpen)}
              className={`${mainBtnClass} ${
                activeTab === 'email' || activeTab === 'proposals'
                  ? 'text-dark bg-dark/5'
                  : 'text-dark/50 hover:text-dark hover:bg-dark/5'
              }`}
            >
              <span>Messages</span>
              <span className={`text-[8px] transition-transform duration-200 ${isMessagesOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isMessagesOpen && (
              <div className="mt-1 ml-4 border-l border-dark/10 pl-2 space-y-1">
                <button
                  onClick={() => setActiveTab('email')}
                  className={`${subBtnClass} ${activeTab === 'email' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
                >
                  <span>Email Logs</span>
                  {unreadCount > 0 && (
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${activeTab === 'email' ? 'bg-white text-dark' : 'bg-red-500 text-white'}`}>{unreadCount}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`${subBtnClass} ${activeTab === 'proposals' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
                >
                  <span>Project Proposals</span>
                  {proposalCount > 0 && (
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${activeTab === 'proposals' ? 'bg-white text-dark' : 'bg-dark/5 text-dark'}`}>{proposalCount}</span>
                  )}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`${mainBtnClass} ${activeTab === 'feedback' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
          >
            <span>Client Feedback</span>
            {feedbackCount > 0 && (
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${activeTab === 'feedback' ? 'bg-white text-dark' : 'bg-dark/5 text-dark'}`}>{feedbackCount}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`${mainBtnClass} ${activeTab === 'invoices' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
          >
            Invoices
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`${mainBtnClass} ${activeTab === 'settings' ? 'bg-dark text-white shadow-sm' : 'text-dark/50 hover:text-dark hover:bg-dark/5'}`}
          >
            Settings
          </button>
        </nav>
      </div>

      <div className="pt-6 border-t border-dark/5 space-y-4">
        <button 
          onClick={handleSignOut} 
          className="w-full flex items-center justify-center gap-2 border border-red-200 hover:border-red-600 bg-red-50/20 hover:bg-red-50 text-red-600 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm"
        >
          <span>→</span>
          <span>Sign Out</span>
        </button>
        <p className="text-[9px] font-bold tracking-wider text-dark/20 text-center uppercase">
          ©2026 DAUPHINÉ CREATIVE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;