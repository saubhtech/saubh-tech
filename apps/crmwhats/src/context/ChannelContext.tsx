'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/api';
import type { WaChannel } from '@/lib/types';

type ChannelFilter = 'ALL' | 'EVOLUTION' | 'WABA';

interface ChannelContextType {
  selectedChannel: ChannelFilter;
  setSelectedChannel: (ch: ChannelFilter) => void;
  channels: WaChannel[];
  channelsLoading: boolean;
  getChannelByType: (type: string) => WaChannel | undefined;
  refreshChannels: () => Promise<void>;
}

const ChannelContext = createContext<ChannelContextType>({
  selectedChannel: 'ALL',
  setSelectedChannel: () => {},
  channels: [],
  channelsLoading: true,
  getChannelByType: () => undefined,
  refreshChannels: async () => {},
});

export function ChannelProvider({ children }: { children: ReactNode }) {
  const [selectedChannel, setSelected] = useState<ChannelFilter>('ALL');
  const [channels, setChannels] = useState<WaChannel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);

  // Restore filter from localStorage
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('saubh_channel') : null;
    if (stored === 'EVOLUTION' || stored === 'WABA' || stored === 'ALL') {
      setSelected(stored);
    }
  }, []);

  // Fetch real channels from API
  const refreshChannels = useCallback(async () => {
    try {
      setChannelsLoading(true);
      const data = await api.get<WaChannel[]>('/api/crm/channels');
      setChannels(data || []);
    } catch (e) {
      console.error('Failed to fetch channels:', e);
    } finally {
      setChannelsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshChannels();
  }, [refreshChannels]);

  const setSelectedChannel = (ch: ChannelFilter) => {
    setSelected(ch);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saubh_channel', ch);
    }
  };

  const getChannelByType = (type: string) => {
    return channels.find(c => c.type === type);
  };

  return (
    <ChannelContext.Provider value={{
      selectedChannel,
      setSelectedChannel,
      channels,
      channelsLoading,
      getChannelByType,
      refreshChannels,
    }}>
      {children}
    </ChannelContext.Provider>
  );
}

export const useChannel = () => useContext(ChannelContext);
