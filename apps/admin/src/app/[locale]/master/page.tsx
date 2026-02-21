import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const TABLES = [
  {
    category: 'Geographic Hierarchy',
    color: '#06b6d4',
    items: [
      { key: 'countries', label: 'Countries', description: 'Country codes, ISD, flags', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4' },
      { key: 'states', label: 'States', description: 'State codes and regions', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0