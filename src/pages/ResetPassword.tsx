import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { KeyRound, CheckCircle2, Loader2 } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // Check for recovery session from URL hash
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
    });
  }, []);

  const handleReset = async () => {
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => navigate("/"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-[360px]">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-recovery animate-pulse-glow" />
            <span className="text-xs font-mono uppercase tracking-widest text-foreground-subtle">Atlas / Reset Password</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Set new password</h1>
          <p className="text-foreground-subtle text-sm mt-1">
            Enter a new secure password for your account.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-5">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={36} className="text-recovery" />
              <p className="text-foreground font-medium text-sm">Password updated</p>
              <p className="text-xs text-foreground-subtle font-mono">Redirecting to dashboard…</p>
            </div>
          ) : (
            <>
              {!validSession && (
                <div className="mb-4 text-xs text-watch bg-watch-dim border border-watch/20 rounded px-3 py-2">
                  Waiting for recovery session… Click the link in your email to activate this form.
                </div>
              )}
              {error && (
                <div className="mb-4 text-xs text-reversal bg-reversal-dim border border-reversal/20 rounded px-3 py-2">
                  {error}
                </div>
              )}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-foreground-subtle font-mono">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-surface-overlay border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-recovery/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-foreground-subtle font-mono">Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-surface-overlay border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-1 focus:ring-recovery/40"
                    onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  />
                </div>
              </div>
              <button
                onClick={handleReset}
                disabled={submitting || !password || !confirm || !validSession}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded bg-recovery text-background text-sm font-semibold hover:bg-recovery-bright transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
                {submitting ? "Updating…" : "Update Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
