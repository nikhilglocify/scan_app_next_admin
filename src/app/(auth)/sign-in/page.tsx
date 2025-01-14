"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormData, signInSchema } from "@/app/schemas/signInSchema";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/global/loader";
import Link from "next/link"; // Add this import
import { routeConstants } from "@/app/helpers/contants";

const SignInForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  const router = useRouter();
  const formData = watch();

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    console.log(formData);
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.email,
        password: data.password,
      });
      
      if (result?.ok) {
        toast.success("User signed in successfully");
        router.push(routeConstants.DASHBOARD);
      } else {
        toast.error(result?.error || "Failed to sign in");
        console.log("Failed to sign in", result?.error);
      }
    } catch (error: any) {
      console.log("error:", error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto  my-auto  mt-[200px] p-6 bg-white rounded-lg shadow-lg space-y-6"
    >
      <h1 className="text-2xl font-bold text-center">Sign In</h1>

      <div>
        <label
          htmlFor="email"
          
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          placeholder="Email"
          {...register("email")}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          {...register("password")}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
        />
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {loading ? <Loader message={"Signing in ...."} /> : "Sign In"}
      </button>

      {/*  "Don't have an account" section */}
      {/* <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href={routeConstants.SIGN_UP}
            className="text-orange-600 hover:text-orange-500"
          >
            Sign up
          </Link>
        </p>
      </div> */}

      {/* Forgot password section */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {/* Don’t have an account?{" "} */}
          <Link
            href={routeConstants.FORGOT_PASSWORD}
            className="text-orange-600 hover:text-orange-500"
          >
            Forgotten Password?
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignInForm;
