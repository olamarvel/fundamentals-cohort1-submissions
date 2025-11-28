import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi, teamsApi } from '../services/api';
import { Project, TeamMember } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [projectResponse, membersResponse] = await Promise.all([
        projectsApi.getById(id),
        teamsApi.getMembers()
      ]);

      setProject(projectResponse.data);
      
      // Filter team members for this project
      const projectTeamMembers = membersResponse.data.filter(member =>
        projectResponse.data.teamMembers.includes(member.id)
      );
      setTeamMembers(projectTeamMembers);
    } catch (err) {
      setError('Failed to load project details');
      console.error('Project detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading project details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProjectDetail} />;
  if (!project) return <ErrorMessage message="Project not found" />;

  return (
    <div className="project-detail">
      <div className="breadcrumb">
        <Link to="/projects">Projects</Link> / {project.name}
      </div>

      <div className="project-header">
        <h1>{project.name}</h1>
        <span className={`status status-${project.status}`}>
          {project.status}
        </span>
      </div>

      <div className="project-content">
        <section className="project-info">
          <h2>Description</h2>
          <p>{project.description}</p>
          
          <div className="project-meta">
            <div className="meta-item">
              <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
            </div>
            <div className="meta-item">
              <strong>Last Updated:</strong> {new Date(project.updatedAt).toLocaleDateString()}
            </div>
            <div className="meta-item">
              <strong>Team Size:</strong> {project.teamMembers.length} members
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Team Members</h2>
          {teamMembers.length > 0 ? (
            <div className="team-grid">
              {teamMembers.map(member => (
                <div key={member.id} className="team-member-card">
                  <h4>{member.name}</h4>
                  <p className="role">{member.role}</p>
                  <p className="email">{member.email}</p>
                  <p className="timezone">{member.timezone}</p>
                  <span className={`status ${member.isActive ? 'active' : 'inactive'}`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>No team members assigned to this project.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProjectDetail;