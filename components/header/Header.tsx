import Link from "next/link";
import React from "react";
import Menu from "./Menu";
import { SearchBox } from "./SearchBox";
import Image from "next/image";
import { Cpu } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="backdrop-blur-md bg-base-100/95 border-b border-base-300 shadow-lg">
        <div className="w-full px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Section - Logo & Menu Button */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="my-drawer"
                className="btn btn-square btn-ghost hover:bg-primary/10 lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>

              <Link
                href="/"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Compulink
                  </span>
                  <p className="text-xs text-base-content/60">IT Solutions</p>
                </div>
              </Link>
            </div>

            {/* Center Section - Search (Desktop) */}

            {/* Right Section - Menu */}
            <Menu />
          </div>

          {/* Mobile Search */}
          {/* / */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
