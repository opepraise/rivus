'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write']);
const userSession = new UserSession({ appConfig });

function getAddress(): string | null {
  try {
    if (userSession.isUserSignedIn()) {
      return userSession.loadUserData().profile.stxAddress.mainnet ?? null;
    }
  } catch {}
  return null;
}

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(() => setAddress(getAddress()));
    } else {
      setAddress(getAddress());
    }
  }, []);

  const connect = useCallback(() => {
    showConnect({
      appDetails: { name: 'Rivus', icon: '/favicon.ico' },
      redirectTo: '/dashboard',
      onFinish: () => setAddress(getAddress()),
      onCancel: () => {},
      userSession,
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut('/dashboard');
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider value={{ address, isConnected: !!address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
