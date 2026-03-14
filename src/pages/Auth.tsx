import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, User, Shield, Mail, Smartphone, Lock, Eye, EyeOff, Phone } from "lucide-react";
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] p-6 font-sans">
      <div className="w-full max-w-[420px] space-y-6">
        {/* Main Logo Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-[64px] h-[64px] bg-[#0070c9] rounded-[20px] flex items-center justify-center shadow-lg shadow-blue-500/10 transition-transform hover:scale-105">
            <Heart className="w-8 h-8 text-white fill-current" />
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-[32px] p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="flex flex-col items-center">
            
            {/* User/Guardian Toggles */}
            <div className="w-full bg-[#f1f3fd] p-1.5 rounded-[18px] flex gap-1 mb-10">
              <button
                onClick={() => setRole("user")}
                className={cn(
                  "flex-1 h-12 rounded-[14px] flex items-center justify-center gap-2 transition-all font-bold text-sm tracking-tight",
                  role === "user" ? "bg-[#0070c9] text-white shadow-md shadow-blue-500/10" : "text-[#7b8ca5] hover:text-[#0070c9]"
                )}
              >
                <User className="w-4.5 h-4.5" /> User
              </button>
              <button
                onClick={() => setRole("guardian")}
                className={cn(
                  "flex-1 h-12 rounded-[14px] flex items-center justify-center gap-2 transition-all font-bold text-sm tracking-tight",
                  role === "guardian" ? "bg-[#0070c9] text-white shadow-md shadow-blue-500/10" : "text-[#7b8ca5] hover:text-[#0070c9]"
                )}
              >
                <Shield className="w-4.5 h-4.5" /> Guardian
              </button>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-[28px] font-black text-[#1d1d1f] mb-2 tracking-tight">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-[#86868b] font-medium text-sm">
                {isLogin ? "Sign in to access your health records" : "Sign up to start managing your health"}
              </p>
            </div>

            {/* Email/Mobile Toggles */}
            <div className="w-full bg-[#f1f3fd] p-1.5 rounded-[18px] flex gap-1 mb-8">
              <button
                onClick={() => { setMethod("email"); setOtpSent(false); }}
                className={cn(
                  "flex-1 h-12 rounded-[14px] flex items-center justify-center gap-2 transition-all font-bold text-sm border-2",
                  method === "email" ? "bg-white text-[#1d1d1f] border-[#e2e8f0] shadow-sm" : "text-[#7b8ca5] border-transparent hover:text-[#0070c9]"
                )}
              >
                <Mail className="w-4.5 h-4.5" /> Email
              </button>
              <button
                onClick={() => { setMethod("mobile"); setOtpSent(false); }}
                className={cn(
                  "flex-1 h-12 rounded-[14px] flex items-center justify-center gap-2 transition-all font-bold text-sm border-2",
                  method === "mobile" ? "bg-white text-[#1d1d1f] border-[#e2e8f0] shadow-sm" : "text-[#7b8ca5] border-transparent hover:text-[#0070c9]"
                )}
              >
                <Smartphone className="w-4.5 h-4.5" /> Mobile
              </button>
            </div>

            {/* Forms */}
            {method === "email" ? (
              <form onSubmit={handleEmailSubmit} className="w-full space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-[#0070c9] transition-colors" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="pl-12 h-14 rounded-[16px] bg-[#f9fafb] border-[#e2e8f0] text-[#1d1d1f] font-medium placeholder:text-[#86868b] focus:ring-1 focus:ring-[#0070c9]/20 focus:border-[#0070c9] transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-[#0070c9] transition-colors" />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="Password"
                    className="pl-12 pr-12 h-14 rounded-[16px] bg-[#f9fafb] border-[#e2e8f0] text-[#1d1d1f] font-medium placeholder:text-[#86868b] focus:ring-1 focus:ring-[#0070c9]/20 focus:border-[#0070c9] transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#0070c9] transition-colors"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {isLogin && (
                  <div className="flex justify-start">
                    <button type="button" onClick={handleForgotPassword} className="text-[#0070c9] text-sm font-medium hover:underline transition-all">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 bg-[#0070c9] hover:bg-[#005ea9] text-white text-lg font-bold rounded-[16px] shadow-sm transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </form>
            ) : !otpSent ? (
              <form onSubmit={handleMobileSubmit} className="w-full space-y-6">
                <div className="flex gap-2">
                  <div className="relative w-24">
                    <Input
                      type="text"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-14 rounded-[16px] bg-[#f9fafb] border-[#e2e8f0] text-[#1d1d1f] font-medium text-center"
                    />
                  </div>
                  <div className="relative flex-1 group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-[#0070c9] transition-colors" />
                    <Input
                      type="tel"
                      placeholder="Mobile number"
                      className="pl-12 h-14 rounded-[16px] bg-[#f9fafb] border-[#e2e8f0] text-[#1d1d1f] font-medium placeholder:text-[#86868b] focus:ring-1 focus:ring-[#0070c9]/20 focus:border-[#0070c9] transition-all"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                      required
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-[#0070c9] transition-colors" />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="Password"
                    className="pl-12 pr-12 h-14 rounded-[16px] bg-[#f9fafb] border-[#e2e8f0] text-[#1d1d1f] font-medium placeholder:text-[#86868b] focus:ring-1 focus:ring-[#0070c9]/20 focus:border-[#0070c9] transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-[#0070c9] hover:bg-[#005ea9] text-white text-lg font-bold rounded-[16px] shadow-sm transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
                <p className="text-sm text-[#86868b] text-center font-medium">
                  Enter the 6-digit OTP sent to {countryCode}{mobileNumber}
                </p>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] group-focus-within:text-[#0070c9] transition-colors" />
                  <Input
                    type="text"
                    placeholder="000000"
                    className="pl-12 h-14 rounded-[16px] bg-[#f9fafb] border-[#e2e8f0] text-[#1d1d1f] font-extrabold text-center tracking-[0.5em] focus:ring-1 focus:ring-[#0070c9]/20 focus:border-[#0070c9] transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                    maxLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#0070c9] hover:bg-[#005ea9] text-white text-lg font-bold rounded-[16px] shadow-sm transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(""); }}
                  className="w-full text-sm text-[#0070c9] font-bold hover:underline"
                >
                  ← Change number
                </button>
              </form>
            )}

            <div className="text-center mt-8">
              <p className="text-[#86868b] font-medium text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setOtpSent(false); }}
                  className="text-[#0070c9] font-bold hover:underline transition-all"
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
