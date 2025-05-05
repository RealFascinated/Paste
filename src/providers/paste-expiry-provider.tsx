"use client";

import { createContext, ReactNode, useContext, useState } from "react";

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

export function usePasteExpiry() {
  const context = useContext(PasteExpiryContext);
  if (!context)
    throw new Error("usePasteExpiry must be used within a PasteExpiryContext");
  return context;
}
