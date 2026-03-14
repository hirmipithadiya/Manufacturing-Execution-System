import { AppShell } from "@/components/app-shell";
import { getCurrentUserContext } from "@/lib/auth";

export default async function InternalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, demoMode, authenticated } = await getCurrentUserContext();

  if (!user) {
    return children;
  }

  return (
    <AppShell user={user} demoMode={demoMode} authenticated={authenticated}>
      {children}
    </AppShell>
  );
}
