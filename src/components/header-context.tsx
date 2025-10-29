'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type HeaderContextType = {
  backgroundSrc: string;
  avatarSrc: string;
  setHeaderImages: (background: string, avatar: string) => void;
  resetHeaderImages: () => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

const defaultBackground = '/images/laptop.webp';
const defaultAvatar = '/images/profile-picture.webp';

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [backgroundSrc, setBackgroundSrc] = useState(defaultBackground);
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar);

  const setHeaderImages = (background: string, avatar: string) => {
    setBackgroundSrc(background);
    setAvatarSrc(avatar);
  };

  const resetHeaderImages = () => {
    setBackgroundSrc(defaultBackground);
    setAvatarSrc(defaultAvatar);
  };

  return (
    <HeaderContext.Provider value={{ backgroundSrc, avatarSrc, setHeaderImages, resetHeaderImages }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeaderContext must be used within a HeaderProvider');
  }
  return context;
}
