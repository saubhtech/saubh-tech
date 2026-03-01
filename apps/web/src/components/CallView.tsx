'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  useParticipants,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track, RoomEvent, LocalParticipant, Participant } from 'livekit-client';

interface CallViewProps {
  roomId: number;
  token: string;
  livekitUrl: string;
  callType?: 'video' | 'audio';
  onClose: () => void;
  myLang?: string;
  otherLang?: string;
  authToken?: string;
}

export default function CallView({ roomId, token, livekitUrl, callType = 'video', onClose, myLang, otherLang, authToken }: CallViewProps) {
  const [isConnecting, setIsConnecting] = useState(true);
  if (!token || !livekitUrl) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0a0a', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', background: 'rgba(0,0,0,0.8)', borderBottom: '1px solid #222',
      }}>
        <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
          {isConnecting ? 'Connecting...' : callType === 'audio' ? '🎤 Voice Call' : '📹 Video Call'}
        </span>
        <button onClick={onClose} style={{
          background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8,
          padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>End Call</button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <LiveKitRoom
          serverUrl={livekitUrl}
          token={token}
          connect={true}
          video={false}
          audio={false}
          onConnected={() => setIsConnecting(false)}
          onDisconnected={() => onClose()}
          onError={(err) => { console.error('LiveKit error:', err); }}
          style={{ height: '100%' }}
          data-lk-theme="default"
        >
          <CallContent callType={callType} onClose={onClose} myLang={myLang} otherLang={otherLang} authToken={authToken} />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
}

/* ─── Single video tile — renders camera OR screenshare ─── */
function VideoTile({ participant, source, isLocal, isMain }: {
  participant: Participant; source: Track.Source; isLocal: boolean; isMain?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const attach = () => {
      const pub = participant.getTrackPublication(source);
      if (pub?.track) {
        pub.track.attach(el);
        el.muted = true; // always mute video element; audio handled by RoomAudioRenderer
        el.play().catch(() => {});
        setHasVideo(true);
      } else {
        setHasVideo(false);
      }
    };

    attach();
    const interval = setInterval(attach, 500);
    return () => {
      clearInterval(interval);
      const pub = participant.getTrackPublication(source);
      if (pub?.track && el) pub.track.detach(el);
    };
  }, [participant, source]);

  const isScreen = source === Track.Source.ScreenShare;
  const label = isScreen
    ? (isLocal ? '🖥 Your Screen' : `🖥 ${participant.name || participant.identity}'s Screen`)
    : (isLocal ? 'You' : participant.name || participant.identity);

  return (
    <div style={{
      flex: isMain ? '1 1 100%' : '1 1 45%',
      maxWidth: '100%',
      position: 'relative', borderRadius: 12, overflow: 'hidden', background: '#111',
      minHeight: isMain ? 300 : 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: isScreen ? '2px solid #3b82f6' : 'none',
    }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%', height: '100%',
          objectFit: isScreen ? 'contain' : 'cover',
          display: hasVideo ? 'block' : 'none',
          transform: (isLocal && !isScreen) ? 'scaleX(-1)' : 'none',
        }}
      />
      {!hasVideo && (
        <div style={{ textAlign: 'center', color: '#555' }}>
          <div style={{ fontSize: 40 }}>{isScreen ? '🖥' : '👤'}</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>{label}</div>
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 8, left: 8,
        background: 'rgba(0,0,0,0.6)', color: '#fff',
        padding: '2px 8px', borderRadius: 6, fontSize: 12,
      }}>{label}</div>
    </div>
  );
}

