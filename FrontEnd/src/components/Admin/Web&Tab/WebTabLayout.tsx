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
  FileText,
  Clock,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { dummyChats, ChatSession, cannedResponses, CannedResponse, Message } from '@/constants/dummyData';
import Avatar from '@/components/Shared/Avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const WebTabLayout = () => {
  const [adminName, setAdminName] = useState('Admin');
  const [adminGmail, setAdminGmail] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<CannedResponse | null>(null);
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
      setAdminName(parsed.username || parsed.Username || 'Admin');
      setAdminGmail(parsed.gmail);
      fetchRooms(parsed.token);
      
      const interval = setInterval(() => fetchRooms(parsed.token), 5000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && selectedChat) {
      const { token } = JSON.parse(storedUser);
      fetchMessages(selectedChat.id, token);
      scrollToBottom();
      
      const interval = setInterval(() => fetchMessages(selectedChat.id, token), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedChat?.id]);

  const fetchRooms = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/chat/rooms', {
        headers: { 'Authorization': token }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setRooms(data.map((r: any) => ({
          ...r,
          user: r.user_name || r.user_gmail.split('@')[0],
          lastMessage: r.last_message,
          time: format(new Date(r.updated_at), 'HH:mm'),
          unread: r.unread_count,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user_gmail}`,
          status: 'online'
        })));
      } else {
        setRooms([]);
      }
    } catch (err) {
      console.error("Gagal ambil room:", err);
      setRooms([]);
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
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Gagal ambil pesan:", err);
      setMessages([]);
    }
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

  const markAsRead = async (id: number) => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const { token } = JSON.parse(storedUser);

    try {
      await fetch(`http://localhost:8080/api/admin/chat/mark-read/${id}`, {
        method: 'POST',
        headers: { 'Authorization': token }
      });
      // Refresh daftar room biar notif ilang
      fetchRooms(token);
    } catch (err) {
      console.error("Gagal mark read:", err);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    // Capture file data (Dummy logic for preview)
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : 'file';

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'admin',
      text: `Mengirim file: ${file.name}`,
      timestamp: format(new Date(), 'HH:mm'),
      type: fileType as any,
      // fileData: fileUrl // In real app, we'd store the URL or upload it
    };

    selectedChat.messages.push(newMessage);
    scrollToBottom();
    
    // Clear input
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    console.log(`File "${file.name}" uploaded successfully!`);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Sidebar - Chat List */}
      <aside className="w-[300px] lg:w-[380px] bg-white border-r border-slate-100 flex flex-col z-20 relative shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
        
        {/* TOP PREMIUM CARD (Admin Style) */}
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
                                <h3 className="text-lg font-black tracking-tighter leading-none">HelpDesk</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="px-1.5 py-0.5 bg-emerald-500 text-[7px] font-black text-white rounded-md uppercase tracking-wider border border-emerald-400 shadow-sm">
                                        ADMIN PANEL
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Welcome Message */}
                    <div>
                        <h4 className="text-xl font-bold leading-tight tracking-tight">Selamat Datang, {adminName}!</h4>
                        <p className="text-[10px] font-medium text-emerald-100/70 uppercase tracking-widest mt-1">Sistem Antrian Admisi</p>
                        <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                            <span className="text-[9px] font-bold tracking-tight">
                                {rooms.filter(r => (r.unread_count || 0) > 0).length} Chat Perlu Respon
                            </span>
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
            <div className="flex items-center justify-between p-1.5 bg-slate-50/50 rounded-2xl border border-slate-100/50">
              {['Semua', 'Unread', 'Resolved'].map((tab, i) => (
                <button
                  key={tab}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-[10px] font-bold transition-all duration-300",
                    i === 0
                      ? "bg-white text-emerald-600 shadow-sm border border-slate-100"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          <div className="flex flex-col gap-1.5 pt-2">
            {rooms.map(chat => {
              const isActive = selectedChat?.id === chat.id;
              return (
                <motion.div
                  key={chat.id}
                  initial={false}
                  onClick={() => handleSelectRoom(chat)}
                  className={cn(
                    "relative p-4 flex items-center gap-4 rounded-[24px] cursor-pointer transition-all duration-300 group",
                    isActive
                      ? "bg-white shadow-[0_10px_25px_-5px_rgba(16,185,129,0.1)] border border-emerald-50"
                      : "hover:bg-slate-50/80 border border-transparent"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 w-1.5 h-10 bg-emerald-500 rounded-r-full"
                    />
                  )}

                  <div className="relative shrink-0">
                    <Avatar src={`https://i.pravatar.cc/150?u=${chat.user_gmail}`} size="md" className={cn(
                      "transition-transform duration-300 group-hover:scale-105",
                      isActive ? "ring-2 ring-emerald-500 ring-offset-2" : "ring-1 ring-slate-100"
                    )} />
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
                    <div className="flex justify-between items-center mt-1">
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
                        await fetch('http://localhost:8080/api/logout', {
                            method: 'POST',
                            headers: { 'Authorization': token }
                        });
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
      <main className="flex-1 flex flex-col bg-[#F8FAFB] relative overflow-hidden">
        {selectedChat ? (
          <>  
            <header className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <Avatar src={`https://i.pravatar.cc/150?u=${selectedChat.user_gmail}`} size="md" className="ring-2 ring-emerald-50" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-slate-800 tracking-tight">{selectedChat.user_name || selectedChat.user_gmail}</h2>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Online</p>
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

            <div className="flex-1 overflow-y-auto p-4 lg:p-10 flex flex-col gap-8 scrollbar-hide">
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

            <div className="px-4 lg:px-8 pb-8 pt-2">
              <div className="bg-white border border-slate-100 rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-hide">
                    <div className="shrink-0 flex items-center gap-2 pr-4 border-r border-slate-200">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <FileText size={16} className="text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Template</span>
                    </div>
                    {cannedResponses.map(resp => (
                      <motion.button
                        key={resp.id}
                        whileHover={{ y: -2, backgroundColor: '#ECFDF5' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedResponse(resp)}
                        className={cn(
                          "shrink-0 px-5 py-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-start gap-0.5",
                          selectedResponse?.id === resp.id
                            ? "bg-emerald-800 text-white border-emerald-700 shadow-lg shadow-emerald-100"
                            : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                        )}
                      >
                        <span className={cn(
                          "text-[9px] uppercase tracking-tight",
                          selectedResponse?.id === resp.id ? "text-emerald-200" : "text-emerald-600"
                        )}>{resp.keyword}</span>
                        <span className="truncate max-w-[140px]">{resp.question}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="p-4">
                  <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                    {selectedResponse && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start justify-between gap-4"
                      >
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Clock size={16} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Selected Draft:</p>
                            <p className="text-sm text-emerald-900/70 italic font-medium leading-relaxed">"{selectedResponse.response}"</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedResponse(null)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    )}
                    <div className="flex items-center gap-3">
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
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      >
                        <Paperclip size={24} />
                      </motion.button>
                      
                      <div className="flex-1 relative">
                        <textarea
                          value={manualNote}
                          onChange={(e) => setManualNote(e.target.value)}
                          placeholder={selectedResponse ? "Add personal notes..." : "Type your message or select template..."}
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
                        disabled={!manualNote.trim() && !selectedResponse}
                        className="w-14 h-14 bg-emerald-800 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-emerald-200/50 hover:bg-emerald-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
                      >
                        <Send size={24} className="ml-1" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <div className="w-48 h-48 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-20"></div>
              <MessageSquare size={80} className="text-emerald-200 relative z-10" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-800">HelpDesk Admisi</h3>
            <p className="text-slate-400 font-medium mt-3 max-w-sm">Pilih percakapan di sidebar untuk mulai memberikan bantuan kepada calon mahasiswa.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WebTabLayout;
