import type { User } from "@supabase/supabase-js";
import { demoUser } from "@/lib/demo-data";
import type { DataSource, DemoUser, UserRole } from "@/lib/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { isSupabaseAppReady } from "@/lib/supabase/runtime";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeRole(value: unknown): UserRole {
  const allowedRoles: UserRole[] = ["Admin", "Planner", "Operator", "Quality Inspector", "Manager"];
  if (typeof value === "string" && allowedRoles.includes(value as UserRole)) {
    return value as UserRole;
  }

  return "Manager";
}

function getFallbackUser(user?: User | null, profile?: { full_name?: string | null; role?: string | null }) {
  return {
    name:
      typeof profile?.full_name === "string" && profile.full_name.trim().length > 0
        ? profile.full_name
        : typeof user?.user_metadata.full_name === "string"
          ? user.user_metadata.full_name
          : user?.email?.split("@")[0] ?? demoUser.name,
    email: user?.email ?? demoUser.email,
    role: normalizeRole(profile?.role ?? user?.user_metadata.role),
  } satisfies DemoUser;
}

export async function getCurrentUserContext(): Promise<{
  demoMode: boolean;
  authenticated: boolean;
  source: DataSource;
  organizationId: string | null;
  user: DemoUser | null;
}> {
  if (!hasSupabaseEnv) {
    return {
      demoMode: true,
      authenticated: true,
      source: "demo",
      organizationId: "demo-org",
      user: demoUser,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return {
        demoMode: true,
        authenticated: false,
        source: "demo",
        organizationId: "demo-org",
        user: demoUser,
      };
    }

    if (!(await isSupabaseAppReady(supabase))) {
      return {
        demoMode: true,
        authenticated: false,
        source: "demo",
        organizationId: "demo-org",
        user: demoUser,
      };
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        demoMode: true,
        authenticated: false,
        source: "demo",
        organizationId: "demo-org",
        user: demoUser,
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role, organization_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.organization_id) {
      return {
        demoMode: true,
        authenticated: true,
        source: "demo",
        organizationId: "demo-org",
        user: getFallbackUser(user, profile ?? undefined),
      };
    }

    return {
      demoMode: false,
      authenticated: true,
      source: "supabase",
      organizationId: profile?.organization_id ?? null,
      user: getFallbackUser(user, profile),
    };
  } catch {
    return {
      demoMode: true,
      authenticated: false,
      source: "demo",
      organizationId: "demo-org",
      user: demoUser,
    };
  }
}
