import { useState, useEffect } from "react";
import { Shield, UserCheck, UserX, ChevronDown, X, Loader2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserRow {
  user_id: string;
  role: AppRole;
  assigned_at: string;
  email?: string;
  display_name?: string;
}

const ROLES: AppRole[] = ["operator", "investor", "executive", "government", "admin"];

const roleColor: Record<AppRole, string> = {
  admin:      "text-accent bg-accent/10 border-accent/20",
  operator:   "text-recovery bg-recovery-dim border-recovery/20",
  investor:   "text-water bg-water-dim border-water/20",
  executive:  "text-foreground-muted bg-surface-raised border-border",
  government: "text-watch bg-watch-dim border-watch/20",
};

function RoleDropdown({
  current,
  userId,
  onChanged,
}: {
  current: AppRole;
  userId: string;
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeRole = async (newRole: AppRole) => {
    setLoading(true);
    setOpen(false);
    // Delete existing roles then insert new one
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
    setLoading(false);
    onChanged();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono uppercase tracking-widest transition-colors ${roleColor[current]}`}
      >
        {loading ? <Loader2 size={9} className="animate-spin" /> : <Shield size={9} />}
        {current}
        <ChevronDown size={8} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-50 min-w-[130px] bg-surface-overlay border border-border rounded shadow-lg py-1">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => changeRole(r)}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-surface-raised ${r === current ? "text-recovery font-semibold" : "text-foreground-muted"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AdminPanel({ open, onClose }: Props) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch all user_roles + join profiles for display info
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role, assigned_at")
      .order("assigned_at", { ascending: false });

    if (!roles) { setLoading(false); return; }

    // Fetch profiles for display names
    const userIds = roles.map((r) => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);

    const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

    setUsers(
      roles.map((r) => ({
        ...r,
        display_name: profileMap[r.user_id]?.display_name ?? undefined,
        email: undefined, // auth.users not accessible client-side; show user_id
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchUsers();
  }, [open]);

  const revokeAccess = async (userId: string) => {
    setRevoking(userId);
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await fetchUsers();
    setRevoking(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-surface border-border p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-5 py-4 border-b border-border">
          <DialogTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield size={14} className="text-accent" />
            Admin — User Role Management
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3 border-b border-border bg-surface-raised">
          <div className="flex items-center gap-2 text-xs text-foreground-subtle">
            <Users size={11} />
            <span className="font-mono">{users.length} registered users</span>
            <span className="ml-auto text-[10px] font-mono text-foreground-subtle">Changes take effect immediately</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-foreground-subtle text-sm">
              <Loader2 size={14} className="animate-spin" />
              Loading users…
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-foreground-subtle text-sm">No users found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {["User", "Role", "Assigned", "Actions"].map((h) => (
                    <th key={h} className="py-2 px-4 text-left text-[10px] text-foreground-subtle uppercase tracking-widest font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={`${u.user_id}-${u.role}`} className="border-b border-border hover:bg-surface-raised transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-xs text-foreground font-medium leading-snug">
                        {u.display_name ?? "Unnamed User"}
                      </div>
                      <div className="text-[10px] text-foreground-subtle font-mono mt-0.5 truncate max-w-[180px]">
                        {u.user_id}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <RoleDropdown
                        current={u.role}
                        userId={u.user_id}
                        onChanged={fetchUsers}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] text-foreground-subtle font-mono">
                        {new Date(u.assigned_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => revokeAccess(u.user_id)}
                        disabled={revoking === u.user_id}
                        className="flex items-center gap-1 text-[10px] text-foreground-subtle hover:text-reversal transition-colors font-mono"
                      >
                        {revoking === u.user_id ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <UserX size={10} />
                        )}
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <p className="text-[10px] text-foreground-subtle font-mono">
            Revoking access removes all roles. User data is preserved.
          </p>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground-subtle hover:text-foreground border border-border rounded transition-colors"
          >
            <X size={11} />
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
