"use client";

import { useState } from "react";
import { DraftQueue } from "@/lib/types/database_types";

/**
 * Placeholder hook for PickQueue component
 * TODO: Implement actual queue functionality
 */
export function usePickQueue() {
  const [autoPick, setAutoPick] = useState(false);
  const queue: DraftQueue[] = []; // Empty queue for now

  return {
    queue,
    autoPick,
    setAutoPick,
  };
}