"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface PasteExpiryContextProps {
  expiry: number;

  setExpiry: (expiry: number) => void;
}

const PasteExpiryContext = createContext<PasteExpiryContextProps | undefined>(
  undefined
);

export function PasteExpiryProvider({ children }: { children: ReactNode }) {
  const [expiry, setExpiry] = useState(-1);

  return (
    <PasteExpiryContext.Provider value={{ expiry, setExpiry }}>
      {children}
    </PasteExpiryContext.Provider>
  );
}

export function usePasteExpiry(defaultExpiry: number = -1) {
  const context = useContext(PasteExpiryContext);
  if (!context) {
    throw new Error("usePasteExpiry must be used within a PasteExpiryContext");
  }

  // Initialize with default value if current expiry is -1 (uninitialized)
  useEffect(() => {
    if (context.expiry === -1 && defaultExpiry !== -1) {
      context.setExpiry(defaultExpiry);
    }
  }, [context.expiry, context.setExpiry, defaultExpiry, context]);

  return context;
}
