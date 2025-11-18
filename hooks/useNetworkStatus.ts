import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);

  useEffect(() => {
    // Get initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Consider offline if:
  // 1. isConnected is explicitly false, OR
  // 2. isInternetReachable is explicitly false (more reliable indicator)
  // Note: If both are null, we haven't received the initial state yet, so assume online for now
  // If isConnected is true but isInternetReachable is null, assume online (common on some platforms)
  const isOffline =
    isConnected === false || (isInternetReachable !== null && isInternetReachable === false);

  return {
    isConnected,
    isInternetReachable,
    isOffline,
  };
}
