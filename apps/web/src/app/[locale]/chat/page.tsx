'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
  translations: { target_lang: string; translated_text: string }[];
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function ChatPage() {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<MatrixEvent[]>([]);
  const [enrichments, setEnrichments] = useState<Map<string, Enrichment>>(new Map());
  const [newMessage, setNewMessage] = useState('');
  const [matrixToken, setMatrixToken] = useState('');
  const [showOriginal, setShowOriginal] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [dmUserId, setDmUserId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const syncTokenRef = useRef<string>('');

  // Auth check
  useEffect(() => {
    const t = getCookie('saubh_token');
    const u = getCookie('saubh_user');
    if (!t || !u) { router.replace(`/${locale}/login`); return; }
    try {
      setToken(t);
      setUser(JSON.parse(u));
    } catch { router.replace(`/${locale}/login`); }
  }, [locale, router]);

  // Load rooms
  useEffect(() => {
    if (!token) return;
    fetch('/api/chat/rooms', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setRooms(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  // Login to Matrix when room selected
  useEffect(() => {
    if (!activeRoom || !user) return;
    // Get Matrix token via admin reset (simplified for MVP)
    fetch('/api/chat/matrix-token', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: activeRoom.conversation_id }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.access_token) {
          setMatrixToken(data.access_token);
          loadMessages(activeRoom.matrix_room_id!, data.access_token);
        }
      })
      .catch(console.error);
  }, [activeRoom]);

  // Real-time polling for new messages
  useEffect(() => {
    if (!activeRoom || !token) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/chat/messages?room_id=${activeRoom.conversation_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (Array.isArray(data.messages)) setMessages(data.messages);
        if (data.enrichments) {
          const map = new Map<string, Enrichment>();
          data.enrichments.forEach((e: Enrichment) => map.set(e.matrix_event_id, e));
          setEnrichments(map);
        }
      } catch {}
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeRoom, token]);

  const loadMessages = async (matrixRoomId: string, mToken: string) => {
    try {
      const res = await fetch(
        `/api/chat/messages?room_id=${activeRoom?.conversation_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (data.enrichments) {
        const map = new Map<string, Enrichment>();
        data.enrichments.forEach((e: Enrichment) => map.set(e.matrix_event_id, e));
        setEnrichments(map);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeRoom?.matrix_room_id || !matrixToken) return;
    const txnId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    try {
      await fetch(
        `/_matrix/client/v3/rooms/${encodeURIComponent(activeRoom.matrix_room_id)}/send/m.room.message/${txnId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${matrixToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ msgtype: 'm.text', body: newMessage }),
        }
      );
      setMessages(prev => [...prev, {
        event_id: txnId,
        sender: `@u_${user.userid}:saubh.tech`,
        content: { msgtype: 'm.text', body: newMessage },
        origin_server_ts: Date.now(),
      }]);
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Send failed', err);
    }
  };

  const createDm = async () => {
    if (!dmUserId.trim()) return;
    try {
      const res = await fetch('/api/chat/dm', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_b: dmUserId }),
      });
      const data = await res.json();
      if (data.conversation_id) {
        setDmUserId('');
        // Reload rooms
        const roomsRes = await fetch('/api/chat/rooms', { headers: { Authorization: `Bearer ${token}` } });
        const roomsData = await roomsRes.json();
        setRooms(Array.isArray(roomsData) ? roomsData : []);
      }
    } catch (err) {
      console.error('DM creation failed', err);
    }
  };

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

  if (loading) return <div style={styles.loading}>Loading chat...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>💬 Chat</h2>
        </div>

        {/* New DM */}
        <div style={styles.newDm}>
          <input
            style={styles.dmInput}
            placeholder="User ID..."
            value={dmUserId}
            onChange={e => setDmUserId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createDm()}
          />
          <button style={styles.dmBtn} onClick={createDm}>+ DM</button>
        </div>

        {/* Room list */}
        <div style={styles.roomList}>
          {rooms.length === 0 && <p style={styles.noRooms}>No conversations yet</p>}
          {rooms.map(room => {
            const other = getOtherMember(room);
            const isActive = activeRoom?.conversation_id === room.conversation_id;
            return (
              <div
                key={room.conversation_id}
                style={{ ...styles.roomItem, ...(isActive ? styles.roomActive : {}) }}
                onClick={() => setActiveRoom(room)}
              >
                <div style={styles.roomAvatar}>
                  {other?.pic
                    ? <img src={other.pic} alt="" style={styles.avatarImg} />
                    : <div style={styles.avatarPlaceholder}>{(other?.fname || '?')[0]}</div>
                  }
                </div>
                <div style={styles.roomInfo}>
                  <div style={styles.roomName}>
                    {room.type === 'DM' ? (other ? `${other.fname} ${other.lname || ''}`.trim() : 'DM') : room.title || 'Group'}
                  </div>
                  <div style={styles.roomLang}>🌐 {room.my_lang}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div style={styles.chatArea}>
        {!activeRoom ? (
          <div style={styles.noChat}>
            <p style={styles.noChatText}>Select a conversation or start a new DM</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={styles.chatHeader}>
              <h3 style={styles.chatTitle}>
                {activeRoom.type === 'DM'
                  ? (() => { const o = getOtherMember(activeRoom); return o ? `${o.fname} ${o.lname || ''}`.trim() : 'DM'; })()
                  : activeRoom.title || 'Group'}
              </h3>
              <span style={styles.chatLang}>🌐 {activeRoom.my_lang}</span>
            </div>

            {/* Messages */}
            <div style={styles.messagesArea}>
              {messages.map(msg => {
                const isMine = msg.sender === `@u_${user?.userid}:saubh.tech`;
                const translation = getTranslation(msg.event_id);
                const showOrig = showOriginal.has(msg.event_id);

                return (
                  <div key={msg.event_id} style={{ ...styles.msgRow, justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{ ...styles.msgBubble, ...(isMine ? styles.msgMine : styles.msgTheirs) }}>
                      <div style={styles.msgText}>
                        {translation && !showOrig ? translation.translated_text : msg.content?.body}
                      </div>
                      {translation && (
                        <button
                          style={styles.toggleBtn}
                          onClick={() => toggleOriginal(msg.event_id)}
                        >
                          {showOrig ? 'View translated' : 'View original'}
                        </button>
                      )}
                      <div style={styles.msgTime}>
                        {new Date(msg.origin_server_ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={styles.inputArea}>
              <input
                style={styles.msgInput}
                placeholder="Type a message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', height: '100vh', fontFamily: 'Outfit, sans-serif', background: '#080b12', color: '#e0e0e0' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#e0e0e0', fontSize: 18, background: '#080b12' },

  // Sidebar
  sidebar: { width: 320, borderRight: '1px solid #1a1f2e', display: 'flex', flexDirection: 'column', background: '#0d1117' },
  sidebarHeader: { padding: '20px 16px 12px', borderBottom: '1px solid #1a1f2e' },
  sidebarTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' },
  newDm: { display: 'flex', gap: 8, padding: '12px 16px', borderBottom: '1px solid #1a1f2e' },
  dmInput: { flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #2a2f3e', background: '#161b22', color: '#e0e0e0', fontSize: 13, outline: 'none' },
  dmBtn: { padding: '8px 14px', borderRadius: 8, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  roomList: { flex: 1, overflowY: 'auto' as const },
  noRooms: { padding: 20, textAlign: 'center' as const, color: '#666', fontSize: 14 },
  roomItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #1a1f2e', transition: 'background 0.15s' },
  roomActive: { background: '#1a2332' },
  roomAvatar: { width: 44, height: 44, borderRadius: '50%', overflow: 'hidden' as const, flexShrink: 0 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' as const },
  avatarPlaceholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3b82f6', color: '#fff', fontSize: 18, fontWeight: 700 },
  roomInfo: { flex: 1, minWidth: 0 },
  roomName: { fontSize: 14, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' as const, overflow: 'hidden' as const, textOverflow: 'ellipsis' as const },
  roomLang: { fontSize: 11, color: '#666', marginTop: 2 },

  // Chat
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column' },
  noChat: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  noChatText: { color: '#555', fontSize: 16 },
  chatHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #1a1f2e', background: '#0d1117' },
  chatTitle: { margin: 0, fontSize: 16, fontWeight: 600, color: '#fff' },
  chatLang: { fontSize: 12, color: '#888' },

  // Messages
  messagesArea: { flex: 1, overflowY: 'auto' as const, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 },
  msgRow: { display: 'flex' },
  msgBubble: { maxWidth: '70%', padding: '10px 14px', borderRadius: 16 },
  msgMine: { background: '#3b82f6', color: '#fff', borderBottomRightRadius: 4 },
  msgTheirs: { background: '#1a2332', color: '#e0e0e0', borderBottomLeftRadius: 4 },
  msgText: { fontSize: 14, lineHeight: 1.5 },
  toggleBtn: { fontSize: 11, color: '#93c5fd', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0 0', textDecoration: 'underline' },
  msgTime: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4, textAlign: 'right' as const },

  // Input
  inputArea: { display: 'flex', gap: 8, padding: '12px 20px', borderTop: '1px solid #1a1f2e', background: '#0d1117' },
  msgInput: { flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid #2a2f3e', background: '#161b22', color: '#e0e0e0', fontSize: 14, outline: 'none' },
  sendBtn: { padding: '12px 24px', borderRadius: 12, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};
