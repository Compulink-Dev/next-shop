import "./globals.css";
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import DrawerButton from "@/components/DrawerButton";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/header/Header";
import { getServerSession, Session } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";

export const metadata: Metadata = {
  title: "Compulink | Enterprise IT Solutions & Technology Services",
  description:
    "Your trusted partner for enterprise IT solutions. Shop laptops, servers, networking equipment, and software licenses from top brands like Dell, HP, Cisco, and Microsoft.",
};

interface RootLayoutProps {
  children: React.ReactNode; // Type for children elements
  params: {
    session?: Session | null; // Optional session prop
    [key: string]: any; // Allow other params
  };
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(options);

  return (
    <html lang="en">
      <body className="bg-base-100 text-base-content">
        <Providers session={session}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
