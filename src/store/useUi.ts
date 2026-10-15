import { create } from 'zustand';

import { todayKey } from '@/lib/date';

/** Ephemeral UI state shared across tabs (not persisted). */
export const useUi = create<{ date: string; setDate: (d: string) => void }>((set) => ({
  date: todayKey(),
  setDate: (date) => set({ date }),
}));
