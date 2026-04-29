'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  User,
  Plus,
  ArrowLeft,
  Send,
  Paperclip,
  CheckCheck,
  HelpCircle,
  Clock,
  MoreVertical,
  Search,
  LogOut
} from 'lucide-react';
import { dummyChats, Message } from '@/constants/dummyData';
import Avatar from '@/components/Shared/Avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
  const [activeTab, setActiveTab] = useState('chats');
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      const roomRes = await fetch(`http://localhost:8080/api/chat/user-room?gmail=${gmail}`, {
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

  const fetchMessages = async (id: number, token: string, currentGmail: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/chat/messages/${id}`, {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setMessages(data.map((m: any) => ({
          id: m.id.toString(),
          sender: m.sender_gmail.toLowerCase() === currentGmail.toLowerCase() ? 'user' : 'admin',
          text: m.message,
          timestamp: format(new Date(m.created_at), 'HH:mm'),
          type: m.message_type
        })));

        // Jika ada pesan dari admin, tandai sudah dibaca
        const hasAdminMessage = data.some((m: any) => m.sender_gmail.toLowerCase() !== currentGmail.toLowerCase() && m.is_read === 0);
        if (hasAdminMessage) {
          markAsRead(id, token);
          setUnreadCount(0);
        }
      }
    } catch (err) {
      console.error("Gagal ambil pesan:", err);
    }
  };

  const markAsRead = async (id: number, token: string) => {
    try {
      await fetch(`http://localhost:8080/api/admin/chat/mark-read/${id}`, {
        method: 'POST',
        headers: { 'Authorization': token }
      });
    } catch (err) {
      console.error("Gagal mark read user:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId) return;

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
          room_id: roomId,
          sender_gmail: gmail,
          message: newMessage,
          message_type: 'text'
        })
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages(roomId, token, gmail);
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
    if (!file) return;

    const msg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: `📎 Mengirim file: ${file.name}`,
      timestamp: format(new Date(), 'HH:mm'),
      type: 'file' as any
    };

    setMessages([...messages, msg]);
    scrollToBottom();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'chats', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 overflow-hidden relative font-sans text-slate-900">
      <AnimatePresence mode="wait">
        {activeTab === 'chats' ? (
          <motion.div
            key="chat-room"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-slate-50"
          >
            {/* Room Header (Glassy & Clean) */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 p-4 pt-12 flex items-center gap-3 z-30">
              <button 
                onClick={() => setActiveTab('home')}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 active:bg-emerald-50 active:text-emerald-600 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                    <Avatar src="https://i.pravatar.cc/150?u=admin" size="sm" className="ring-2 ring-emerald-100 shadow-sm" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-slate-800 text-sm tracking-tight truncate">
                      Admin HelpDesk
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
            <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide pb-32">
              <div className="flex justify-center mb-2">
                <span className="bg-white border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Layanan Bantuan Resmi
                </span>
              </div>

              {messages.map((msg, idx) => {
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
                    <p className="leading-relaxed">{msg.text}</p>
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
              })}
              <div ref={messagesEndRef} />
            </main>

            {/* Input Area (Floating) */}
            <div className="absolute bottom-24 left-4 right-4 z-20">
                <div className="bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-2xl shadow-slate-200/50 p-2">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button type="button" onClick={handleFileClick} className="w-10 h-10 flex items-center justify-center text-slate-400 active:text-emerald-600">
                            <Paperclip size={22} />
                        </button>
                        <textarea 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Tulis pesan..."
                            className="flex-1 py-2 text-sm text-slate-700 bg-transparent focus:outline-none resize-none max-h-20"
                            rows={1}
                        />
                        <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-10 h-10 bg-emerald-800 text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-30"
                        >
                            <Send size={18} className="ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
          </motion.div>
        ) : activeTab === 'home' ? (
          <motion.div
            key="home-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full bg-slate-50"
          >
            {/* Premium Header (Matching Admin Mobile) */}
            <div className="bg-emerald-800 rounded-b-[40px] px-6 pt-12 pb-16 shadow-2xl relative overflow-hidden">
               <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>

               <header className="relative z-10 flex flex-col gap-6">
                 <div className="flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                            <HelpCircle size={24} />
                        </div>
                        <div className="text-white flex flex-col gap-1">
                          <h2 className="text-xl font-black tracking-tight leading-none">Selamat Datang, {userName}!</h2>
                          <div className={cn(
                             "mt-1.5 flex items-center gap-1.5 w-fit px-2 py-1 rounded-full border backdrop-blur-sm transition-all duration-500",
                             unreadCount > 0 
                                 ? "bg-rose-500/20 border-rose-500/30 animate-pulse" 
                                 : "bg-emerald-400/20 border-emerald-400/20"
                          )}>
                             <span className={cn(
                                 "w-1 h-1 rounded-full",
                                 unreadCount > 0 ? "bg-rose-400" : "bg-emerald-400"
                             )}></span>
                             <span className="text-[8px] font-bold text-white uppercase tracking-widest">
                                 {unreadCount > 0 ? `${unreadCount} Balasan Baru` : "Sistem Antrian Admisi"}
                             </span>
                          </div>
                        </div>
                    </div>
                 </div>
               </header>
            </div>

            <main className="flex-1 px-6 -mt-8 relative z-20 pb-32">
                <div className="grid grid-cols-1 gap-4">
                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Layanan Cepat</h4>
                        <div className="flex flex-col gap-3">
                            {['Alur Pendaftaran', 'Bantuan Teknis', 'FAQ Admisi'].map((item) => (
                                <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 active:bg-emerald-50 active:border-emerald-100 transition-all">
                                    <span className="text-sm font-bold text-slate-700">{item}</span>
                                    <Plus size={16} className="text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
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
             <p className="text-sm text-slate-400 font-medium">Mahasiswa Baru - 2026</p>
             
             <button 
                onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}
                className="mt-12 w-full max-w-[200px] py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-100 flex items-center justify-center gap-2 active:bg-rose-100 transition-all"
             >
                <LogOut size={16} />
                Keluar Akun
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM NAV (Premium Notched Style) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 w-[92%] max-w-lg h-[76px] pointer-events-none">
          <nav className="relative flex items-center justify-around px-6 h-full pointer-events-auto">
              <NotchedBackground />
              
              {navItems.map((item) => {
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
                                  "p-2 transition-all relative",
                                  active ? "text-emerald-600" : "text-slate-400"
                              )}
                          >
                              <ActiveIcon size={22} />
                              {item.id === 'chats' && unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                                  {unreadCount}
                                </span>
                              )}
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
    </div>
  );
};

export default MobileLayout;
