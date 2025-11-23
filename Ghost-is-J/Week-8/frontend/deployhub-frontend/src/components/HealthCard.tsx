import React from 'react';
import type {Health} from '../api';

export default function HealthCard({health}: {health: Health}) {
    return (
        <div style={{ padding: 16, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
            <h2>Service Health</h2>
            <p>Status: <strong>{health.status}</strong></p>
            <p>Version: <strong>{health.version}</strong></p>
            <p>Uptime: <strong>{Math.round(health.uptime)}s</strong></p>
        </div>
    );
}