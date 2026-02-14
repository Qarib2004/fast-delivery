"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FormData, signInSchema } from "@/schema/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface IProps {
  onClose: () => void;
  onSwitchToRegistration?: () => void;
}

const LoginForm = ({ onClose }: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: FormData) => {
    const toastId = toast.loading("Signing in...");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      toast.dismiss(toastId);

      if (!result || result.error) {
        toast.error(result?.error || "Authentication failed");
        return;
      }

      toast.success("Signed in successfully");
      reset();
      onClose();
      router.refresh();
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        type="email"
        label="Email Address"
        placeholder="john@example.com"
        variant="bordered"
        isRequired
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        startContent={<Mail className="text-black-400 w-4 h-4" />}
        classNames={{
          label: "!text-black-700 font-medium",
          input: "!outline-none !ring-0 focus:!ring-0",

          inputWrapper: errors.email
            ? "border-red-500"
            : "border-black-300 hover:border-orange-400 focus-within:!border-orange-500",
        }}
        
      />

      <div>
        <Input
          {...register("password")}
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Enter your password"
          variant="bordered"
          isRequired
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          startContent={<Lock className="text-black-400 w-4 h-4" />}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="text-black-400 hover:text-black-600 w-4 h-4" />
              ) : (
                <Eye className="text-black-400 hover:text-black-600 w-4 h-4" />
              )}
            </button>
          }
          classNames={{
            label: "text-black-700 font-medium",
            input: "!outline-none !ring-0 focus:!ring-0",
            inputWrapper: errors.password
              ? "border-red-500"
              : "border-black-300 hover:border-orange-400 focus-within:!border-orange-500",
          }}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="light"
          onPress={onClose}
          className="flex-1 font-medium hover:bg-black-100"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-black-600">
          Dont have an account?{" "}
          <span className="text-orange-600 font-medium hover:text-orange-700 hover:underline cursor-pointer">
            Sign Up
          </span>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
