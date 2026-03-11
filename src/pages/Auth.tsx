import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Heart, Shield } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName } },
        });
        if (error) throw error;
        toast.success("Check your email to verify your account before signing in.");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">MyHealthCompanion</h1>
          <p className="text-muted-foreground">Your personal health tracking dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{isLogin ? "Welcome back" : "Create account"}</CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to access your health dashboard" : "Start tracking your health today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={!isLogin}
                />
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>Your data is encrypted and DPDPA compliant</span>
        </div>
      </div>
    </div>
  );
}
