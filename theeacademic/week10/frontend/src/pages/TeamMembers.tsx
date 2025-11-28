import React, { useState, useEffect } from 'react';
import { teamsApi } from '../services/api';
import { TeamMember } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const TeamMembers: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('');

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const isActiveBoolean = activeFilter === 'true' ? true : activeFilter === 'false' ? false : undefined;
      const response = await teamsApi.getMembers(roleFilter || undefined, isActiveBoolean);
      setTeamMembers(response.data);
    } catch (err) {
      setError('Failed to load team members');
      console.error('Team members error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [roleFilter, activeFilter]);

  if (loading) return <LoadingSpinner message="Loading team members..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTeamMembers} />;

  const groupedByTimezone = teamMembers.reduce((acc, member) => {
    const timezone = member.timezone;
    if (!acc[timezone]) {
      acc[timezone] = [];
    }
    acc[timezone].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <div className="team-members">
      <div className="page-header">
        <h1>Team Members</h1>
        <div className="filters">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
            <option value="qa">QA</option>
          </select>
          
          <select 
            value={activeFilter} 
            onChange={(e) => setActiveFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Members</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="team-stats">
        <div className="stat">
          <strong>Total Members:</strong> {teamMembers.length}
        </div>
        <div className="stat">
          <strong>Active Members:</strong> {teamMembers.filter(m => m.isActive).length}
        </div>
        <div className="stat">
          <strong>Timezones:</strong> {Object.keys(groupedByTimezone).length}
        </div>
      </div>

      <div className="timezone-sections">
        {Object.entries(groupedByTimezone).map(([timezone, members]) => (
          <section key={timezone} className="timezone-section">
            <h2>
              {timezone} ({members.length} member{members.length !== 1 ? 's' : ''})
            </h2>
            <div className="members-grid">
              {members.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-header">
                    <h3>{member.name}</h3>
                    <span className={`status ${member.isActive ? 'active' : 'inactive'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="member-info">
                    <p className="role">{member.role}</p>
                    <p className="email">{member.email}</p>
                    <p className="timezone">{member.timezone}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="empty-state">
          <h3>No team members found</h3>
          <p>No members match the current filters.</p>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;