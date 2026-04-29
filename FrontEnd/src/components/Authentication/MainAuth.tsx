'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

// Web Components
import WebLogin from './Web&Tab/Login';
import WebSignUp from './Web&Tab/SignUp';

// Mobile Components
import MobileLogin from './Mobile/Login';
import MobileSignUp from './Mobile/SignUp';

interface MainAuthProps {
    initialMode: 'login' | 'signup';
    onLoginSuccess?: (user: any) => void;
}

const MainAuth = ({ initialMode, onLoginSuccess }: MainAuthProps) => {
    const isMobile = useIsMobile();
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
    const [mounted, setMounted] = useState(false);
    
    // Auth State
    const [loading, setLoading] = useState(false);
    const [captcha, setCaptcha] = useState({ kode: 0, pertanyaan: '', jawaban: '' });

    useEffect(() => {
        setMounted(true);
        fetchCaptcha();
    }, []);

    const fetchCaptcha = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/captcha');
            const data = await res.json();
            if (res.ok) {
                setCaptcha(data);
            }
        } catch (err) {
            console.error('Failed to fetch captcha:', err);
        }
    };

    const handleNavigate = () => {
        const newMode = mode === 'login' ? 'signup' : 'login';
        setMode(newMode);
    };

    const handleLogin = async (payload: any) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                if (onLoginSuccess) {
                    onLoginSuccess(data);
                } else {
                    router.push('/');
                }
            } else {
                alert(data.error || 'Login Gagal');
                fetchCaptcha();
            }
        } catch (err) {
            alert('Gagal menyambung ke server Backend');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (payload: any) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert('Pendaftaran Berhasil! Silakan Login.');
                setMode('login');
            } else {
                alert(data.error || 'Pendaftaran Gagal');
            }
        } catch (err) {
            alert('Gagal menyambung ke server Backend');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    if (mode === 'login') {
        const LoginComp = isMobile ? MobileLogin : WebLogin;
        return (
            <LoginComp 
                onNavigate={handleNavigate} 
                onLogin={handleLogin}
                loading={loading}
                captcha={captcha}
                onRefreshCaptcha={fetchCaptcha}
            />
        );
    } else {
        const SignUpComp = isMobile ? MobileSignUp : WebSignUp;
        return (
            <SignUpComp 
                onNavigate={handleNavigate} 
                onSignUp={handleSignUp}
                loading={loading}
            />
        );
    }
};

export default MainAuth;
