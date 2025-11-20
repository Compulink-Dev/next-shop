"use client";
import { fetcher } from "@/lib/services/fetcher";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Search } from "lucide-react";

export const SearchBox = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";

  const { data: categories, error } = useSWR(
    "/api/products/categories",
    fetcher
  );

  if (error) return <span className="text-error text-sm">{error.message}</span>;
  if (!categories) return <span className="text-base-content/60 text-sm">Loading...</span>;

  return (
    <form action="/search" method="GET" className="w-full">
      <div className="join w-full">
        <select
          name="category"
          defaultValue={category}
          className="join-item select select-bordered w-32 text-base-content bg-base-100 border-base-300"
        >
          <option value="all">All</option>
          {categories.map((c: string) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          className="join-item input input-bordered flex-1 min-w-0 text-base-content bg-base-100 border-base-300 placeholder:text-base-content/40"
          placeholder="Search IT products..."
          defaultValue={q}
          name="q"
        />
        <button type="submit" className="join-item btn btn-primary">
          <Search className="w-5 h-5" />
          <span className="hidden sm:inline ml-1">Search</span>
        </button>
      </div>
    </form>
  );
};
