import { useState } from "react";
import { LogIn, LogOut, User, ChevronDown, Shield, Mail, KeyRound, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth, type AppRole } from "@/hooks/useAuth";

const roleLabels: Record<AppRole, { label: string; color: string }> = {
  admin:       { label: "Admin",       color: "text-accent" },
  operator:    { label: "Operator",    color: "text-recovery" },
  investor:    { label: "Investor",    color: "text-water" },
  executive:   { label: "Executive",  color: "text-foreground-muted" },
  government:  { label: "Government", color: "text-watch" },
};

interface Props {
  onOpenOperatorForm: () => void;
  onOpenAdmin?: () => void;
}

type AuthView = "login" | "signup" | "forgot";

export function AuthPanel({ onOpenOperatorForm, onOpenAdmin }: Props) {
  const { user, role, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authView, setAuthView] = useState<AuthView>("login");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async () => {
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      if (authView === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setOpen(false);
      } else if (authView === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setInfo("Check your email to confirm your account.");
      } else {
        // forgot password
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setInfo("Reset link sent — check your inbox.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result?.error) throw result.error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
  };

  if (loading) return <div className="w-6 h-6 rounded-full bg-surface-overlay animate-pulse" />;

  if (user) {
    const cfg = role ? roleLabels[role] : { label: "User", color: "text-foreground-muted" };
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded border border-border bg-surface hover:bg-surface-raised transition-colors text-xs"
        >
          <div className="w-5 h-5 rounded-full bg-recovery-dim flex items-center justify-center">
            <User size={10} className="text-recovery" />
          </div>
          <span className={`font-mono font-medium ${cfg.color}`}>{cfg.label}</span>
          <ChevronDown size={10} className="text-foreground-subtle" />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute top-full right-0 mt-1 z-50 min-w-[200px] bg-surface-overlay border border-border rounded shadow-lg py-1">
              <div className="px-4 py-2.5 border-b border-border">
                <div className="text-[10px] text-foreground-subtle font-mono">Signed in as</div>
                <div className="text-xs text-foreground truncate max-w-[170px]">{user.email}</div>
                <div className={`text-[10px] font-mono mt-0.5 ${cfg.color}`}>
                  <Shield size={9} className="inline mr-1" />{cfg.label}
                </div>
              </div>
              {(role === "operator" || role === "admin") && (
                <button
                  onClick={() => { setOpen(false); onOpenOperatorForm(); }}
                  className="w-full text-left px-4 py-2 text-xs text-recovery hover:bg-surface-raised transition-colors"
                >
                  + Submit Field Data
                </button>
              )}
              {role === "admin" && onOpenAdmin && (
                <button
                  onClick={() => { setOpen(false); onOpenAdmin(); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-accent hover:bg-surface-raised transition-colors"
                >
                  <Shield size={11} />
                  Admin Panel
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-foreground-muted hover:bg-surface-raised transition-colors"
              >
                <LogOut size={11} />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  const viewTitle = authView === "login" ? "Sign In to Atlas" : authView === "signup" ? "Create Operator Account" : "Reset Password";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-surface hover:bg-surface-raised transition-colors text-xs text-foreground-subtle hover:text-foreground"
      >
        <LogIn size={12} />
        Sign In
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 z-50 w-[290px] bg-surface-overlay border border-border rounded shadow-lg p-4">
            <div className="text-xs font-semibold text-foreground mb-3">{viewTitle}</div>

            {error && (
              <div className="mb-3 text-xs text-reversal bg-reversal-dim border border-reversal/20 rounded px-3 py-2">
                {error}
              </div>
            )}
            {info && (
              <div className="mb-3 text-xs text-recovery bg-recovery-dim border border-recovery/20 rounded px-3 py-2">
                {info}
              </div>
            )}

            {/* Google sign-in */}
            {authView !== "forgot" && (
              <>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded border border-border bg-surface hover:bg-surface-raised transition-colors text-xs text-foreground mb-3 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" className="flex-shrink-0">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continue with Google
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[10px] text-foreground-subtle font-mono">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <input
                className="w-full bg-surface border border-border rounded px-3 py-2 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-recovery/40"
                type="email"
                placeholder="email@organisation.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              />
              {authView !== "forgot" && (
                <input
                  className="w-full bg-surface border border-border rounded px-3 py-2 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-recovery/40"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                />
              )}
            </div>

            <button
              onClick={handleAuth}
              disabled={submitting || !email || (authView !== "forgot" && !password)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded bg-recovery text-background text-xs font-semibold hover:bg-recovery-bright transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 size={12} className="animate-spin" /> : authView === "forgot" ? <Mail size={12} /> : <KeyRound size={12} />}
              {submitting ? "…" : authView === "login" ? "Sign In" : authView === "signup" ? "Create Account" : "Send Reset Link"}
            </button>

            {/* Footer links */}
            <div className="mt-2 flex flex-col gap-1">
              {authView === "login" && (
                <>
                  <button
                    onClick={() => { setAuthView("forgot"); setError(null); setInfo(null); }}
                    className="text-center text-[10px] text-foreground-subtle hover:text-foreground-muted transition-colors"
                  >
                    Forgot password?
                  </button>
                  <button
                    onClick={() => { setAuthView("signup"); setError(null); setInfo(null); }}
                    className="text-center text-[10px] text-foreground-subtle hover:text-foreground-muted transition-colors"
                  >
                    New operator? Create account →
                  </button>
                </>
              )}
              {authView !== "login" && (
                <button
                  onClick={() => { setAuthView("login"); setError(null); setInfo(null); }}
                  className="text-center text-[10px] text-foreground-subtle hover:text-foreground-muted transition-colors"
                >
                  ← Back to sign in
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
