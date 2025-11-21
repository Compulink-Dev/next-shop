//@ts-nocheck
"use client";
import useCartService from "@/lib/hooks/useCartStore";
import { Trash, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function CartDetails() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, itemsPrice, decrease, increase, remove, clear } =
    useCartService();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProceedToCheckout = () => {
    if (status === "loading") return; // Still loading auth state

    if (!session) {
      // User not logged in, redirect to sign in
      signIn("credentials", { callbackUrl: "/shipping" });
      // Or you can use: router.push("/auth/signin?callbackUrl=/shipping");
    } else {
      // User is logged in, proceed to shipping
      router.push("/shipping");
    }
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Shopping Cart
          </h1>
          <p className="text-base-content/60">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-base-200 rounded-2xl p-16 text-center border border-base-300">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-base-content/30" />
            <h2 className="text-2xl font-bold text-base-content mb-4">
              Your cart is empty
            </h2>
            <p className="text-base-content/60 mb-8">
              Add some IT products to get started
            </p>
            <Link
              href="/"
              className="btn btn-primary btn-lg rounded-full gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="bg-base-200 rounded-2xl p-6 border border-base-300 hover:border-primary/30 transition-colors"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.slug}`}
                      className="flex-shrink-0"
                    >
                      <div className="w-24 h-24 bg-base-100 rounded-xl overflow-hidden border border-base-300">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-lg font-semibold text-base-content hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-base-content/60 mt-1">
                        {item?.brand}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <span className="text-2xl font-bold text-primary">
                          ${item.price}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => remove(item)}
                        className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-sm btn-circle btn-outline"
                          type="button"
                          onClick={() => decrease(item)}
                          disabled={item.qty <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-12 text-center">
                          {item.qty}
                        </span>
                        <button
                          className="btn btn-sm btn-circle btn-outline"
                          type="button"
                          onClick={() => increase(item)}
                          disabled={item.qty >= item.countInStock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                className="btn btn-outline btn-error w-full rounded-xl"
                onClick={() => clear()}
              >
                <Trash className="w-5 h-5" />
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-base-200 rounded-2xl p-6 border border-base-300 sticky top-24">
                <h2 className="text-2xl font-bold text-base-content mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-base-content/70">
                    <span>Items ({items.reduce((a, c) => a + c.qty, 0)})</span>
                    <span className="font-semibold">${itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-base-content/70">
                    <span>Shipping</span>
                    <span className="text-success font-semibold">FREE</span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between text-xl font-bold text-base-content">
                    <span>Total</span>
                    <span className="text-primary">${itemsPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={status === "loading"}
                  className="btn btn-primary w-full rounded-full gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {!session && status !== "loading" && (
                  <p className="text-sm text-warning text-center mt-3">
                    Please sign in to proceed with checkout
                  </p>
                )}

                <div className="mt-6 text-center">
                  <Link
                    href="/"
                    className="text-primary hover:underline text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
