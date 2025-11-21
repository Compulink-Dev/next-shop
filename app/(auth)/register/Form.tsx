"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { User, Mail, Lock, UserPlus, Cpu, ChevronLeft } from "lucide-react";

type Inputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Form = () => {
  const { data: session } = useSession();

  const params = useSearchParams();
  const router = useRouter();
  let callbackUrl = params.get("callbackUrl") || "/";
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (res.ok) {
        return router.push(
          `/signin?callbackUrl=${callbackUrl}&success=Account has been created`
        );
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err: any) {
      const error =
        err.message && err.message.indexOf("E11000") === 0
          ? "Email is duplicate"
          : err.message;
      toast.error(error || "error");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl">
              <Cpu className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-base-content/60">
            Join Compulink IT Solutions today
          </p>
        </div>
        {/* Card */}
        <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-xl">
          <form onSubmit={handleSubmit(formSubmit)} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="label" htmlFor="name">
                <span className="label-text font-semibold">Full Name</span>
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
                <span className="label-text font-semibold">Email Address</span>
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

            {/* Password Field */}
            <div>
              <label className="label" htmlFor="password">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
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
                  Confirm Password
                </span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) => {
                      const { password } = getValues();
                      return password === value || "Passwords should match!";
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full gap-2 rounded-full text-lg h-12 mt-6"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6">OR</div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-base-content/70">
              Already have an account?{" "}
              <Link
                className="link link-primary font-semibold"
                href={`/signin?callbackUrl=${callbackUrl}`}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
        {/* Footer */}
        <p className="text-center text-sm text-base-content/50 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>

        <div
          className="flex items-center mt-8 cursor-pointer text-slate-400 hover:text-base-content transition-colors gap-2"
          onClick={() => router.back()}
        >
          <ChevronLeft size={16} />
          <p className="text-sm">Back to previous page</p>
        </div>
      </div>
    </div>
  );
};

export default Form;
