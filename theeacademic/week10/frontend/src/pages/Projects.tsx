import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../services/api';
import { Project } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectsApi.getAll(statusFilter || undefined);
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  if (loading) return <LoadingSpinner message="Loading projects..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProjects} />;

  return (
    <div className="projects">
      <div className="page-header">
        <h1>Projects</h1>
        <div className="filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>
                <Link to={`/projects/${project.id}`}>{project.name}</Link>
              </h3>
              <span className={`status status-${project.status}`}>
                {project.status}
              </span>
            </div>
            
            <p className="project-description">{project.description}</p>
            
            <div className="project-footer">
              <div className="team-info">
                <span className="team-count">
                  {project.teamMembers.length} team members
                </span>
              </div>
              <div className="project-dates">
                <small>
                  Updated: {new Date(project.updatedAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <h3>No projects found</h3>
          <p>
            {statusFilter 
              ? `No projects with status "${statusFilter}"`
              : 'No projects available'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Projects;