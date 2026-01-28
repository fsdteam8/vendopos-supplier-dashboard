/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Assuming Input component is here
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useEmailVerify } from "@/hooks/useAuth";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your specific OTP must be 6 characters.",
  }),
});

const EmailVerify = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const { verifyEmailMutation } = useEmailVerify();
  const [loading, startTransition] = useTransition();
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otpValue = form.watch("otp");

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = otpValue.split("");
    // Ensure array is size 6
    while (newOtp.length < 6) newOtp.push("");

    newOtp[index] = value.substring(value.length - 1);
    const combinedOtp = newOtp.join("");
    form.setValue("otp", combinedOtp);

    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    form.setValue("otp", pastedData);
    // Focus last filled
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    verifyEmailMutation.mutate(
      {token:token,otp:values.otp },
      {
        onSuccess: (data) => {
          toast.success( data.message||"Email verified successfully!");
          router.push("/login");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to verify OTP");
        },
      }
    );
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center 
      flex-col gap-5"
    >
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-center mb-2">
        <Image
          src="/logo.svg"
          alt="logo"
          width={50}
          height={60}
          className=""
        />
      </div>
        <h1 className="text-primary text-3xl md:text-[40px] font-bold mb-2 font-heading text-center">
          Enter OTP
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          We’ve sent a 6-digit code to your email:{" "}
          {/* <span className="font-semibold text-[#131313]">{email}</span> */}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="otp"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-between gap-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Input
                          key={index}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={otpValue[index] || ""}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          className="h-16 w-14 md:w-16 text-center text-2xl font-bold border-gray-300 focus:ring-2 focus:ring-primary"
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={index === 0 ? handlePaste : undefined}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timer + Resend */}
            <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-1">
                <span>⏱</span>
                <span>
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
              <div>
                Didn’t get a code?{" "}
                <button
                  type="button"
                  disabled={timeLeft > 0}
                  className={`${
                    timeLeft > 0
                      ? "text-primary cursor-not-allowed"
                      : "text-primary hover:underline cursor-pointer"
                  }`}
                  onClick={() => {
                    toast.info("Resend functionality not implemented yet");
                    setTimeLeft(30);
                  }}
                >
                  Resend
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={verifyEmailMutation.isPending}
              className="bg-primary hover:bg-primary/50 text-white h-12 w-full rounded-md text-base font-semibold shadow-md flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default EmailVerify;
