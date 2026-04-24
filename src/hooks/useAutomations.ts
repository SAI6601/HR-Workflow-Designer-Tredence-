/**
 * useAutomations.ts — Hook to fetch mock automation actions.
 */

import { useState, useEffect } from 'react';
import type { AutomationAction } from '../types/workflow';
import { getAutomations } from '../api/mockApi';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAutomations().then((data) => {
      if (!cancelled) {
        setAutomations(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return { automations, loading };
}
