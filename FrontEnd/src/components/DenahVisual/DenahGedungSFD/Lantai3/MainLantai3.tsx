'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import WebTabLayoutSfd from './Web&Tab/Web&TabLayout';
import MobileLayoutSfd from './Mobile/MobileLayout';

export default function MainLantai3() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayoutSfd />;
  }

  return <WebTabLayoutSfd />;
}
