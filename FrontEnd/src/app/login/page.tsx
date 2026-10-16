'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainAuth from '@/components/Authentication/MainAuth';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Kalau sudah login, langsung redirect ke dashboard sesuai role
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace('/user');
        }
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, [router]);

  if (!mounted) return null;

  const handleLoginSuccess = (userData: any) => {
    if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/user');
    }
  };

  return (
    <MainAuth 
      initialMode="login" 
      onLoginSuccess={handleLoginSuccess} 
    />
  );
}
