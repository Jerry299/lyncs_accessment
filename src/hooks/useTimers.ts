import { useState, useEffect } from 'react';
import type { Timer } from '../types';

const STORAGE_KEY = 'timelines_data';

export function useTimers() {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) setTimers(JSON.parse(data));
        } catch (e) {
            console.error('Failed to load timers', e);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
        } catch (e) {
            console.error('Failed to save timers', e);
        }
    }, [timers, isLoaded]);

    const addTimer = (timer: Omit<Timer, 'id' | 'createdAt'>) => {
        const newTimer: Timer = {
            ...timer,
            id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
            createdAt: new Date().toISOString(),
        };
        setTimers(prev => [...prev, newTimer]);
    };

    const editTimer = (id: string, updates: Partial<Timer>) => {
        setTimers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTimer = (id: string) => {
        setTimers(prev => prev.filter(t => t.id !== id));
    };

    const sortedTimers = [...timers].sort((a, b) => {
        const tA = new Date(a.targetDate).getTime();
        const tB = new Date(b.targetDate).getTime();
        const now = Date.now();
        const aPast = tA < now;
        const bPast = tB < now;
        if (aPast && !bPast) return 1;
        if (!aPast && bPast) return -1;
        return tA - tB;
    });

    return { timers: sortedTimers, addTimer, editTimer, deleteTimer };
}
