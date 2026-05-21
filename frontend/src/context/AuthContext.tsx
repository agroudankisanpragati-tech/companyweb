'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'farmer' | 'shopkeeper' | 'agribusiness';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    farmSize?: string;
    location?: string;
    businessType?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('authToken');

        if (savedUser && savedToken) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setRole(parsedUser.role);
        }
        setIsLoading(false);
    }, []);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.agroudankisanpragati.com/api';

    const register = async (userData: RegisterData) => {
        try {
            setIsLoading(true);

            // Try server registration first
            try {
                // Map frontend fields to backend expected shape where possible
                const payload: any = {
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    role: 'farmer',
                };

                // farmSize may be provided as string; convert to number if possible
                if (userData.farmSize) {
                    const n = parseFloat(userData.farmSize as any);
                    payload.farmSize = Number.isNaN(n) ? 0 : n;
                } else {
                    payload.farmSize = 0;
                }

                // Location: backend expects object; try to map a simple string to state
                if (userData.location && typeof userData.location === 'string') {
                    payload.location = {
                        state: userData.location,
                        district: '',
                        coordinates: { latitude: 0, longitude: 0 },
                    };
                }

                const res = await fetch(`${apiBase}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    const data = await res.json();
                    const newUser: User = {
                        id: data.user?.id || data.user?._id || Date.now().toString(),
                        email: data.user?.email || userData.email,
                        name: data.user?.name || userData.name,
                        role: (data.user?.role as UserRole) || userData.role,
                        phone: data.user?.phone || userData.phone,
                    };

                    localStorage.setItem('user', JSON.stringify(newUser));
                    if (data.token) localStorage.setItem('authToken', data.token);
                    setUser(newUser);
                    setRole(newUser.role as UserRole);
                    return;
                }
                // if server returned error, fallthrough to local fallback
            } catch (err) {
                // server not reachable or error - we'll fallback to localStorage simulation
                // console.warn('Server register failed, falling back to local:', err);
            }

            // Local fallback (legacy behavior)
            const newUser: User = {
                id: Date.now().toString(),
                email: userData.email,
                name: userData.name,
                role: userData.role,
                phone: userData.phone,
            };

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const token = `token_${Date.now()}`;
            // persist main user for session
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('authToken', token);
            localStorage.setItem(`userData_${userData.role}`, JSON.stringify(userData));

            // Also keep a localUsers list so users created via fallback can login after logout
            try {
                const raw = localStorage.getItem('localUsers');
                const localUsers: Array<any> = raw ? JSON.parse(raw) : [];
                // store minimal info for fallback login (email + password + profile)
                localUsers.push({ email: userData.email, password: userData.password, user: newUser });
                localStorage.setItem('localUsers', JSON.stringify(localUsers));
            } catch (e) {
                // ignore local storage errors
            }

            setUser(newUser);
            setRole(userData.role);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            // Try server login first
            try {
                const res = await fetch(`${apiBase}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (res.ok) {
                    const data = await res.json();
                    const loggedUser: User = {
                        id: data.user?.id || data.user?._id || Date.now().toString(),
                        email: data.user?.email,
                        name: data.user?.name,
                        role: (data.user?.role as UserRole) || 'farmer',
                        phone: data.user?.phone,
                    };

                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(loggedUser));
                    setUser(loggedUser);
                    setRole(loggedUser.role as UserRole);
                    return;
                }
            } catch (err) {
                // server not reachable or error - fallback to localStorage
                // console.warn('Server login failed, falling back to local:', err);
            }

            // Local fallback (legacy behavior)
            await new Promise(resolve => setTimeout(resolve, 300));

            // 1) Check current session 'user' (fast path)
            const current = JSON.parse(localStorage.getItem('user') || 'null');
            if (current && current.email === email) {
                const token = `token_${Date.now()}`;
                localStorage.setItem('authToken', token);
                setUser(current);
                setRole(current.role);
                return;
            }

            // 2) Check localUsers list for accounts created via fallback
            try {
                const raw = localStorage.getItem('localUsers');
                const localUsers: Array<any> = raw ? JSON.parse(raw) : [];
                const matched = localUsers.find(u => u.email === email && u.password === password);
                if (matched) {
                    const token = `token_${Date.now()}`;
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('user', JSON.stringify(matched.user));
                    setUser(matched.user);
                    setRole(matched.user.role);
                    return;
                }
            } catch (e) {
                // ignore local storage parse errors
            }

            throw new Error('Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                role,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
