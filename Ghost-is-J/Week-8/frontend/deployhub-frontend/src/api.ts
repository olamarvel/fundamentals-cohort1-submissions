export type Health = {status: string; version: string; uptime: number};

const base = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchHealth(): Promise<Health> {
    const res = await fetch(base + '/api/health');
    if (!res.ok) throw new Error(`Failed to fetch health: ${res.status}`);
    return res.json();
}