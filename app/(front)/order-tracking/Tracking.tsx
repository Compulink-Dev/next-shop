"use client";
import AdminLoading from "@/components/admin/AdminLoading";
import { fetcher } from "@/lib/services/fetcher";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { Package, Search, X, CheckCircle, Clock, XCircle, Truck, MapPin, Eye, Calendar } from "lucide-react";

export default function Tracking() {
  const router = useRouter();
  const { data: orders, error } = useSWR(`/api/orders/mine`, fetcher);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter((order: any) => {
      const matchesSearch = 
        order._id?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "delivered" && order.isDelivered) ||
        (statusFilter === "in-transit" && !order.isDelivered && order.isPaid);
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Calculate delivery progress
  const getDeliveryProgress = (order: any) => {
    if (order.isDelivered) return 100;
    if (order.isPaid) return 50;
    return 25;
  };

  // Get estimated delivery time
  const getEstimatedDelivery = (order: any) => {
    if (order.isDelivered && order.deliveredAt) {
      return `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`;
    }
    if (order.estimatedDeliveryAt) {
      const daysRemaining = Math.ceil(
        (new Date(order.estimatedDeliveryAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysRemaining > 0 
        ? `Estimated delivery in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
        : 'Arriving today';
    }
    return 'Delivery time unavailable';
  };

  if (!mounted) return <></>;
  if (error) return "An error has occurred.";
  if (!orders) return <AdminLoading />;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-base-content mb-2">Track Your Orders</h1>
        <p className="text-base-content/60">
          Monitor real-time status and delivery progress
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
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Tracking */}
      {filteredOrders.length === 0 ? (
        <div className="bg-base-200 rounded-2xl p-16 text-center border border-base-300">
          <Truck className="w-24 h-24 mx-auto mb-6 text-base-content/30" />
          <h3 className="text-2xl font-bold text-base-content mb-4">No orders to track</h3>
          <p className="text-base-content/60 mb-6">Place an order to start tracking</p>
          <Link href="/" className="btn btn-primary rounded-full">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order: any) => {
            const progress = getDeliveryProgress(order);
            return (
              <div
                key={order._id}
                className="bg-base-200 rounded-2xl p-6 border border-base-300 hover:shadow-lg transition-all"
              >
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-base-content">
                        Order #{order._id.substring(20, 24)}
                      </p>
                      <p className="text-sm text-base-content/60">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/order/${order._id}`}
                    className="btn btn-primary btn-sm gap-2 rounded-full"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Link>
                </div>

                {/* Delivery Progress Timeline */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-base-content">Delivery Progress</span>
                    <span className="text-sm text-base-content/60">{progress}%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-base-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Order Placed */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      true ? 'bg-success/20' : 'bg-base-300'
                    }`}>
                      <CheckCircle className={`w-5 h-5 ${
                        true ? 'text-success' : 'text-base-content/30'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-base-content">Order Placed</p>
                      <p className="text-xs text-base-content/60">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Payment Confirmed */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      order.isPaid ? 'bg-success/20' : 'bg-base-300'
                    }`}>
                      {order.isPaid ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <Clock className="w-5 h-5 text-base-content/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-base-content">Payment Confirmed</p>
                      <p className="text-xs text-base-content/60">
                        {order.isPaid && order.paidAt
                          ? new Date(order.paidAt).toLocaleDateString()
                          : 'Pending payment'}
                      </p>
                    </div>
                  </div>

                  {/* Delivered */}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      order.isDelivered ? 'bg-success/20' : 'bg-base-300'
                    }`}>
                      {order.isDelivered ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <Truck className="w-5 h-5 text-base-content/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-base-content">Delivered</p>
                      <p className="text-xs text-base-content/60">
                        {order.isDelivered && order.deliveredAt
                          ? new Date(order.deliveredAt).toLocaleDateString()
                          : 'In transit'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Info Card */}
                <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-base-content mb-1">
                        {getEstimatedDelivery(order)}
                      </p>
                      <p className="text-sm text-base-content/60">
                        Total: <span className="font-semibold text-primary">${order.totalPrice.toFixed(2)}</span>
                      </p>
                    </div>
                    <div>
                      {order.isDelivered ? (
                        <span className="badge badge-success gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Delivered
                        </span>
                      ) : order.isPaid ? (
                        <span className="badge badge-warning gap-1">
                          <Truck className="w-3 h-3" />
                          In Transit
                        </span>
                      ) : (
                        <span className="badge badge-error gap-1">
                          <XCircle className="w-3 h-3" />
                          Awaiting Payment
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Count */}
      {filteredOrders.length > 0 && (
        <div className="text-center mt-6 text-base-content/60">
          Tracking {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
}
