"use client";
import Link from "next/link";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import useSWR from "swr";
import { formatNumber } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
  ChartOptions,
} from "chart.js";
import { fetcher } from "@/lib/services/fetcher";
import AdminLoading from "@/components/admin/AdminLoading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
);

// Define proper chart options with correct types
const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const, // Use 'as const' to narrow the type
    },
  },
};

const barChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const doughnutChartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/admin/orders/summary`, fetcher);

  if (error) return error.message;
  if (!summary) return <AdminLoading />;

  const salesData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: "Sales",
        data: summary.salesData.map(
          (x: { totalSales: number }) => x.totalSales
        ),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const ordersData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: "Orders",
        data: summary.salesData.map(
          (x: { totalOrders: number }) => x.totalOrders
        ),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const productsData = {
    labels: summary.productsData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        label: "Category",
        data: summary.productsData.map(
          (x: { totalProducts: number }) => x.totalProducts
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
      },
    ],
  };

  const usersData = {
    labels: summary.usersData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        label: "Users",
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        data: summary.usersData.map(
          (x: { totalUsers: number }) => x.totalUsers
        ),
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-base-content mb-2">Dashboard</h1>
        <p className="text-base-content/60">{`Welcome back! Here's your business overview`}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Sales Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-secondary-content shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>+12%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Sales</h3>
          <p className="text-3xl font-bold mb-3">
            ${formatNumber(summary.ordersPrice)}
          </p>
          <Link
            href="/admin/orders"
            className="text-sm opacity-90 hover:opacity-100 flex items-center gap-1"
          >
            View details
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Orders Card */}
        <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-primary-content shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>+8%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Orders</h3>
          <p className="text-3xl font-bold mb-3">{summary.ordersCount}</p>
          <Link
            href="/admin/orders"
            className="text-sm opacity-90 hover:opacity-100 flex items-center gap-1"
          >
            View details
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Products Card */}
        <div className="bg-gradient-to-br from-accent to-accent/80 rounded-2xl p-6 text-accent-content shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>+5%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">
            Total Products
          </h3>
          <p className="text-3xl font-bold mb-3">{summary.productsCount}</p>
          <Link
            href="/admin/products"
            className="text-sm opacity-90 hover:opacity-100 flex items-center gap-1"
          >
            View details
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Users Card */}
        <div className="bg-gradient-to-br from-info to-info/80 rounded-2xl p-6 text-info-content shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>+15%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Users</h3>
          <p className="text-3xl font-bold mb-3">{summary.usersCount}</p>
          <Link
            href="/admin/users"
            className="text-sm opacity-90 hover:opacity-100 flex items-center gap-1"
          >
            View details
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
          <h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Sales Report
          </h2>
          <div className="h-72">
            <Line data={salesData} options={lineChartOptions} />
          </div>
        </div>
        <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
          <h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-secondary" />
            Orders Report
          </h2>
          <div className="h-72">
            <Line data={ordersData} options={lineChartOptions} />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
          <h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            Products by Category
          </h2>
          <div className="flex items-center justify-center h-80">
            <Doughnut data={productsData} options={doughnutChartOptions} />
          </div>
        </div>
        <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
          <h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-info" />
            Users Growth
          </h2>
          <div className="h-80">
            <Bar data={usersData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
