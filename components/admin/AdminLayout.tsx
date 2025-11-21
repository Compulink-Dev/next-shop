import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  LayoutDashboard,
  MonitorUp,
  Users,
  Package,
  ShoppingCart,
  Image,
  Shield,
  Cpu,
  LogOut,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import SignOutSection from "../SignOut";

const AdminLayout = async ({
  activeItem = "dashboard",
  children,
}: {
  activeItem: string;
  children: React.ReactNode;
}) => {
  const session = await getServerSession(options);

  if (!session || !session.user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="bg-base-200 rounded-2xl p-8 border border-base-300 max-w-md text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-error" />
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Unauthorized
          </h1>
          <p className="text-base-content/60 mb-6">
            Admin permission required to access this area
          </p>
          <Link href="/" className="btn btn-primary rounded-full">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      key: "dashboard",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      key: "orders",
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      key: "products",
    },
    { name: "Banners", href: "/admin/banners", icon: Image, key: "banners" },
    { name: "Users", href: "/admin/users", icon: Users, key: "users" },
  ];

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Sidebar - Fixed */}
      <aside className="w-64 bg-base-200 min-h-screen border-r border-base-300 hidden lg:block fixed left-0 top-0 bottom-0 overflow-y-auto">
        {/* Logo Section */}
        <Link href={"/"}>
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-base-content">
                  Admin Panel
                </h2>
                <p className="text-xs text-base-content/60">Compulink IT</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.key === activeItem;
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary text-white font-semibold shadow-lg"
                        : "text-base-content hover:bg-base-300"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info with Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-sm">
                  {session.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-base-content truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {session.user.email}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <SignOutSection
            userName={session.user.name || ""}
            userEmail={session.user.email || ""}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile Menu - Fixed Top Bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-base-200 border-b border-base-300 z-50 h-16">
          <div className="flex items-center justify-between p-4 h-full">
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6 text-primary" />
              <span className="font-bold text-base-content">Admin Panel</span>
            </div>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-52 mt-4"
              >
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.key === activeItem;
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 ${
                          isActive ? "bg-primary text-white" : ""
                        }`}
                      >
                        <Icon size={18} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
                <li className="border-t border-base-300 mt-2 pt-2">
                  <SignOutSection
                    userName={session.user.name || ""}
                    userEmail={session.user.email || ""}
                    mobileView={true}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 lg:pt-0 pt-16 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
