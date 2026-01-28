"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Image from "next/image";
import { useForgotPassword } from "@/hooks/useAuth";

// ✅ Validation schema
const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const { forgetPasswordMutation } = useForgotPassword();

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const onSubmit = (values: ForgotFormValues) => {
    const toastId = "forgot-password";
    setIsLoading(true);

    forgetPasswordMutation.mutate(values.email, {
      onSuccess: (data) => {
        const token = data?.data?.accessToken;
        if (!token) {
          toast.error("Failed to get verification token");
          return;
        }
        toast.success("OTP sent! Check your email.", { id: toastId });

        // Store email for verify-otp page
        localStorage.setItem("userEmail", values.email);

        // Redirect
        router.push(`/verify-otp?token=${token}`);
      },
      onError: (err) => {
        const message = err?.message || "Failed to send OTP";
        toast.error(message, { id: toastId });
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center 
     flex-col gap-5"
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-2">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={50}
            height={60}
            className=""
          />
        </div>
        <h2 className="text-3xl md:text-[48px] font-bold leading-[150%] font-playfair text-primary mb-2 leading-tight text-center">
          Reset Your Password
        </h2>
        <p className="text-gray-500 mb-6">
          Enter your email address and we&apos;ll send you code to reset your
          password.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[16px] leading-[150%] font-medium text-[#343A40]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      className="h-12 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/80 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
