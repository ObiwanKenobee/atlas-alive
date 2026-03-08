import { useState } from "react";
import { LogIn, LogOut, User, ChevronDown, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
}

export function AuthPanel({ onOpenOperatorForm }: Props) {
  const { user, role, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async () => {
    setError(null);
    setSubmitting(true);
    try {
      if (authMode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      }
      setOpen(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
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
          <div className="absolute top-full right-0 mt-1 z-50 w-[280px] bg-surface-overlay border border-border rounded shadow-lg p-4">
            <div className="text-xs font-semibold text-foreground mb-3">
              {authMode === "login" ? "Sign In to Atlas" : "Create Operator Account"}
            </div>
            {error && (
              <div className="mb-3 text-xs text-reversal bg-reversal-dim border border-reversal/20 rounded px-3 py-2">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <input
                className="w-full bg-surface border border-border rounded px-3 py-2 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-recovery/40"
                type="email"
                placeholder="email@organisation.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              />
              <input
                className="w-full bg-surface border border-border rounded px-3 py-2 text-xs text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-recovery/40"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              />
            </div>
            <button
              onClick={handleAuth}
              disabled={submitting || !email || !password}
              className="mt-3 w-full py-2 rounded bg-recovery text-background text-xs font-semibold hover:bg-recovery-bright transition-colors disabled:opacity-50"
            >
              {submitting ? "..." : authMode === "login" ? "Sign In" : "Create Account"}
            </button>
            <button
              onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              className="mt-2 w-full text-center text-[10px] text-foreground-subtle hover:text-foreground-muted transition-colors"
            >
              {authMode === "login"
                ? "New operator? Create account →"
                : "Already have an account? Sign in →"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
