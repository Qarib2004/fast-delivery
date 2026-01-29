"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input, Button } from "@heroui/react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/actions/auth.action";
import { toast } from "sonner";

interface IProps {
  onClose: () => void;
  onSwitchToLogin: () => void; 
}

const registrationSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof registrationSchema>;

const RegistrationForm = ({ onClose, onSwitchToLogin }: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const toastId = toast.loading('Registering user...');  
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
  
      toast.dismiss(toastId);
  
      if (result.error) {
        toast.error(result.error); 
        return;
      }
  
      toast.success('Registration successful! Please login.'); 
      reset();
      
      setTimeout(() => {
        onSwitchToLogin();
      }, 500);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An unexpected error occurred'); 
    }
  };

  

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name")}
        label="Full Name"
        placeholder="John Doe"
        variant="bordered"
        isRequired
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        startContent={<User className="text-gray-400 w-4 h-4" />}
        classNames={{
          label: "text-black-700 font-medium",
          input: "!outline-none !ring-0 focus:!ring-0",
          inputWrapper: errors.password
            ? "border-red-500"
            : "border-black-300 hover:border-orange-400 focus-within:!border-orange-500",
        }}      />

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
          label: "text-black-700 font-medium",
          input: "!outline-none !ring-0 focus:!ring-0",
          inputWrapper: errors.password
            ? "border-red-500"
            : "border-black-300 hover:border-orange-400 focus-within:!border-orange-500",
        }}
      />

      <Input
        {...register("password")}
        type={showPassword ? "text" : "password"}
        label="Password"
        placeholder="Min. 8 characters"
        variant="bordered"
        isRequired
        isInvalid={!!errors.password}
        errorMessage={errors.password?.message}
        startContent={<Lock className="text-gray-400 w-4 h-4" />}
        endContent={
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
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

      <Input
        {...register("confirmPassword")}
        type={showConfirmPassword ? "text" : "password"}
        label="Confirm Password"
        placeholder="Re-enter password"
        variant="bordered"
        isRequired
        isInvalid={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        startContent={<Lock className="text-gray-400 w-4 h-4" />}
        endContent={
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
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

      <div className="flex gap-3 pt-4">
        <Button variant="light" onPress={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="flex-1 bg-orange-500 text-white">
          Register
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin} 
            className="text-orange-600 hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;
