'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  Settings, 
  Plus,
  History,
  Search,
  MoreVertical,
  ArrowLeft,
  Send,
  Paperclip,
  CheckCheck,
  FileText,
  Download,
  Eye,
  Clock,
  Megaphone,
  Trash2,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';
import { Message, CannedResponse, BlastTemplate } from '@/constants/chatTypes';
import { dummyChats } from '@/constants/chatData';
import { cannedResponses } from '@/constants/cannedResponses';
import { blastTemplates } from '@/constants/blastTemplates';
import Avatar from '@/components/Shared/Avatar';
import FormattedText from '@/components/Shared/FormattedText';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';

const toLocalTime = (dateStr: string) => {
    if (!dateStr) return '--:--';
    try {
        // Ambil teks jamnya langsung biar ga kegeser timezone browser
        const timePart = dateStr.includes('T') ? dateStr.split('T')[1] : dateStr.split(' ')[1];
        if (timePart) {
            return timePart.substring(0, 5); // Ambil HH:mm
        }
        return format(new Date(dateStr), 'HH:mm');
    } catch (e) {
        return '--:--';
    }
};
import { usePathname, useRouter } from 'next/navigation';

// --- Components from User Example Adapted for HelpDesk ---

const NotchedBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 80"
            preserveAspectRatio="xMidYMin slice"
            className="drop-shadow-[0_-5px_20px_rgba(0,0,0,0.05)] filter transition-all duration-500"
        >
            <path
                d="M-500,40 
                   C-500,18 -482,0 -460,0 
                   L430,0 
                   C450,0 455,5 460,15 
                   C480,62 520,62 540,15 
                   C545,5 550,0 570,0 
                   L1460,0 
                   C1482,0 1500,18 1500,40 
                   L1500,40 
                   C1500,62 1482,80 1460,80 
                   L-460,80 
                   C-482,80 -500,62 -500,40 
                   Z"
                className="fill-white backdrop-blur-3xl stroke-slate-100"
                strokeWidth="1"
            />
        </svg>
    </div>
);

