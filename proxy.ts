import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseEnv, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { isSupabaseAppReady } from "@/lib/supabase/runtime";

const protectedPaths = [
  "/dashboard",
  "/production-orders",
  "/work-instructions",
  "/quality",
  "/traceability",
  "/inventory",
  "/erp-sync",
  "/reports",
  "/settings",
  "/operations",
  "/planning",
  "/compliance",
];

function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function proxy(request: NextRequest) {
  if (!hasSupabaseEnv || !isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  if (!(await isSupabaseAppReady(supabase))) {
    return NextResponse.next();
  }

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/production-orders/:path*",
    "/work-instructions/:path*",
    "/quality/:path*",
    "/traceability/:path*",
    "/inventory/:path*",
    "/erp-sync/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/operations/:path*",
    "/planning/:path*",
    "/compliance/:path*",
  ],
};
