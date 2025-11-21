"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

// Dialog components (you'll need to install or create these)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SignOutSectionProps {
  userName: string;
  userEmail: string;
  mobileView?: boolean;
}

export default function SignOutSection({
  userName,
  userEmail,
  mobileView = false,
}: SignOutSectionProps) {
  const [showDialog, setShowDialog] = useState(false);

  const signoutHandler = async () => {
    setShowDialog(false);
    await signOut({ callbackUrl: "/" });
  };

  if (mobileView) {
    return (
      <>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-3 w-full px-2 py-2 text-error hover:bg-error/10 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>

        {/* Sign Out Confirmation Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-base-100 text-base-content border-base-300">
            <DialogTitle className="text-base-content">Sign Out</DialogTitle>
            <DialogDescription className="text-base-content/70">
              Are you sure you want to sign out?
            </DialogDescription>
            <DialogFooter>
              <Button
                variant="outline"
                className="text-base-content border-base-300"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={signoutHandler}>
                Sign Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="btn btn-outline btn-error btn-sm w-full gap-2"
      >
        <LogOut size={16} />
        Sign Out
      </button>

      {/* Sign Out Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-base-100 text-base-content border-base-300">
          <DialogTitle className="text-base-content">Sign Out</DialogTitle>
          <DialogDescription className="text-base-content/70">
            Are you sure you want to sign out?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-base-content border-base-300"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={signoutHandler}>
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
