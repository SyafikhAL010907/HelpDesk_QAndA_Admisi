import { ChatSession } from './chatTypes';

export const dummyChats: ChatSession[] = [
  {
    id: '1',
    userName: 'Budi Santoso',
    userAvatar: 'https://i.pravatar.cc/150?u=budi',
    lastMessage: 'Halo, saya mau tanya soal pendaftaran SNMPTN.',
    timestamp: '10:30',
    unreadCount: 2,
    messages: [
      { id: 'm1', sender: 'user', text: 'Halo, saya mau tanya soal pendaftaran SNMPTN.', timestamp: '10:30', type: 'text' },
    ],
  },
  {
    id: '2',
    userName: 'Siti Aminah',
    userAvatar: 'https://i.pravatar.cc/150?u=siti',
    lastMessage: 'Apakah berkas KTP harus dilegalisir?',
    timestamp: '09:45',
    unreadCount: 0,
    messages: [
      { id: 'm2', sender: 'user', text: 'Apakah berkas KTP harus dilegalisir?', timestamp: '09:45', type: 'text' },
    ],
  },
];
