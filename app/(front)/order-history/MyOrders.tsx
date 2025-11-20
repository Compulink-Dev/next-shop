"use client";
//@ts-ignore
import { Order } from "@/lib/models/OrderModel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { getSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/services/fetcher";
import AdminLoading from "@/components/admin/AdminLoading";
import { Package, Search, X, CheckCircle, Clock, XCircle, Calendar, DollarSign, Eye } from "lucide-react";

export default function MyOrders() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      //@ts-ignore
      setSession(sessionData);
    };

    fetchSession();
    setMounted(true);
  }, []);

  const { data: orders, error } = useSWR(
    //@ts-ignore
    session?.user.isAdmin ? "/api/orders/admin" : "/api/orders/mine",
    fetcher
  );

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter((order: Order) => {
      const matchesSearch = 
        order._id?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "delivered" && order.isDelivered) ||
        (statusFilter === "pending" && !order.isDelivered) ||
        (statusFilter === "paid" && order.isPaid) ||
        (statusFilter === "unpaid" && !order.isPaid);
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  if (!mounted) return <></>;
  if (error) return "An error has occurred.";
  if (!orders) return <AdminLoading />;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-base-content mb-2">Order History</h1>
        <p className="text-base-content/60">
          Track and manage all your orders
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-base-200 rounded-2xl p-6 mb-6 border border-base-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending Delivery</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-base-200 rounded-2xl p-16 text-center border border-base-300">
          <Package className="w-24 h-24 mx-auto mb-6 text-base-content/30" />
          <h3 className="text-2xl font-bold text-base-content mb-4">No orders found</h3>
          <p className="text-base-content/60 mb-6">Start shopping to create your first order</p>
          <Link href="/" className="btn btn-primary rounded-full">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: Order) => (
            <div
              key={order._id}
              className="bg-base-200 rounded-2xl p-6 border border-base-300 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-base-content">
                        Order #{order._id.substring(20, 24)}
                      </p>
                      <p className="text-sm text-base-content/60">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Order Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-base-content/50" />
                      <span className="text-sm text-base-content/70">
                        Total: <span className="font-semibold text-primary">${order.totalPrice.toFixed(2)}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.isPaid ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm text-success">
                            Paid on {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-error" />
                          <span className="text-sm text-error">Not paid</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {order.isDelivered ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm text-success">
                            Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-warning" />
                          <span className="text-sm text-warning">In transit</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href={`/order/${order._id}`}
                    className="btn btn-primary btn-sm gap-2 rounded-full"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-base-300">
                {order.isPaid && (
                  <span className="badge badge-success gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Paid
                  </span>
                )}
                {order.isDelivered && (
                  <span className="badge badge-success gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Delivered
                  </span>
                )}
                {!order.isDelivered && (
                  <span className="badge badge-warning gap-1">
                    <Clock className="w-3 h-3" />
                    Processing
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Count */}
      {filteredOrders.length > 0 && (
        <div className="text-center mt-6 text-base-content/60">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
}
