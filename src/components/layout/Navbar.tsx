'use client'

import { Logo } from '@/components/layout/Logo';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';

type Section = 'markets' | 'create' | 'manage' | 'pair' | 'request' | 'none';