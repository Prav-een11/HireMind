'use client';

import { useEffect, useState } from 'react';

export default function DemoModeBadge() {
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    // Check demo mode status from backend
    fetch('/api/interviews')
      .then(r => r.json())
      .then(data => {
        if (data.isDemoMode !== undefined) setIsDemo(data.isDemoMode);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FFF1D6] text-[#D99A2B] border border-[#E2E5E1]">
      <span className="w-2 h-2 rounded-full bg-[#D99A2B] animate-pulse"></span>
      <span>{isDemo ? 'Demo AI Mode' : 'AI Engine Connected'}</span>
    </div>
  );
}
