import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi, teamsApi } from '../services/api';
import { Project, TeamMember } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectsResponse, membersResponse] = await Promise.all([
        projectsApi.getAll(),
        teamsApi.getMembers()
      ]);

      setProjects(projectsResponse.data);
      setTeamMembers(membersResponse.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

  const activeProjects = projects.filter(p => p.status === 'active');
  const activeMembers = teamMembers.filter(m => m.isActive);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <div className="stat-number">{projects.length}</div>
          <Link to="/projects" className="stat-link">View all projects</Link>
        </div>
        
        <div className="stat-card">
          <h3>Active Projects</h3>
          <div className="stat-number">{activeProjects.length}</div>
        </div>
        
        <div className="stat-card">
          <h3>Team Members</h3>
          <div className="stat-number">{activeMembers.length}</div>
          <Link to="/team" className="stat-link">View team</Link>
        </div>
        
        <div className="stat-card">
          <h3>Timezones</h3>
          <div className="stat-number">{new Set(activeMembers.map(m => m.timezone)).size}</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="recent-projects">
          <h2>Recent Projects</h2>
          <div className="project-list">
            {activeProjects.slice(0, 3).map(project => (
              <div key={project.id} className="project-card">
                <h3>
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                </h3>
                <p>{project.description}</p>
                <div className="project-meta">
                  <span className={`status status-${project.status}`}>
                    {project.status}
                  </span>
                  <span className="team-count">
                    {project.teamMembers.length} members
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="team-overview">
          <h2>Team Overview</h2>
          <div className="team-grid">
            {activeMembers.slice(0, 4).map(member => (
              <div key={member.id} className="team-card">
                <h4>{member.name}</h4>
                <p className="role">{member.role}</p>
                <p className="timezone">{member.timezone}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;