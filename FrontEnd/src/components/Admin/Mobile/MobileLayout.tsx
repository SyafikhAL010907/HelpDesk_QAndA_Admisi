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
  Clock,
  Trash2,
  HelpCircle,
  LayoutGrid,
  LogOut
} from 'lucide-react';
import { dummyChats, ChatSession, Message, cannedResponses, CannedResponse } from '@/constants/dummyData';
import Avatar from '@/components/Shared/Avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
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
  const [view, setView] = useState<'LIST' | 'ROOM'>('LIST');
  const [activeTab, setActiveTab] = useState('chats');
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<CannedResponse | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [manualNote, setManualNote] = useState('');
  const [isFABOpen, setIsFABOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setAdminName(parsed.username || parsed.Username || 'Admin');
      setAdminGmail(parsed.gmail);
      fetchRooms(parsed.token);
      const interval = setInterval(() => fetchRooms(parsed.token), 5000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && selectedChat && view === 'ROOM') {
      const { token } = JSON.parse(storedUser);
      fetchMessages(selectedChat.id, token);
      const interval = setInterval(() => fetchMessages(selectedChat.id, token), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat?.id, view]);

  const fetchRooms = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/chat/rooms', {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok) setRooms(data);
    } catch (err) {
      console.error("Gagal ambil room:", err);
    }
  };

  const fetchMessages = async (roomId: number, token: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/chat/messages/${roomId}`, {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setMessages(data.map((m: any) => ({
          id: m.id.toString(),
          sender: m.sender_gmail.toLowerCase() === adminGmail.toLowerCase() ? 'admin' : 'user',
          text: m.message,
          timestamp: format(new Date(m.created_at), 'HH:mm'),
          type: m.message_type
        })));
      }
    } catch (err) {
      console.error("Gagal ambil pesan:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (view === 'ROOM') {
      scrollToBottom();
    }
  }, [view, selectedChat?.messages]);

  const handleOpenChat = (chat: any) => {
    setSelectedChat(chat);
    setView('ROOM');
    setIsFABOpen(false);
    markAsRead(chat.id);
  };

  const markAsRead = async (id: number) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token } = JSON.parse(storedUser);

    try {
      await fetch(`http://localhost:8080/api/admin/chat/mark-read/${id}`, {
        method: 'POST',
        headers: { 'Authorization': token }
      });
      fetchRooms(token);
    } catch (err) {
      console.error("Gagal mark read:", err);
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
      const res = await fetch('http://localhost:8080/api/chat/send', {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'admin',
      text: `📎 File: ${file.name}`,
      timestamp: format(new Date(), 'HH:mm'),
      type: 'file' as any
    };

    selectedChat.messages.push(newMessage);
    scrollToBottom();
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
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'chats', icon: MessageCircle, label: 'Chats' },
    { id: 'fab', isFAB: true },
    { id: 'history', icon: History, label: 'Riwayat' },
    { id: 'settings', icon: Settings, label: 'Pengaturan' },
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
            {/* Premium Header (Matching Web) */}
            <div className="bg-emerald-800 rounded-b-[40px] px-6 pt-12 pb-16 shadow-2xl relative overflow-hidden">
               {/* Decorative Circles */}
               <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>

               <header className="relative z-10 flex flex-col gap-6">
                 <div className="flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight leading-none">HelpDesk</h1>
                            <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mt-1">Admisi 2026</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={async () => { 
                                const storedUser = localStorage.getItem('user');
                                if (storedUser) {
                                    const { token } = JSON.parse(storedUser);
                                    await fetch('http://localhost:8080/api/logout', {
                                        method: 'POST',
                                        headers: { 'Authorization': token }
                                    });
                                }
                                localStorage.removeItem('user'); 
                                window.location.reload(); 
                            }}
                            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-rose-200"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                 </div>

                 {/* Welcome Message */}
                 <div className="text-white">
                    <h2 className="text-lg font-bold">Selamat Datang, {adminName}!</h2>
                    <p className="text-xs text-emerald-100/70">Ada {rooms.filter((r: any) => (r.unread_count || 0) > 0).length} chat baru yang menunggu responmu.</p>
                 </div>
               </header>
            </div>

            {/* Chat List Area */}
            <main className="flex-1 overflow-y-auto px-4 -mt-8 relative z-20 pb-32">
              <div className="flex flex-col gap-3">
                {rooms.map((chat) => (
                  <motion.div
                    key={chat.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOpenChat(chat)}
                    className="flex items-center gap-4 p-4 bg-white rounded-3xl shadow-sm border border-slate-100 active:bg-slate-50 transition-all"
                  >
                    <div className="relative">
                        <Avatar src={`https://i.pravatar.cc/150?u=${chat.user_gmail}`} size="md" className="ring-2 ring-slate-50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-slate-800 truncate text-sm">{chat.user_name || chat.user_gmail}</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {format(new Date(chat.updated_at), 'HH:mm')}
                        </span>
                      </div>
                       <div className="flex justify-between items-center">
                         <p className={cn(
                             "text-[11px] truncate pr-2 text-slate-400 font-medium flex-1"
                         )}>
                           {chat.last_message}
                         </p>
                         {chat.unread_count > 0 && (
                           <div className="bg-emerald-500 text-white text-[9px] font-bold h-4 min-w-[16px] px-1.5 flex items-center justify-center rounded-full shadow-lg shadow-emerald-200 animate-bounce">
                             {chat.unread_count}
                           </div>
                         )}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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

            {/* BOTTOM NAV (Premium Notched Style) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-[92%] max-w-lg h-[76px] pointer-events-none">
                <nav className="relative flex items-center justify-between px-6 h-full pointer-events-auto">
                    <NotchedBackground />
                    
                    {navItems.map((item) => {
                        if (item.isFAB) {
                            return (
                                <div key="fab-slot" className="relative flex flex-col items-center w-[60px]">
                                    {/* ARC SPEED DIAL */}
                                    <AnimatePresence>
                                        {isFABOpen && (
                                            <motion.div
                                                variants={containerVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className="absolute bottom-[80px] w-0 h-0 flex items-center justify-center"
                                            >
                                                {fabItems.map((fItem, idx) => {
                                                    const x = R * Math.cos((fItem.angle * Math.PI) / 180);
                                                    const y = -R * Math.sin((fItem.angle * Math.PI) / 180);
                                                    const FIcon = fItem.icon;
                                                    return (
                                                        <motion.div
                                                            key={`fab-arc-${idx}`}
                                                            custom={{ x, y }}
                                                            variants={arcItemVariants}
                                                            className="absolute"
                                                        >
                                                            <div className="flex flex-col items-center gap-2">
                                                                <button 
                                                                    className={cn(
                                                                        "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform",
                                                                        fItem.color
                                                                    )}
                                                                >
                                                                    <FIcon size={20} />
                                                                </button>
                                                                <span className="text-[10px] font-black text-white whitespace-nowrap bg-slate-900/50 px-2 py-0.5 rounded-full backdrop-blur-md">
                                                                    {fItem.label}
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Main FAB */}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        animate={{ rotate: isFABOpen ? 45 : 0 }}
                                        onClick={() => setIsFABOpen(!isFABOpen)}
                                        className={cn(
                                            "absolute -top-14 w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 z-70",
                                            isFABOpen
                                              ? "bg-rose-500 text-white shadow-rose-200"
                                              : "bg-emerald-600 text-white shadow-emerald-200"
                                        )}
                                    >
                                        <Plus size={32} />
                                    </motion.button>
                                </div>
                            );
                        }

                        const ActiveIcon = item.icon!;
                        const active = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id!)}
                                className="flex flex-col items-center gap-1 group relative"
                            >
                                <motion.div
                                    animate={active ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
                                    className={cn(
                                        "p-2 transition-all",
                                        active ? "text-emerald-600" : "text-slate-400"
                                    )}
                                >
                                    <ActiveIcon size={22} />
                                </motion.div>
                                {active && (
                                    <motion.span 
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[8px] font-black uppercase tracking-widest text-emerald-600"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="room"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="flex flex-col h-full bg-slate-50"
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
                    <Avatar src={`https://i.pravatar.cc/150?u=${selectedChat?.user_gmail}`} size="sm" className="ring-2 ring-emerald-100 shadow-sm" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-slate-800 text-sm tracking-tight truncate">
                      {selectedChat?.user_name || selectedChat?.user_gmail}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-1">
                <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 active:bg-slate-100">
                    <Search size={18} />
                </button>
                <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 active:bg-slate-100">
                    <MoreVertical size={18} />
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
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
                  <p className="leading-relaxed">{msg.text}</p>
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
                            <div className="flex gap-2">
                                <Clock size={14} className="text-emerald-600 mt-0.5" />
                                <div className="min-w-0">
                                    <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Draft:</p>
                                    <p className="text-[11px] text-emerald-900/70 italic font-medium leading-relaxed truncate">"{selectedResponse.response}"</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedResponse(null)} className="text-slate-400 hover:text-red-500">
                                <Trash2 size={14} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSendMessage} className="flex flex-col gap-2 p-3">
                    <div className="flex items-center gap-3">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button type="button" onClick={handleFileClick} className="w-10 h-10 flex items-center justify-center text-slate-400 active:text-emerald-600">
                            <Paperclip size={22} />
                        </button>
                        <textarea 
                            value={manualNote}
                            onChange={(e) => setManualNote(e.target.value)}
                            placeholder="Ketik pesan..."
                            className="flex-1 py-2 text-sm text-slate-700 bg-transparent focus:outline-none resize-none"
                            rows={1}
                        />
                        <button 
                            type="submit"
                            disabled={!manualNote.trim() && !selectedResponse}
                            className="w-10 h-10 bg-emerald-800 text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-30"
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
    </div>
  );
};

export default MobileLayout;
