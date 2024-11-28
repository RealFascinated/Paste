import { HomeButton } from "@/components/navbar/home-button";
import { auth } from "@/common/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/button";
import { SignoutButton } from "@/components/auth/signout-button";
import { ReactNode } from "react";

type NavbarProps = {
  /**
   * Additional buttons to display when logged in.
   */
  loggedInButtons?: ReactNode;
};

export async function Navbar({ loggedInButtons }: NavbarProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <div className="min-h-[40px] p-1.5 px-3 bg-background-secondary flex justify-between items-center h-full">
        <div className="flex flex-row gap-3 items-center">
          <HomeButton />
        </div>

        <div className="flex gap-2 items-center">
          {session == null ? (
            <>
              <Link href="/auth/login">
                <Button>Login</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <SignoutButton />
              {loggedInButtons}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
