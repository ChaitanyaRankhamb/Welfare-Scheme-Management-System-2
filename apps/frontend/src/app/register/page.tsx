"use client";

import Link from "next/link";
import { useRegisterForm } from "./useRegistrationFrom";
import { formSchema } from "./constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GoogleIcon } from "@/icons/google.icon";
import { loginWithGoogle } from "@/components/api/authApi";
import { SuccessModal } from "@/components/success-model";
import { Input } from "@/components/ui/input";
import AuthVisualPanel from "@/components/auth/AuthVisualPanel";
import styles from "./register.module.css";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const {
    form,
    isLoading,
    showSuccess,
    setShowSuccess,
    usernameStatus,
    checkUsername,
  } = useRegisterForm();

  const router = useRouter();

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
              <h1 className={styles.formTitle}>Create your account</h1>

              <p className={styles.switchText}>
                Already have an account?{" "}
                <Link href="/login" className={styles.switchLinkTop}>
                  Log in
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
              {/* Username field */}
              <form.Field
                name="username"
                validators={{ onChange: formSchema.shape.username }}
              >
                {(field) => (
                  <div className={styles.fieldGroup}>
                    <label htmlFor={field.name} className={styles.label}>
                      Username
                    </label>
                    <div className={styles.inputWrap}>
                      <div className={styles.inputWithIcon}>

                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="Enter your username"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            checkUsername(e.target.value);
                          }}
                          className={styles.input}
                        />

                      </div>
                    </div>
                    {usernameStatus.isChecking && (
                      <p className={styles.checking}>Checking availability…</p>
                    )}
                    {!usernameStatus.isChecking && usernameStatus.available !== null && (
                      <p className={usernameStatus.available ? styles.available : styles.unavailable}>
                        {usernameStatus.message}
                      </p>
                    )}
                    {field.state.meta.errors?.length > 0 && field.state.value && (
                      <p className={styles.fieldError}>
                        {(field.state.meta.errors[0] as any)?.message ??
                          field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Email field */}
              <form.Field
                name="email"
                validators={{ onSubmit: formSchema.shape.email }}
              >
                {(field) => (
                  <div className={styles.fieldGroup}>
                    <label htmlFor={field.name} className={styles.label}>
                      Email address
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
                    {field.state.meta.errors?.length > 0 && field.state.value && (
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
                {isLoading ? "Creating account…" : "Register"}
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
          <AuthVisualPanel variant="register" />
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        title="Registration Successful"
        description="Your account has been created. Please verify your email to continue."
        buttonLabel="Verify Email"
        redirectPath={`/verify?email=${encodeURIComponent(form.state.values.email)}`}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
