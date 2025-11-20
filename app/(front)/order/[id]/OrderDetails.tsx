"use client";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useState } from "react";
import { fetcher } from "@/lib/services/fetcher";
import { formatDateTime } from "@/lib/utils";
import { MapPin, CreditCard, Package, CheckCircle, XCircle, Clock, Truck } from "lucide-react";

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string;
  paypalClientId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const { data, error } = useSWR(`/api/orders/${orderId}`, fetcher);
  const { data: session } = useSession();
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      console.log("Delivering order...");

      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Order delivered successfully");
      } else {
        toast.error(data.message);
      }
    }
  );

  // Call this function when the user returns from PayNow
  const createPayNowOrder = async () => {
    setLoading(true);
    console.log("Creating PayNow order...");
    try {
      const response = await fetch(
        `/api/orders/${orderId}/create-paynow-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order/${orderId}`, // Redirect after payment
            resultUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}/verify-paynow`, // IPN notification
          }),
        }
      );

      const order = await response.json();
      console.log("API Response:", order);

      if (order.link) {
        setPaymentUrl(order.link);
        console.log("Redirecting to PayNow:", order.link);
        checkOrderStatus();
        window.location.href = order.link; // Redirect to PayNow
      } else {
        console.error(
          "Failed to create PayNow order. No payment link received."
        );
        toast.error("Failed to create PayNow order.");
      }
    } catch (error) {
      console.error("Error creating PayNow order:", error);
      toast.error("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  const checkOrderStatus = async () => {
    try {
      console.log("Checking order payment status...");
      const response = await fetch(`/api/orders/${orderId}/verify-paynow`, {
        method: "POST",
      });

      const result = await response.json();
      console.log("Verify API Response:", result);

      if (result.isPaid) {
        toast.success("Payment successful!");
      } else {
        toast.error("Payment not completed yet.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Failed to verify payment.");
    }
  };

  console.log("data", data);

  const createPayPalOrder = async () => {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((order) => order.id);
  };

  const onApprovePayPalOrder = async (data: any) => {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Order paid successfully");
      });
  };

  if (error) return (
    <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
      <div className="text-error">Error: {error.message}</div>
    </div>
  );
  if (!data) return (
    <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
    createdAt,
  } = data;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-base-content mb-2">Order Details</h1>
              <p className="text-base-content/60">Order ID: <span className="font-mono text-primary">#{orderId}</span></p>
            </div>
            <div className="flex items-center gap-3">
              {isPaid ? (
                <div className="badge badge-success badge-lg gap-2 py-4">
                  <CheckCircle className="w-4 h-4" />
                  Paid
                </div>
              ) : (
                <div className="badge badge-warning badge-lg gap-2 py-4">
                  <Clock className="w-4 h-4" />
                  Pending Payment
                </div>
              )}
              {isDelivered ? (
                <div className="badge badge-success badge-lg gap-2 py-4">
                  <Truck className="w-4 h-4" />
                  Delivered
                </div>
              ) : (
                <div className="badge badge-warning badge-lg gap-2 py-4">
                  <Package className="w-4 h-4" />
                  Processing
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-base-content/60 mt-2">
            Ordered on {formatDateTime(createdAt).dateTime}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-base-content mb-4">Shipping Address</h2>
                  <div className="space-y-1">
                    <p className="font-semibold text-base-content">{shippingAddress.fullName}</p>
                    <p className="text-base-content/70">{shippingAddress.address}</p>
                    <p className="text-base-content/70">
                      {shippingAddress.city}, {shippingAddress.postalCode}
                    </p>
                    <p className="text-base-content/70">{shippingAddress.country}</p>
                  </div>
                </div>
              </div>
              {isDelivered ? (
                <div className="flex items-center gap-2 mt-4 p-3 bg-success/10 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-success font-semibold">Delivered on {formatDateTime(deliveredAt).dateTime}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-4 p-3 bg-warning/10 rounded-xl">
                  <Clock className="w-5 h-5 text-warning" />
                  <span className="text-warning font-semibold">Awaiting Delivery</span>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-base-content mb-4">Payment Method</h2>
                  <p className="text-lg font-semibold text-base-content">{paymentMethod}</p>
                </div>
              </div>
              {isPaid ? (
                <div className="flex items-center gap-2 mt-4 p-3 bg-success/10 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-success font-semibold">Paid on {formatDateTime(paidAt).dateTime}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-4 p-3 bg-error/10 rounded-xl">
                  <XCircle className="w-5 h-5 text-error" />
                  <span className="text-error font-semibold">Payment Pending</span>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-base-content">Order Items</h2>
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
                  <span>Items</span>
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

              {/* Payment Buttons */}
              {!isPaid && paymentMethod === "PayPal" && (
                <div className="mb-4">
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalButtons
                      createOrder={createPayPalOrder}
                      onApprove={onApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              
              {!isPaid && paymentMethod === "PayNow" && (
                <button
                  onClick={createPayNowOrder}
                  className="btn btn-primary w-full rounded-full btn-lg mb-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay with PayNow
                    </>
                  )}
                </button>
              )}

              {session?.user.isAdmin && !isDelivered && (
                <button
                  className="btn btn-success w-full rounded-full gap-2"
                  onClick={() => deliverOrder()}
                  disabled={isDelivering}
                >
                  {isDelivering ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Truck className="w-5 h-5" />
                  )}
                  Mark as Delivered
                </button>
              )}

              {isPaid && (
                <div className="text-center text-sm text-base-content/60 mt-4">
                  <p>Need help with your order?</p>
                  <Link href="/" className="text-primary hover:underline">
                    Contact Support
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
