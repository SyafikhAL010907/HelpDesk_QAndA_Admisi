'use client';

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Send,
  Paperclip,
  CheckCheck,
  MessageSquare,
  HelpCircle,
  Clock,
  Trash2,
  MoreVertical,
  Search as SearchIcon,
  LogOut
} from 'lucide-react';
import { dummyChats, Message } from '@/constants/dummyData';
import Avatar from '@/components/Shared/Avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const WebTabLayout = () => {
  const [userName, setUserName] = useState('User');
  const [userGmail, setUserGmail] = useState('');
  const [roomId, setRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [manualNote, setManualNote] = useState('');
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
      // Ambil gmail dengan berbagai kemungkinan penulisan
      const email = parsed.gmail || parsed.Gmail || parsed.email || parsed.Email || '';
      setUserGmail(email);
      
      if (email) {
        initChat(email, parsed.token);
      }
    }
  }, []);

  const initChat = async (gmail: string, token: string) => {
    try {
      // 1. Get or Create Room
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
    if (!manualNote.trim() || !roomId) return;

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
          message: manualNote,
          message_type: 'text'
        })
      });

      if (res.ok) {
        setManualNote('');
        fetchMessages(roomId, token, gmail);
      }
    } catch (err) {
      console.error("Gagal kirim pesan:", err);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : 'file';

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: `📎 Mengirim file: ${file.name}`,
      timestamp: format(new Date(), 'HH:mm'),
      type: fileType as any
    };

    setMessages([...messages, newMessage]);
    scrollToBottom();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar - Integrated Info (Instead of Chat List) */}
      <aside className="w-[300px] lg:w-[380px] bg-white border-r border-slate-100 flex flex-col z-20 relative shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
        
        {/* TOP PREMIUM CARD (Matching Mobile Header style) */}
        <div className="p-4">
            <div className="bg-linear-to-br from-emerald-600 to-emerald-800 rounded-[32px] p-6 text-white shadow-2xl shadow-emerald-200/50 relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-emerald-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>

                <div className="relative z-10 flex flex-col gap-8">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-inner">
                                <Image
                                    src="/unj.png"
                                    alt="Logo UNJ"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-black tracking-tighter leading-none">HELP DESK ADMISI</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="px-1.5 py-0.5 bg-emerald-500 text-[7px] font-black text-white rounded-md uppercase tracking-wider border border-emerald-400 shadow-sm">
                                        Admisi System
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => { localStorage.removeItem('user'); window.location.reload(); }}
                            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-rose-200 hover:bg-rose-500/20 hover:text-white transition-all active:scale-90"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    {/* Welcome Message */}
                    <div>
                        <h4 className="text-xl font-bold leading-tight tracking-tight">Selamat Datang, {userName}!</h4>
                        <p className="text-[10px] font-medium text-emerald-100/70 uppercase tracking-widest mt-1">Pusat Bantuan Mahasiswa</p>
                        <div className={cn(
                            "mt-4 flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border backdrop-blur-sm transition-all duration-500",
                            unreadCount > 0 
                                ? "bg-rose-500/20 border-rose-500/30 animate-pulse" 
                                : "bg-white/10 border-white/10"
                        )}>
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]",
                                unreadCount > 0 ? "bg-rose-400" : "bg-emerald-400"
                            )}></span>
                            <span className="text-[9px] font-bold tracking-tight">
                                {unreadCount > 0 ? `${unreadCount} Balasan Baru` : "Admin Siap Membantu"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-1 px-6 flex flex-col gap-6 pt-2 overflow-y-auto scrollbar-hide">
            <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Panduan Cepat</h4>
                <div className="grid grid-cols-1 gap-2">
                    {['Cara Daftar', 'Biaya UKT', 'Jadwal Ujian'].map((item) => (
                        <div key={item} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-emerald-50 hover:border-emerald-100 transition-all">
                            <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700">{item}</span>
                            <HelpCircle size={14} className="text-slate-300 group-hover:text-emerald-500" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Support Info Section */}
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Jam Layanan</h4>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Clock size={16} className="text-emerald-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Senin - Jumat</span>
                            <span className="text-xs font-black text-slate-700 leading-none mt-1">08:00 - 16:00 WIB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="p-6 mt-auto">
            <div className="p-4 bg-slate-900 rounded-2xl text-white flex items-center justify-between shadow-xl shadow-slate-200">
                <div className="flex items-center gap-3">
                    <Avatar size="sm" alt="Student" className="ring-2 ring-slate-800" />
                    <div>
                        <p className="text-[10px] font-bold">{userName}</p>
                        <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black">Peserta 2026</p>
                    </div>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-[#F8FAFB] relative overflow-hidden">
        {/* Header */}
        <header className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar src="https://i.pravatar.cc/150?u=admin" size="md" className="ring-2 ring-emerald-50" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-slate-800 tracking-tight">Admin HelpDesk</h2>
                <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded-md tracking-tighter uppercase">OFFICIAL</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Aktif Sekarang</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
              <SearchIcon size={20} />
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 flex flex-col gap-8 scrollbar-hide">
          <div className="flex justify-center mb-2">
            <span className="bg-white border border-slate-100 shadow-sm text-[10px] font-black text-slate-400 px-4 py-1.5 rounded-full uppercase tracking-widest">
              Layanan Bantuan Resmi UNJ
            </span>
          </div>
          
          <AnimatePresence>
            {messages.map((msg: Message, idx: number) => {
              const isMe = msg.sender === 'user';
              return (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex flex-col gap-1.5 max-w-[80%]",
                    isMe ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div className={cn(
                    "px-6 py-4 rounded-4xl shadow-md text-sm font-medium leading-relaxed relative",
                    isMe
                      ? "bg-linear-to-br from-emerald-400 to-emerald-500 text-white rounded-tr-none border border-emerald-300 shadow-emerald-100"
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-slate-100/50"
                  )}>
                    {msg.text}
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

        {/* Input Area */}
        <div className="px-4 lg:px-8 pb-8 pt-2">
          <div className="bg-white border border-slate-100 rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-4">
              <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
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
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                  >
                    <Paperclip size={24} />
                  </motion.button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={manualNote}
                      onChange={(e) => setManualNote(e.target.value)}
                      placeholder="Tulis pertanyaanmu di sini..."
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-medium"
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
                    disabled={!manualNote.trim()}
                    className="w-14 h-14 bg-emerald-800 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-emerald-200/50 hover:bg-emerald-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
                  >
                    <Send size={24} className="ml-1" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WebTabLayout;
