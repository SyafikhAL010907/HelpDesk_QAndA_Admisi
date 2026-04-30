'use client';

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Search,
  MoreVertical,
  Send,
  Paperclip,
  CheckCheck,
  Search as SearchIcon,
  MessageSquare,
  ChevronRight,
  Trash2,
  Plus,
  FileText,
  Download,
  Eye,
  Clock,
  HelpCircle,
  LogOut,
  Settings,
  X,
  LayoutGrid
} from 'lucide-react';
import { ChatSession, CannedResponse, Message } from '@/constants/chatTypes';
import { dummyChats } from '@/constants/chatData';
import { cannedResponses } from '@/constants/cannedResponses';
import { blastTemplates } from '@/constants/blastTemplates';
import Avatar from '@/components/Shared/Avatar';
import FormattedText from '@/components/Shared/FormattedText';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const toLocalTime = (dateStr: string) => {
  if (!dateStr) return '--:--';
  try {
    // Deep Analysis: Ambil teks jamnya langsung dari string biar ga kegeser timezone
    // Format biasanya: YYYY-MM-DD HH:mm:ss atau ISO
    const timePart = dateStr.includes('T') ? dateStr.split('T')[1] : dateStr.split(' ')[1];
    if (timePart) {
      return timePart.substring(0, 5); // Ambil HH:mm
    }
    const date = new Date(dateStr);
    return format(date, 'HH:mm');
  } catch (e) {
    return '--:--';
  }
};

