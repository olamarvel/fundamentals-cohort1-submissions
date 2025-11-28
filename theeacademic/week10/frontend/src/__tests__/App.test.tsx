import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the API calls
vi.mock('../services/api', () => ({
  projectsApi: {
    getAll: vi.fn().mockResolvedValue({
      success: true,
      data: [],
      count: 0
    })
  },
  teamsApi: {
    getMembers: vi.fn().mockResolvedValue({
      success: true,
      data: [],
      count: 0
    })
  }
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByText('SyncForge')).toBeInTheDocument();
  });

  it('displays navigation links', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });
});