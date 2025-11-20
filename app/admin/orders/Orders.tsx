"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLoading from "@/components/admin/AdminLoading";
import DataError from "@/components/admin/DataError";
import { fetcher } from "@/lib/services/fetcher";
import { formatId } from "@/lib/utils";
import Link from "next/link";
import useSWR from "swr";
import { useState, useMemo } from "react";
import { Search, X, ChevronLeft, ChevronRight, Package, CheckCircle, Clock, XCircle } from "lucide-react";

export default function Orders() {
  const {
    data: orders,
    error,
    isLoading,
  } = useSWR(`/api/admin/orders`, fetcher);

  // Pagination and filters state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [paidFilter, setPaidFilter] = useState("all");
  const [deliveredFilter, setDeliveredFilter] = useState("all");

  // Filter and paginate orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter((order: any) => {
      const matchesSearch = 
        order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPaid = 
        paidFilter === "all" ||
        (paidFilter === "paid" && order.isPaid) ||
        (paidFilter === "unpaid" && !order.isPaid);
      
      const matchesDelivered = 
        deliveredFilter === "all" ||
        (deliveredFilter === "delivered" && order.isDelivered) ||
        (deliveredFilter === "pending" && !order.isDelivered);
      
      return matchesSearch && matchesPaid && matchesDelivered;
    });
  }, [orders, searchQuery, paidFilter, deliveredFilter]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  if (error) return <div>An error has occurred: {error.message}</div>;
  if (isLoading) return <AdminLoading />;
  if (!orders || orders.length === 0) return <DataError name="orders" />;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Orders
          </h1>
          <p className="text-base-content/60 mt-2">
            {filteredOrders.length} of {orders?.length || 0} orders
          </p>
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
              placeholder="Search by order ID, customer..."
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

          {/* Payment Status Filter */}
          <select
            value={paidFilter}
            onChange={(e) => {
              setPaidFilter(e.target.value);
              handleFilterChange();
            }}
            className="select select-bordered w-full"
          >
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          {/* Delivery Status Filter */}
          <select
            value={deliveredFilter}
            onChange={(e) => {
              setDeliveredFilter(e.target.value);
              handleFilterChange();
            }}
            className="select select-bordered w-full"
          >
            <option value="all">All Delivery Status</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="bg-base-200 rounded-2xl overflow-hidden border border-base-300">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-300">
              <tr className="text-base">
                <th className="font-semibold">Order ID</th>
                <th className="font-semibold">Customer</th>
                <th className="font-semibold">Date</th>
                <th className="font-semibold">Total</th>
                <th className="font-semibold">Payment</th>
                <th className="font-semibold">Delivery</th>
                <th className="font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="text-base-content/60">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-base-300/50 transition-colors">
                    <td className="font-mono text-sm">{formatId(order._id)}</td>
                    <td className="font-medium">{order.user?.name || "Deleted user"}</td>
                    <td className="text-base-content/70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="font-semibold text-primary">${order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? (
                        <div className="flex items-center gap-2">
                          <span className="badge badge-success gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Paid
                          </span>
                          <span className="text-xs text-base-content/60">
                            {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="badge badge-error gap-1">
                          <XCircle className="w-3 h-3" />
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <div className="flex items-center gap-2">
                          <span className="badge badge-success gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Delivered
                          </span>
                          <span className="text-xs text-base-content/60">
                            {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="badge badge-warning gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-end">
                        <Link
                          href={`/order/${order._id}`}
                          className="btn btn-sm btn-ghost gap-1 hover:bg-primary hover:text-primary-content transition-all"
                        >
                          <Package size={14} />
                          View Details
                        </Link>
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
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                      className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
    </div>
  );
}
