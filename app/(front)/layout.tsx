"use client";

import PaynowReactWrapper from "paynow-react";
import DrawerButton from "@/components/DrawerButton";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header/Header";

export default function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const paynow_config = {
    integration_id: `${process.env.NEXT_PUBLIC_PAYNOW_API_ID}`,
    integration_key: `${process.env.NEXT_PUBLIC_PAYNOW_API_KEY}`,
    result_url: "http://localhost:3000/",
    return_url: "http://localhost:3000/",
  };

  return (
    <main className="flex-grow">
      <PaynowReactWrapper {...paynow_config}>
        <div className="drawer">
          <DrawerButton />
          <div className="drawer-content">
            <div className="min-h-screen flex flex-col">
              <Header />
              {children}
              <footer className="bg-base-200 border-t border-base-300 mt-auto">
                <div className="container mx-auto px-4 lg:px-8 py-12">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                        Compulink
                      </h3>
                      <p className="text-base-content/70 mb-4">
                        Your trusted partner for enterprise IT solutions.
                        Providing quality hardware, software, and IT services
                        since 2010.
                      </p>
                      <p className="text-base-content/60 text-sm">
                        Enterprise IT Solutions | Business Technology Services
                      </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                      <h4 className="font-semibold text-base-content mb-4">
                        Quick Links
                      </h4>
                      <ul className="space-y-2">
                        <li>
                          <a
                            href="/"
                            className="text-base-content/70 hover:text-primary transition-colors"
                          >
                            Home
                          </a>
                        </li>
                        <li>
                          <a
                            href="/search"
                            className="text-base-content/70 hover:text-primary transition-colors"
                          >
                            Products
                          </a>
                        </li>
                        <li>
                          <a
                            href="/cart"
                            className="text-base-content/70 hover:text-primary transition-colors"
                          >
                            Cart
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Support */}
                    <div>
                      <h4 className="font-semibold text-base-content mb-4">
                        Support
                      </h4>
                      <ul className="space-y-2">
                        <li>
                          <span className="text-base-content/70">
                            24/7 Support
                          </span>
                        </li>
                        <li>
                          <span className="text-base-content/70">
                            Free Shipping
                          </span>
                        </li>
                        <li>
                          <span className="text-base-content/70">
                            1 Year Warranty
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="pt-8 border-t border-base-300 text-center">
                    <p className="text-base-content/60 text-sm">
                      Copyright © 2025{" "}
                      <span className="font-semibold text-primary">
                        Compulink
                      </span>
                      . All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <Sidebar />
          </div>
        </div>
      </PaynowReactWrapper>
    </main>
  );
}
