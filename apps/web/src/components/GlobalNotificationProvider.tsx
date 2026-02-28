'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

interface Toast {
  id: string;
  type: 'message' | 'call';
  title: string;
  body: string;
  conversationId: string;
  callType?: string;
  callerId?: string;
  callerName?: string;
  timestamp: number;
}

interface IncomingCall {
  conversationId: string;
  callerId: string;
  callerName: string;
  callType: string;
}

export default function GlobalNotificationProvider() {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const callTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Skip on chat page — it has its own socket and notifications
  const isOnChatPage = pathname?.includes('/chat');

  const addToast = useCallback((toast: Omit<Toast, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { ...toast, id, timestamp: Date.now() }]);
    // Auto-dismiss after 6s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const navigateToChat = useCallback((conversationId: string, callType?: string) => {
    const url = callType
      ? `/${locale}/chat?dm=${conversationId}&call=${callType}`
      : `/${locale}/chat?dm=${conversationId}`;
    router.push(url);
  }, [locale, router]);

  // Connect socket
  useEffect(() => {
    if (isOnChatPage) return; // chat page manages its own socket

    const token = getCookie('saubh-token');
    if (!token) return;

    const rtUrl = typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname}:3002`
      : '';
    if (!rtUrl) return;

    const socket = io(rtUrl, {
      path: '/socket.io',
      auth: { token },
      reconnection: true,
      reconnectionDelay: 3000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔔 Global notifications connected');
    });

    socket.on('authenticated', async () => {
      // Fetch user's rooms and subscribe for notifications
      try {
        const res = await fetch('/api/chat/rooms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const rooms = await res.json();
          const roomIds = rooms.map((r: any) => r.conversation_id);
          socket.emit('subscribe-notifications', { roomIds });
        }
      } catch (err) {
        console.warn('Could not fetch rooms for notifications:', err);
      }
    });

    // Global message notification
    socket.on('global:new_message', (data: any) => {
      addToast({
        type: 'message',
        title: data.senderName || 'New message',
        body: data.type === 'voice_note' ? '🎤 Voice note'
          : data.type === 'image' ? '📷 Image'
          : data.type === 'file' ? '📎 File'
          : data.content || 'New message',
        conversationId: data.conversationId,
      });
      // Play notification sound
      try {
        const audio = new Audio('/sounds/ring.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}
    });

    // Global incoming call
    socket.on('global:call:incoming', (data: any) => {
      setIncomingCall({
        conversationId: data.conversationId,
        callerId: data.callerId,
        callerName: data.callerName || 'Someone',
        callType: data.callType || 'video',
      });
      // Ring
      try {
        audioRef.current = new Audio('/sounds/ring.mp3');
        audioRef.current.loop = true;
        audioRef.current.play().catch(() => {});
      } catch {}
      // Auto-dismiss after 30s
      callTimeoutRef.current = setTimeout(() => {
        setIncomingCall(null);
        audioRef.current?.pause();
      }, 30000);
    });

    socket.on('global:call:ended', () => {
      setIncomingCall(null);
      audioRef.current?.pause();
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      audioRef.current?.pause();
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    };
  }, [isOnChatPage, addToast]);

  const acceptCall = useCallback(() => {
    if (!incomingCall) return;
    audioRef.current?.pause();
    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    navigateToChat(incomingCall.conversationId, incomingCall.callType);
    setIncomingCall(null);
  }, [incomingCall, navigateToChat]);

  const declineCall = useCallback(() => {
    audioRef.current?.pause();
    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    if (incomingCall) {
      socketRef.current?.emit('call:decline', { conversationId: incomingCall.conversationId });
    }
    setIncomingCall(null);
  }, [incomingCall]);

  // Don't render anything on chat page
  if (isOnChatPage) return null;

  return (
    <>
      {/* ─── Toast notifications (bottom-right) ─── */}
      {toasts.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 60, right: 20, zIndex: 9990,
          display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 340,
        }}>
          {toasts.map(toast => (
            <div
              key={toast.id}
              onClick={() => { navigateToChat(toast.conversationId); dismissToast(toast.id); }}
              style={{
                background: 'rgba(20,25,35,0.95)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12,
                padding: '12px 16px', cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                animation: 'slideIn 0.3s ease-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{toast.type === 'call' ? '📞' : '💬'}</span>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{toast.title}</span>
                <button
                  onClick={e => { e.stopPropagation(); dismissToast(toast.id); }}
                  style={{
                    marginLeft: 'auto', background: 'none', border: 'none',
                    color: '#666', cursor: 'pointer', fontSize: 16, padding: 0,
                  }}
                >✕</button>
              </div>
              <div style={{
                color: '#aaa', fontSize: 13,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{toast.body}</div>
              <div style={{ color: '#3b82f6', fontSize: 11, marginTop: 4 }}>
                Click to open chat →
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Incoming call overlay ─── */}
      {incomingCall && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#1a1f2e', borderRadius: 20, padding: '40px 48px', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)', maxWidth: 360,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {incomingCall.callType === 'audio' ? '🎤' : '📹'}
            </div>
            <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              {incomingCall.callerName}
            </div>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>
              Incoming {incomingCall.callType} call...
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button
                onClick={declineCall}
                style={{
                  background: '#ef4444', color: '#fff', border: 'none', borderRadius: 50,
                  width: 60, height: 60, fontSize: 24, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
              <button
                onClick={acceptCall}
                style={{
                  background: '#22c55e', color: '#fff', border: 'none', borderRadius: 50,
                  width: 60, height: 60, fontSize: 24, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✓</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CSS animation ─── */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
