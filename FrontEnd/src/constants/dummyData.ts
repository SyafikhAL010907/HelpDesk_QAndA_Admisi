export interface Message {
  id: string;
  sender: 'admin' | 'user';
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  attachmentUrl?: string;
}

export interface ChatSession {
  id: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

export interface CannedResponse {
  id: string;
  keyword: string;
  question: string;
  response: string;
}

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

export const cannedResponses: CannedResponse[] = [
  {
    id: 'c1',
    keyword: 'SNMPTN',
    question: 'Cara daftar SNMPTN?',
    response: 'Untuk pendaftaran SNMPTN, silakan buka portal resmi LTMPT dan masukkan NISN serta password yang sudah didaftarkan.',
  },
  {
    id: 'c2',
    keyword: 'KTP',
    question: 'Legalitisir KTP?',
    response: 'Berkas KTP tidak perlu dilegalisir, cukup unggah scan asli yang berwarna dan jelas terbaca.',
  },
  {
    id: 'c3',
    keyword: 'UKT',
    question: 'Pembayaran UKT?',
    response: 'Pembayaran UKT dapat dilakukan melalui Bank Mandiri, BNI, atau BTN menggunakan nomor pendaftaran.',
  },
];
