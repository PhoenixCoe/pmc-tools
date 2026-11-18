'use client';
import { useEffect } from 'react';
import { startPmcFeel } from '@/lib/pmcFeel';

/** Lets every toggle be dragged as well as clicked. It pulls back unless you mean it, and springs when it switches. */
export function ToggleFeel() {
  useEffect(() => { startPmcFeel(); }, []);
  return null;
}
