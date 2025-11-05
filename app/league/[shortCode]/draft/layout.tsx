"use client";

import React from "react";
import { DraftProvider } from "./context/DraftProvider";

interface DraftLayoutProps {
  children: React.ReactNode;
}

export default function DraftLayout({ children }: DraftLayoutProps) {
  return (
    <DraftProvider>
      {children}
    </DraftProvider>
  );
}

