import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, User, Shield, Mail, Smartphone, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Role = "user" | "guardian";
type Method = "email" | "mobile";

export default function Auth() {
  const [role, setRole] = useState<Role>("user");
  const [method, setMethod] = useState<Method>("email");
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dummyEmail = (phone: string) =>
    `${phone.replace(/\+/g, "")}@phone.myhealthcompanion.app`;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `${countryCode}${mobileNumber}`;
    if (mobileNumber.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    const mappedEmail = dummyEmail(fullPhone);
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: mappedEmail, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email: mappedEmail,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        const { error: otpError } = await supabase.auth.signInWithOtp({ phone: fullPhone });
        if (otpError) throw otpError;
        setOtpSent(true);
        toast.success("OTP sent to your mobile number");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullPhone = `${countryCode}${mobileNumber}`;
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: fullPhone,
        token: otp,
        type: "sms",
      });
      if (error) throw error;
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset link sent to your email");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 font-sans">
      <div className="w-full max-w-[420px] space-y-8">
        {/* Main Logo Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary rounded-[20px] flex items-center justify-center shadow-lg shadow-primary/15 transition-transform hover:scale-105">
            <Heart className="w-8 h-8 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-[32px] p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-border">
          <div className="flex flex-col items-center">
            
            {/* User/Guardian Toggles */}
            <div className="w-full bg-secondary p-1.5 rounded-[18px] flex gap-1 mb-10">
              <button
                onClick={() => setRole("user")}
                className={cn(
                  "flex-1 h-12 rounded-[14px] flex items-center justify-center gap-2.5 transition-all font-bold text-sm tracking-tight",
                  role === "user"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <User className="w-[18px] h-[18px]" /> User
              </button>
              <button
                onClick={() => setRole("guardian")}
                className={cn(
                  "flex-1 h-12 rounded-[14px] flex items-center justify-center gap-2.5 transition-all font-bold text-sm tracking-tight",
                  role === "guardian"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Shield className="w-[18px] h-[18px]" /> Guardian
              </button>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-[28px] font-black text-foreground mb-2 tracking-tight">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-muted-foreground font-medium text-sm">
                {isLogin ? "Sign in to access your health records" : "Sign up to start managing your health"}
              </p>
            </div>

            {/* Email/Mobile Toggles */}
            <div className="w-full bg-secondary p-1.5 rounded-[18px] flex gap-1 mb-8">
              <button
                onClick={() => { setMethod("email"); setOtpSent(false); }}
                className={cn(
                  "flex-1 h-12 rounded-[14px] flex items-center justify-center gap-2.5 transition-all font-bold text-sm border-2",
                  method === "email"
                    ? "bg-card text-foreground border-border shadow-sm"
                    : "text-muted-foreground border-transparent hover:text-primary"
                )}
              >
                <Mail className="w-[18px] h-[18px]" /> Email
              </button>
              <button
                onClick={() => { setMethod("mobile"); setOtpSent(false); }}
                className={cn(
                  "flex-1 h-12 rounded-[14px] flex items-center justify-center gap-2.5 transition-all font-bold text-sm border-2",
                  method === "mobile"
                    ? "bg-card text-foreground border-border shadow-sm"
                    : "text-muted-foreground border-transparent hover:text-primary"
                )}
              >
                <Smartphone className="w-[18px] h-[18px]" /> Mobile
              </button>
            </div>

            {/* Forms */}
            {method === "email" ? (
              <form onSubmit={handleEmailSubmit} className="w-full space-y-5">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="pl-12 h-14 rounded-[16px] bg-muted border-border text-foreground font-medium placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="Password"
                    className="pl-12 pr-12 h-14 rounded-[16px] bg-muted border-border text-foreground font-medium placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {isLogin && (
                  <div className="flex justify-start">
                    <button type="button" onClick={handleForgotPassword} className="text-primary text-sm font-medium hover:underline transition-all">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-[16px] shadow-sm transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </form>
            ) : !otpSent ? (
              <form onSubmit={handleMobileSubmit} className="w-full space-y-5">
                <div className="flex gap-2">
                  <div className="relative w-24">
                    <Input
                      type="text"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-14 rounded-[16px] bg-muted border-border text-foreground font-medium text-center"
                    />
                  </div>
                  <div className="relative flex-1 group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type="tel"
                      placeholder="Mobile number"
                      className="pl-12 h-14 rounded-[16px] bg-muted border-border text-foreground font-medium placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                      required
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="Password"
                    className="pl-12 pr-12 h-14 rounded-[16px] bg-muted border-border text-foreground font-medium placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-[16px] shadow-sm transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="w-full space-y-5">
                <p className="text-sm text-muted-foreground text-center font-medium">
                  Enter the 6-digit OTP sent to {countryCode}{mobileNumber}
                </p>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="text"
                    placeholder="000000"
                    className="pl-12 h-14 rounded-[16px] bg-muted border-border text-foreground font-extrabold text-center tracking-[0.5em] focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    maxLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-[16px] shadow-sm transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(""); }}
                  className="w-full text-sm text-primary font-bold hover:underline"
                >
                  ← Change number
                </button>
              </form>
            )}

            <div className="text-center mt-8">
              <p className="text-muted-foreground font-medium text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setOtpSent(false); }}
                  className="text-primary font-bold hover:underline transition-all"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
