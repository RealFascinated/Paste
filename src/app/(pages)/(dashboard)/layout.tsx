import { ReactNode } from "react";
import { Navbar } from "@/components/navbar/navbar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { auth } from "@/common/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check if the user is logged in.
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) {
    return redirect("/");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <section>
          <Navbar loggedInButtons={<SidebarTrigger />} />
          <div className="p-2 w-full h-full">{children}</div>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
