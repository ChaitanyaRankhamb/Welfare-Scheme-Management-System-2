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
    <div className="flex min-h-screen items-center justify-center bg-background p-4 min-[851px]:p-8">
      <div className="grid min-h-162.5 w-full max-w-250 grid-cols-1 overflow-hidden rounded-[20px] bg-card shadow-2xl min-[851px]:grid-cols-2">
        {/* ── Left: form panel ── */}
        <div className="relative order-1 flex items-center justify-center bg-card px-5 py-8 min-[851px]:p-12">
          <div className="absolute left-5 top-5 z-10">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft />
              <span className="text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline">
                Back
              </span>
            </Button>
          </div>
          <div className="flex w-full max-w-85 flex-col gap-6">
            {/* Top nav row */}
            <div className="mb-6 flex flex-col items-center">
              <span className="font-sans text-[2.2rem] font-extrabold tracking-[-0.04em] text-foreground">
                Yojana<span className="text-primary">Connect</span>
              </span>
            </div>

            {/* Header */}
            <div className="mb-2 flex flex-col items-center gap-[0.3rem]">
              <h1 className="m-0 font-sans text-[1.35rem] font-semibold text-foreground">
                Welcome back
              </h1>

              <p className="mt-4 text-center text-[0.8rem] text-muted-foreground">
                Don’t have an account?{" "}
                <Link
                  href="/register"
                  className="text-[0.8rem] text-primary transition-colors hover:text-primary/80 hover:underline"
                >
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
              className="flex flex-col gap-5"
            >
              <form.Field
                name="email"
                validators={{ onChange: formSchema.shape.email }}
              >
                {(field) => (
                  <div className="flex flex-col gap-[0.4rem]">
                    <label
                      htmlFor={field.name}
                      className="text-[0.85rem] font-semibold text-foreground"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="example@gmail.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-11 w-full rounded-lg border border-border bg-transparent px-[0.8rem] text-[0.9rem] text-foreground shadow-sm transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                    {field.state.meta.errors?.length > 0 && (
                      <p className="m-0 text-xs text-destructive">
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
                className="mt-2 h-11 w-full cursor-pointer rounded-lg border-0 bg-primary text-[0.9rem] font-semibold text-primary-foreground shadow-md transition-[transform,box-shadow,opacity] hover:-translate-y-px hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isLoading ? "Logging in…" : "Login"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <Separator className="flex-1 bg-border" />
              <span className="whitespace-nowrap text-xs font-medium text-muted-foreground">
                or
              </span>
              <Separator className="flex-1 bg-border" />
            </div>

            {/* Google OAuth */}
            <Button
              variant="outline"
              onClick={loginWithGoogle}
              className="flex h-11 w-full items-center justify-center gap-[0.6rem] rounded-lg border border-border bg-transparent text-[0.88rem] font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </Button>

            {/* Terms */}
            <p className="mt-4 text-center text-[0.8rem] text-muted-foreground">
              By registering, you agree to our{" "}
              <Link
                href="#"
                className="text-primary hover:text-primary/80 hover:underline"
              >
                Terms and Conditions
              </Link>{" "}
              and our{" "}
              <Link
                href="#"
                className="text-primary hover:text-primary/80 hover:underline"
              >
                Security Policy
              </Link>
            </p>
          </div>
        </div>

        {/* ── Right: visual panel ── */}
        <div className="order-2 flex bg-card p-6 max-[850px]:hidden">
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
