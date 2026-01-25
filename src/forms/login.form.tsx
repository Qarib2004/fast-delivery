"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, Form, Checkbox } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FormData, signInSchema } from "@/schema/zod";

interface IProps {
  onClose: () => void;
}


const LoginForm = ({ onClose }: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data, "Remember me:", rememberMe);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reset();
    onClose();
  };

  return (
    <Form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        type="email"
        label="Email Address"
        placeholder="john@example.com"
        variant="bordered"
        isRequired
        isInvalid={!!errors.email}
        errorMessage={errors.email?.message}
        startContent={<Mail className="text-gray-400 w-4 h-4" />}
        classNames={{
          label: "text-gray-700 font-medium",
          input: "text-gray-900",
          inputWrapper: errors.email
            ? "border-red-500"
            : "border-gray-300 hover:border-orange-400 focus-within:!border-orange-500",
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
          startContent={<Lock className="text-gray-400 w-4 h-4" />}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="text-gray-400 hover:text-gray-600 w-4 h-4" />
              ) : (
                <Eye className="text-gray-400 hover:text-gray-600 w-4 h-4" />
              )}
            </button>
          }
          classNames={{
            label: "text-gray-700 font-medium",
            input: "text-gray-900",
            inputWrapper: errors.password
              ? "border-red-500"
              : "border-gray-300 hover:border-orange-400 focus-within:!border-orange-500",
          }}
        />
      </div>

      {/* <div className="flex items-center justify-between">
        <Checkbox
          size="sm"
          isSelected={rememberMe}
          onValueChange={setRememberMe}
          classNames={{
            wrapper: "after:bg-orange-500 group-data-[selected=true]:border-orange-500",
          }}
        >
          <span className="text-sm text-gray-700">Remember me</span>
        </Checkbox>
        <button
          type="button"
          className="text-sm text-orange-600 hover:text-orange-700 hover:underline font-medium"
        >
          Forgot password?
        </button>
      </div> */}

      <div className="flex gap-3 pt-2">
        <Button
          variant="light"
          onPress={onClose}
          className="flex-1 font-medium hover:bg-gray-100"
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
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <span className="text-orange-600 font-medium hover:text-orange-700 hover:underline cursor-pointer">
            Sign Up
          </span>
        </p>
      </div>
    </Form>
  );
};

export default LoginForm;