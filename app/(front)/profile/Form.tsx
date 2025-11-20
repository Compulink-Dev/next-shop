"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Edit2,
  Save,
  X,
  Shield,
  Calendar,
} from "lucide-react";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Form = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session && session.user) {
      setValue("name", session.user.name!);
      setValue("email", session.user.email!);
    }
  }, [router, session, setValue]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form;
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (res.status === 200) {
        toast.success("Profile updated successfully");
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            name,
            email,
          },
        };
        await update(newSession);
        setIsEditing(false);
      } else {
        const data = await res.json();
        toast.error(data.message || "error");
      }
    } catch (err: any) {
      const error =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message;
      toast.error(error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            My Profile
          </h1>
          <p className="text-base-content/60">
            Manage your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card - Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
              {/* Avatar Section */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="avatar placeholder mb-4">
                  <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-24 h-24">
                    <span className="text-3xl font-bold">
                      {getUserInitials(session?.user?.name || "")}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-base-content mb-1">
                  {session?.user?.name}
                </h2>
                <p className="text-base-content/60 text-sm mb-4">
                  {session?.user?.email}
                </p>

                {/* Account Type Badge */}
                {session?.user?.isAdmin && (
                  <div className="badge badge-primary gap-2">
                    <Shield className="w-3 h-3" />
                    Administrator
                  </div>
                )}
              </div>

              <div className="divider"></div>

              {/* Account Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-base-content/50" />
                  <div>
                    <p className="text-base-content/60 text-xs">Full Name</p>
                    <p className="text-base-content font-medium">
                      {session?.user?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-base-content/50" />
                  <div>
                    <p className="text-base-content/60 text-xs">
                      Email Address
                    </p>
                    <p className="text-base-content font-medium">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-base-content/50" />
                  <div>
                    <p className="text-base-content/60 text-xs">Member Since</p>
                    <p className="text-base-content font-medium">
                      {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form - Right Section */}
          <div className="lg:col-span-2">
            <div className="bg-base-200 rounded-2xl p-8 border border-base-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-base-content">
                    Account Settings
                  </h2>
                  <p className="text-base-content/60 text-sm">
                    Update your personal information
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary gap-2 rounded-full"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="label" htmlFor="name">
                      <span className="label-text font-semibold">
                        Full Name
                      </span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                      <input
                        type="text"
                        id="name"
                        {...register("name", {
                          required: "Name is required",
                        })}
                        className="input input-bordered w-full pl-10"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name?.message && (
                      <p className="text-error text-sm mt-1 ml-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="label" htmlFor="email">
                      <span className="label-text font-semibold">
                        Email Address
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                      <input
                        type="text"
                        id="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                            message: "Email is invalid",
                          },
                        })}
                        className="input input-bordered w-full pl-10"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email?.message && (
                      <p className="text-error text-sm mt-1 ml-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="divider">Change Password (Optional)</div>

                  {/* Password Field */}
                  <div>
                    <label className="label" htmlFor="password">
                      <span className="label-text font-semibold">
                        New Password
                      </span>
                      <span className="label-text-alt text-base-content/60">
                        Leave blank to keep current
                      </span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                      <input
                        type="password"
                        id="password"
                        {...register("password", {})}
                        className="input input-bordered w-full pl-10"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password?.message && (
                      <p className="text-error text-sm mt-1 ml-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="label" htmlFor="confirmPassword">
                      <span className="label-text font-semibold">
                        Confirm New Password
                      </span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                      <input
                        type="password"
                        id="confirmPassword"
                        {...register("confirmPassword", {
                          validate: (value) => {
                            const { password } = getValues();
                            return (
                              password === value || "Passwords should match!"
                            );
                          },
                        })}
                        className="input input-bordered w-full pl-10"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword?.message && (
                      <p className="text-error text-sm mt-1 ml-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary flex-1 gap-2 rounded-full"
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setValue("name", session?.user?.name || "");
                        setValue("email", session?.user?.email || "");
                        setValue("password", "");
                        setValue("confirmPassword", "");
                      }}
                      className="btn btn-ghost flex-1 gap-2 rounded-full"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Display Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                      <label className="text-sm text-base-content/60 mb-1 block">
                        Full Name
                      </label>
                      <p className="text-base-content font-medium">
                        {session?.user?.name}
                      </p>
                    </div>
                    <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                      <label className="text-sm text-base-content/60 mb-1 block">
                        Email Address
                      </label>
                      <p className="text-base-content font-medium">
                        {session?.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-base-100 rounded-xl p-4 border border-base-300">
                    <label className="text-sm text-base-content/60 mb-1 block">
                      Password
                    </label>
                    <p className="text-base-content font-medium">••••••••</p>
                  </div>

                  <div className="alert alert-info rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>{`Click "Edit Profile" to update your information`}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
