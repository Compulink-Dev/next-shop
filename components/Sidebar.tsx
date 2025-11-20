"use client";

import useLayoutService from "@/lib/hooks/useLayout";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/services/fetcher";
import { Package } from "lucide-react";

const Sidebar = () => {
  const { toggleDrawer } = useLayoutService();
  const { data: categories, error } = useSWR("/api/products/categories", fetcher);

  if (error) return <div className="p-4 text-error">Error: {error.message}</div>;
  if (!categories) return <div className="p-4 text-base-content/60">Loading...</div>;

  return (
    <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300">
      <li className="mb-4">
        <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Shop By Category
        </h2>
      </li>
      {categories.map((category: string) => (
        <li key={category}>
          <Link 
            href={`/search?category=${category}`} 
            onClick={toggleDrawer}
            className="text-base-content hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {category}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
