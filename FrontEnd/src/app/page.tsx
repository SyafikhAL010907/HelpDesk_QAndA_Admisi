'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import AdminWebDashboard from '@/components/Admin/Web&Tab/WebTabLayout';
import AdminMobileDashboard from '@/components/Admin/Mobile/MobileLayout';
import UserWebDashboard from '@/components/User/Web&Tab/WebTabLayout';
import UserMobileDashboard from '@/components/User/Mobile/MobileLayout';
import React, { useState, useEffect } from 'react';
import MainAuth from '@/components/Authentication/MainAuth';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function Home() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'LOGIN' | 'SIGNUP' | 'APP'>('LOGIN');

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setView('APP');
    }
  }, []);

  if (!mounted) return null;

  // 1. LOGIN VIEW
  if (view === 'LOGIN' && !user) {
    return (
      <MainAuth 
        initialMode="login" 
        onLoginSuccess={(userData: any) => { setUser(userData); setView('APP'); }} 
      />
    );
  }

  // 2. SIGNUP VIEW
  if (view === 'SIGNUP' && !user) {
    return <MainAuth initialMode="signup" />;
  }

  if (!user) return null;

  // Admin View
  if (user.role === 'admin') {
    return (
      <main className="min-h-screen">
        {isMobile ? <AdminMobileDashboard /> : <AdminWebDashboard />}
      </main>
    );
  }

  // User View (Default fallback)
  return (
    <main className="min-h-screen">
      {isMobile ? <UserMobileDashboard /> : <UserWebDashboard />}
    </main>
  );
}
