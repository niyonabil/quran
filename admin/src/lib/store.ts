import { create } from 'zustand';
import { supabase } from './supabase';

interface User {
    id: string;
    email: string;
    name?: string;
    role: 'admin' | 'moderator' | 'user';
    created_at: string;
}

interface AdminStore {
    // Auth
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;

    // UI State
    sidebarOpen: boolean;
    toggleSidebar: () => void;

    // Notifications
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
}

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
    // Auth State
    user: null,
    isAuthenticated: false,

    login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        if (data.user) {
            // TODO: Fetch user details from database
            set({
                user: {
                    id: data.user.id,
                    email: data.user.email!,
                    role: 'admin', // TODO: Get from DB
                    created_at: data.user.created_at,
                },
                isAuthenticated: true,
            });

            localStorage.setItem('admin_token', data.session?.access_token || '');
        }
    },

    logout: () => {
        supabase.auth.signOut();
        localStorage.removeItem('admin_token');
        set({
            user: null,
            isAuthenticated: false,
        });
    },

    // UI State
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    // Notifications
    notifications: [],
    addNotification: (notification) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
            notifications: [
                ...state.notifications,
                { ...notification, id, timestamp: new Date() },
            ],
        }));

        // Auto-remove after 5 seconds
        setTimeout(() => {
            get().removeNotification(id);
        }, 5000);
    },
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
}));
