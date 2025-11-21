"use client";
import { signIn, useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, LogIn, Cpu, User2, ChevronLeft } from "lucide-react";

type Inputs = {
  email: string;
  password: string;
};

const Form = () => {
  const { data: session } = useSession();

  const params = useSearchParams();
  let callbackUrl = params.get("callbackUrl") || "/";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, params, router, session]);

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password } = form;
    signIn("credentials", {
      email,
      password,
    });
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
            Welcome Back
          </h1>
          <p className="text-base-content/60">Sign in to access your account</p>
        </div>

        {/* Card */}
        <div className="bg-base-200 rounded-2xl p-8 border border-base-300 shadow-xl">
          {/* Alerts */}
          {params.get("error") && (
            <div className="alert alert-error mb-6 rounded-xl">
              <span>
                {params.get("error") === "CredentialsSignin"
                  ? "Invalid email or password"
                  : params.get("error")}
              </span>
            </div>
          )}
          {params.get("success") && (
            <div className="alert alert-success mb-6 rounded-xl">
              <span>{params.get("success")}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full gap-2 rounded-full text-lg h-12"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <User2 className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider my-6">OR</div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-base-content/70">
              {`Don't have an account?`}{" "}
              <Link
                className="link link-primary font-semibold"
                href={`/register?callbackUrl=${callbackUrl}`}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-base-content/50 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
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
