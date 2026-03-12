import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, Shield, Activity } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-primary to-secondary p-12 text-primary-foreground">
        <div className="max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <Heart className="h-10 w-10" />
            <h1 className="text-4xl font-bold tracking-tight">MyHealth Companion</h1>
          </div>
          <p className="text-lg opacity-90 leading-relaxed">
            Your trusted partner for health tracking, medication management, and wellness monitoring — designed with care for you and your loved ones.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 opacity-80">
              <Activity className="h-5 w-5 shrink-0" />
              <span>Track vitals, medications & appointments</span>
            </div>
            <div className="flex items-center gap-3 opacity-80">
              <Shield className="h-5 w-5 shrink-0" />
              <span>Secure guardian system for peace of mind</span>
            </div>
            <div className="flex items-center gap-3 opacity-80">
              <Heart className="h-5 w-5 shrink-0" />
              <span>AI-powered wellness insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">MyHealth Companion</h1>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-foreground">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to access your health dashboard"
                : "Start your health journey today"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-primary hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
