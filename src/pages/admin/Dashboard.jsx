import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import SEO from '../../components/common/SEO';

import Sidebar from '../../components/admin/Sidebar';
import EmailLogsTab from '../../components/admin/EmailLogsTab';
import ClientFeedbackTab from '../../components/admin/ClientFeedbackTab';
import SettingsTab from '../../components/admin/SettingsTab';
import ProjectManagementTab from '../../components/admin/ProjectManagementTab'; 
import ClientPerformanceTab from '../../components/admin/ClientPerformanceTab';
import WebsitePerformanceTab from '../../components/admin/WebsitePerformanceTab';
import ClientsTab from '../../components/admin/ClientsTab';
import LeadsTab from '../../components/admin/LeadsTab';
import InvoicesTab from '../../components/admin/InvoicesTab';
import ProposalsTab from '../../components/admin/ProposalsTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('web-performance'); 
  const [inquiries, setInquiries] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [projects, setProjects] = useState([]); 
  const [clients, setClients] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false); 
  const [isClientsLoading, setIsClientsLoading] = useState(false);
  const [isProposalsLoading, setIsProposalsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const guardAdminPanel = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/dauphine-admin/login');
      } else {
        fetchInquiries();
        fetchFeedbacks();
        fetchProjects(); 
        fetchClients();
        fetchProposals();
      }
    };
    guardAdminPanel();
  }, [navigate]);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInquiries(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    setIsFeedbackLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setFeedbacks(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const fetchProjects = async () => {
    setIsProjectsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('studio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProjects(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  const fetchClients = async () => {
    setIsClientsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('studio_clients')
        .select('*')
        .order('company_name', { ascending: true });

      if (fetchError) throw fetchError;
      setClients(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsClientsLoading(false);
    }
  };

  const fetchProposals = async () => {
    setIsProposalsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('studio_proposals')
        .select('*, studio_leads(*)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProposals(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsProposalsLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!window.confirm("Are you sure you want to sign out?")) return;
    await supabase.auth.signOut();
    navigate('/dauphine-admin/login');
  };

  const unreadCount = inquiries.filter(item => !item.is_read).length;
  const proposalCount = proposals.filter(item => item.deal_status === 'Proposed').length;

  return (
    <div className="bg-white min-h-screen flex text-dark selection:bg-dark selection:text-white">
      <SEO title="Studio Management - Dauphiné" description="Admin management panel." />
      
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        feedbackCount={feedbacks.length}
        projectCount={projects.length}
        proposalCount={proposalCount}
        handleSignOut={handleSignOut}
      />

      <div className="flex-grow pl-64 md:pl-80 w-full">
        <div className="max-w-[1100px] mx-auto p-8 md:p-12 w-full">
          
          <AnimatePresence mode="wait">

            {activeTab === 'web-performance' && (
              <WebsitePerformanceTab />
            )}
            
            {activeTab === 'performance' && (
              <ClientPerformanceTab 
                projects={projects}
                feedbacks={feedbacks}
                inquiries={inquiries}
              />
            )}

            {activeTab === 'email' && (
              <EmailLogsTab 
                inquiries={inquiries}
                isLoading={isLoading}
                fetchInquiries={fetchInquiries}
                setInquiries={setInquiries}
              />
            )}

            {activeTab === 'proposals' && (
              <ProposalsTab 
                proposals={proposals}
                isLoading={isProposalsLoading}
                fetchProposals={fetchProposals}
                setProposals={setProposals}
              />
            )}

            {activeTab === 'feedback' && (
              <ClientFeedbackTab 
                feedbacks={feedbacks}
                isFeedbackLoading={isFeedbackLoading}
                fetchFeedbacks={fetchFeedbacks}
                setFeedbacks={setFeedbacks}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectManagementTab 
                projects={projects}
                clients={clients}
                isLoading={isProjectsLoading}
                fetchProjects={fetchProjects}
                setProjects={setProjects}
              />
            )}

            {activeTab === 'clients' && (
              <ClientsTab 
                clients={clients}
                isLoading={isClientsLoading}
                fetchClients={fetchClients}
                setClients={setClients}
              />
            )}

            {activeTab === 'leads' && (
              <LeadsTab />
            )}

            {activeTab === 'invoices' && (
              <InvoicesTab 
                projects={projects}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab />
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;