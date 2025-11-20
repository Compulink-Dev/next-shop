"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { Pen, Trash, Plus } from "lucide-react";

import AdminLoading from "@/components/admin/AdminLoading";
import DataError from "@/components/admin/DataError";
import { fetcher } from "@/lib/services/fetcher";
import { formatId } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Banners() {
  const {
    data: banner,
    error,
    isLoading,
  } = useSWR(`/api/admin/banners`, fetcher);

  const router = useRouter();
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { trigger: deleteBanner, isMutating: isDeleting } = useSWRMutation(
    `/api/admin/banners`,
    async (url, { arg }: { arg: { bannerId: string } }) => {
      const toastId = toast.loading("Deleting banner...");
      const res = await fetch(`${url}/${arg.bannerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Banner deleted successfully", { id: toastId });
        setIsDialogOpen(false); // Close dialog
      } else {
        toast.error(data.message, { id: toastId });
      }
      setSelectedBannerId(null);
    }
  );

  const { trigger: createBanner, isMutating: isCreating } = useSWRMutation(
    `/api/admin/banners`,
    async (url) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.message);

      toast.success("Banner created successfully");
      router.push(`/admin/banners/${data.banner._id}`);
    }
  );

  const openDeleteDialog = (bannerId: string) => {
    setSelectedBannerId(bannerId);
    setIsDialogOpen(true);
  };

  if (error) return <div>An error has occurred: {error.message}</div>;
  if (isLoading) return <AdminLoading />;
  if (!banner || banner.length === 0) return <DataError name="banner" />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Banners
          </h1>
          <p className="text-base-content/60 mt-2">Manage your homepage banner slides</p>
        </div>
        <Button 
          disabled={isCreating} 
          onClick={() => createBanner()}
          className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          {isCreating && <span className="loading loading-spinner loading-sm"></span>}
          <Plus size={18} />
          Create Banner
        </Button>
      </div>

      <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-base-300">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-200">
              <tr className="text-base">
                <th className="font-semibold">ID</th>
                <th className="font-semibold">Name</th>
                <th className="font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banner.map((bannerItem: any) => (
                <tr key={bannerItem._id} className="hover:bg-base-200/50 transition-colors">
                  <td className="font-mono text-sm">{formatId(bannerItem._id!)}</td>
                  <td className="font-medium">{bannerItem.name}</td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/banners/${bannerItem._id}`}
                        className="btn btn-sm btn-ghost gap-1 hover:bg-primary hover:text-primary-content transition-all"
                      >
                        <Pen size={14} />
                        Edit
                      </Link>
                      <Dialog
                        open={isDialogOpen && selectedBannerId === bannerItem._id}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="btn btn-sm gap-1 text-error hover:bg-error hover:text-error-content transition-all"
                            onClick={() => openDeleteDialog(bannerItem._id!)}
                          >
                            <Trash size={14} /> Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-base-100">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Confirm Deletion</DialogTitle>
                            <DialogDescription className="text-base-content/70">
                              Are you sure you want to delete this banner? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                deleteBanner({ bannerId: bannerItem._id! })
                              }
                              disabled={isDeleting}
                              className="gap-2"
                            >
                              {isDeleting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                              ) : (
                                "Delete Banner"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
