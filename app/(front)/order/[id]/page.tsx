'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import OrderTracking from '@/components/OrderTracking';
import OrderDetails from './OrderDetails';

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      //@ts-ignore
      setSession(sessionData);
    };

    fetchSession();
  }, []);

  return (
    <div>
      <OrderDetails
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        orderId={params.id}
      />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <OrderTracking orderId={params.id} session={session} />
      </div>
    </div>
  );
}