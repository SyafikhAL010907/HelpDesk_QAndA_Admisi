'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  User,
  Plus,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Send,
  Paperclip,
  CheckCheck,
  HelpCircle,
  Search,
  LogOut,
  FileText,
  Download,
  Eye,
  Clock,
  LayoutGrid,
  X,
  Trash2,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { Message, CannedResponse } from '@/constants/chatTypes';
import { cannedQuestions as cannedResponses } from '@/constants/cannedQuestions';
import { jadwalPenmaba } from '@/constants/jadwalPenmaba';
import BukuPedomanViewer from '@/components/Shared/BukuPedomanViewer';
import Image from 'next/image';
import Avatar from '@/components/Shared/Avatar';
import FormattedText from '@/components/Shared/FormattedText';
import CustomAlert from '@/components/Shared/CustomAlert';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const toLocalTime = (dateStr: string) => {
    if (!dateStr) return '--:--';
    try {
        const timePart = dateStr.includes('T') ? dateStr.split('T')[1] : dateStr.split(' ')[1];
        if (timePart) {
            return timePart.substring(0, 5); // Ambil HH:mm
        }
        return format(new Date(dateStr), 'HH:mm');
    } catch (e) {
        return '--:--';
    }
};

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
  const [userName, setUserName] = useState('User');
  const [userGmail, setUserGmail] = useState('');
  const [roomId, setRoomId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [chatView, setChatView] = useState<'LIST' | 'ROOM'>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('userActiveChat') === 'true' ? 'ROOM' : 'LIST';
    }
    return 'LIST';
  });

  useEffect(() => {
    sessionStorage.setItem('userActiveChat', (chatView === 'ROOM' && activeTab === 'chats').toString());
    if (chatView === 'ROOM' && activeTab === 'chats') {
      setUnreadCount(0);
      const storedUser = localStorage.getItem('user');
      if (storedUser && roomId) {
        try {
          const { token } = JSON.parse(storedUser);
          markAsRead(roomId, token);
        } catch (e) {}
      }
    }
  }, [chatView, activeTab, roomId]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isLocalSearchOpen, setIsLocalSearchOpen] = useState(false);
  const [isJadwalModalOpen, setIsJadwalModalOpen] = useState(false);
  const [searchMatchIndex, setSearchMatchIndex] = useState<number>(0);

  const searchMatches = messages
    ? messages.filter(m => localSearchQuery.trim() && m.text.toLowerCase().includes(localSearchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    if (localSearchQuery.trim()) {
      setSearchMatchIndex(searchMatches.length > 0 ? 1 : 0);
    } else {
      setSearchMatchIndex(0);
    }
  }, [localSearchQuery, messages]);

  const scrollToMatch = (index: number) => {
    if (index > 0 && searchMatches[index - 1]) {
      const matchMsg = searchMatches[index - 1];
      const el = document.getElementById(`msg-${matchMsg.id || matchMsg.timestamp}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return <FormattedText text={text} />;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span className="whitespace-pre-wrap leading-relaxed">
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-amber-300 text-slate-900 font-extrabold px-1 rounded-sm shadow-sm border border-amber-400 mx-0.5 select-all">
              {part}
            </span>
          ) : (
            <FormattedText key={i} text={part} />
          )
        )}
      </span>
    );
  };
  const [selectedResponse, setSelectedResponse] = useState<CannedResponse | null>(null);
  const [isTemplatePopupOpen, setIsTemplatePopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Informasi Umum');
  const [alertConfig, setAlertConfig] = useState<{show: boolean, type: 'alert' | 'confirm', message: string, title?: string, onConfirm?: () => void}>({show: false, type: 'alert', message: ''});

  const showAlert = (message: string, title?: string) => setAlertConfig({show: true, type: 'alert', message, title});

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserName(parsed.username || parsed.Username || 'User');
      setUserGmail(parsed.gmail);
      initChat(parsed.gmail, parsed.token);
    }
  }, []);

  const initChat = async (gmail: string, token: string) => {
    try {
      const roomRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/user-room?gmail=${gmail}`, {
        headers: { 'Authorization': token }
      });
      const roomData = await roomRes.json();
      if (roomRes.ok) {
        setRoomId(roomData.id);
        setUnreadCount(roomData.unread_count || 0);
        fetchMessages(roomData.id, token, gmail);
        
        // Polling setiap 3 detik
        const interval = setInterval(() => fetchMessages(roomData.id, token, gmail), 3000);
        return () => clearInterval(interval);
      }
    } catch (err) {
      console.error("Gagal inisialisasi chat:", err);
    }
  };

  useEffect(() => {
    if (roomId && userGmail) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { token } = JSON.parse(storedUser);
            const interval = setInterval(() => fetchMessages(roomId, token, userGmail), 3000);
            return () => clearInterval(interval);
        }
    }
  }, [roomId, userGmail]);

  const fetchMessages = async (id: number, token: string, currentGmail: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/messages/${id}`, {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setMessages(data.map((m: any) => ({
          id: m.id.toString(),
          sender: m.sender_gmail.toLowerCase() === currentGmail.toLowerCase() ? 'user' : 'admin',
          text: m.message,
          timestamp: toLocalTime(m.created_at),
          type: m.message_type
        })));

        if (activeTab === 'chats' && chatView === 'ROOM') {
          markAsRead(id, token);
          setUnreadCount(0);
        } else {
          const unreadAdminCount = data.filter((m: any) => m.sender_gmail.toLowerCase() !== currentGmail.toLowerCase() && m.is_read === 0).length;
          setUnreadCount(unreadAdminCount);
        }
      }
    } catch (err) {
      console.error("Gagal ambil pesan:", err);
    }
  };

  // Efek pintar buat scroll
  useEffect(() => {
    if (roomId && messages.length > 0) {
      if (lastRoomIdRef.current !== roomId) {
        scrollToBottom('auto');
        lastRoomIdRef.current = roomId;
        setShouldAutoScroll(true);
      } else if (shouldAutoScroll) {
        scrollToBottom('smooth');
      }
    }
  }, [messages, roomId, shouldAutoScroll]);

  const markAsRead = async (id: number, token: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/mark-read/${id}`, {
        method: 'POST',
        headers: { 'Authorization': token }
      });
    } catch (err) {
      console.error("Gagal mark read user:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const combinedText = selectedResponse
      ? `${selectedResponse.response}\n\nCatatan Tambahan:\n${newMessage}`
      : newMessage;

    if (!combinedText.trim() || !roomId) return;

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
          room_id: roomId,
          sender_gmail: gmail,
          message: combinedText,
          message_type: 'text'
        })
      });

      if (res.ok) {
        setNewMessage('');
        setSelectedResponse(null);
        const el = document.getElementById('user-message-input');
        if (el) el.style.height = 'auto';
        fetchMessages(roomId, token, gmail);
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
    if (!file || !roomId) return;

    if (file.size > 1024 * 1024) {
      showAlert(`Waduh bro! Ukuran file lu (${(file.size / (1024 * 1024)).toFixed(2)} MB) kegedean. Maksimal cuma boleh 1 MB biar server tetep ngebut!`, 'Ukuran File Kegedean');
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
            room_id: roomId,
            sender_gmail: gmail,
            message: combinedData,
            message_type: fileType
          })
        });

        if (res.ok) {
          fetchMessages(roomId, token, gmail);
          scrollToBottom();
        }
      } catch (err) {
        console.error("Gagal kirim file:", err);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'chats', icon: MessageCircle, label: 'Chat' },
    { id: 'logout', icon: LogOut, label: 'Keluar' },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 overflow-hidden relative font-sans text-slate-900">
      <AnimatePresence mode="wait">
        {activeTab === 'chats' ? (
          <motion.div
            key="chats-tab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-slate-50"
          >
            <AnimatePresence mode="wait">
              {chatView === 'LIST' ? (
                <motion.div
                  key="chat-list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col h-full"
                >
                  {/* List Header */}
                  <div className="bg-emerald-800 rounded-b-[40px] px-6 pt-12 pb-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <header className="relative z-10">
                      <h2 className="text-xl font-black text-white tracking-tight leading-none">Pesan Bantuan</h2>
                      <p className="text-emerald-100/70 text-[10px] font-bold uppercase tracking-widest mt-2">Hubungi Admin UNJ</p>
                    </header>
                  </div>

                  {/* Jadwal Penmaba Card (Replaces Search Bar) */}
                  <div className="px-6 -mt-8 relative z-20 mb-4">
                      <motion.button 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsJadwalModalOpen(true)}
                          className="w-full bg-white rounded-full shadow-xl shadow-slate-200/40 p-1.5 border-2 border-emerald-50 hover:border-emerald-400 focus:outline-none transition-all duration-300 flex items-center justify-between"
                      >
                          <div className="flex items-center gap-3 px-4 h-11">
                              <Calendar size={18} className="text-emerald-600 shrink-0" />
                              <div className="flex flex-col text-left">
                                  <span className="text-[11px] font-black text-slate-800 leading-tight">Cek Jadwal Penting Penmaba 2026</span>
                                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Info pendaftaran & ujian</span>
                              </div>
                          </div>
                          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-1">
                              <ChevronRight size={16} />
                          </div>
                      </motion.button>
                  </div>

                  {/* Admin Room Item - Refined & Clean */}
                  <main className="flex-1 px-6 overflow-y-auto scrollbar-hide pb-32">
                    <div className="flex flex-col gap-4 mt-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] ml-2">Admin Helpdesk Admisi</h4>
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setChatView('ROOM')}
                        className="w-full bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/30 border border-slate-100 flex items-center gap-5 group active:bg-emerald-50 active:border-emerald-100 transition-all duration-300"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 ring-4 ring-slate-50">
                            <Image src="/unj.png" alt="UNJ" width={40} height={40} className="drop-shadow-md" />
                          </div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex justify-between items-center">
                            <h4 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1">
                              <span>Admin Admisi</span>
                              <ChevronRight size={16} className="text-slate-400" />
                            </h4>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                           <MessageCircle size={18}     />
                        </div>
                      </motion.button>

                      {/* Info Card - Lighter Emerald Gradient */}
                      <div className="p-6 bg-linear-to-br from-emerald-500 to-emerald-700 rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-emerald-200/50">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
                         <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-2">Info Layanan</h5>
                         <p className="text-[11px] text-emerald-50 font-medium leading-relaxed">Admin akan merespon pesan Anda segera dalam jam operasional.</p>
                      </div>
                    </div>
                  </main>
                </motion.div>
              ) : (
                <motion.div
                  key="chat-room"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full bg-slate-50"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20v20H20zM0 20c11.046 0 20-8.954 20-20v20H0zM0 20c11.046 0 20 8.954 20 20H0V20zm20 20c0-11.046 8.954-20 20-20v20H20z' fill='%23059669' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
                  }}
                >
                  {/* Room Header */}
                  <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 p-4 pt-12 flex items-center gap-3 z-30">
                    <button 
                      onClick={() => setChatView('LIST')}
                      className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 active:bg-emerald-50 active:text-emerald-600 transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    
                    {!isLocalSearchOpen && (
                      <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                            <Avatar src="/unj.png" size="sm" />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-black text-slate-800 text-sm tracking-tight truncate">
                              Admin Admisi UNJ
                          </h2>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Online</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={cn("flex gap-1 relative items-center", isLocalSearchOpen ? "flex-1 ml-2" : "")}>
                      {isLocalSearchOpen ? (
                        <motion.div 
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "100%" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex items-center bg-slate-50 border border-slate-200 rounded-[18px] px-3 py-1 h-9 ring-4 ring-emerald-500/5 focus-within:border-emerald-200 focus-within:bg-white focus-within:ring-emerald-500/10 transition-all duration-300 gap-1.5 flex-1"
                        >
                          <Search size={14} className="text-emerald-500 shrink-0" />
                          <input 
                            type="text" 
                            autoFocus
                            value={localSearchQuery}
                            onChange={(e) => setLocalSearchQuery(e.target.value)}
                            placeholder="Cari..."
                            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none text-xs font-semibold text-slate-700 placeholder:text-slate-400 h-full p-0 min-w-[60px]"
                          />
                          {localSearchQuery.trim() && (
                            <div className="flex items-center gap-1 shrink-0 bg-slate-100/80 px-1.5 py-0.5 rounded-lg">
                              <span className="text-[9px] font-black text-slate-500 select-none">
                                {searchMatchIndex}/{searchMatches.length}
                              </span>
                              <button 
                                onClick={() => {
                                  if (searchMatches.length === 0) return;
                                  const nextIdx = searchMatchIndex <= 1 ? searchMatches.length : searchMatchIndex - 1;
                                  setSearchMatchIndex(nextIdx);
                                  scrollToMatch(nextIdx);
                                }}
                                className="text-slate-400 hover:text-emerald-600 transition-colors"
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button 
                                onClick={() => {
                                  if (searchMatches.length === 0) return;
                                  const nextIdx = searchMatchIndex >= searchMatches.length ? 1 : searchMatchIndex + 1;
                                  setSearchMatchIndex(nextIdx);
                                  scrollToMatch(nextIdx);
                                }}
                                className="text-slate-400 hover:text-emerald-600 transition-colors"
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>
                          )}
                          <button 
                            onClick={() => {
                              setLocalSearchQuery('');
                              setIsLocalSearchOpen(false);
                            }}
                            className="text-slate-300 hover:text-rose-500 shrink-0 ml-1 transition-colors duration-300"
                          >
                            <X size={12} />
                          </button>
                        </motion.div>
                      ) : (
                        <button 
                          onClick={() => setIsLocalSearchOpen(true)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 active:bg-slate-100"
                        >
                          <Search size={18} />
                        </button>
                      )}
                    </div>
                  </header>

                  <main 
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide pb-32"
                  >
                    <div className="flex justify-center mb-2">
                      <span className="bg-white border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 px-4 py-1.5 rounded-full uppercase tracking-widest">
                        Layanan Bantuan Resmi
                      </span>
                    </div>

                    {(() => {

                      const filteredMessages = localSearchQuery.trim()

                        ? messages.filter(m => m.text.toLowerCase().includes(localSearchQuery.toLowerCase()))

                        : messages;

                      return filteredMessages.map((msg, idx) => {
                      const isMe = msg.sender === 'user';
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={msg.id || idx}
                          className={cn(
                            "max-w-[85%] px-5 py-3.5 rounded-4xl text-xs shadow-md relative",
                            isMe 
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
                                  <>
                                    <img 
                                      src={imgData} 
                                      alt="Sent image" 
                                      onClick={() => setSelectedImage(imgData)}
                                      className="rounded-2xl max-w-[200px] h-auto shadow-sm border border-slate-100 cursor-zoom-in active:scale-95 transition-all"
                                    />
                                    {caption && (
                                      <FormattedText text={caption} className="text-[13px] font-medium leading-relaxed mt-1 px-1" />
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
                              const caption = parts.length > 2 ? parts[2] : null;
                              return (
                                <>
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
                                  {caption && (
                                    <div className="mt-3 px-1 border-t border-slate-100 pt-3">
                                      <FormattedText text={caption} className="text-[13px] font-medium leading-relaxed" />
                                    </div>
                                  )}
                                </>
                              );
                            })()
                          ) : (
                            renderHighlightedText(msg.text, localSearchQuery)
                          )}
                          <div className="flex items-center justify-end gap-1.5 mt-2">
                            <span className={cn(
                                "text-[9px] font-bold",
                                isMe ? "text-emerald-50" : "text-slate-400"
                            )}>
                              {msg.timestamp}
                            </span>
                            {isMe && <CheckCheck size={12} className="text-emerald-100" />}
                          </div>
                        </motion.div>
                      );
                    });
                    })()}
                    <div ref={messagesEndRef} />
                  </main>

                  {/* Input Area - Moved Lower (since bottom nav is hidden) */}
                  <div className="absolute bottom-6 left-4 right-4 z-20">
                      <div className="bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-2xl shadow-emerald-200/20 p-2">
                           <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                               {selectedResponse && (
                                 <motion.div
                                   initial={{ opacity: 0, height: 0 }}
                                   animate={{ opacity: 1, height: 'auto' }}
                                   className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start justify-between gap-3 mx-2"
                                 >
                                   <div className="flex-1 min-w-0 flex items-start gap-2">
                                     <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                       <Clock size={12} className="text-emerald-600" />
                                     </div>
                                     <div className="min-w-0 flex-1">
                                       <p className="text-[8px] font-black text-emerald-800 uppercase tracking-widest mb-0.5">Draf:</p>
                                       <p className="text-[10px] text-emerald-900/70 italic font-medium leading-relaxed whitespace-pre-wrap">"{selectedResponse.response}"</p>
                                     </div>
                                   </div>
                                   <button
                                     type="button"
                                     onClick={() => setSelectedResponse(null)}
                                     className="w-8 h-8 rounded-full flex items-center justify-center bg-white/50 text-slate-400 hover:text-red-500 shrink-0 shadow-sm transition-all"
                                   >
                                     <X size={14} />
                                   </button>
                                 </motion.div>
                               )}
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
                                     id="user-message-input"
                                     value={newMessage}
                                     onChange={(e) => {
                                         setNewMessage(e.target.value);
                                         e.target.style.height = 'auto';
                                         e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                                     }}
                                     placeholder="Tulis pesan..."
                                     className="flex-1 py-2.5 px-2 text-[13px] font-medium text-slate-700 bg-transparent focus:outline-none resize-none max-h-[120px] scrollbar-hide"
                                     rows={1}
                                 />
                                 <button 
                                     type="submit"
                                     disabled={!newMessage.trim() && !selectedResponse}
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
          </motion.div>
        ) : activeTab === 'home' ? (
          <motion.div
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full bg-slate-50 overflow-hidden"
          >
            {/* Fixed Header - Higher Layer (z-30) */}
            <div className="bg-emerald-800 rounded-b-[40px] px-8 pt-10 pb-12 shadow-2xl relative overflow-hidden shrink-0 z-30">
               <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
               <div className="absolute bottom-[-20px] left-[-20px] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

               <header className="relative z-10 flex flex-col gap-6">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
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
                        <div className="flex flex-col">
                          <h2 className="text-sm font-black text-white tracking-tighter leading-none uppercase">Admin Admisi UNJ</h2>
                          <span className="text-[8px] font-black text-emerald-300 uppercase tracking-widest mt-0.5">UNJ ADMISI 2026</span>
                        </div>
                    </div>
                 </div>

                 <div className="mt-1">
                    <motion.h1 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-2xl font-black text-white tracking-tight leading-tight"
                    >
                      Halo, <span className="text-emerald-300">{userName}!</span>
                    </motion.h1>
                    <div className="flex items-center gap-2 mt-3">
                       <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                       <p className="text-[9px] font-black text-emerald-100 uppercase tracking-[0.15em]">Admin Siap Membantu</p>
                    </div>
                 </div>
               </header>
            </div>

            {/* Scrollable Content - Lower Layer (z-10) */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-6 -mt-10 relative z-10 pb-32">
                <div className="flex flex-col gap-8">
                    {/* Chat Landing Section */}
                    <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-[40px] shadow-xl shadow-slate-200/30 border border-slate-100 mt-12 mb-2">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center max-w-sm"
                        >
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-100 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/10 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full"></div>
                                <Image src="/unj.png" alt="Logo" width={50} height={50} className="relative z-10" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Admin Admisi UNJ</h2>
                            <p className="text-[12px] font-medium text-slate-400 leading-relaxed mb-8 px-4">
                              Klik tombol dibawah ini untuk mulai berkonsultasi dengan petugas kami.
                            </p>
                            <button 
                              onClick={() => {
                                setIsChatStarted(true);
                                setActiveTab('chats');
                                setChatView('LIST');
                              }}
                              className="px-8 py-3.5 bg-emerald-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-900 hover:scale-105 active:scale-95 transition-all w-full relative"
                            >
                              BUKA CHAT SEKARANG
                              {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                                  {unreadCount}
                                </span>
                              )}
                            </button>
                        </motion.div>
                    </div>

                    {/* Jam Layanan Section */}
                    <div className="p-6 bg-white border border-slate-100 rounded-[36px] shadow-xl shadow-slate-200/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-5 px-1">Jam Operasional</h4>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-inner ring-4 ring-white">
                                <Clock size={28} className="text-emerald-600" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Senin - Jumat</span>
                                <span className="text-lg font-black text-slate-800 leading-none">09:00 - 16:00 <span className="text-[10px] text-emerald-600 font-black">WIB</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-2 bg-white border border-slate-100/80 rounded-[36px] p-4 shadow-xl shadow-slate-200/20 mb-16 select-none">
                      <BukuPedomanViewer />
                    </div>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full bg-slate-50 p-10 items-center justify-center"
          >
             <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 ring-4 ring-white shadow-xl">
                <User size={48} className="text-emerald-600" />
             </div>
             <h2 className="text-2xl font-black text-slate-800">{userName}</h2>
             <p className="text-sm text-slate-400 font-medium">User Baru - 2026</p>
             
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
                            console.error("Logout API failed:", err);
                        }
                    }
                    localStorage.removeItem('user'); 
                    window.location.reload(); 
                }}
                className="mt-12 w-full max-w-[200px] py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-100 flex items-center justify-center gap-2 active:bg-rose-100 transition-all"
             >
                <LogOut size={16} />
                Keluar Akun
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM NAV (Redesigned ala Admin) - Hidden in Room View */}
      <AnimatePresence>
        {!(activeTab === 'chats' && chatView === 'ROOM') && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-[92%] max-w-lg h-[76px] pointer-events-none"
          >
              <nav className="relative flex items-center justify-between px-10 h-full pointer-events-auto">
                  <NotchedBackground />
                  
                  {/* Home Tab */}
                  <button
                      onClick={() => setActiveTab('home')}
                      className="flex flex-col items-center gap-1 group relative"
                  >
                      <motion.div
                          animate={activeTab === 'home' ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
                          className={cn(
                              "p-2 transition-all relative",
                              activeTab === 'home' ? "text-emerald-600" : "text-slate-400"
                          )}
                      >
                          <Home size={24} />
                      </motion.div>
                      {activeTab === 'home' && (
                          <motion.span 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-[8px] font-black uppercase tracking-widest text-emerald-600"
                          >
                              HOME
                          </motion.span>
                      )}
                  </button>

                  {/* Center Floating Chat Button */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6">
                      <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setActiveTab('chats');
                            setChatView('LIST');
                          }}
                          className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative",
                            activeTab === 'chats' 
                              ? "bg-emerald-600 text-white shadow-emerald-200" 
                              : "bg-white text-emerald-600 shadow-slate-200 border border-slate-100"
                          )}
                      >
                          <MessageCircle size={28} />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white">
                              {unreadCount}
                            </span>
                          )}
                      </motion.button>
                  </div>

                  {/* Logout Tab */}
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
                                  console.error("Logout API failed:", err);
                              }
                          }
                          localStorage.removeItem('user'); 
                          window.location.reload(); 
                      }}
                      className="flex flex-col items-center gap-1 group relative"
                  >
                      <div className="p-2 text-slate-400 group-active:text-rose-600 transition-all">
                          <LogOut size={24} />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-active:text-rose-600">
                          KELUAR
                      </span>
                  </button>
              </nav>
          </motion.div>
        )}
      </AnimatePresence>
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
                  <h3 className="text-lg font-black tracking-tight">Template Pertanyaan</h3>
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

      {/* Image Lightbox Modal */}
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
              src={selectedImage || undefined}
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

      {/* Jadwal Modal Popup */}
      <AnimatePresence>
        {isJadwalModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-[40px] w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative border-t border-slate-100"
            >
              {/* Modal Header */}
              <div className="bg-emerald-800 p-6 flex justify-between items-center relative shrink-0">
                <div className="absolute top-[-30px] right-[-30px] w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 text-white">
                  <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                    <Calendar size={22} className="text-emerald-300" />
                    Kalender & Jadwal
                  </h3>
                  <p className="text-emerald-100/60 text-[9px] font-bold uppercase tracking-widest mt-1">
                    Jadwal Penting PENMABA UNJ 2026
                  </p>
                </div>
                <button 
                  onClick={() => setIsJadwalModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20 transition-all text-white relative z-10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Schedules List */}
              <div className="flex-1 p-6 overflow-y-auto scrollbar-hide bg-slate-50">
                <div className="flex flex-col gap-4">
                  {jadwalPenmaba.map((event) => (
                    <motion.div
                      key={event.id}
                      whileTap={{ scale: 0.98 }}
                      className="p-5 bg-white border border-slate-100 rounded-[28px] text-left active:border-emerald-200 active:bg-emerald-50/30 transition-all shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-2 justify-between">
                         <span className={cn(
                           "px-2.5 py-1 text-[8px] font-black rounded uppercase tracking-widest",
                           event.category === 'PENDAFTARAN' && "bg-blue-50 text-blue-600",
                           event.category === 'UJIAN' && "bg-amber-50 text-amber-600",
                           event.category === 'PENGUMUMAN' && "bg-emerald-50 text-emerald-600"
                         )}>
                           {event.category}
                         </span>
                      </div>
                      <p className="text-sm font-black text-slate-800 leading-tight mb-2">
                        {event.title}
                      </p>
                      <p className="text-[12px] font-bold text-slate-500 leading-relaxed">
                        {event.dateRange}
                      </p>
                    </motion.div>
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

      <CustomAlert config={alertConfig} onClose={() => setAlertConfig({...alertConfig, show: false})} />
    </div>
  );
};

export default MobileLayout;

