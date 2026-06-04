import { Suspense } from 'react';
import ShopClient from './ShopClient';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8" />}>
      <ShopClient />
    </Suspense>
  );
}
