'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import dynamic from 'next/dynamic';
const CallView = dynamic(() => import('@/components/CallView'), { ssr: false });

/* ─── Types ──────────────────────────────────────────────── */
interface ChatRoom {
  conversation_id: string;
  type: string;
  title: string | null;
  matrix_room_id: string | null;
  livekit_room: string | null;
  my_lang: string;
  is_muted: boolean;
  members: ChatMember[];
}
interface ChatMember {
  user_id: string;
  fname: string;
  lname: string | null;
  pic: string | null;
  role: string;
  lang: string;
}
interface MatrixEvent {
  event_id: string;
  sender: string;
  content: { msgtype: string; body: string };
  origin_server_ts: number;
}
interface Enrichment {
  id: string;
  matrix_event_id: string;
  message_type: string;
  original_lang: string | null;
  transcript_text: string | null;
  original_media_url: string | null;
  translations: { target_lang: string; translated_text: string }[];
}
interface ChatEvent {
  type: 'new_message' | 'translation_ready' | 'stt_ready' | 'read_receipt';
  event_id: string;
  room_id: string;
  sender?: string;
  content?: any;
  timestamp?: number;
  enrichment_id?: string;
  target_lang?: string;
  translated_text?: string;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const LANG_NAMES: Record<string, string> = {
  hi: 'हिन्दी', bn: 'বাংলা', ta: 'தமிழ்', te: 'తెలుగు', mr: 'मराठी',
  gu: 'ગુજરાતી', kn: 'ಕನ್ನಡ', ml: 'മലയാളം', pa: 'ਪੰਜਾਬੀ', or: 'ଓଡ଼ିଆ',
  en: 'English', ur: 'اردو', as: 'অসমীয়া', ne: 'नेपाली',
};

/* ─── Helpers: parse enrichments from API (camelCase → snake_case) ── */
function parseEnrichment(e: any): Enrichment {
  return {
    id: e.id,
    matrix_event_id: e.matrixEventId || e.matrix_event_id,
    message_type: e.messageType || e.message_type,
    original_lang: e.originalLang || e.original_lang || null,
    transcript_text: e.transcriptText || e.transcript_text || null,
    original_media_url: e.originalMediaUrl || e.original_media_url || null,
    translations: (e.translations || []).map((t: any) => ({
      target_lang: t.targetLang || t.target_lang,
      translated_text: t.translatedText || t.translated_text,
    })),
  };
}

function buildEnrichmentMap(enrichments: any[]): Map<string, Enrichment> {
  const map = new Map<string, Enrichment>();
  enrichments.forEach((e: any) => {
    const parsed = parseEnrichment(e);
    map.set(parsed.matrix_event_id, parsed);
  });
  return map;
}

/* ─── Component ──────────────────────────────────────────── */
export default function ChatsPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState('');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<MatrixEvent[]>([]);
  const [enrichments, setEnrichments] = useState<Map<string, Enrichment>>(new Map());
  const [newMessage, setNewMessage] = useState('');
  const [matrixToken, setMatrixToken] = useState('');
  const [showOriginal, setShowOriginal] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [dmUserId, setDmUserId] = useState('');
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [onlineStatus, setOnlineStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [inCall, setInCall] = useState(false);
  const [callToken, setCallToken] = useState('');
  const [callLkUrl, setCallLkUrl] = useState('');
  const [callType, setCallType] = useState<'video' | 'audio'>('video');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    conversationId: string; callerId: string; callerName: string; callType: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const incomingAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRoomRef = useRef<ChatRoom | null>(null);
  const shouldScrollRef = useRef(false);
  const lastMessageCountRef = useRef(0);

  // Keep ref in sync
  useEffect(() => { activeRoomRef.current = activeRoom; }, [activeRoom]);

  /* ─── Scroll helper (avoids infinite re-render) ────────── */
  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  // Scroll when message count actually changes (not on every render)
  useEffect(() => {
    if (messages.length !== lastMessageCountRef.current) {
      lastMessageCountRef.current = messages.length;
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  /* ─── Auth ─────────────────────────────────────────────── */
  useEffect(() => {
    const t = getCookie('saubh_token');
    const u = getCookie('saubh_user');
    if (!t || !u) { router.replace(`/${locale}/login`); return; }
    try { setToken(t); setUser(JSON.parse(u)); }
    catch { router.replace(`/${locale}/login`); }
  }, [locale, router]);

  /* ─── Socket.io Connection ─────────────────────────────── */
  useEffect(() => {
    if (!token) return;
    const rtUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? 'https://rt.saubh.tech/chat'
      : 'http://localhost:3002/chat';

    const socket = io(rtUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setOnlineStatus('connected');
      // Re-join active room on reconnect
      const room = activeRoomRef.current;
      if (room) {
        socket.emit('join-room', { conversationId: room.conversation_id });
      }
    });
    socket.on('disconnect', () => setOnlineStatus('disconnected'));
    socket.on('connect_error', () => setOnlineStatus('disconnected'));
    socket.on('authenticated', () => setOnlineStatus('connected'));

    socket.on('chat-event', (data: ChatEvent) => {
      const room = activeRoomRef.current;
      if (!room || data.room_id !== room.conversation_id) return;

      if (data.type === 'new_message' && data.content) {
        setMessages(prev => {
          if (prev.some(m => m.event_id === data.event_id)) return prev;
          return [...prev, {
            event_id: data.event_id,
            sender: data.sender || '',
            content: data.content,
            origin_server_ts: data.timestamp || Date.now(),
          }];
        });
      }

      if (data.type === 'translation_ready' && data.target_lang && data.translated_text) {
        setEnrichments(prev => {
          const next = new Map(prev);
          const existing = [...next.values()].find(e => e.id === data.enrichment_id);
          if (existing) {
            const has = existing.translations.some(t => t.target_lang === data.target_lang);
            if (!has) {
              existing.translations.push({
                target_lang: data.target_lang!,
                translated_text: data.translated_text!,
              });
              next.set(existing.matrix_event_id, { ...existing });
            }
          }
          return next;
        });
      }
    });

    socket.on('call:incoming', (data: any) => {
      setIncomingCall(data);
      try {
        const audio = new Audio('/sounds/ring.mp3');
        audio.loop = true;
        audio.play().catch(() => {});
        incomingAudioRef.current = audio;
      } catch {}
      setTimeout(() => {
        setIncomingCall(prev => prev?.conversationId === data.conversationId ? null : prev);
        incomingAudioRef.current?.pause();
      }, 30000);
    });

    socket.on('call:ended', (data: any) => {
      setIncomingCall(prev => prev?.conversationId === data.conversationId ? null : prev);
      incomingAudioRef.current?.pause();
      if (inCall) { setInCall(false); setCallToken(''); setCallLkUrl(''); }
    });

    socket.on('call:declined', () => {});

    socket.on('user-typing', (data: { conversationId: string; userId: string }) => {
      setTypingUsers(prev => new Set(prev).add(data.userId));
      setTimeout(() => {
        setTypingUsers(prev => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }, 3000);
    });

    return () => { socket.disconnect(); socketRef.current = null; };
  }, [token]);

  /* ─── Load rooms ───────────────────────────────────────── */
  useEffect(() => {
    if (!token) return;
    fetch('/api/chat/rooms', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setRooms(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
    fetch('/api/chat/unread', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setUnreadCounts).catch(() => {});
  }, [token]);

  /* ─── Join room + load messages ────────────────────────── */
  useEffect(() => {
    if (!activeRoom || !user) return;
    socketRef.current?.emit('join-room', { conversationId: activeRoom.conversation_id });

    fetch('/api/chat/matrix-token', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: activeRoom.conversation_id }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.access_token) {
          setMatrixToken(data.access_token);
          loadMessages();
        }
      })
      .catch(console.error);

    return () => {
      socketRef.current?.emit('leave-room', { conversationId: activeRoom.conversation_id });
    };
  }, [activeRoom]);

  const loadMessages = async () => {
    if (!activeRoom) return;
    try {
      const res = await fetch(
        `/api/chat/messages?room_id=${activeRoom.conversation_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (data.enrichments) setEnrichments(buildEnrichmentMap(data.enrichments));
      scrollToBottom();

      // Mark room as read
      if (data.messages?.length) {
        const lastEvent = data.messages[data.messages.length - 1];
        fetch('/api/chat/read', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ room_id: activeRoom?.conversation_id, event_id: lastEvent.event_id }),
        }).then(() => {
          setUnreadCounts(prev => ({ ...prev, [activeRoom?.conversation_id || '']: 0 }));
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  /* ─── Polling: fetch messages + enrichments every 4s ───── */
  useEffect(() => {
    if (!activeRoom || !token) return;
    const pollMessages = () => {
      const currentRoom = activeRoomRef.current;
      if (!currentRoom) return;
      fetch('/api/chat/messages?room_id=' + currentRoom.conversation_id, {
        headers: { Authorization: 'Bearer ' + token }
      })
        .then(r => r.json())
        .then((data: any) => {
          if (Array.isArray(data.messages)) {
            setMessages(prev => {
              const lastPrev = prev[prev.length - 1]?.event_id;
              const lastNew = data.messages[data.messages.length - 1]?.event_id;
              if (prev.length === data.messages.length && lastPrev === lastNew) return prev;
              return data.messages;
            });
          }
          if (data.enrichments) {
            setEnrichments(buildEnrichmentMap(data.enrichments));
          }
        })
        .catch(() => {});
    };
    const interval = setInterval(pollMessages, 4000);
    return () => clearInterval(interval);
  }, [activeRoom, token]);

  /* ─── Send text ────────────────────────────────────────── */
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeRoom?.matrix_room_id || !matrixToken) return;
    const txnId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const body = newMessage.trim();
    setNewMessage('');

    // Optimistic add
    setMessages(prev => [...prev, {
      event_id: txnId,
      sender: `@u_${user.userid}:saubh.tech`,
      content: { msgtype: 'm.text', body },
      origin_server_ts: Date.now(),
    }]);
    scrollToBottom();

    try {
      const res = await fetch(
        `/_matrix/client/v3/rooms/${encodeURIComponent(activeRoom.matrix_room_id)}/send/m.room.message/${txnId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${matrixToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ msgtype: 'm.text', body }),
        }
      );
      const data = await res.json();
      if (data.event_id) {
        setMessages(prev => prev.map(m => m.event_id === txnId ? { ...m, event_id: data.event_id } : m));
      }
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  /* ─── Typing indicator ─────────────────────────────────── */
  const handleTyping = () => {
    if (!activeRoom) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef.current?.emit('typing', { conversationId: activeRoom.conversation_id });
    typingTimeoutRef.current = setTimeout(() => {}, 3000);
  };

  /* ─── Voice recording ──────────────────────────────────── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size > 0 && activeRoom) {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'voice.webm');
          formData.append('room_id', activeRoom.conversation_id);
          try {
            await fetch('/api/chat/voice/upload', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            });
            loadMessages();
          } catch (err) { console.error('Voice upload failed', err); }
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) { console.error('Mic error', err); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (recordingTimerRef.current) { clearInterval(recordingTimerRef.current); recordingTimerRef.current = null; }
  };

  /* ─── File upload ──────────────────────────────────────── */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRoom) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('room_id', activeRoom.conversation_id);
    try {
      await fetch('/api/chat/file/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      loadMessages();
    } catch (err) { console.error('File upload failed', err); }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ─── Create DM ────────────────────────────────────────── */
  const createDm = async () => {
    if (!dmUserId.trim() || !token) return;
    try {
      const res = await fetch('/api/chat/dm', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_b: dmUserId.trim() }),
      });
      const data = await res.json();
      // Refresh rooms
      const roomsRes = await fetch('/api/chat/rooms', { headers: { Authorization: `Bearer ${token}` } });
      const updatedRooms = await roomsRes.json();
      setRooms(updatedRooms);
      const newRoom = updatedRooms.find((r: any) => r.conversation_id === data.conversation_id?.toString());
      if (newRoom) setActiveRoom(newRoom);
      setDmUserId('');
    } catch (err) { console.error('DM creation failed', err); }
  };

  /* ─── Change language preference ───────────────────────── */
  const changeLang = async (langCode: string) => {
    if (!activeRoom || !token) return;
    setLangDropdownOpen(false);
    try {
      await fetch('/api/chat/prefs', {
        method: 'PUT',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: String(activeRoom.conversation_id), preferred_lang: langCode }),
      });
      const res = await fetch('/api/chat/rooms', { headers: { Authorization: 'Bearer ' + token } });
      const updatedRooms = await res.json();
      setRooms(updatedRooms);
      const updated = updatedRooms.find((r: any) => r.conversation_id === activeRoom.conversation_id);
      if (updated) setActiveRoom(updated);
    } catch (err) { console.error('Failed to change language:', err); }
  };

  /* ─── Auto-open from query params (dashboard integration) ── */
  useEffect(() => {
    if (!rooms.length || !token) return;
    const dmParam = searchParams.get('dm');
    if (dmParam) {
      const existing = rooms.find(r =>
        r.type === 'DM' && r.members.some(m => m.user_id === dmParam)
      );
      if (existing) {
        setActiveRoom(existing);
      } else {
        fetch('/api/chat/dm', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_b: dmParam }),
        })
          .then(r => r.json())
          .then(async () => {
            const res = await fetch('/api/chat/rooms', { headers: { Authorization: `Bearer ${token}` } });
            const updated = await res.json();
            setRooms(updated);
            const newRoom = updated.find((r: any) =>
              r.type === 'DM' && r.members.some((m: any) => m.user_id === dmParam)
            );
            if (newRoom) setActiveRoom(newRoom);
          })
          .catch(console.error);
      }
    }
  }, [rooms.length, token, searchParams]);

  /* ─── Helpers ──────────────────────────────────────────── */
  const toggleOriginal = (eventId: string) => {
    setShowOriginal(prev => {
      const next = new Set(prev);
      next.has(eventId) ? next.delete(eventId) : next.add(eventId);
      return next;
    });
  };

  const getOtherMember = (room: ChatRoom) => {
    if (!user) return null;
    return room.members.find(m => m.user_id !== user.userid?.toString());
  };

  const getTranslation = (eventId: string) => {
    const e = enrichments.get(eventId);
    if (!e || !e.translations?.length) return null;
    const myLang = activeRoom?.my_lang || 'hi';
    return e.translations.find(t => t.target_lang === myLang);
  };

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getMemberName = (sender: string) => {
    const match = sender.match(/@u_(\d+):/);
    if (!match) return sender;
    const member = activeRoom?.members.find(m => m.user_id === match[1]);
    return member ? member.fname : `User ${match[1]}`;
  };

  /* ─── Start call ───────────────────────────────────────── */
  const startCall = async (type: 'video' | 'audio' = 'video') => {
    if (!activeRoom || !token) return;
    try {
      const res = await fetch('/api/chat/call/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ room_id: Number(activeRoom.conversation_id) }),
      });
      if (!res.ok) throw new Error('Failed to get call token');
      const data = await res.json();
      setCallToken(data.token);
      setCallLkUrl(data.livekitUrl);
      setCallType(type);
      setInCall(true);
      socketRef.current?.emit('call:start', {
        conversationId: activeRoom.conversation_id,
        callerName: user?.name || 'Someone',
        callType: type,
      });
    } catch (err) { console.error('Call error:', err); alert('Could not start call'); }
  };

  /* ─── Loading screen ───────────────────────────────────── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#080b12', color: '#e0e0e0', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
        <div>Loading chat...</div>
      </div>
    </div>
  );

  /* ─── Render ───────────────────────────────────────────── */
  return (
    <>
    <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'Outfit, sans-serif', background: '#080b12', color: '#e0e0e0' }}>
      {/* ─── Sidebar ──────────────────────────────────────── */}
      <div style={{ width: 320, borderRight: '1px solid #1a1f2e', display: 'flex', flexDirection: 'column', background: '#0d1117' }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #1a1f2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>💬 Chat</h2>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: onlineStatus === 'connected' ? '#22c55e' : onlineStatus === 'connecting' ? '#eab308' : '#ef4444',
          }} title={onlineStatus} />
        </div>

        {/* DM Creator */}
        <div style={{ display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #1a1f2e' }}>
          <input
            value={dmUserId}
            onChange={e => setDmUserId(e.target.value)}
            placeholder="User ID for DM..."
            onKeyDown={e => e.key === 'Enter' && createDm()}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid #1a2332',
              background: '#0d1117', color: '#e0e0e0', fontSize: 13, outline: 'none',
            }}
          />
          <button onClick={createDm} style={{
            background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10,
            width: 36, height: 36, fontSize: 18, cursor: 'pointer', fontWeight: 700,
          }}>+</button>
        </div>

        {/* Room List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {rooms.map(room => {
            const other = getOtherMember(room);
            const isActive = activeRoom?.conversation_id === room.conversation_id;
            const displayName = room.type === 'DM'
              ? (other ? `${other.fname} ${other.lname || ''}`.trim() : 'DM')
              : (room.title || 'Group');
            const initial = displayName.charAt(0).toUpperCase();

            return (
              <div
                key={room.conversation_id}
                onClick={() => { setActiveRoom(room); setMessages([]); setEnrichments(new Map()); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  cursor: 'pointer', transition: 'background 0.15s',
                  background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                  borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: room.type === 'DM' ? '#3b82f6' : '#8b5cf6',
                  color: '#fff', fontSize: 18, fontWeight: 700,
                }}>
                  {other?.pic ? <img src={other.pic} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initial}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    {room.type !== 'DM' && `${room.members.length} members · `}
                    🌐 {LANG_NAMES[room.my_lang] || room.my_lang}
                  </div>
                  {(unreadCounts[room.conversation_id] || 0) > 0 && (
                    <div style={{
                      minWidth: 22, height: 22, borderRadius: 11, background: '#3b82f6',
                      color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', padding: '0 6px',
                    }}>
                      {unreadCounts[room.conversation_id]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Chat Area ────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!activeRoom ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: '#555' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <div style={{ fontSize: 16 }}>Select a conversation or start a new DM</div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px', borderBottom: '1px solid #1a1f2e', background: '#0d1117',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#fff' }}>
                  {activeRoom.type === 'DM'
                    ? (() => { const o = getOtherMember(activeRoom); return o ? `${o.fname} ${o.lname || ''}`.trim() : 'DM'; })()
                    : activeRoom.title || 'Group'}
                </h3>
                {activeRoom.type !== 'DM' && (
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    {activeRoom.members.map(m => m.fname).join(', ')}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => startCall('audio')} title="Voice Call" style={{
                  background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8,
                  padding: '6px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>🎤</button>
                <button onClick={() => startCall('video')} title="Video Call" style={{
                  background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8,
                  padding: '6px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>📹</button>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    style={{
                      fontSize: 12, color: '#888', padding: '4px 10px', background: '#161b22',
                      borderRadius: 12, border: '1px solid transparent', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#3b82f6')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                    title="Change your chat language"
                  >
                    🌐 {LANG_NAMES[activeRoom.my_lang] || activeRoom.my_lang} ▾
                  </button>
                  {langDropdownOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: 4,
                      background: '#1a1f2e', border: '1px solid #2a2f3e', borderRadius: 12,
                      padding: '6px 0', maxHeight: 280, overflowY: 'auto', width: 180,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 100,
                    }}>
                      {Object.entries(LANG_NAMES).map(([code, name]) => (
                        <button
                          key={code}
                          onClick={() => changeLang(code)}
                          style={{
                            display: 'block', width: '100%', padding: '8px 14px',
                            background: code === activeRoom.my_lang ? 'rgba(59,130,246,0.15)' : 'transparent',
                            border: 'none', color: code === activeRoom.my_lang ? '#3b82f6' : '#ccc',
                            fontWeight: code === activeRoom.my_lang ? 700 : 400,
                            fontSize: 13, cursor: 'pointer', textAlign: 'left',
                          }}
                        >
                          {name} ({code})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {messages.map(msg => {
                const isMine = msg.sender === `@u_${user?.userid}:saubh.tech`;
                const translation = getTranslation(msg.event_id);
                const showOrig = showOriginal.has(msg.event_id);
                const enrichment = enrichments.get(msg.event_id);
                const isVoice = enrichment?.message_type === 'VOICE';

                return (
                  <div key={msg.event_id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 14px', borderRadius: 16,
                      ...(isMine
                        ? { background: '#3b82f6', color: '#fff', borderBottomRightRadius: 4 }
                        : { background: '#1a2332', color: '#e0e0e0', borderBottomLeftRadius: 4 }),
                    }}>
                      {/* Sender name in group */}
                      {!isMine && activeRoom.type !== 'DM' && (
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#93c5fd', marginBottom: 2 }}>
                          {getMemberName(msg.sender)}
                        </div>
                      )}

                      {/* Voice player */}
                      {isVoice && enrichment?.original_media_url && (
                        <div style={{ marginBottom: 6 }}>
                          <div style={{ fontSize: 12, marginBottom: 4, opacity: 0.8 }}>🎤 Voice note</div>
                          <audio
                            controls
                            preload="none"
                            style={{ width: '100%', maxWidth: 260, height: 36, borderRadius: 8 }}
                            src={`/api/chat/voice/play?url=${encodeURIComponent(enrichment.original_media_url)}`}
                          />
                        </div>
                      )}

                      {/* Transcript for voice */}
                      {isVoice && enrichment?.transcript_text && (
                        <div style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.7, marginBottom: 4 }}>
                          📝 {enrichment.transcript_text}
                        </div>
                      )}

                      {/* Image display */}
                      {enrichment?.message_type === 'IMAGE' && enrichment?.original_media_url && (
                        <div style={{ marginBottom: 6 }}>
                          <img
                            src={`/api/chat/file/download?url=${encodeURIComponent(enrichment.original_media_url)}`}
                            alt="shared image"
                            style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, cursor: 'pointer' }}
                            onClick={() => window.open(`/api/chat/file/download?url=${encodeURIComponent(enrichment.original_media_url!)}`, '_blank')}
                          />
                        </div>
                      )}

                      {/* File download */}
                      {enrichment?.message_type === 'FILE' && enrichment?.original_media_url && (
                        <a
                          href={`/api/chat/file/download?url=${encodeURIComponent(enrichment.original_media_url)}`}
                          target="_blank"
                          rel="noopener"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                            background: 'rgba(255,255,255,0.1)', borderRadius: 8, marginBottom: 6,
                            color: '#93c5fd', textDecoration: 'none', fontSize: 13,
                          }}
                        >
                          📄 {msg.content?.body || 'Download file'}
                        </a>
                      )}

                      {/* Message text */}
                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                        {translation && !showOrig ? translation.translated_text : msg.content?.body}
                      </div>

                      {/* Translating indicator */}
                      {!isMine && !translation && enrichment && (Date.now() - msg.origin_server_ts < 60000) && (
                        <div style={{ fontSize: 11, color: '#eab308', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ animation: 'pulse 1.5s infinite' }}>🔄</span> Translating...
                        </div>
                      )}

                      {/* Translation toggle */}
                      {translation && (
                        <button
                          onClick={() => toggleOriginal(msg.event_id)}
                          style={{
                            fontSize: 11, background: 'none', border: 'none', cursor: 'pointer',
                            padding: '4px 0 0', textDecoration: 'underline',
                            color: isMine ? 'rgba(255,255,255,0.7)' : '#93c5fd',
                          }}
                        >
                          {showOrig ? '🌐 View translated' : '📄 View original'}
                        </button>
                      )}

                      {/* Timestamp */}
                      <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, textAlign: 'right' }}>
                        {formatTime(msg.origin_server_ts)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {typingUsers.size > 0 && (
                <div style={{ fontSize: 12, color: '#666', fontStyle: 'italic', padding: '4px 0' }}>
                  {[...typingUsers].map(uid => {
                    const m = activeRoom.members.find(m => m.user_id === uid);
                    return m ? m.fname : `User ${uid}`;
                  }).join(', ')} typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
              padding: '12px 20px', borderTop: '1px solid #1a1f2e', background: '#0d1117',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              {/* Voice recorder */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                  background: isRecording ? '#ef4444' : 'transparent', border: isRecording ? 'none' : '1px solid #333',
                  color: isRecording ? '#fff' : '#888', borderRadius: '50%', width: 36, height: 36,
                  cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title={isRecording ? `Stop (${recordingTime}s)` : 'Record voice note'}
              >
                {isRecording ? '⏹' : '🎤'}
              </button>

              {/* File attach */}
              <input ref={fileInputRef} type="file" hidden onChange={handleFileUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'transparent', border: '1px solid #333', color: '#888',
                  borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="Attach file"
              >📎</button>

              {/* Text input */}
              <input
                value={newMessage}
                onChange={e => { setNewMessage(e.target.value); handleTyping(); }}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: 24, background: '#161b22',
                  border: '1px solid #1a2332', color: '#e0e0e0', fontSize: 14, outline: 'none',
                }}
              />

              {/* Send */}
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                style={{
                  background: newMessage.trim() ? '#3b82f6' : '#1a2332',
                  color: '#fff', border: 'none', borderRadius: 24, padding: '10px 20px',
                  fontSize: 14, fontWeight: 600, cursor: newMessage.trim() ? 'pointer' : 'default',
                  opacity: newMessage.trim() ? 1 : 0.5,
                }}
              >Send</button>
            </div>
          </>
        )}
      </div>

      {/* ─── Incoming call popup ──────────────────────────── */}
      {incomingCall && (
        <div style={{
          position: 'fixed', top: 20, right: 20, background: '#1a2332', borderRadius: 16,
          padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 1000, minWidth: 280,
          border: '1px solid #3b82f6',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
            📞 Incoming {incomingCall.callType} call
          </div>
          <div style={{ fontSize: 13, color: '#aaa', marginBottom: 16 }}>
            {incomingCall.callerName}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => {
              setIncomingCall(null);
              incomingAudioRef.current?.pause();
              const room = rooms.find(r => r.conversation_id === incomingCall.conversationId);
              if (room) { setActiveRoom(room); startCall(incomingCall.callType as any); }
            }} style={{
              flex: 1, padding: '8px 16px', background: '#22c55e', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
            }}>Accept</button>
            <button onClick={() => {
              setIncomingCall(null);
              incomingAudioRef.current?.pause();
              socketRef.current?.emit('call:decline', { conversationId: incomingCall.conversationId });
            }} style={{
              flex: 1, padding: '8px 16px', background: '#ef4444', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
            }}>Decline</button>
          </div>
        </div>
      )}

      {/* ─── Call view ────────────────────────────────────── */}
      {inCall && callToken && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: '#000' }}>
          <CallView
            roomId={Number(activeRoom?.conversation_id || 0)}
            myLang={activeRoom?.my_lang || 'en'}
            otherLang={(() => { const o = activeRoom?.members?.find((m: any) => m.user_id !== user?.userid?.toString()); return o?.lang || 'en'; })()}
            authToken={token}
            token={callToken}
            livekitUrl={callLkUrl}
            callType={callType}
            onClose={() => { setInCall(false); setCallToken(''); setCallLkUrl(''); }}
          />
        </div>
      )}
    </div>
    </>
  );
}
