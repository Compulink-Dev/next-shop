"use client";
import CheckoutSteps from "@/components/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import { MapPin, CreditCard, Package, Edit2, ShoppingCart } from "lucide-react";

const Form = () => {
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
  } = useCartService();

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async (url) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          items,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      });
      const data = await res.json();

      console.log("Order Data Passed : ", data);

      if (res.ok) {
        clear();
        toast.success("Order placed successfully");
        return router.push(`/order/${data.order._id}`);
      } else {
        toast.error(data.message);
      }
    }
  );
  useEffect(() => {
    if (!paymentMethod) {
      return router.push("/payment");
    }
    if (items.length === 0) {
      return router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, router]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <CheckoutSteps current={4} />

        {/* Page Header */}
        <div className="mt-8 mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">Review Your Order</h1>
          <p className="text-base-content/60">Please review your order details before placing your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-base-content">Shipping Address</h2>
                </div>
                <Link href="/shipping" className="btn btn-ghost btn-sm gap-2 hover:bg-primary/10">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
              </div>
              <div className="ml-16 space-y-1">
                <p className="font-semibold text-base-content">{shippingAddress.fullName}</p>
                <p className="text-base-content/70">{shippingAddress.address}</p>
                <p className="text-base-content/70">
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
                <p className="text-base-content/70">{shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-base-content">Payment Method</h2>
                </div>
                <Link href="/payment" className="btn btn-ghost btn-sm gap-2 hover:bg-primary/10">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
              </div>
              <div className="ml-16">
                <p className="text-lg font-semibold text-base-content">{paymentMethod}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-base-content">Order Items</h2>
                </div>
                <Link href="/cart" className="btn btn-ghost btn-sm gap-2 hover:bg-primary/10">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
              </div>
              
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.slug} className="flex gap-4 p-4 bg-base-100 rounded-xl border border-base-300">
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <div className="w-20 h-20 bg-base-200 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/product/${item.slug}`}
                        className="font-semibold text-base-content hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      {(item.color || item.size) && (
                        <p className="text-sm text-base-content/60 mt-1">
                          {item.color} {item.color && item.size && '•'} {item.size}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-base-content/70">Qty: {item.qty}</span>
                        <span className="text-lg font-bold text-primary">${item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300 sticky top-24">
              <h2 className="text-2xl font-bold text-base-content mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base-content/70">
                  <span>Items ({items.reduce((a, c) => a + c.qty, 0)})</span>
                  <span className="font-semibold">${itemsPrice}</span>
                </div>
                <div className="flex justify-between text-base-content/70">
                  <span>Tax</span>
                  <span className="font-semibold">${taxPrice}</span>
                </div>
                <div className="flex justify-between text-base-content/70">
                  <span>Shipping</span>
                  <span className="font-semibold">${shippingPrice}</span>
                </div>
                <div className="divider my-2"></div>
                <div className="flex justify-between text-2xl font-bold text-base-content">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice}</span>
                </div>
              </div>

              <button
                onClick={() => placeOrder()}
                disabled={isPlacing}
                className="btn btn-primary w-full rounded-full btn-lg gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                {isPlacing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                {isPlacing ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-center text-base-content/60 mt-4">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Form;
