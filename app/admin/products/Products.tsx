//@ts-nocheck
"use client";
import * as XLSX from "xlsx";
import { formatId } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  Plus,
  Upload,
  Trash2,
  Pen,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DataError from "@/components/admin/DataError";
import { fetcher } from "@/lib/services/fetcher";
import AdminLoading from "@/components/admin/AdminLoading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

interface UploadedProduct {
  part: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: string;
  brand: string;
  countInStock: number;
  description: string;
}

export default function Products() {
  const {
    data: products,
    error,
    isLoading,
    mutate,
  } = useSWR(`/api/admin/products`, fetcher);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Pagination and filters state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const router = useRouter();

  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading("Deleting product...");
      const res = await fetch(`${url}/${arg.productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Product deleted successfully", { id: toastId });
        mutate(); // Refresh the products list
      } else {
        toast.error(data.message, { id: toastId });
      }
    }
  );

  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const toastId = toast.loading("Creating product...");
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to create product", {
            id: toastId,
          });
          return;
        }

        toast.success("Product created successfully", { id: toastId });
        mutate(); // Refresh the products list
        router.push(`/admin/products/${data.product._id}`);
      } catch (error) {
        console.error("Error creating product:", error);
        toast.error("Failed to create product", { id: toastId });
      }
    }
  );

  // Filter and paginate products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: Product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.part?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && product.countInStock > 0) ||
        (stockFilter === "out-of-stock" && product.countInStock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Get unique categories
  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((p: Product) => p.category)));
  }, [products]);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleDeleteConfirm = () => {
    if (deleteProductId) {
      deleteProduct({ productId: deleteProductId });
      setDeleteProductId(null);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<UploadedProduct>(sheet);

      setUploadedData(jsonData);
      for (const product of jsonData) {
        try {
          const response = await fetch(`/api/admin/products/bulk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          });
          if (!response.ok) {
            const errorData = await response.json();
            toast.error(`Failed to add product: ${errorData.message}`);
          } else {
            toast.success(`Product ${product.name || ""} added successfully`);
          }
        } catch (err) {
          console.error("Error uploading product:", err);
          toast.error(`Error uploading product: ${product.name || ""}`);
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  if (error) return <div>An error has occurred: {error.message}</div>;
  if (isLoading) return <AdminLoading />;
  if (!products || products.length === 0) return <DataError name="products" />;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-base-content/60 mt-2">
            {filteredProducts.length} of {products?.length || 0} products
          </p>
        </div>
        <div className="flex gap-3">
          <button
            disabled={isCreating}
            onClick={() => createProduct()}
            className="btn btn-primary gap-2 rounded-full"
          >
            {isCreating && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            <Plus size={18} />
            Create Product
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            id="file-upload"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <label
            htmlFor="file-upload"
            className="btn btn-secondary gap-2 rounded-full cursor-pointer"
          >
            <Upload size={18} />
            Upload Excel
          </label>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-base-200 rounded-2xl p-6 mb-6 border border-base-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange();
              }}
              className="input input-bordered w-full pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  handleFilterChange();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              handleFilterChange();
            }}
            className="select select-bordered w-full"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              handleFilterChange();
            }}
            className="select select-bordered w-full"
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-base-200 rounded-2xl overflow-hidden border border-base-300">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-300">
              <tr className="text-base">
                <th className="font-semibold">ID</th>
                <th className="font-semibold">Part</th>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Price</th>
                <th className="font-semibold">Category</th>
                <th className="font-semibold">Stock</th>
                <th className="font-semibold">Rating</th>
                <th className="font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="text-base-content/60">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product: Product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-base-300/50 transition-colors"
                  >
                    <td className="font-mono text-sm">
                      {formatId(product._id!)}
                    </td>
                    <td className="font-medium">{product.part}</td>
                    <td className="max-w-xs truncate">{product.name}</td>
                    <td className="font-semibold text-primary">
                      ${product.price}
                    </td>
                    <td>
                      <span className="badge badge-primary badge-outline">
                        {product.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          product.countInStock > 0
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {product.countInStock}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className="text-warning">⭐</span>
                        <span className="font-medium">{product.rating}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="btn btn-sm btn-ghost gap-1 hover:bg-primary hover:text-primary-content transition-all"
                        >
                          <Pen size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteProductId(product._id!)}
                          className="btn btn-sm btn-ghost gap-1 text-error hover:bg-error hover:text-error-content transition-all"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-base-300">
            <div className="text-sm text-base-content/60">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn btn-sm btn-ghost gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`btn btn-sm ${
                        currentPage === pageNum ? "btn-primary" : "btn-ghost"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-ghost gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <DialogContent className="bg-base-100 text-base-content border-base-300">
          <DialogHeader>
            <DialogTitle className="text-base-content">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-base-content/70">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-base-content border-base-300"
              onClick={() => setDeleteProductId(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
