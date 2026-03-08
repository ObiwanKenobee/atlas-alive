import type { AppRole } from "@/hooks/useAuth";

interface RoleGateProps {
  role: AppRole | null;
  allow: AppRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the current user's role is in the `allow` list.
 * Shows optional `fallback` otherwise.
 */
export function RoleGate({ role, allow, children, fallback = null }: RoleGateProps) {
  if (!role) return <>{fallback}</>;
  // Admin sees everything
  if (role === "admin" || allow.includes(role)) return <>{children}</>;
  return <>{fallback}</>;
}

/**
 * Returns true if the role is permitted.
 */
export function canAccess(role: AppRole | null, allow: AppRole[]): boolean {
  if (!role) return false;
  return role === "admin" || allow.includes(role);
}