const MobileLayout = () => {
  const [adminName, setAdminName] = useState('Admin');
  const [adminGmail, setAdminGmail] = useState('');
  const [view, setView] = useState<'LIST' | 'ROOM'>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('adminActiveChat') ? 'ROOM' : 'LIST';
    }
    return 'LIST';
  });
  const [activeTab, setActiveTab] = useState('home');
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('adminActiveChat');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  useEffect(() => {
    if (selectedChat) {
      sessionStorage.setItem('adminActiveChat', JSON.stringify(selectedChat));
    } else {
      sessionStorage.removeItem('adminActiveChat');
    }
  }, [selectedChat]);
  const [selectedResponse, setSelectedResponse] = useState<CannedResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [manualNote, setManualNote] = useState('');
  const [activeFilter, setActiveFilter] = useState<'unreading' | 'reading'>('unreading');
  const [showBlessModal, setShowBlessModal] = useState(false);
  const [blessMessage, setBlessMessage] = useState('');
  const [blessFile, setBlessFile] = useState<{ name: string, data: string, type: string } | null>(null);
  const [blessTargetMode, setBlessTargetMode] = useState<'waiting_room' | 'all_users' | 'specific_users'>('waiting_room');
  const [allUsers, setAllUsers] = useState<{username: string, gmail: string}[]>([]);
  const [selectedBlessUsers, setSelectedBlessUsers] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isBlasting, setIsBlasting] = useState(false);
  const [isTemplatePopupOpen, setIsTemplatePopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Pendaftaran');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isInfoActive, setIsInfoActive] = useState(false);
  // ── AI Auto-Response State ────────────────────────────────────────────────
  // ⚠️  DISABLE: Comment baris ini untuk balik ke toggle lokal saja
  const [isAILoading, setIsAILoading] = useState(false); // Loading state saat toggle
  const [showAIConfirm, setShowAIConfirm] = useState(false); // Konfirmasi sebelum toggle AI
  const [pendingAIState, setPendingAIState] = useState(false); // State AI yang akan diaktifkan
  // ─────────────────────────────────────────────────────────────────────────
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isRoomMenuOpen, setIsRoomMenuOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [networkLatency, setNetworkLatency] = useState<number>(24);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(12540);

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  const downloadFile = (dataUrl: string, fileName: string) => {
    try {
      const parts = dataUrl.split(',');
      if (parts.length < 2) throw new Error("Format base64 tidak valid");
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Gagal download:", e);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    }
  };

  const viewFile = (dataUrl: string) => {
    try {
      const parts = dataUrl.split(',');
      if (parts.length < 2) throw new Error("Format base64 tidak valid");
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (e) {
      console.error("Gagal melihat file:", e);
      window.open(dataUrl, '_blank');
    }
  };
  const [isFABOpen, setIsFABOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastRoomIdRef = useRef<number | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isAtBottom);
    }
  };

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok) {
        setTotalUsersCount(data.total_users || 0);
      }
    } catch (err) {
      console.error("Gagal ambil stats:", err);
    }
  };

  const fetchAllUsers = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setAllUsers(data);
      }
    } catch (err) {
      console.error("Gagal ambil semua user:", err);
    }
  };

  const fetchRooms = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/chat/rooms`, {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setRooms(data.map((r: any) => ({
          ...r,
          is_online: r.is_online,
          is_marked_unread: r.is_marked_unread
        })));
      } else if (res.ok) {
        setRooms([]);
      }
    } catch (err) {
      console.error("Gagal ambil room:", err);
      setRooms([]);
    }
  };

  const fetchMessages = async (roomId: number, token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${roomId}`, {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setMessages(data.map((m: any) => ({
          id: m.id.toString(),
          sender: m.sender_gmail.toLowerCase() === adminGmail.toLowerCase() ? 'admin' : 'user',
          text: m.message,
          timestamp: toLocalTime(m.created_at),
          type: m.message_type
        })));
      }
    } catch (err) {
      console.error("Gagal ambil pesan:", err);
    }
  };

  const handleMarkAsUnread = async () => {
    if (!selectedChat) return;
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token } = JSON.parse(storedUser);
    
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/chat/mark-unread/${selectedChat.id}`, {
            method: 'POST',
            headers: { 'Authorization': token }
        });
        setIsRoomMenuOpen(false);
        setSelectedChat(null); 
        fetchRooms(token);
    } catch (err) {
        console.error("Gagal tandai belum dibaca:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setAdminName(parsed.username || parsed.Username || 'Admin');
      setAdminGmail(parsed.gmail);
      fetchRooms(parsed.token);
      fetchStats(parsed.token);
      fetchAllUsers(parsed.token);
      // ⚠️  DISABLE: Comment baris fetchAIStatus di bawah jika tidak pakai AI
      fetchAIStatus(parsed.token); // Ambil status AI saat pertama load
      const interval = setInterval(() => {
        fetchRooms(parsed.token);
        fetchStats(parsed.token);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, []);


  useEffect(() => {
    const updateLatency = () => {
      // @ts-ignore
      const rtt = navigator.connection?.rtt || Math.floor(Math.random() * (40 - 15 + 1)) + 15;
      setNetworkLatency(rtt);
    };
    updateLatency();
    const interval = setInterval(updateLatency, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && selectedChat && view === 'ROOM' && adminGmail) {
      const { token } = JSON.parse(storedUser);
      fetchMessages(selectedChat.id, token);
      const interval = setInterval(() => fetchMessages(selectedChat.id, token), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat?.id, view, adminGmail]);

  // Efek pintar buat scroll
  useEffect(() => {
    if (selectedChat && messages.length > 0 && view === 'ROOM') {
      if (lastRoomIdRef.current !== selectedChat.id) {
        scrollToBottom('auto');
        lastRoomIdRef.current = selectedChat.id;
        setShouldAutoScroll(true);
      } else if (shouldAutoScroll) {
        scrollToBottom('smooth');
      }
    }
  }, [messages, view, selectedChat?.id, shouldAutoScroll]);



  const filteredRooms = rooms.filter(room => {
    if (activeFilter === 'unreading') return room.unread_count > 0 || room.is_marked_unread;
    if (activeFilter === 'reading') return room.unread_count === 0 && !room.is_marked_unread;
    return true;
  });

  const handleOpenChat = (chat: any) => {
    setSelectedChat(chat);
    setView('ROOM');
    setIsFABOpen(false);
    markAsRead(chat.id);
    
    // Pas buka chat, paksa scroll ke bawah dan reset state
    setShouldAutoScroll(true);
    setTimeout(() => scrollToBottom('auto'), 100);
  };

  const markAsRead = async (id: number) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token } = JSON.parse(storedUser);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/chat/mark-read/${id}`, {
        method: 'POST',
        headers: { 'Authorization': token }
      });
      fetchRooms(token);
    } catch (err) {
      console.error("Gagal mark read:", err);
    }
  };

  // ── AI Auto-Response Functions ───────────────────────────────────────────
  // ⚠️  DISABLE: Comment seluruh blok fetchAIStatus + handleToggleAI di bawah ini

  const fetchAIStatus = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ai/status`, {
        headers: { 'Authorization': token }
      });
      if (res.ok) {
        const data = await res.json();
        setIsInfoActive(data.enabled === true);
      }
    } catch (err) {
      console.warn('[AI] Tidak bisa ambil status AI (ML service mungkin belum jalan):', err);
    }
  };

  const handleToggleAI = async (newState: boolean) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token } = JSON.parse(storedUser);

    setIsInfoActive(newState);
    setIsAILoading(true);
    setShowAIConfirm(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/ai/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ enabled: newState })
      });
      if (!res.ok) {
        setIsInfoActive(!newState);
        console.error('[AI] Gagal toggle AI');
      }
    } catch (err) {
      setIsInfoActive(!newState);
      console.warn('[AI] Koneksi ke backend gagal:', err);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleAIToggleRequest = (newState: boolean) => {
    setPendingAIState(newState);
    setShowAIConfirm(true);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleBlessChat = async () => {
    if (!blessMessage.trim() && !blessFile) return;
    if (blessTargetMode === 'specific_users' && selectedBlessUsers.length === 0) {
      alert('Pilih minimal satu user tujuan!');
      return;
    }
    
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token, gmail } = JSON.parse(storedUser);

    setIsBlasting(true);
    try {
      const payload = {
        message: blessMessage,
        admin_gmail: gmail,
        file_data: blessFile ? `${blessFile.name}|${blessFile.data}` : '',
        file_type: blessFile ? blessFile.type : 'text',
        target_type: blessTargetMode,
        target_gmails: blessTargetMode === 'specific_users' ? selectedBlessUsers : []
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/chat/broadcast`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Berhasil mengirim pesan Bless Chat!');
        setBlessMessage('');
        setBlessFile(null);
        setSelectedBlessUsers([]);
        setShowBlessModal(false);
        fetchRooms(token);
      }
    } catch (err) {
      console.error("Gagal kirim Bless Chat:", err);
    } finally {
      setIsBlasting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRooms.length === 0) return;
    
    if (!confirm(`Lu yakin mau hapus ${selectedRooms.length} room chat ini secara permanen? Data gak bakal bisa balik lagi lho bro!`)) return;

    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token } = JSON.parse(storedUser);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/chat/delete-bulk`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ room_ids: selectedRooms })
      });

      if (res.ok) {
        alert('Mantap! Room chat pilihan lu udah bersih dari database.');
        setSelectedRooms([]);
        setIsDeleteMode(false);
        fetchRooms(token);
      } else {
        const data = await res.json();
        alert('Gagal hapus: ' + data.error);
      }
    } catch (err) {
      console.error("Gagal bulk delete:", err);
      alert('Ada kendala koneksi pas mau hapus data bro.');
    }
  };

  const toggleSelectRoom = (id: number) => {
    setSelectedRooms(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRooms.length === filteredRooms.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(filteredRooms.map(r => r.id));
    }
  };

  const handleBack = () => {
    setView('LIST');
    setTimeout(() => {
      if (view === 'LIST') {
        setSelectedChat(null);
        setMessages([]);
      }
    }, 300);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChat) return;

    const combinedText = selectedResponse
      ? `${selectedResponse.response}\n\nCatatan Tambahan:\n${manualNote}`
      : manualNote;

    if (!combinedText.trim()) return;

    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token, gmail } = JSON.parse(storedUser);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/send`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          room_id: selectedChat.id,
          sender_gmail: gmail,
          message: combinedText,
          message_type: 'text'
        })
      });

      if (res.ok) {
        setManualNote('');
        setSelectedResponse(null);
        const el = document.getElementById('admin-message-input');
        if (el) el.style.height = 'auto';
        fetchMessages(selectedChat.id, token);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Gagal kirim pesan:", err);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    if (file.size > 1024 * 1024) {
      alert(`Waduh bro! Ukuran file lu (${(file.size / (1024 * 1024)).toFixed(2)} MB) kegedean. Maksimal cuma boleh 1 MB biar server tetep ngebut!`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token, gmail } = JSON.parse(storedUser);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      const fileType = file.type.startsWith('image/') ? 'image' : 'file';
      const combinedData = `${file.name}|${base64Data}`;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/send`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            room_id: selectedChat.id,
            sender_gmail: gmail,
            message: combinedData,
            message_type: fileType
          })
        });

        if (res.ok) {
          fetchMessages(selectedChat.id, token);
          scrollToBottom();
        }
      } catch (err) {
        console.error("Gagal kirim file:", err);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const arcItemVariants: any = {
    hidden: { opacity: 0, scale: 0, x: 0, y: 0 },
    visible: (custom: { x: number, y: number }) => ({
        opacity: 1,
        scale: 1,
        x: custom.x,
        y: custom.y,
        transition: { type: "spring", damping: 12, stiffness: 200 }
    }),
    exit: { opacity: 0, scale: 0, x: 0, y: 0, transition: { duration: 0.15 } }
  };

  // ARC FAB Items
  const R = 100;
  const fabItems = [
    { icon: FileText, label: 'Template', angle: 150, color: 'bg-emerald-600 shadow-emerald-500/50' },
    { icon: MessageCircle, label: 'Broadcast', angle: 90, color: 'bg-blue-600 shadow-blue-500/50' },
    { icon: LayoutGrid, label: 'Tools', angle: 30, color: 'bg-purple-600 shadow-purple-500/50' },
  ];

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'unreading', icon: MessageCircle, label: 'Unread' },
    { id: 'bless', isFAB: true },
    { id: 'reading', icon: CheckCheck, label: 'Read' },
    { id: 'logout', icon: LogOut, label: 'Keluar' },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 overflow-hidden relative font-sans text-slate-900">
      <AnimatePresence mode="wait">
        {view === 'LIST' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-slate-50"
          >
            {/* FIXED HEADER SECTION */}
            <div className="sticky top-0 z-40 bg-slate-50 flex flex-col shrink-0 border-b border-slate-100/40">
                {/* Premium Header (Logo & Welcome) */}
                <div className="bg-emerald-800 rounded-b-[40px] px-6 pt-12 pb-14 relative overflow-hidden shadow-lg shadow-emerald-900/10">
                   {/* Decorative Circles */}
                   <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                   <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>

                   <header className="relative z-10 flex flex-col gap-6">
                     <div className="flex justify-between items-center text-white">
                        <div className="flex items-center gap-3 text-white">
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                            >
                                <Image 
                                  src="/unj.png" 
                                  alt="Logo UNJ" 
                                  width={48} 
                                  height={48} 
                                  className="drop-shadow-2xl" 
                                />
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-black tracking-tight leading-none">Admin Admisi UNJ</h1>
                                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mt-1">Admisi 2026</p>
                            </div>
                        </div>
                     </div>

                     {/* Welcome Message */}
                     <div className="text-white flex items-end justify-between">
                         <div>
                            <h2 className="text-lg font-bold">Selamat Datang, {adminName}!</h2>
                            <div className="flex items-center gap-3">
                               <p className="text-xs text-emerald-100/70">
                                 {activeTab === 'home' ? "Panel Informasi Dashboard" : `Ada ${rooms.filter((r: any) => (r.unread_count || 0) > 0).length} chat baru.`}
                               </p>
                            </div>
                         </div>
                      </div>
                   </header>
                </div>

                {/* Top Actions Area */}
                <div className="px-4 -mt-7 relative z-30 pb-3">
                  {activeTab === 'home' ? (
                     /* PREMIUM LARGE TOGGLE SWITCH (Replaces Quick Access) */
                     <div className="w-full bg-white rounded-[32px] p-4 shadow-xl shadow-emerald-900/10 border border-emerald-100/50 flex items-center justify-between group transition-all relative overflow-hidden">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                           <Settings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                         </div>
                         <div className="flex flex-col">
                           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Sistem Pintar</p>
                           <h4 className="text-sm font-bold text-slate-700 leading-tight">Auto-Response AI</h4>
                           <p className="text-[9px] font-medium text-slate-400 mt-0.5">Fitur belum tersedia</p>
                         </div>
                       </div>

                       {/* Elegant Large Toggle */}
                       <div 
                         onClick={() => {
                          // ⚠️  DISABLE: Ganti handleAIToggleRequest → setIsInfoActive(!isInfoActive)
                          if (!isAILoading) handleAIToggleRequest(!isInfoActive);
                        }}
                         className={cn(
                           "relative w-16 h-9 rounded-full p-1 transition-all duration-500 cursor-pointer",
                           isInfoActive ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-slate-100 shadow-inner",
                           isAILoading && "opacity-60 cursor-wait"
                         )}
                       >
                         <motion.div 
                           animate={{ x: isInfoActive ? 28 : 0 }}
                           transition={{ type: "spring", stiffness: 300, damping: 20 }}
                           className="w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden"
                         >
                           {isAILoading ? (
                             <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                           ) : (
                             <div className={cn(
                               "w-1.5 h-1.5 rounded-full transition-all duration-300",
                               isInfoActive ? "bg-emerald-500 scale-150" : "bg-slate-300"
                             )} />
                           )}
                         </motion.div>
                       </div>
                     </div>
                  ) : (
                    /* SEARCH & DELETE MODE */
                    <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="flex flex-col gap-3"
                    >
                       <div className="bg-white rounded-[32px] p-2 shadow-lg shadow-emerald-900/5 border border-slate-50">
                           <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/50 rounded-[24px]">
                               <Search size={18} className="text-slate-400" />
                               <input 
                                   type="text" 
                                   placeholder="Cari user atau pesan..." 
                                   className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full text-slate-600 placeholder:text-slate-400"
                               />
                           </div>
                       </div>
                        <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-50 min-h-[46px] items-center justify-center relative overflow-hidden shadow-xs">
                          <AnimatePresence mode="wait">
                            {isDeleteMode ? (
                              <motion.div 
                                key="delete-mode-active-mob"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="flex w-full gap-1.5"
                              >
                                <button 
                                  onClick={toggleSelectAll}
                                  className="flex-1 py-2 px-3 rounded-xl text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 whitespace-nowrap"
                                >
                                  {selectedRooms.length === filteredRooms.length ? "Batal Semua" : "Pilih Semua"}
                                </button>
                                <button 
                                  onClick={() => {
                                    setIsDeleteMode(false);
                                    setSelectedRooms([]);
                                  }}
                                  className="flex-1 py-2 px-3 rounded-xl text-[10px] font-black text-red-600 bg-red-50 border border-red-100"
                                >
                                  Batal
                                </button>
                                <button 
                                  onClick={handleBulkDelete}
                                  disabled={selectedRooms.length === 0}
                                  className={cn(
                                    "flex-1 py-2 px-3 rounded-xl text-[10px] font-black text-white shadow-lg transition-all active:scale-95 whitespace-nowrap",
                                    selectedRooms.length > 0 ? "bg-red-500 shadow-red-200" : "bg-slate-300 shadow-none grayscale cursor-not-allowed"
                                  )}
                                >
                                  Hapus ({selectedRooms.length})
                                </button>
                              </motion.div>
                            ) : (
                              <motion.button 
                                key="delete-mode-off-mob"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setIsDeleteMode(true)}
                                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                              >
                                <Trash2 size={14} />
                                Mode Hapus
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                    </motion.div>
                  )}
                </div>
            </div>

            {/* SCROLLABLE CONTENT AREA */}
            <main className="flex-1 overflow-y-auto px-4 relative z-10 pb-32 pt-2 scrollbar-hide">
              <AnimatePresence mode="wait">
                {activeTab === 'home' ? (
                  <motion.div
                    key="info-dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col gap-6 pt-4"
                  >
                    {/* STATS GRID */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Total Chat', value: rooms.length, icon: MessageSquare, color: 'emerald', detail: 'Live' },
                        { label: 'Unread', value: rooms.filter(r => (r.unread_count || 0) > 0).length, icon: Clock, color: 'rose', detail: 'Pending' },
                        { label: 'Reading', value: rooms.filter(r => (r.unread_count || 0) === 0).length, icon: CheckCheck, color: 'cyan', detail: 'Terbaca' },
                        { label: 'Sistem AI', value: isInfoActive ? 'Aktif' : 'Non-Aktif', icon: Settings, color: 'indigo', detail: 'Auto' },
                        { label: 'User Online', value: rooms.filter(r => r.is_online).length, icon: Search, color: 'amber', detail: 'Live' }
                      ].map((stat, i) => (
                        <div key={stat.label} className={cn(
                          "bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden group",
                          i === 4 ? "col-span-2" : ""
                        )}>
                          <div className={cn(
                            "absolute -right-2 -top-2 w-16 h-16 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 opacity-20",
                            stat.color === 'emerald' ? "bg-emerald-400" :
                            stat.color === 'rose' ? "bg-rose-400" :
                            stat.color === 'cyan' ? "bg-cyan-400" :
                            stat.color === 'indigo' ? "bg-indigo-400" : "bg-amber-400"
                          )}></div>
                          <div className="flex justify-between items-start relative z-10">
                            <div className={cn(
                              "w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                              stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                              stat.color === 'rose' ? "bg-rose-50 text-rose-600" :
                              stat.color === 'cyan' ? "bg-cyan-50 text-cyan-600" :
                              stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                            )}>
                              <stat.icon size={20} />
                            </div>
                            <span className={cn(
                              "text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest",
                              stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                              stat.color === 'rose' ? "bg-rose-50 text-rose-600" :
                              stat.color === 'cyan' ? "bg-cyan-50 text-cyan-600" :
                              stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                            )}>{stat.detail}</span>
                          </div>
                          <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{stat.label}</p>
                            <h3 className="text-xl font-black text-slate-800 mt-1 tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
                              {stat.value}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* SYSTEM STATUS CARD (Emerald Theme) */}
                    <div className="bg-linear-to-br from-emerald-800 to-emerald-950 p-7 rounded-[40px] text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
                      <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="flex items-center justify-between relative z-10 mb-8">
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Server Status</p>
                          <h4 className="text-lg font-bold">Admisi UNJ Gateway</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase">System Operational</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                          <HelpCircle size={24} className="text-white/80" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10 relative z-10">
                        <div>
                          <p className="text-emerald-100/50 text-[10px] font-black uppercase tracking-widest mb-1">Network Latency</p>
                          <p className="text-lg font-bold">{networkLatency}ms <span className="text-[10px] font-medium text-emerald-400">
                            {networkLatency < 50 ? 'Excellent' : 'Good'}
                          </span></p>
                        </div>
                        <div>
                          <p className="text-emerald-100/50 text-[10px] font-black uppercase tracking-widest mb-1">Total User</p>
                          <p className="text-lg font-bold">{formatNumber(totalUsersCount)} <span className="text-[10px] font-medium text-emerald-400">Reg.</span></p>
                        </div>
                      </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="flex flex-col gap-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Informasi Tambahan</h4>
                      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden divide-y divide-slate-50">
                        <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                              <LayoutGrid size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">Manajemen Kuota</p>
                              <p className="text-[9px] font-medium text-slate-400 mt-0.5">Pantau pendaftar per jalur</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                        <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                              <Search size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">Log Aktivitas</p>
                              <p className="text-[9px] font-medium text-slate-400 mt-0.5">Cek histori broadcast admin</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-slate-300" />
                        </div>
                      </div>
                    </div>

                    {/* QUOTE / TIP */}
                    <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100/50 flex gap-4 items-start">
                      <div className="text-xl">💡</div>
                      <p className="text-[11px] font-medium text-emerald-800 leading-relaxed">
                        *Tips:* Pastikan selalu membalas pesan user dalam waktu kurang dari 15 menit untuk menjaga performa layanan Admisi UNJ.
                      </p>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div
                    key="chat-list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-3"
                  >
                    {filteredRooms.map((chat) => (
                       <motion.div
                        key={chat.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => isDeleteMode ? toggleSelectRoom(chat.id) : handleOpenChat(chat)}
                        className={cn(
                          "flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm border transition-all",
                          isDeleteMode && selectedRooms.includes(chat.id) ? "border-red-200 bg-red-50/30" : "border-slate-100 active:bg-slate-50"
                        )}
                      >
                        {isDeleteMode && (
                          <div className={cn(
                            "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                            selectedRooms.includes(chat.id) ? "bg-red-500 border-red-500 text-white" : "border-slate-200 bg-white"
                          )}>
                            {selectedRooms.includes(chat.id) && <Plus size={14} className="rotate-45" />}
                          </div>
                        )}
                        <div className="relative">
                            <Avatar size="md" />
                            {chat.is_online && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-slate-800 truncate text-sm">{chat.user_name || chat.user_gmail}</h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {toLocalTime(chat.updated_at)}
                            </span>
                          </div>
                           <div className="flex justify-between items-center">
                             <p className={cn(
                                 "text-[11px] truncate pr-2 mt-1 flex-1",
                                 (chat.unread_count > 0 || chat.is_marked_unread) ? "text-slate-700 font-bold" : "text-slate-400 font-medium"
                             )}>
                               {chat.last_message}
                             </p>
                             {chat.unread_count > 0 ? (
                               <div className="bg-emerald-500 text-white text-[9px] font-bold h-4 min-w-[16px] px-1.5 flex items-center justify-center rounded-full shadow-lg shadow-emerald-200 animate-bounce">
                                 {chat.unread_count}
                               </div>
                             ) : chat.is_marked_unread ? (
                               <div className="bg-emerald-500 w-2.5 h-2.5 rounded-full shadow-lg shadow-emerald-200 animate-pulse mr-1 mt-1"></div>
                             ) : null}
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* OVERLAY for FAB Speed Dial */}
            <AnimatePresence>
                {isFABOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setIsFABOpen(false)}
                        className="fixed inset-0 z-55 bg-slate-900/40 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* BOTTOM NAV (Premium Notched Style) - Hidden when Bless Modal is active */}
            <AnimatePresence>
                {!showBlessModal && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-[92%] max-w-lg h-[76px] pointer-events-none"
                    >
                        <nav className="relative flex items-center justify-between px-6 h-full pointer-events-auto">
                            <NotchedBackground />
                            
                            {navItems.map((item) => {
                                if (item.isFAB) {
                                    return (
                                        <div key="fab-slot" className="relative flex flex-col items-center w-[60px]">
                                            <motion.button
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setShowBlessModal(true)}
                                                className="absolute -top-14 w-[64px] h-[64px] bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(16,185,129,0.4)] z-70 border-4 border-white overflow-hidden group"
                                            >
                                                {/* Professional Megaphone Model */}
                                                <div className="relative flex items-center justify-center">
                                                  <Megaphone size={28} className="text-white relative z-10 drop-shadow-md" strokeWidth={2.5} fill="rgba(255,255,255,0.1)" />
                                                  <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-white/20 to-transparent rounded-full blur-md opacity-50 scale-150"></div>
                                                  <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/20 rounded-full"></div>
                                                </div>
                                            </motion.button>
                                        </div>
                                    );
                                }

                                const ActiveIcon = item.icon!;
                                const active = activeTab === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={async () => {
                                            setActiveTab(item.id);
                                            if (item.id === 'unreading') setActiveFilter('unreading');
                                            if (item.id === 'reading') setActiveFilter('reading');
                                            
                                            if (item.id === 'logout') {
                                                const storedUser = localStorage.getItem('user');
                                                if (storedUser) {
                                                    const { token } = JSON.parse(storedUser);
                                                    try {
                                                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                                                            method: 'POST',
                                                            headers: { 'Authorization': token }
                                                        });
                                                    } catch (e) {}
                                                }
                                                localStorage.removeItem('user');
                                                window.location.reload();
                                                return;
                                            }
                                        }}
                                        className={cn(
                                            "relative flex flex-col items-center justify-center w-[50px] transition-all duration-500 py-1",
                                            active ? "scale-105" : "opacity-40 hover:opacity-100"
                                        )}
                                    >
                                        <div className={cn(
                                          "p-2 rounded-2xl transition-all duration-300 relative",
                                          active ? "bg-emerald-50 text-emerald-600 shadow-[inset_0_2px_4px_rgba(16,185,129,0.05)]" : "text-slate-500"
                                        )}>
                                          <ActiveIcon size={22} strokeWidth={active ? 2.5 : 2} />
                                          {active && (
                                            <motion.div 
                                              layoutId="nav-dot"
                                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm"
                                            />
                                          )}
                                        </div>
                                        <span className={cn(
                                            "text-[8px] font-black uppercase tracking-tighter mt-1 transition-all duration-300",
                                            active ? "text-emerald-700 opacity-100" : "text-slate-400 opacity-0"
                                        )}>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="room"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="flex flex-col h-full bg-slate-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20v20H20zM0 20c11.046 0 20-8.954 20-20v20H0zM0 20c11.046 0 20 8.954 20 20H0V20zm20 20c0-11.046 8.954-20 20-20v20H20z' fill='%23059669' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}
          >
            {/* Room Header (Glassy & Clean) */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 p-4 pt-12 flex items-center gap-3 z-30">
              <button 
                onClick={handleBack}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 active:bg-emerald-50 active:text-emerald-600 transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                    <Avatar size="sm" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-slate-800 text-sm tracking-tight truncate">
                      {selectedChat?.user_name || selectedChat?.user_gmail}
                  </h2>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      selectedChat?.is_online ? "text-emerald-600" : "text-slate-400"
                    )}>
                      {selectedChat?.is_online ? "Online" : "Offline"}
                    </p>
                </div>
              </div>

              <div className="flex gap-1 relative">
                <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 active:bg-slate-100">
                    <Search size={18} />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsRoomMenuOpen(!isRoomMenuOpen)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 active:bg-slate-100"
                  >
                    <MoreVertical size={18} />
                  </button>
                  <AnimatePresence>
                    {isRoomMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsRoomMenuOpen(false)}></div>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 origin-top-right"
                        >
                          <button 
                            onClick={handleMarkAsUnread}
                            className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            Tandai belum dibaca
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </header>

            {/* Messages Area */}
            <main 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id || idx}
                  className={cn(
                    "max-w-[85%] px-5 py-3.5 rounded-4xl text-xs shadow-md relative",
                    msg.sender === 'admin' 
                      ? "bg-linear-to-br from-emerald-400 to-emerald-500 text-white self-end rounded-tr-none border border-emerald-300 shadow-emerald-100" 
                      : "bg-white text-slate-700 self-start rounded-tl-none border border-slate-100 shadow-slate-100/50"
                  )}
                >
                  {msg.type === 'image' ? (
                    <div className="flex flex-col gap-2">
                      {(() => {
                        const parts = msg.text.split('|');
                        const imgData = parts.length > 1 ? parts[1] : msg.text;
                        const caption = parts.length > 2 ? parts[2] : null;
                        return (
                          <div className="flex flex-col gap-2">
                            <img 
                              src={imgData} 
                              alt="Sent image" 
                              onClick={() => setSelectedImage(imgData)}
                              className="rounded-2xl max-w-[200px] h-auto shadow-sm border border-slate-100 cursor-zoom-in active:scale-95 transition-all"
                            />
                            {caption && (
                              <FormattedText text={caption} className="text-[13px] font-medium leading-relaxed mt-1 px-1" />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : msg.type === 'file' ? (
                    (() => {
                        const parts = msg.text.split('|');
                        const fileName = parts.length > 1 ? parts[0] : "Dokumen";
                        const fileData = parts.length > 1 ? parts[1] : msg.text;
                        return (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 min-w-[180px]">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                              <FileText size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-slate-700 truncate">{fileName}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <button 
                                  onClick={() => viewFile(fileData)}
                                  className="text-[9px] font-black text-emerald-600 hover:underline flex items-center gap-1"
                                >
                                  <Eye size={10} />
                                  Lihat
                                </button>
                                <button 
                                  onClick={() => downloadFile(fileData, fileName)}
                                  className="text-[9px] font-black text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                                >
                                  <Download size={10} />
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                          {(() => {
                            const caption = msg.text.split('|')[2];
                            return caption ? (
                              <div className="mt-3 px-1 border-t border-slate-100 pt-3">
                                <FormattedText text={caption} className="text-[13px] font-medium leading-relaxed" />
                              </div>
                            ) : null;
                          })()}
                          </div>
                      );
                    })()
                  ) : (
                    <FormattedText text={msg.text} className="leading-relaxed" />
                  )}
                  <div className="flex items-center justify-end gap-1.5 mt-2">
                    <span className={cn(
                        "text-[9px] font-bold",
                        msg.sender === 'admin' ? "text-emerald-50" : "text-slate-400"
                    )}>
                      {msg.timestamp}
                    </span>
                    {msg.sender === 'admin' && (
                      <CheckCheck size={12} className="text-emerald-100" />
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 pb-8">
              <div className="bg-slate-50 border border-slate-100 rounded-[28px] overflow-hidden shadow-2xl shadow-slate-200/50">
                {/* Selected Template Preview */}
                <AnimatePresence>
                    {selectedResponse && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex items-start justify-between gap-3"
                        >
                            <div className="flex-1 min-w-0 flex gap-2">
                                <Clock size={14} className="text-emerald-600 shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Draft:</p>
                                    <p className="text-[11px] text-emerald-900/70 italic font-medium leading-relaxed whitespace-pre-wrap">"{selectedResponse.response}"</p>
                                </div>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setSelectedResponse(null)} 
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50 text-slate-400 hover:text-red-500 shrink-0 shadow-sm"
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSendMessage} className="flex flex-col gap-2 p-3">
                    <div className="flex items-end gap-2 bg-slate-50/50 rounded-2xl p-1">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <div className="flex items-center gap-1 mb-1 ml-1">
                            <button type="button" onClick={handleFileClick} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-sm rounded-full active:text-emerald-600 transition-all">
                                <Paperclip size={20} />
                            </button>
                            <button type="button" onClick={() => setIsTemplatePopupOpen(true)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-sm rounded-full active:text-emerald-600 transition-all">
                                <LayoutGrid size={20} />
                            </button>
                        </div>
                        <textarea 
                            id="admin-message-input"
                            value={manualNote}
                            onChange={(e) => {
                                setManualNote(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                            }}
                            placeholder="Tulis pesan..."
                            className="flex-1 py-2.5 px-2 text-[13px] font-medium text-slate-700 bg-transparent focus:outline-none resize-none max-h-[120px] scrollbar-hide"
                            rows={1}
                        />
                        <button 
                            type="submit"
                            disabled={!manualNote.trim() && !selectedResponse}
                            className="w-10 h-10 mb-0.5 mr-0.5 bg-emerald-800 text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shrink-0"
                        >
                            <Send size={18} className="ml-0.5" />
                        </button>
                    </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates Bottom Sheet (Integrated into FAB logic but we can keep it as a standalone drawer if needed) */}
      {/* For now, the user wants the FAB Speed Dial to handle specific actions */}
      {/* Bless Chat Modal Mobile */}
      <AnimatePresence>
        {showBlessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-white rounded-[40px] w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl">📢</span>
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Bless Chat</h3>
                <p className="text-slate-500 text-xs mb-6 font-medium leading-relaxed">
                  Kirim pengumuman penting ke pengguna. Pilih target penerima di bawah ini.
                </p>

                {/* Target Selector */}
                <div className="mb-6 bg-slate-50 p-1 rounded-[16px] border border-slate-100 flex gap-1">
                  <button 
                    onClick={() => setBlessTargetMode('waiting_room')}
                    className={cn(
                      "flex-1 py-2 px-2 rounded-[12px] text-[10px] font-black transition-all duration-300",
                      blessTargetMode === 'waiting_room' ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    )}
                  >
                    Active Room
                  </button>
                  <button 
                    onClick={() => setBlessTargetMode('all_users')}
                    className={cn(
                      "flex-1 py-2 px-2 rounded-[12px] text-[10px] font-black transition-all duration-300",
                      blessTargetMode === 'all_users' ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    )}
                  >
                    Semua Akun
                  </button>
                  <button 
                    onClick={() => setBlessTargetMode('specific_users')}
                    className={cn(
                      "flex-1 py-2 px-2 rounded-[12px] text-[10px] font-black transition-all duration-300",
                      blessTargetMode === 'specific_users' ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    )}
                  >
                    Pilih User
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {blessTargetMode === 'specific_users' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden flex flex-col gap-3"
                    >
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Cari nama atau email..." 
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-[12px] text-[11px] font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto bg-slate-50 rounded-[12px] border border-slate-100 p-1.5 flex flex-col gap-1 scrollbar-hide">
                        {allUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.gmail.toLowerCase().includes(userSearchQuery.toLowerCase())).map(user => (
                          <label key={user.gmail} className="flex items-center gap-3 p-2 hover:bg-white rounded-[8px] cursor-pointer transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
                            <div className={cn(
                              "w-4 h-4 rounded shadow-inner flex items-center justify-center transition-colors border shrink-0",
                              selectedBlessUsers.includes(user.gmail) ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-300"
                            )}>
                              {selectedBlessUsers.includes(user.gmail) && <CheckCheck size={10} />}
                            </div>
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={selectedBlessUsers.includes(user.gmail)}
                              onChange={() => {
                                setSelectedBlessUsers(prev => 
                                  prev.includes(user.gmail) ? prev.filter(g => g !== user.gmail) : [...prev, user.gmail]
                                );
                              }}
                            />
                            <div className="flex flex-col min-w-0">
                              <span className="text-[11px] font-bold text-slate-700 truncate">{user.username}</span>
                              <span className="text-[9px] font-medium text-slate-400 truncate">{user.gmail}</span>
                            </div>
                          </label>
                        ))}
                        {allUsers.length === 0 && (
                          <p className="text-center text-[9px] font-bold text-slate-400 p-3">Memuat data user...</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Pilih Templat:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                    {blastTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setBlessMessage(template.content)}
                        className="whitespace-nowrap px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100 transition-all active:scale-95"
                      >
                        {template.name}
                      </button>
                    ))}
                    <button
                      onClick={() => setBlessMessage('')}
                      className="whitespace-nowrap px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black rounded-full border border-slate-200 transition-all active:scale-95"
                    >
                      Kosongkan
                    </button>
                  </div>
                </div>

                <textarea
                  value={blessMessage}
                  onChange={(e) => setBlessMessage(e.target.value)}
                  placeholder={blessFile ? "Tambahkan keterangan..." : "Tulis pesan sakti Anda..."}
                  className="w-full h-36 p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-medium"
                />

                <div className="mt-4 flex items-center justify-between px-2">
                    <div className="flex flex-col gap-3 w-full">
                      <div className="flex items-center gap-2">
                        <input 
                          type="file" 
                          id="bless-file-mobile" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 1024 * 1024) {
                                alert(`Waduh bro! Ukuran file lu (${(file.size / (1024 * 1024)).toFixed(2)} MB) kegedean. Maksimal cuma boleh 1 MB biar server tetep ngebut!`);
                                e.target.value = '';
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setBlessFile({
                                  name: file.name,
                                  data: reader.result as string,
                                  type: file.type.startsWith('image/') ? 'image' : 'file'
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <label 
                          htmlFor="bless-file-mobile"
                          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 active:bg-emerald-100 text-emerald-600 rounded-[16px] text-[10px] font-black cursor-pointer transition-all border border-emerald-100"
                        >
                          <Paperclip size={14} />
                          {blessFile ? 'Ganti File' : 'Lampirkan File'}
                        </label>
                        {blessFile && (
                          <button 
                            onClick={() => setBlessFile(null)}
                            className="text-rose-500 text-[10px] font-black"
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      {/* Preview Section Mobile */}
                      {blessFile && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                          {blessFile.type === 'image' ? (
                            <div className="flex flex-col gap-2">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Preview Gambar:</p>
                              <img 
                                src={blessFile.data} 
                                alt="Preview" 
                                onClick={() => setSelectedImage(blessFile.data)}
                                className="w-full max-h-48 object-contain rounded-xl border border-slate-200 bg-slate-100/50"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                  <FileText size={16} className="text-emerald-600" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-700 truncate">{blessFile.name}</p>
                              </div>
                              <button 
                                onClick={() => viewFile(blessFile.data)}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-[9px] font-black text-slate-600 rounded-lg flex items-center gap-1"
                              >
                                <Eye size={12} />
                                Lihat
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => {
                    setShowBlessModal(false);
                    setBlessFile(null);
                    setBlessMessage('');
                    setSelectedBlessUsers([]);
                  }}
                  className="flex-1 py-4 rounded-2xl text-xs font-black text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={handleBlessChat}
                  disabled={isBlasting || (!blessMessage.trim() && !blessFile)}
                  className="flex-2 py-4 bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                  {isBlasting ? 'Mengirim...' : 'Bless Now!'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Image Lightbox Modal */}
      {/* Template Popup Modal */}
      <AnimatePresence>
        {isTemplatePopupOpen && (
          <div className="fixed inset-0 z-999 flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTemplatePopupOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-xl bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 bg-emerald-800 text-white flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-black tracking-tight">Template Balasan</h3>
                  <p className="text-emerald-100/60 text-[9px] font-bold uppercase tracking-widest mt-1">Pilih kategori bantuan</p>
                </div>
                <button 
                  onClick={() => setIsTemplatePopupOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories Tabs - Horizontal Scroll */}
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 overflow-x-auto scrollbar-hide flex gap-3 shrink-0">
                {Array.from(new Set(cannedResponses.map(r => r.category))).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "shrink-0 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                      activeCategory === cat 
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                        : "bg-white text-slate-400 border border-slate-100"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Questions List */}
              <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col gap-4">
                  {cannedResponses.filter(r => r.category === activeCategory).map(resp => (
                    <motion.button
                      key={resp.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedResponse(resp);
                        setIsTemplatePopupOpen(false);
                      }}
                      className="p-5 bg-white border border-slate-100 rounded-[28px] text-left active:border-emerald-200 active:bg-emerald-50/30 transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-2">
                         <span className="px-2 py-0.5 bg-emerald-50 text-[7px] font-black text-emerald-600 rounded uppercase tracking-widest">{resp.keyword}</span>
                      </div>
                      <p className="text-sm font-black text-slate-800 leading-tight mb-2">{resp.question}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{resp.response}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center shrink-0">
                 <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-lg"
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Enlarged"
              className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl object-contain border-4 border-white/10"
            />
            <button 
              className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20"
              onClick={() => setSelectedImage(null)}
            >
              Tutup Galeri
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI CONFIRMATION MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showAIConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-200 flex items-end justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowAIConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
              {/* Header Gradient */}
              <div className={`p-6 ${pendingAIState ? 'bg-linear-to-br from-emerald-500 to-emerald-700' : 'bg-linear-to-br from-slate-600 to-slate-800'} relative overflow-hidden`}>
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
                    <span className="text-2xl">{pendingAIState ? '🤖' : '🔕'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-0.5">Konfirmasi</p>
                    <h3 className="text-lg font-black text-white leading-tight">
                      {pendingAIState ? 'Aktifkan AI?' : 'Matikan AI?'}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-4">
                {pendingAIState ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                      Fitur <span className="text-emerald-600">Auto-Response AI</span> akan diaktifkan untuk semua chat yang masuk.
                    </p>
                    <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col gap-2 border border-emerald-100">
                      <div className="flex items-start gap-2.5">
                        <span className="text-sm mt-0.5">✅</span>
                        <p className="text-xs font-semibold text-slate-600">AI akan otomatis menjawab pertanyaan user berdasarkan template yang sudah dilatih</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-sm mt-0.5">✅</span>
                        <p className="text-xs font-semibold text-slate-600">Respons akan muncul dalam hitungan detik</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-sm mt-0.5">⚠️</span>
                        <p className="text-xs font-semibold text-slate-500">Pastikan ML Service sudah berjalan sebelum mengaktifkan</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                      Fitur <span className="text-slate-600">Auto-Response AI</span> akan dinonaktifkan.
                    </p>
                    <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-2 border border-slate-100">
                      <div className="flex items-start gap-2.5">
                        <span className="text-sm mt-0.5">ℹ️</span>
                        <p className="text-xs font-semibold text-slate-600">Semua chat selanjutnya harus dijawab secara manual oleh admin</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-sm mt-0.5">ℹ️</span>
                        <p className="text-xs font-semibold text-slate-600">Chat yang sedang berjalan tidak terpengaruh</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-1">
                  <button
                    onClick={() => setShowAIConfirm(false)}
                    className="flex-1 py-3.5 rounded-2xl text-xs font-black text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleToggleAI(pendingAIState)}
                    className={`flex-1 py-3.5 rounded-2xl text-xs font-black text-white shadow-lg transition-all active:scale-95 ${
                      pendingAIState
                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                        : 'bg-slate-700 hover:bg-slate-800 shadow-slate-200'
                    }`}
                  >
                    {pendingAIState ? '🚀 Ya, Aktifkan!' : '🔕 Ya, Matikan'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ──────────────────────────────────────────────────────────────────── */}
    </div>
  );
};

export default MobileLayout;
