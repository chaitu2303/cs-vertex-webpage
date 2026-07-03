export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';
import AdsClient from './AdsClient';

export const revalidate = 0;

export default async function AdsAdmin() {
  const ads = await prisma.advertisement.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <AdsClient initialAds={ads} />
}



