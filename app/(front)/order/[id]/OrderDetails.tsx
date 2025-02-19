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

  if (error) return error.message;
  if (!data) return "Loading...";

  console.log("data", data);

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
    <div>
      <h1 className="text-2xl py-4">Order {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          {/* Shipping Address */}
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <div className="text-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="text-error">Not Delivered</div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className="text-success">
                  Paid at {formatDateTime(createdAt).dateTime}
                </div>
              ) : (
                <div className="text-error">Not Paid</div>
              )}
            </div>
          </div>

          {/* Items List */}
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>${item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card bg-base-300">
            <div className="card-body p-6">
              <h2 className="card-title">Order Summary</h2>
              <ul className="">
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>

                {/* Payment Buttons */}
                {!isPaid && paymentMethod === "PayPal" && (
                  <li>
                    <PayPalScriptProvider
                      options={{ clientId: paypalClientId }}
                    >
                      <PayPalButtons
                        createOrder={createPayPalOrder}
                        onApprove={onApprovePayPalOrder}
                      />
                    </PayPalScriptProvider>
                  </li>
                )}
                {!isPaid && paymentMethod === "PayNow" && (
                  <li>
                    <button
                      onClick={createPayNowOrder}
                      className="btn"
                      disabled={loading}
                    >
                      {loading ? (
                        "Processing..."
                      ) : (
                        <img
                          src={
                            "https://www.paynow.co.zw/Content/buttons/medium_buttons/button_add-to-cart_medium.png"
                          }
                          width={150}
                          height={150}
                          alt=""
                        />
                      )}
                    </button>
                  </li>
                )}

                {session?.user.isAdmin && !isDelivered && (
                  <li>
                    <button
                      className="btn w-full my-2"
                      onClick={() => deliverOrder()}
                      disabled={isDelivering}
                    >
                      {isDelivering && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Mark as delivered
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
