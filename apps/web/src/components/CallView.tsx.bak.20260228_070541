'use client';

import { useState, useEffect } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  useTracks,
  useParticipants,
  useRoomContext,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track, RoomEvent } from 'livekit-client';

interface CallViewProps {
  roomId: number;
  token: string;
  livekitUrl: string;
  onClose: () => void;
}

export default function CallView({ roomId, token, livekitUrl, onClose }: CallViewProps) {
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
          {isConnecting ? 'Connecting...' : 'In Call'}
        </span>
        <button onClick={onClose} style={{
          background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8,
          padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          End Call
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <LiveKitRoom
          serverUrl={livekitUrl}
          token={token}
          connect={true}
          video={true}
          audio={true}
          onConnected={() => setIsConnecting(false)}
          onDisconnected={() => { setIsConnecting(false); onClose(); }}
          onError={(err) => { console.error('LiveKit error:', err); onClose(); }}
          style={{ height: '100%' }}
        >
          <CallContent onClose={onClose} />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </div>
  );
}

function CallContent({ onClose }: { onClose: () => void }) {
  const room = useRoomContext();
  const participants = useParticipants();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  useEffect(() => {
    if (!room) return;
    const handleDisconnect = () => onClose();
    room.on(RoomEvent.Disconnected, handleDisconnect);
    return () => { room.off(RoomEvent.Disconnected, handleDisconnect); };
  }, [room, onClose]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: 8 }}>
        <GridLayout tracks={tracks} style={{ height: '100%' }}>
          <ParticipantTile />
        </GridLayout>
      </div>
      <ControlBar
        variation="minimal"
        controls={{ camera: true, microphone: true, screenShare: true, leave: true }}
      />
      <div style={{
        position: 'absolute', top: 60, right: 16,
        background: 'rgba(0,0,0,0.7)', color: '#fff',
        padding: '4px 10px', borderRadius: 12, fontSize: 12,
      }}>
        {participants.length} in call
      </div>
    </div>
  );
}
