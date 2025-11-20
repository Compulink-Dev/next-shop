'use client'

import PaynowReactWrapper from "paynow-react"

export default function FrontLayout({
  children,
}: {
  children: React.ReactNode
}) {


  const paynow_config = {
    integration_id: `${process.env.NEXT_PUBLIC_PAYNOW_API_ID}`,
    integration_key: `${process.env.NEXT_PUBLIC_PAYNOW_API_KEY}`,
    result_url: 'http://localhost:3000/',
    return_url: 'http://localhost:3000/',
  };


  return <main className="flex-grow">
    <PaynowReactWrapper {...paynow_config}>
      {children}
    </PaynowReactWrapper>
  </main>
}
