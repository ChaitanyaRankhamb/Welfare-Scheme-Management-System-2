"use client";

import { useState, Suspense } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SuccessModal } from "@/components/success-model";
import { useSearchParams, useRouter } from "next/navigation";
import {
  verifyEmail,
  resendVerificationCode,
} from "@/components/api/verifyApi";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

// Define schema with Zod
const formSchema = z.object({
  otp: z.string().min(6, "Your one-time password must be 6 characters"),
});

function VerifyFormContent() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const form = useForm({
    defaultValues: { otp: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      if (!email) {
        toast.error("Email is missing. Please try registering again.");
        return;
      }
      setIsLoading(true);
      try {
        await verifyEmail(email, value.otp);
        setShowSuccess(true);
        toast.success("Email verified successfully!");
      } catch (error: any) {
        toast.error(
          error.message || "Verification failed. Please check your code.",
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email is missing. Please try registering again.");
      return;
    }
    setIsResending(true);
    try {
      await resendVerificationCode(email);
      form.reset();
      toast.success("Verification code resent! Please check your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-110 flex-col rounded-2xl border border-border bg-card p-10 shadow-lg">
        {/* Top Header Row with Back Button */}
        <div className="mb-6 flex justify-start">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-auto p-0 text-[0.85rem] font-medium text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Brand */}
        <div className="mb-8 flex justify-center">
          <span className="font-sans text-2xl font-extrabold tracking-[-0.04em] text-foreground">
            Yojana<span className="text-primary">Connect</span>
          </span>
        </div>

        {/* Form Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="m-0 mb-2 text-2xl font-bold text-foreground">
            Check your email
          </h1>
          <p className="m-0 text-[0.9rem] leading-6 text-muted-foreground">
            We emailed a 6-digit code to{" "}
            <span className="font-semibold text-foreground">
              {email || "your email"}
            </span>
            .
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <form.Field
            name="otp"
            validators={{ onSubmit: formSchema.shape.otp }}
          >
            {(field) => (
              <div className="flex flex-col gap-3">
                <label
                  htmlFor={field.name}
                  className="text-center text-[0.85rem] font-semibold text-foreground"
                >
                  Verification Code
                </label>
                <div className="flex justify-center mb-2">
                  <InputOTP
                    maxLength={6}
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  >
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-13.75 w-12.5 rounded-lg border border-border bg-transparent text-xl font-bold text-foreground shadow-sm transition-[border-color] data-[active=true]:border-ring data-[active=true]:shadow-[0_0_0_2px_color-mix(in_oklab,var(--ring)_30%,transparent)]"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {field.state.meta.errors?.length > 0 && (
                  <p className="m-0 text-center text-xs text-destructive">
                    {(field.state.meta.errors[0] as any)?.message ??
                      field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="h-12 w-full cursor-pointer rounded-[10px] border-0 bg-primary text-base font-bold text-primary-foreground shadow-lg transition-[transform,box-shadow,opacity] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isLoading ? "Verifying…" : "Verify Account"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2">
          <p className="m-0 text-[0.85rem] text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button
            variant="link"
            disabled={isResending || !email}
            className="h-auto p-0 text-[0.85rem] font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
            onClick={handleResendOTP}
          >
            {isResending ? "Resending…" : "Resend it"}
          </Button>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        title="Email Verified Valid!"
        description="Your email has been verified successfully. You can now access your dashboard."
        buttonLabel="Go to Dashboard"
        redirectPath="/citizenDashboard"
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}

export default function VerifyForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-foreground">
          Loading…
        </div>
      }
    >
      <VerifyFormContent />
    </Suspense>
  );
}
