'use client'
import CheckoutSteps from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CreditCard, Smartphone, Wallet, Banknote, Building2 } from 'lucide-react'

const Form = () => {
  const router = useRouter()
  const { savePaymentMethod, paymentMethod, shippingAddress } = useCartService()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    savePaymentMethod(selectedPaymentMethod)
    router.push('/place-order')
  }

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping')
    }
    setSelectedPaymentMethod(paymentMethod || 'PayPal')
  }, [paymentMethod, router, shippingAddress.address])

  const paymentMethods = [
    {
      value: 'Ecocash',
      label: 'Ecocash',
      description: 'Pay with Ecocash mobile money',
      icon: Smartphone,
      color: 'text-red-500'
    },
    {
      value: 'OneMoney',
      label: 'OneMoney',
      description: 'Pay with OneMoney mobile wallet',
      icon: Smartphone,
      color: 'text-purple-500'
    },
    {
      value: 'Telecash',
      label: 'Telecash',
      description: 'Pay with Telecash mobile money',
      icon: Smartphone,
      color: 'text-blue-500'
    },
    {
      value: 'PayNow',
      label: 'Paynow',
      description: 'Pay with Paynow gateway',
      icon: CreditCard,
      color: 'text-orange-500'
    },
    {
      value: 'PayPal',
      label: 'PayPal',
      description: 'Pay with PayPal (International)',
      icon: Wallet,
      color: 'text-blue-600'
    },
    {
      value: 'BankTransfer',
      label: 'Bank Transfer',
      description: 'Direct bank transfer (ZWL/USD)',
      icon: Building2,
      color: 'text-green-500'
    },
    {
      value: 'CashOnDelivery',
      label: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: Banknote,
      color: 'text-emerald-500'
    }
  ]

  return (
    <div className="min-h-screen bg-base-100">
      <CheckoutSteps current={2} />
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-base-content mb-2">Payment Method</h1>
            <p className="text-base-content/60">
              Select your preferred payment method
            </p>
          </div>

          <div className="bg-base-200 rounded-2xl p-6 lg:p-8 border border-base-300">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <label
                      key={method.value}
                      className={`block cursor-pointer transition-all duration-200 ${
                        selectedPaymentMethod === method.value
                          ? 'ring-2 ring-primary'
                          : 'hover:bg-base-300/50'
                      }`}
                    >
                      <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 bg-base-200 rounded-lg ${method.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base-content text-lg">
                              {method.label}
                            </div>
                            <div className="text-sm text-base-content/60">
                              {method.description}
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="paymentMethod"
                            className="radio radio-primary"
                            value={method.value}
                            checked={selectedPaymentMethod === method.value}
                            onChange={() => setSelectedPaymentMethod(method.value)}
                          />
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>

              {/* Payment Info Box */}
              <div className="bg-info/10 border border-info/20 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <CreditCard className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-base-content/80">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p>All transactions are encrypted and secure. Your payment information is protected.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  className="btn btn-ghost flex-1 rounded-full"
                  onClick={() => router.back()}
                >
                  Back to Shipping
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex-1 rounded-full"
                  disabled={!selectedPaymentMethod}
                >
                  Continue to Review Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Form