function CallContent({ callType, onClose, myLang, otherLang, authToken }: { callType: string; onClose: () => void; myLang?: string; otherLang?: string; authToken?: string }) {
  const room = useRoomContext();
  const participants = useParticipants();
  const stableOnClose = useCallback(onClose, []);
  const [, forceUpdate] = useState(0);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [subtitlesAvailable, setSubtitlesAvailable] = useState(false);
  const [subtitles, setSubtitles] = useState<{orig: string; trans: string; ts: number}[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const failCountRef = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Force re-render when tracks change
  useEffect(() => {
    if (!room) return;
    const refresh = () => forceUpdate(n => n + 1);
    room.on(RoomEvent.TrackSubscribed, refresh);
    room.on(RoomEvent.TrackUnsubscribed, refresh);
    room.on(RoomEvent.TrackPublished, refresh);
    room.on(RoomEvent.TrackUnpublished, refresh);
    room.on(RoomEvent.LocalTrackPublished, refresh);
    room.on(RoomEvent.LocalTrackUnpublished, refresh);
    return () => {
      room.off(RoomEvent.TrackSubscribed, refresh);
      room.off(RoomEvent.TrackUnsubscribed, refresh);
      room.off(RoomEvent.TrackPublished, refresh);
      room.off(RoomEvent.TrackUnpublished, refresh);
      room.off(RoomEvent.LocalTrackPublished, refresh);
      room.off(RoomEvent.LocalTrackUnpublished, refresh);
    };
  }, [room]);

  // Enable devices after connect
  useEffect(() => {
    if (!room) return;
    let cancelled = false;

    const enableDevices = async () => {
      try {
        await room.localParticipant.setMicrophoneEnabled(true);
        console.log('✅ Mic enabled');
      } catch (err) { console.warn('Mic failed:', err); }

      if (callType === 'video' && !cancelled) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const cameras = devices.filter(d => d.kind === 'videoinput');
          console.log('📷 Available cameras:', cameras.map(c => c.label));
          const realCam = cameras.find(c => !c.label.toLowerCase().includes('virtual'));

          if (realCam) {
            console.log('📷 Using camera:', realCam.label);
            await room.localParticipant.setCameraEnabled(true, {
              deviceId: realCam.deviceId,
              resolution: { width: 1280, height: 720, frameRate: 30 },
            } as any);
          } else {
            await room.localParticipant.setCameraEnabled(true, {
              facingMode: 'user',
              resolution: { width: 1280, height: 720, frameRate: 30 },
            } as any);
          }
          console.log('✅ Camera enabled');
        } catch (err) { console.warn('Camera failed:', err); }
      }
    };

    const timer = setTimeout(enableDevices, 800);
    const handleDisconnect = () => stableOnClose();
    room.on(RoomEvent.Disconnected, handleDisconnect);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      room.off(RoomEvent.Disconnected, handleDisconnect);
    };
  }, [room, callType, stableOnClose]);

  // Check subtitle availability
  useEffect(() => {
    if (!authToken) return;
    fetch('/api/chat/call/subtitles/status', { headers: { Authorization: 'Bearer ' + authToken } })
      .then(r => r.ok ? r.json() : { available: false })
      .then(d => { if (d.available) { setSubtitlesAvailable(true); setSubtitlesEnabled(true); } })
      .catch(() => {});
  }, [authToken]);

  // Audio capture from LiveKit mic track (NO getUserMedia)
  useEffect(() => {
    if (!room || !subtitlesEnabled || !subtitlesAvailable || !authToken || !myLang) return;
    let cancelled = false;

    const start = () => {
      try {
        // Get REMOTE participant's mic (so we see THEIR speech translated)
        const remotes = room.remoteParticipants;
        let mst: MediaStreamTrack | undefined;
        if (remotes && remotes.size > 0) {
          const remote = Array.from(remotes.values())[0];
          const micPub = remote?.getTrackPublication?.(Track.Source.Microphone);
          mst = micPub?.track?.mediaStreamTrack;
        }
        if (!mst) { if (!cancelled) setTimeout(start, 2000); return; }

        const ctx = new AudioContext({ sampleRate: 48000 });
        audioCtxRef.current = ctx;
        const src = ctx.createMediaStreamSource(new MediaStream([mst]));
        const dest = ctx.createMediaStreamDestination();
        src.connect(dest);

        const mime = typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
        let chunks: Blob[] = [];

        const record = () => {
          if (cancelled) return;
          try {
            const rec = new MediaRecorder(dest.stream, mime ? { mimeType: mime } : {});
            recorderRef.current = rec;
            chunks = [];
            rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            rec.onstop = () => {
              if (cancelled || chunks.length === 0) return;
              const blob = new Blob(chunks, { type: mime || 'audio/webm' });
              chunks = [];
              if (blob.size < 1000) return;
              const reader = new FileReader();
              reader.onloadend = () => {
                const b64 = (reader.result as string)?.split(',')?.[1];
                if (!b64 || cancelled || failCountRef.current >= 5) return;
                setIsTranscribing(true);
                const ctrl = new AbortController();
                const to = setTimeout(() => ctrl.abort(), 15000);
                fetch('/api/chat/call/transcribe', {
                  method: 'POST', signal: ctrl.signal,
                  headers: { Authorization: 'Bearer ' + authToken, 'Content-Type': 'application/json' },
                  body: JSON.stringify({ audio: b64, source_lang: otherLang || 'en', target_lang: myLang || 'en', room_id: 0 }),
                }).then(r => { clearTimeout(to); return r.ok ? r.json() : null; })
                  .then(d => { if (d?.originalText?.trim()) { failCountRef.current = 0; setSubtitles(p => [...p.slice(-10), { orig: d.originalText, trans: d.translatedText, ts: Date.now() }]); } })
                  .catch(() => { failCountRef.current++; if (failCountRef.current >= 5) setSubtitlesEnabled(false); })
                  .finally(() => setIsTranscribing(false));
              };
              reader.readAsDataURL(blob);
            };
            rec.onerror = () => {};
            rec.start();
          } catch {}
        };

        record();
        intervalRef.current = setInterval(() => {
          try { if (recorderRef.current?.state === 'recording') { recorderRef.current.stop(); setTimeout(record, 100); } } catch {}
        }, 3000);
      } catch {}
    };

    const timer = setTimeout(start, 3000);
    return () => {
      cancelled = true; clearTimeout(timer);
      try { if (intervalRef.current) clearInterval(intervalRef.current); } catch {}
      try { recorderRef.current?.stop(); } catch {}
      try { audioCtxRef.current?.close(); } catch {}
    };
  }, [room, subtitlesEnabled, subtitlesAvailable, authToken, myLang, otherLang]);

  // Build tile list: cameras + screen shares
  const tiles: { participant: Participant; source: Track.Source; isLocal: boolean }[] = [];
  const hasScreenShare = participants.some(p =>
    p.getTrackPublication(Track.Source.ScreenShare)?.track
  );

  participants.forEach(p => {
    const isLocal = p instanceof LocalParticipant;
    // Camera tile
    tiles.push({ participant: p, source: Track.Source.Camera, isLocal });
    // Screen share tile (if sharing)
    if (p.getTrackPublication(Track.Source.ScreenShare)?.track) {
      tiles.push({ participant: p, source: Track.Source.ScreenShare, isLocal });
    }
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        position: 'absolute', top: 60, right: 16,
        background: 'rgba(0,0,0,0.7)', color: '#fff',
        padding: '4px 10px', borderRadius: 12, fontSize: 12, zIndex: 10,
      }}>
        {participants.length} in call
      </div>
      {subtitlesAvailable && (
        <button onClick={() => { setSubtitlesEnabled(!subtitlesEnabled); if (!subtitlesEnabled) failCountRef.current = 0; }} style={{
          position: 'absolute', top: 60, right: 120, background: subtitlesEnabled ? 'rgba(59,130,246,0.8)' : 'rgba(0,0,0,0.7)',
          color: '#fff', border: 'none', borderRadius: 12, padding: '4px 10px', fontSize: 12, cursor: 'pointer', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {subtitlesEnabled ? '🔤 CC' : '🔤 OFF'}{isTranscribing && subtitlesEnabled && <span style={{animation:'pulse 1s infinite',fontSize:8}}>●</span>}
        </button>
      )}

      {/* Main area: if screenshare active, show it large with cameras small */}
      {hasScreenShare ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
          {/* Screen share takes the main area */}
          <div style={{ flex: 1 }}>
            {tiles.filter(t => t.source === Track.Source.ScreenShare).map(t => (
              <VideoTile
                key={`${t.participant.identity}-screen`}
                participant={t.participant}
                source={t.source}
                isLocal={t.isLocal}
                isMain
              />
            ))}
          </div>
          {/* Camera feeds in a row at the bottom */}
          <div style={{ display: 'flex', gap: 8, height: 120 }}>
            {tiles.filter(t => t.source === Track.Source.Camera).map(t => (
              <VideoTile
                key={`${t.participant.identity}-cam`}
                participant={t.participant}
                source={t.source}
                isLocal={t.isLocal}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8, padding: 8,
          alignItems: 'center', justifyContent: 'center',
        }}>
          {tiles.map(t => (
            <VideoTile
              key={`${t.participant.identity}-${t.source}`}
              participant={t.participant}
              source={t.source}
              isLocal={t.isLocal}
            />
          ))}
        </div>
      )}

      {subtitlesEnabled && subtitlesAvailable && subtitles.filter(s => Date.now() - s.ts < 8000).length > 0 && (
        <div style={{ position:'absolute', bottom:80, left:'50%', transform:'translateX(-50%)', width:'80%', maxWidth:700, zIndex:50, display:'flex', flexDirection:'column', gap:4, alignItems:'center' }}>
          {subtitles.filter(s => Date.now() - s.ts < 8000).slice(-3).map((s, i) => {
            const age = Date.now() - s.ts; const opacity = age > 6000 ? Math.max(0, 1-(age-6000)/2000) : 1;
            return (<div key={i} style={{ background:'rgba(0,0,0,0.75)', borderRadius:10, padding:'8px 16px', textAlign:'center', opacity, backdropFilter:'blur(8px)' }}>
              {s.trans && s.trans !== s.orig && <div style={{color:'#60a5fa',fontSize:15,fontWeight:600,lineHeight:1.4}}>{s.trans}</div>}
              <div style={{color:'rgba(255,255,255,0.6)',fontSize:12,lineHeight:1.3,marginTop:s.trans?2:0}}>{s.orig}</div>
            </div>);
          })}
        </div>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
      <ControlBar
        variation="minimal"
        controls={{ camera: callType === 'video', microphone: true, screenShare: true, leave: true }}
      />
    </div>
  );
}
