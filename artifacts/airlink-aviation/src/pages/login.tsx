import { type FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [, navigate] = useLocation();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    // FORGOT PASSWORD
    if (forgotPassword) {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setMessage(
        "If an account exists for this email, a password reset link has been sent."
      );

      setLoading(false);
      return;
    }

    // SIGN IN
    if (mode === "signin") {
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      navigate("/");
      setLoading(false);
      return;
    }

    // CREATE ACCOUNT
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Force the user to sign in manually after account creation.
    await supabase.auth.signOut();

    setMode("signin");
    setForgotPassword(false);
    setPassword("");
    setFullName("");
    setShowPassword(false);

    setMessage(
      "Account created successfully. Please sign in with your new account."
    );

    setLoading(false);
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setForgotPassword(false);
    setPassword("");
    setFullName("");
    setError("");
    setMessage("");
    setShowPassword(false);
  };

  const openForgotPassword = () => {
    setForgotPassword(true);
    setError("");
    setMessage("");
    setPassword("");
    setShowPassword(false);
  };

  const backToSignIn = () => {
    setForgotPassword(false);
    setMode("signin");
    setError("");
    setMessage("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <main className="min-h-[100dvh] bg-[#061522] text-[#eef3f5]">
      <div className="grid min-h-[100dvh] md:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="hidden border-r border-[#234052] md:flex md:flex-col md:justify-between">
          <div className="p-8 lg:p-12">
            <Link href="/" className="inline-flex">
              <img
                src="/images/airlink-aviation-original-logo.png"
                alt="Airlink Aviation"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <div className="px-8 pb-16 lg:px-12 lg:pb-20">
            <p className="mono-font mb-6 text-[10px] uppercase tracking-[.2em] text-[#f39a12]">
              Airlink Aviation / Secure Access
            </p>

            <h1 className="display-font max-w-xl text-5xl font-semibold leading-[.95] tracking-[-.055em] lg:text-7xl">
              Built for the{" "}
              <span className="text-[#f39a12]">
                mission ahead.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-7 text-[#aebfca]">
              Access Airlink Aviation&apos;s aerospace, defence,
              engineering, simulation, and precision cable harness
              capabilities.
            </p>
          </div>

          <div className="border-t border-[#234052] p-8 lg:px-12">
            <p className="mono-font text-[9px] uppercase tracking-[.16em] text-[#718792]">
              AIRLINK AVIATION PVT LTD
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center px-5 py-12 md:px-10">
          <div className="w-full max-w-[460px]">
            {/* MOBILE LOGO */}
            <div className="mb-10 md:hidden">
              <Link href="/">
                <img
                  src="/images/airlink-aviation-original-logo.png"
                  alt="Airlink Aviation"
                  className="h-11 w-auto"
                />
              </Link>
            </div>

            {/* HEADING */}
            <div className="mb-10">
              <p className="mono-font mb-4 text-[10px] uppercase tracking-[.2em] text-[#f39a12]">
                {forgotPassword
                  ? "Password recovery"
                  : mode === "signin"
                    ? "Secure access"
                    : "Create account"}
              </p>

              <h2 className="display-font text-4xl font-semibold tracking-[-.05em] md:text-5xl">
                {forgotPassword
                  ? "Reset your password."
                  : mode === "signin"
                    ? "Sign in to Airlink."
                    : "Create your Airlink account."}
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#aebfca]">
                {forgotPassword
                  ? "Enter your email and we will send you a password reset link."
                  : mode === "signin"
                    ? "Enter your credentials to continue to the website."
                    : "Create an account to access the Airlink Aviation website."}
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* FULL NAME */}
              {!forgotPassword && mode === "signup" && (
                <label className="grid gap-2">
                  <span className="mono-font text-[9px] uppercase tracking-[.15em] text-[#9db0bb]">
                    Full name
                  </span>

                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                    className="auth-input w-full border border-[#29495a] bg-[#0a1c29] px-4 py-4 text-sm outline-none placeholder:text-[#7f949f] focus:border-[#f39a12]"
                    required
                  />
                </label>
              )}

              {/* EMAIL */}
              <label className="grid gap-2">
                <span className="mono-font text-[9px] uppercase tracking-[.15em] text-[#9db0bb]">
                  Email address
                </span>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718792]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="auth-input w-full border border-[#29495a] bg-[#0a1c29] py-4 pl-11 pr-4 text-base outline-none placeholder:text-[#9fb1bb] focus:border-[#f39a12]"
                    required
                  />
                </div>
              </label>

              {/* PASSWORD */}
              {!forgotPassword && (
                <div className="grid gap-2">
                  <label htmlFor="password">
                    <span className="mono-font text-[9px] uppercase tracking-[.15em] text-[#9db0bb]">
                      Password
                    </span>
                  </label>

                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718792]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete={
                        mode === "signin"
                          ? "current-password"
                          : "new-password"
                      }
                      className="auth-input w-full border border-[#29495a] bg-[#0a1c29] py-4 pl-11 pr-4 text-sm outline-none placeholder:text-[#7f949f] focus:border-[#f39a12]"
                      required
                      minLength={6}
                    />
                  </div>

                  {/* SHOW PASSWORD */}
                  <label className="flex cursor-pointer items-center gap-2 pt-1 text-sm text-[#aebfca]">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(event) =>
                        setShowPassword(event.target.checked)
                      }
                      className="h-4 w-4 cursor-pointer accent-[#f39a12]"
                    />

                    <span>Show password</span>
                  </label>

                  {/* FORGOT PASSWORD */}
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={openForgotPassword}
                      className="mt-1 w-fit text-sm text-[#f39a12] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* MESSAGE */}
              {message && (
                <div className="border border-[#f39a12]/30 bg-[#f39a12]/10 px-4 py-3 text-sm text-[#f7c36f]">
                  {message}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 bg-[#f39a12] px-5 py-4 mono-font text-[10px] font-medium uppercase tracking-[.16em] text-[#061522] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Processing..."
                  : forgotPassword
                    ? "Send reset link"
                    : mode === "signin"
                      ? "Sign in"
                      : "Create account"}

                <ArrowRight size={15} />
              </button>
            </form>

            {/* BOTTOM ACTIONS */}
            <div className="mt-8 border-t border-[#234052] pt-7 text-center">
              {forgotPassword ? (
                <button
                  type="button"
                  onClick={backToSignIn}
                  className="mono-font text-[10px] uppercase tracking-[.15em] text-[#f39a12] hover:underline"
                >
                  Back to sign in
                </button>
              ) : (
                <>
                  <p className="text-sm text-[#8fa3ae]">
                    {mode === "signin"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </p>

                  <button
                    type="button"
                    onClick={switchMode}
                    className="mt-2 mono-font text-[10px] uppercase tracking-[.15em] text-[#f39a12] hover:underline"
                  >
                    {mode === "signin"
                      ? "Create an account"
                      : "Sign in instead"}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}