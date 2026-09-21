"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { SuccessModal } from "@/components/success-model";
import { loginUser, loginWithGoogle } from "@/components/api/authApi";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { GoogleIcon } from "@/icons/google.icon";
import { useRouter } from "next/navigation";
import AuthVisualPanel from "@/components/auth/AuthVisualPanel";
import styles from "./login.module.css";
import { ArrowLeft } from "lucide-react";

// Define schema with Zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export default function LoginForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const router = useRouter();

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const response = await loginUser(value.email);
        if (response.success) {
          await login();
          setShowSuccess(true);
          toast.success("Logged in successfully!");
          setTimeout(() => router.push("/dashboard"), 1000);
        }
      } catch (error: any) {
        toast.error(error.message || "Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className={styles.page}>
      <div className={styles.cardContainer}>
        {/* ── Left: form panel ── */}
        <div className={styles.formCol}>
          <div className={styles.backArrow}>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft />
              <span className={`text-sm font-medium ${styles.switchLinkTop}`}>Back</span>
            </Button>
          </div>
          <div className={styles.formWrapper}>

            {/* Top nav row */}
            <div className={styles.topNav}>
              <span className={styles.brandWordmark}>
                Yojana<span className={styles.brandHighlight}>Connect</span>
              </span>
            </div>

            {/* Header */}
            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>Welcome back</h1>

              <p className={styles.switchText}>
                Don’t have an account?{" "}
                <Link href="/register" className={styles.switchLinkTop}>
                  Create one
                </Link>
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
                name="email"
                validators={{ onChange: formSchema.shape.email }}
              >
                {(field) => (
                  <div className={styles.fieldGroup}>
                    <label htmlFor={field.name} className={styles.label}>
                      Email
                    </label>
                    <div className={styles.inputWrap}>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="example@gmail.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={styles.input}
                      />
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
                disabled={isLoading}
                className={styles.submitBtn}
              >
                {isLoading ? "Logging in…" : "Login"}
              </Button>
            </form>

            {/* Divider */}
            <div className={styles.dividerRow}>
              <Separator className={styles.divider} />
              <span className={styles.dividerLabel}>or</span>
              <Separator className={styles.divider} />
            </div>

            {/* Google OAuth */}
            <Button
              variant="outline"
              onClick={loginWithGoogle}
              className={styles.googleBtn}
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </Button>

            {/* Terms */}
            <p className={styles.switchText}>
              By registering, you agree to our <Link href="#" className={styles.switchLink}>Terms and Conditions</Link> and our <Link href="#" className={styles.switchLink}>Security Policy</Link>
            </p>
          </div>
        </div>

        {/* ── Right: visual panel ── */}
        <div className={styles.visualCol}>
          <AuthVisualPanel variant="login" />
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        title="Login Successful"
        description="You have been logged in successfully. Redirecting to dashboard…"
        buttonLabel="OK"
        redirectPath="/citizenDashboard"
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