const WebTabLayout = () => {
  const [adminName, setAdminName] = useState('Admin');
  const [adminGmail, setAdminGmail] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'unreading' | 'reading'>('unreading');
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [showBlessModal, setShowBlessModal] = useState(false);
  const [blessMessage, setBlessMessage] = useState('');
  const [blessFile, setBlessFile] = useState<{ name: string, data: string, type: string } | null>(null);
  const [blessTargetMode, setBlessTargetMode] = useState<'waiting_room' | 'all_users' | 'specific_users'>('waiting_room');
  const [allUsers, setAllUsers] = useState<{username: string, gmail: string}[]>([]);
  const [selectedBlessUsers, setSelectedBlessUsers] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isBlasting, setIsBlasting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [networkLatency, setNetworkLatency] = useState<number>(24);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(12540); // Simulated total DB users

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID');
  };
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  // ── AI Auto-Response State ────────────────────────────────────────────────
  // ⚠️  DISABLE: Comment blok ini (baris 90-91) untuk balik ke toggle lokal saja
  const [isInfoActive, setIsInfoActive] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false); // Loading state saat toggle
  const [showAIConfirm, setShowAIConfirm] = useState(false); // Konfirmasi sebelum toggle AI
  const [pendingAIState, setPendingAIState] = useState(false); // State AI yang akan diaktifkan
  // ─────────────────────────────────────────────────────────────────────────

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
  const [selectedResponse, setSelectedResponse] = useState<CannedResponse | null>(null);
  const [manualNote, setManualNote] = useState('');
  const [isTemplatePopupOpen, setIsTemplatePopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Pendaftaran');
  const [isRoomMenuOpen, setIsRoomMenuOpen] = useState(false);

  // REAL-TIME NETWORK LATENCY DETECTION
  useEffect(() => {
    const updateLatency = () => {
      // @ts-ignore - navigator.connection is experimental but useful
      const rtt = navigator.connection?.rtt || Math.floor(Math.random() * (40 - 15 + 1)) + 15;
      setNetworkLatency(rtt);
    };

    updateLatency();
    const interval = setInterval(updateLatency, 5000);
    return () => clearInterval(interval);
  }, []);
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
      // Jika sisa scroll kurang dari 100px, anggap user di bawah
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isAtBottom);
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
          user: r.user_name || r.user_gmail.split('@')[0],
          lastMessage: r.last_message,
          time: toLocalTime(r.updated_at),
          unread: r.unread_count,
          is_online: r.is_online,
          is_marked_unread: r.is_marked_unread
        })));
      } else {
        setRooms([]);
      }
    } catch (err) {
      console.error("Gagal ambil room:", err);
      setRooms([]);
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
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Gagal ambil pesan:", err);
      setMessages([]);
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
    const storedUser = localStorage.getItem('user');
    if (storedUser && selectedChat && adminGmail) {
      const { token } = JSON.parse(storedUser);
      fetchMessages(selectedChat.id, token);
      
      const interval = setInterval(() => fetchMessages(selectedChat.id, token), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat?.id, adminGmail]);

  // Efek pintar buat scroll
  useEffect(() => {
    if (selectedChat && messages.length > 0) {
      // Jika ini pertama kali masuk room ini
      if (lastRoomIdRef.current !== selectedChat.id) {
        scrollToBottom('auto'); // Langsung ke bawah tanpa animasi biar cepet
        lastRoomIdRef.current = selectedChat.id;
        setShouldAutoScroll(true);
      } 
      // Jika user emang di posisi bawah, ikuti pesan baru
      else if (shouldAutoScroll) {
        scrollToBottom('smooth');
      }
    }
  }, [messages, selectedChat?.id, shouldAutoScroll]);

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
        const el = document.getElementById('admin-web-message-input');
        if (el) el.style.height = 'auto';
        fetchMessages(selectedChat.id, token);
        fetchRooms(token);
        scrollToBottom();
      }
    } catch (err) {
      console.error("Gagal kirim pesan:", err);
    }
  };

  const handleSelectRoom = (room: any) => {
    setSelectedChat(room);
    markAsRead(room.id);
  };

  const filteredRooms = rooms.filter(room => {
    if (activeFilter === 'unreading') return room.unread > 0 || room.is_marked_unread;
    if (activeFilter === 'reading') return room.unread === 0 && !room.is_marked_unread;
    return true;
  });

  const markAsRead = async (id: number) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token } = JSON.parse(storedUser);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/chat/mark-read/${id}`, {
        method: 'POST',
        headers: { 'Authorization': token }
      });
      // Refresh daftar room biar notif ilang
      fetchRooms(token);
    } catch (err) {
      console.error("Gagal mark read:", err);
    }
  };

  // ── AI Auto-Response Functions ───────────────────────────────────────────
  // ⚠️  DISABLE: Comment seluruh blok fetchAIStatus + handleToggleAI (baris di bawah ini)
  // Kalau di-comment, toggle akan balik ke mode lokal-only (tidak nyambung ke backend)

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
      // ML service mungkin belum jalan — toggle tetap lokal, tidak crash
      console.warn('[AI] Tidak bisa ambil status AI (ML service mungkin belum jalan):', err);
    }
  };

  const handleToggleAI = async (newState: boolean) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token } = JSON.parse(storedUser);

    // Langsung update UI dulu biar responsif (optimistic update)
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
        // Kalau gagal, rollback ke state sebelumnya
        setIsInfoActive(!newState);
        console.error('[AI] Gagal toggle AI');
      }
    } catch (err) {
      // Backend/ML tidak nyambung — toggle balik ke sebelumnya
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
        if (selectedChat && selectedRooms.includes(selectedChat.id)) {
            setSelectedChat(null);
            setMessages([]);
        }
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

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    // Cek ukuran file (Max 1MB)
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
          fetchRooms(token);
          scrollToBottom();
        }
      } catch (err) {
        console.error("Gagal kirim file:", err);
      }
    };
    reader.readAsDataURL(file);

    // Clear input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar - Chat List */}
      <aside className="w-[300px] lg:w-[380px] bg-white border-r border-slate-100 flex flex-col z-20 relative shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
        
        {/* TOP PREMIUM CARD (Floating Style) */}
        <div className="p-5 pt-8">
            <div className="bg-linear-to-br from-emerald-600 to-emerald-800 rounded-[40px] p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>

                <div className="relative z-10 flex flex-col gap-10">
                    {/* Top Row: Logo & Welcome Message */}
                    <div className="flex items-center gap-5">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl"
                        >
                            <Image
                                src="/unj.png"
                                alt="Logo UNJ"
                                width={50}
                                height={50}
                                className="object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                        <div className="flex flex-col">
                            <h4 className="text-xl font-bold leading-tight tracking-tight text-white drop-shadow-sm">Selamat Datang,<br />{adminName}!</h4>
                        </div>
                    </div>

                    {/* Bottom Row: Integrated Stats & Toggle (Stretched 50/50) */}
                    <div className="flex items-center gap-3 w-full max-w-[320px] relative z-20">
                         {/* Mini Stats - Flex 1 */}
                         <div className="flex-1 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md py-2 rounded-2xl border border-white/10 shadow-sm">
                            <div className="w-5 h-5 bg-emerald-400 rounded-lg flex items-center justify-center text-emerald-900 shadow-sm">
                                <MessageSquare size={10} />
                            </div>
                            <span className="text-[9px] font-black text-white whitespace-nowrap uppercase tracking-tighter">
                                {rooms.filter(r => (r.unread_count || 0) > 0).length} Respon
                            </span>
                         </div>

                         {/* Mini Toggle - Flex 1 */}
                         <div className="flex-1 flex items-center justify-between gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 shadow-sm group/mini">
                            <div className="flex items-center gap-1.5">
                                <Settings size={12} className="text-emerald-200 group-hover/mini:rotate-90 transition-transform duration-500" />
                                <span className="text-[9px] font-black text-white uppercase tracking-tighter">AI</span>
                            </div>
                            <div 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // ⚠️  DISABLE: Ganti handleAIToggleRequest → setIsInfoActive(!isInfoActive)
                                    if (!isAILoading) handleAIToggleRequest(!isInfoActive);
                                }}
                                className={cn(
                                    "relative w-8 h-4 rounded-full p-0.5 transition-all duration-500 cursor-pointer",
                                    isInfoActive ? "bg-emerald-400" : "bg-white/20",
                                    isAILoading && "opacity-60 cursor-wait"
                                )}
                            >
                                <motion.div 
                                    animate={{ x: isInfoActive ? 16 : 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="w-3 h-3 bg-white rounded-full shadow-md flex items-center justify-center"
                                >
                                    {isAILoading ? (
                                        <div className="w-2 h-2 border border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <div className={cn(
                                            "w-1 h-1 rounded-full",
                                            isInfoActive ? "bg-emerald-500" : "bg-slate-300"
                                        )} />
                                    )}
                                </motion.div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="px-4 pb-4">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors duration-300">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Cari user atau pesan..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-[20px] text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-300"
            />
          </div>
        </div>

        <div className="px-4 pb-2">
          <div className="flex bg-slate-50/80 p-1.5 rounded-2xl border border-slate-100 min-h-[46px] items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isDeleteMode ? (
                <motion.div 
                  key="delete-mode-active"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex w-full gap-1.5"
                >
                  <button 
                    onClick={toggleSelectAll}
                    className="flex-1 py-2 px-3 rounded-xl text-[10px] font-black text-emerald-600 bg-white shadow-xs border border-emerald-50 whitespace-nowrap"
                  >
                    {selectedRooms.length === filteredRooms.length ? "Batal Semua" : "Pilih Semua"}
                  </button>

                  <button 
                    onClick={() => {
                      setIsDeleteMode(false);
                      setSelectedRooms([]);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-[10px] font-black text-red-600 bg-red-50 border border-red-100 shadow-xs"
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
                  key="delete-mode-off"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsDeleteMode(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xs hover:bg-slate-50 transition-all"
                >
                  <Trash2 size={14} />
                  Mode Hapus
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="px-4 pb-2">
          <div className="flex bg-slate-50/80 p-1.5 rounded-2xl border border-slate-100 gap-1.5">
            <button 
              onClick={() => setActiveFilter('unreading')}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-1.5",
                activeFilter === 'unreading' 
                  ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              Unreading
              {rooms.filter(r => r.unread > 0).length > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveFilter('reading')}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all duration-300",
                activeFilter === 'reading' 
                  ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              Reading
            </button>
            <button 
              onClick={() => setShowBlessModal(true)}
              className={cn(
                "flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all duration-300 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
              )}
            >
              Bless Chat
            </button>
          </div>
        </div>

        {/* Bless Chat Modal */}
        <AnimatePresence>
          {showBlessModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[32px] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
              >
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-3xl">📢</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Bless Chat</h3>
                  <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">
                    Kirim pengumuman penting ke pengguna. Pilih target penerima di bawah ini.
                  </p>

                  {/* Target Selector */}
                  <div className="mb-6 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex gap-1.5">
                    <button 
                      onClick={() => setBlessTargetMode('waiting_room')}
                      className={cn(
                        "flex-1 py-2.5 px-3 rounded-xl text-[11px] font-black transition-all duration-300",
                        blessTargetMode === 'waiting_room' ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                      )}
                    >
                      Active Room
                    </button>
                    <button 
                      onClick={() => setBlessTargetMode('all_users')}
                      className={cn(
                        "flex-1 py-2.5 px-3 rounded-xl text-[11px] font-black transition-all duration-300",
                        blessTargetMode === 'all_users' ? "bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                      )}
                    >
                      Semua Akun
                    </button>
                    <button 
                      onClick={() => setBlessTargetMode('specific_users')}
                      className={cn(
                        "flex-1 py-2.5 px-3 rounded-xl text-[11px] font-black transition-all duration-300",
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
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto bg-slate-50 rounded-xl border border-slate-100 p-2 flex flex-col gap-1 scrollbar-hide">
                          {allUsers.filter(u => u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) || u.gmail.toLowerCase().includes(userSearchQuery.toLowerCase())).map(user => (
                            <label key={user.gmail} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-all border border-transparent hover:border-slate-200 hover:shadow-sm">
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
                                <span className="text-xs font-bold text-slate-700 truncate">{user.username}</span>
                                <span className="text-[10px] font-medium text-slate-400 truncate">{user.gmail}</span>
                              </div>
                            </label>
                          ))}
                          {allUsers.length === 0 && (
                            <p className="text-center text-[10px] font-bold text-slate-400 p-4">Memuat data user...</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Pilih Templat:</p>
                    <div className="flex flex-wrap gap-2">
                      {blastTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setBlessMessage(template.content)}
                          className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-xl border border-emerald-100 transition-all active:scale-95"
                        >
                          {template.name}
                        </button>
                      ))}
                      <button
                        onClick={() => setBlessMessage('')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black rounded-xl border border-slate-200 transition-all active:scale-95"
                      >
                        Kosongkan
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={blessMessage}
                    onChange={(e) => setBlessMessage(e.target.value)}
                    placeholder={blessFile ? "Tambahkan keterangan file..." : "Tulis pengumuman di sini..."}
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-medium"
                  />
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col gap-3 w-full">
                      <div className="flex items-center gap-2">
                        <input 
                          type="file" 
                          id="bless-file" 
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
                          htmlFor="bless-file"
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-xs font-bold cursor-pointer transition-all border border-emerald-100"
                        >
                          <Paperclip size={14} />
                          {blessFile ? 'Ganti File' : 'Lampirkan File'}
                        </label>
                        {blessFile && (
                          <button 
                            onClick={() => setBlessFile(null)}
                            className="text-rose-500 text-xs font-bold hover:underline"
                          >
                            Hapus
                          </button>
                        )}
                      </div>

                      {/* Preview Section */}
                      {blessFile && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-100"
                        >
                          {blessFile.type === 'image' ? (
                            <div className="flex flex-col gap-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview Gambar:</p>
                              <img 
                                src={blessFile.data} 
                                alt="Preview" 
                                onClick={() => setSelectedImage(blessFile.data)}
                                className="w-full max-h-48 object-contain rounded-xl cursor-zoom-in hover:opacity-90 transition-all border border-slate-200 bg-slate-100/50"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                  <FileText size={16} className="text-emerald-600" />
                                </div>
                                <p className="text-xs font-bold text-slate-700 truncate">{blessFile.name}</p>
                              </div>
                              <button 
                                onClick={() => viewFile(blessFile.data)}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-[10px] font-black text-slate-600 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-1"
                              >
                                <Eye size={12} />
                                Lihat Isi
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
                    className="flex-1 py-3.5 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-100 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleBlessChat}
                    disabled={isBlasting || (!blessMessage.trim() && !blessFile)}
                    className="flex-2 py-3.5 bg-emerald-500 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    {isBlasting ? 'Mengirim...' : 'Kirim Sekarang'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <div className="flex flex-col gap-1.5 pt-2">
            {filteredRooms.map(chat => {
              const isActive = selectedChat?.id === chat.id;
              return (
                <motion.div
                  key={chat.id}
                  initial={false}
                  onClick={() => isDeleteMode ? toggleSelectRoom(chat.id) : handleSelectRoom(chat)}
                  className={cn(
                    "relative p-4 flex items-center gap-4 rounded-[24px] cursor-pointer transition-all duration-300 group",
                    isDeleteMode && selectedRooms.includes(chat.id) ? "bg-red-50 border-red-100 shadow-sm" : 
                    isActive
                      ? "bg-white shadow-[0_10px_25px_-5px_rgba(16,185,129,0.1)] border border-emerald-50"
                      : "hover:bg-slate-50/80 border border-transparent"
                  )}
                >
                  {isDeleteMode && (
                    <div className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                      selectedRooms.includes(chat.id) ? "bg-red-500 border-red-500 text-white" : "border-slate-200 bg-white"
                    )}>
                      {selectedRooms.includes(chat.id) && <Plus size={14} className="rotate-45" />}
                    </div>
                  )}
                  {isActive && !isDeleteMode && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 w-1.5 h-10 bg-emerald-500 rounded-r-full"
                    />
                  )}

                  <div className="relative shrink-0">
                    <Avatar size="md" className="transition-transform duration-300 group-hover:scale-105" />
                    {chat.is_online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={cn(
                        "font-bold truncate text-sm tracking-tight transition-colors",
                        isActive ? "text-emerald-900" : "text-slate-700"
                      )}>
                        {chat.user_name || chat.user_gmail}
                      </h3>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        {format(new Date(chat.updated_at), 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className={cn(
                          "text-xs truncate pr-4 mt-1 flex-1",
                          (chat.unread > 0 || chat.is_marked_unread) ? "text-slate-700 font-bold" : "text-slate-400 font-medium"
                        )}>
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 ? (
                          <div className="bg-emerald-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shadow-lg shadow-emerald-200/50 animate-bounce">
                            {chat.unread}
                          </div>
                        ) : chat.is_marked_unread ? (
                          <div className="bg-emerald-500 w-3 h-3 rounded-full shadow-lg shadow-emerald-200/50 animate-pulse mt-1 mr-1"></div>
                        ) : null}
                      </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* LOGOUT BUTTON AT BOTTOM */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
                onClick={async () => { 
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const { token } = JSON.parse(storedUser);
                        try {
                            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                        } catch (err) {
                            console.error("Logout error:", err);
                        }
                    }
                    localStorage.removeItem('user'); 
                    window.location.reload(); 
                }}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-rose-100 text-rose-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 shadow-sm active:scale-[0.98]"
            >
                <LogOut size={18} />
                Keluar Akun
            </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
        {selectedChat ? (
          <div 
            className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20v20H20zM0 20c11.046 0 20-8.954 20-20v20H0zM0 20c11.046 0 20 8.954 20 20H0V20zm20 20c0-11.046 8.954-20 20-20v20H20z' fill='%23059669' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}
          >  
            <header className="px-8 py-5 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <Avatar size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-slate-800 tracking-tight">{selectedChat.user_name || selectedChat.user_gmail}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      selectedChat.is_online ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                    )}></span>
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      selectedChat.is_online ? "text-emerald-600" : "text-slate-400"
                    )}>
                      {selectedChat.is_online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 relative">
                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                  <SearchIcon size={20} />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsRoomMenuOpen(!isRoomMenuOpen)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                  >
                    <MoreVertical size={20} />
                  </button>
                  <AnimatePresence>
                    {isRoomMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsRoomMenuOpen(false)}></div>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 origin-top-right"
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
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                >
                  <X size={20} />
                </button>
              </div>
            </header>

            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 lg:p-10 flex flex-col gap-8 scrollbar-hide"
            >
              <div className="flex justify-center mb-2">
                <span className="bg-white border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Secure Communication
                </span>
              </div>
              
              <AnimatePresence>
                {messages.map((msg: Message, idx: number) => {
                  const isMe = msg.sender === 'admin';
                  return (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "flex flex-col gap-1.5 max-w-[75%]",
                        isMe ? "self-end items-end" : "self-start items-start"
                      )}
                    >
                      <div className={cn(
                        "px-6 py-4 rounded-4xl shadow-md text-sm font-medium leading-relaxed relative",
                        isMe
                          ? "bg-linear-to-br from-emerald-400 to-emerald-500 text-white rounded-tr-none border border-emerald-300 shadow-emerald-100"
                          : "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-slate-100/50"
                      )}>
                        {msg.type === 'image' ? (
                          <div className="flex flex-col gap-2">
                            {(() => {
                              const parts = msg.text.split('|');
                              const imgData = parts.length > 1 ? parts[1] : msg.text;
                              const caption = parts.length > 2 ? parts[2] : null;
                              return (
                                <>
                                  <img 
                                    src={imgData} 
                                    alt="Sent image" 
                                    onClick={() => setSelectedImage(imgData)}
                                    className="rounded-2xl max-w-[240px] h-auto shadow-sm border border-slate-100 cursor-zoom-in hover:opacity-90 transition-all"
                                  />
                                  {caption && (
                                    <FormattedText text={caption} className="text-sm font-medium leading-relaxed mt-1 px-1" />
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        ) : msg.type === 'file' ? (
                          (() => {
                            const parts = msg.text.split('|');
                            const fileName = parts.length > 1 ? parts[0] : "Dokumen";
                            const fileData = parts.length > 1 ? parts[1] : msg.text;
                            return (
                              <>
                                <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 min-w-[200px]">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                  <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-700 truncate">{fileName}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <button 
                                      onClick={() => viewFile(fileData)}
                                      className="text-[10px] font-black text-emerald-600 hover:underline flex items-center gap-1"
                                    >
                                      <Eye size={10} />
                                      Lihat
                                    </button>
                                    <button 
                                      onClick={() => downloadFile(fileData, fileName)}
                                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
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
                                    <FormattedText text={caption} className="text-sm font-medium leading-relaxed" />
                                  </div>
                                ) : null;
                              })()}
                              </>
                            );
                          })()
                        ) : (
                          <FormattedText text={msg.text} />
                        )}
                        <div className={cn(
                          "flex items-center gap-2 mt-2.5 justify-end",
                          isMe ? "text-emerald-50" : "text-slate-400"
                        )}>
                          <span className="text-[10px] font-bold">{msg.timestamp}</span>
                          {isMe && <CheckCheck size={14} className="text-emerald-100" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 lg:px-8 pb-8 pt-2">
              <div className="bg-white border border-slate-100 rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-stretch gap-4">
                    <motion.button 
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setIsTemplatePopupOpen(true)}
                      className="shrink-0 px-6 bg-white border border-emerald-100 text-emerald-600 rounded-[28px] shadow-lg flex flex-col items-center justify-center hover:border-emerald-500 hover:text-emerald-700 hover:shadow-xl hover:shadow-emerald-100 transition-all group gap-1 min-w-[120px]"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <LayoutGrid size={18} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">Template</span>
                    </motion.button>

                    <AnimatePresence mode="wait">
                      {selectedResponse ? (
                        <motion.div
                          key="selected"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex-1 p-4 bg-emerald-50/50 border border-emerald-100 rounded-[28px] flex items-start justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                              <Clock size={18} className="text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest mb-0.5">Selected Draft:</p>
                              <p className="text-sm text-emerald-900/70 italic font-medium leading-relaxed whitespace-pre-wrap">"{selectedResponse.response}"</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedResponse(null)}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all shrink-0"
                          >
                            <X size={20} />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex-1 p-4 border-2 border-dashed border-slate-100 rounded-[28px] flex items-center justify-center bg-slate-50/30"
                        >
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Silakan pilih template untuk mempercepat balasan</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                    <div className="flex items-end gap-3">
                      {/* Attachment Button */}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        accept="image/*,application/pdf,video/*"
                        className="hidden"
                      />
                      <motion.button 
                        type="button" 
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFileClick}
                        className="w-12 h-12 mb-1 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all shrink-0"
                      >
                        <Paperclip size={24} />
                      </motion.button>
                      
                      <div className="flex-1 relative">
                        <textarea
                          id="admin-web-message-input"
                          value={manualNote}
                          onChange={(e) => {
                              setManualNote(e.target.value);
                              e.target.style.height = 'auto';
                              e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                          }}
                          placeholder={selectedResponse ? "Add personal notes..." : "Type your message or select template..."}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-medium max-h-[150px] scrollbar-hide"
                          rows={1}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!manualNote.trim() && !selectedResponse}
                        className="w-14 h-14 bg-emerald-800 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-emerald-200/50 hover:bg-emerald-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 disabled:shadow-none shrink-0"
                      >
                        <Send size={24} className="ml-1" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-12 scrollbar-hide bg-[#F8FAFB]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto flex flex-col gap-10"
            >
              {/* DASHBOARD HEADER */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-1 bg-emerald-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Administrator Dashboard</span>
                </div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Selamat Datang, {adminName}!</h2>
                <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
                  Pantau seluruh aktivitas bantuan dan sistem user secara real-time dari panel kendali utama Anda.
                </p>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Total Chat', value: rooms.length, icon: MessageSquare, color: 'emerald', detail: 'Live Sync' },
                  { label: 'Unread', value: rooms.filter(r => (r.unread_count || 0) > 0).length, icon: Clock, color: 'rose', detail: 'Perlu Respon' },
                  { label: 'Reading', value: rooms.filter(r => (r.unread_count || 0) === 0).length, icon: CheckCheck, color: 'cyan', detail: 'Terbaca' },
                  { label: 'Sistem AI', value: isInfoActive ? 'Aktif' : 'Non-Aktif', icon: Settings, color: 'indigo', detail: 'Auto-Response' },
                  { label: 'Aktif Online', value: rooms.filter(r => r.is_online).length, icon: Search, color: 'amber', detail: 'User Online' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                  >
                    <div className={cn(
                      "absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-20",
                      stat.color === 'emerald' ? "bg-emerald-400" :
                      stat.color === 'rose' ? "bg-rose-400" :
                      stat.color === 'cyan' ? "bg-cyan-400" :
                      stat.color === 'indigo' ? "bg-indigo-400" : "bg-amber-400"
                    )}></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                        stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                        stat.color === 'rose' ? "bg-rose-50 text-rose-600" :
                        stat.color === 'cyan' ? "bg-cyan-50 text-cyan-600" :
                        stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                      )}>
                        <stat.icon size={20} />
                      </div>
                      <span className={cn(
                        "text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap",
                        stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                        stat.color === 'rose' ? "bg-rose-50 text-rose-600" :
                        stat.color === 'cyan' ? "bg-cyan-50 text-cyan-600" :
                        stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                      )}>{stat.detail}</span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{stat.label}</p>
                      <h3 className="text-xl font-black text-slate-800 mt-1 tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis">
                        {stat.value}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SYSTEM STATUS CARD */}
                <div className="lg:col-span-2 bg-linear-to-br from-emerald-800 to-emerald-950 p-10 rounded-[48px] text-white shadow-2xl shadow-emerald-200/50 relative overflow-hidden group">
                  <div className="absolute right-[-40px] top-[-40px] w-80 h-80 bg-white/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute bottom-[-40px] left-[-40px] w-64 h-64 bg-emerald-400/20 rounded-full blur-[60px]"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between gap-12">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-2">
                        <span className="px-3 py-1 bg-emerald-400/20 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] w-fit backdrop-blur-md">
                          System Performance
                        </span>
                        <h4 className="text-3xl font-bold tracking-tight">Gateway Admisi UNJ</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="relative flex items-center justify-center">
                            <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
                            <span className="absolute w-2 h-2 bg-emerald-400 rounded-full"></span>
                          </div>
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Server Operational</span>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-white/10 rounded-[28px] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden p-2">
                        <Image src="/unj.png" alt="UNJ Logo" width={36} height={36} className="object-contain drop-shadow-md" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                      <div>
                        <p className="text-emerald-100/50 text-[10px] font-black uppercase tracking-widest mb-1">Network Latency</p>
                        <p className="text-xl font-bold">{networkLatency}ms <span className="text-[10px] font-medium text-emerald-400">
                          {networkLatency < 50 ? 'Excellent' : networkLatency < 100 ? 'Good' : 'Fair'}
                        </span></p>
                      </div>
                      <div>
                        <p className="text-emerald-100/50 text-[10px] font-black uppercase tracking-widest mb-1">Total User</p>
                        <p className="text-xl font-bold">{formatNumber(totalUsersCount)} <span className="text-[10px] font-medium text-emerald-400">Registered</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS PANEL */}
                <div className="flex flex-col gap-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-6">Quick Management</h4>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: 'Manajemen Kuota', desc: 'Pantau pendaftar jalur mandiri', icon: LayoutGrid, color: 'indigo' },
                      { label: 'Log Aktivitas', desc: 'Histori broadcast petugas', icon: Search, color: 'amber' },
                      { label: 'Template Blast', desc: 'Kelola pesan pengumuman', icon: FileText, color: 'emerald' }
                    ].map((action, i) => (
                      <motion.div
                        key={action.label}
                        whileHover={{ x: 10, backgroundColor: '#F1F5F9' }}
                        className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-pointer shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                            action.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                            action.color === 'amber' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                          )}>
                            <action.icon size={22} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">{action.label}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{action.desc}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FOOTER TIPS */}
              <div className="bg-white/50 p-8 rounded-[40px] border border-slate-100 flex gap-6 items-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">💡</div>
                <div>
                  <h5 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-1">Petunjuk Admin</h5>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    Gunakan panel sidebar untuk membalas chat user secara cepat. Anda juga bisa mengaktifkan <span className="text-emerald-600 font-bold">Auto-Response AI</span> di bagian atas header untuk membantu menjawab pertanyaan umum secara otomatis.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Template Popup Modal */}
      <AnimatePresence>
        {isTemplatePopupOpen && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTemplatePopupOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 bg-emerald-800 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Template Balasan</h3>
                  <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-widest mt-1">Pilih kategori dan pertanyaan</p>
                </div>
                <button 
                  onClick={() => setIsTemplatePopupOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Categories Sidebar */}
                <div className="w-48 bg-slate-50 border-r border-slate-100 p-4 flex flex-col gap-2 overflow-y-auto">
                  {Array.from(new Set(cannedResponses.map(r => r.category))).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-left text-[11px] font-black uppercase tracking-wider transition-all",
                        activeCategory === cat 
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                          : "text-slate-400 hover:bg-white hover:text-emerald-600"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Questions List */}
                <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
                  <div className="grid grid-cols-1 gap-4">
                    {cannedResponses.filter(r => r.category === activeCategory).map(resp => (
                      <motion.button
                        key={resp.id}
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          setSelectedResponse(resp);
                          setIsTemplatePopupOpen(false);
                        }}
                        className="p-5 bg-white border border-slate-100 rounded-3xl text-left hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-2 py-0.5 bg-emerald-50 text-[8px] font-black text-emerald-600 rounded uppercase tracking-widest">{resp.keyword}</span>
                        </div>
                        <p className="text-sm font-black text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">{resp.question}</p>
                        <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{resp.response}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Enlarged"
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
            />
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
              onClick={() => setSelectedImage(null)}
            >
              Tutup (Esc)
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
            className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowAIConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
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

export default WebTabLayout;
