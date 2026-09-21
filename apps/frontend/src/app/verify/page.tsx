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
import styles from "./verify.module.css";

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
          error.message || "Verification failed. Please check your code."
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
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Top Header Row with Back Button */}
        <div className={styles.topNav}>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className={styles.backBtn}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Brand */}
        <div className={styles.brandContainer}>
          <span className={styles.brandWordmark}>
            Yojana<span className={styles.brandHighlight}>Connect</span>
          </span>
        </div>

        {/* Form Header */}
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Check your email</h1>
          <p className={styles.formSubtitle}>
            We emailed a 6-digit code to <span className={styles.emailHighlight}>{email || "your email"}</span>.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className={styles.form}
        >
          <form.Field
            name="otp"
            validators={{ onSubmit: formSchema.shape.otp }}
          >
            {(field) => (
              <div className={styles.fieldGroup}>
                <label htmlFor={field.name} className={styles.otpLabel}>
                  Verification Code
                </label>
                <div className="flex justify-center mb-2">
                  <InputOTP
                    maxLength={6}
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  >
                    <InputOTPGroup className={styles.otpGroup}>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className={styles.otpSlot}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {field.state.meta.errors?.length > 0 && (
                  <p className={styles.fieldError}>
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
            className={styles.submitBtn}
          >
            {isLoading ? "Verifying…" : "Verify Account"}
          </Button>
        </form>

        <div className={styles.bottomLinkRow}>
          <p className={styles.footerText}>Didn't receive the code?</p>
          <Button
            variant="link"
            disabled={isResending || !email}
            className={styles.resendBtn}
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
